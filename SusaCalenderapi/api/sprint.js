const express = require('express');
const Sprint = require('../schema/sprint'); // Adjust the path accordingly
const router = express.Router();
const cron = require('node-cron');

router.put('/updatesprintdata/:sprintId', async (req, res) => {
  const { sprintId } = req.params;
  const updatedSprintData = req.body; // Assuming the body contains the updated sprint data

  // Basic validation for the incoming data
  if (!updatedSprintData || !Array.isArray(updatedSprintData.tickets) || !Array.isArray(updatedSprintData.resources)) {
    return res.status(400).json({ message: 'Invalid data structure' });
  }

  try {
    // Find the sprint by sprintId
    const sprint = await Sprint.findOne({ sprintId });

    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    // Add tickets only if the ticketId doesn't already exist in the sprint's tickets array
    updatedSprintData.tickets.forEach(ticket => {
      const ticketExists = sprint.tickets.some(existingTicket => existingTicket.ticketId === ticket.ticketId);
      if (!ticketExists) {
        sprint.tickets.push(ticket);
      }
    });

    // Add resources using $addToSet to avoid duplicates
    updatedSprintData.resources.forEach(resource => {
      const resourceExists = sprint.resources.some(existingResource => existingResource.id === resource.id);
      if (!resourceExists) {
        sprint.resources.push(resource);
      }
    });

    // Save the updated sprint to the database
    const updatedSprint = await sprint.save(); // Save the updated sprint document

    // Respond with the updated sprint data
    res.status(200).json({ message: 'Sprint updated successfully', updatedSprint });

  } catch (error) {
    console.error('Error updating sprint:', error);
    res.status(500).json({ message: 'Error updating sprint', error: error.message });
  }
});
router.delete('/:sprintId/ticket/:ticketId', async (req, res) => {
  const { sprintId, ticketId } = req.params;

  try {
    // Update the sprint by removing the ticket with the specified ticketId
    const updatedSprint = await Sprint.findOneAndUpdate(
      { sprintId },
      { $pull: { tickets: { ticketId } } },
      { new: true }
    );

    if (!updatedSprint) {
      return res.status(404).json({ message: 'Sprint or Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket deleted successfully', updatedSprint });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ticket', error: error.message });
  }
});



router.get('/get', async (req, res) => {
  const { sprintOwnerId } = req.query;

  try {
    // Find sprints where sprintOwnerId matches or resources contain an entry with matching sprintOwnerId
    const sprints = await Sprint.find({
      $or: [
        { sprintOwnerId },
        { 'resources.id': sprintOwnerId }  // Assuming 'resources' has an 'id' field for each entry
      ]
    }).lean();

    if (sprints.length === 0) {
      return res.status(404).json({ message: 'No sprints found for the given sprintOwnerId or associated resources.' });
    }

    res.status(200).json(sprints);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving sprints', error: error.message });
  }
});

cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Cron job running at midnight');

    // Find all sprints whose endDate has passed and are still open
    const sprintsToClose = await Sprint.find({
      endDate: { $lt: new Date() }, // endDate is before the current date
      status: 'open',               // status is still open
    });

    // Update the status to 'closed' for each sprint
    if (sprintsToClose.length > 0) {
      for (let sprint of sprintsToClose) {
        sprint.status = 'closed';
        await sprint.save();
        console.log(`Sprint ${sprint.sprintId} status updated to 'closed'`);
      }
    } else {
      console.log('No sprints found to close.');
    }
  } catch (error) {
    console.error('Error in cron job:', error.message);
  }
});
router.post('/add', async (req, res) => {
  try {
    console.log("Received request at '/add' endpoint");
    console.log("Request body:", req.body);

    const sprint = new Sprint(req.body);
    console.log("Created new Sprint instance:", sprint);

    await sprint.save();
    console.log("Sprint saved to database successfully:", sprint);

    res.status(201).json(sprint);
    console.log("Response sent with status 201:", sprint);
  } catch (error) {
    console.log("Error occurred while creating sprint:", error.message);
    res.status(400).json({ message: 'Error creating sprint', error: error.message });
  }
});




router.post('/add-ticket/:sprintId/', async (req, res) => {
  const { sprintId } = req.params;
  const { ticketData, resourcesData } = req.body;

  try {
    // Find the sprint by sprintId
    const sprint = await Sprint.findOne({ sprintId });
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    // Create the new ticket object
    const newTicket = {
      ticketId: ticketData.ticketId,
      title: ticketData.title,
      tickethours: ticketData.tickethours,
      _id: ticketData._id,
    };

    // Check if the resource ID already exists in the sprint's resources array
    const resourceExists = sprint.resources.some(resource => resource.id === resourcesData._id);

    // Only add the resource if it doesn't already exist
    if (!resourceExists) {
      // Map `_id` to `id` for consistency with schema requirements
      const resourceToAdd = {
        id: resourcesData._id,
        name: resourcesData.name,
      };

      sprint.resources.push(resourceToAdd);
    }

    // Add the new ticket to the tickets array
    sprint.tickets.push(newTicket);

    // Save the updated sprint
    await sprint.save();

    // Respond with the updated sprint data
    res.status(200).json({
      message: 'Ticket added successfully to sprint',
      sprint,
    });
  } catch (error) {
    console.error('Error adding ticket:', error);
    res.status(500).json({ message: 'Error adding ticket to sprint', error });
  }
});







router.get('/getAll', async (req, res) => {
  try {
    // Fetch only the most recent 5 sprints, sorted in descending order
    const sprints = await Sprint.find().sort({ _id: -1 }).limit(5);
    res.status(200).json(sprints);
  } catch (error) {
    console.error('Error retrieving sprints:', error);
    res.status(500).json({ message: 'Error retrieving sprints' });
  }
});






// CREATE: Add a new sprint


// READ: Get all sprints


// READ: Get a sprint by ID
router.get('/get/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    res.status(200).json(sprint);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving sprint', error: error.message });
  }
});

// UPDATE: Update a sprint by ID
router.put('/upadte/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    res.status(200).json(sprint);
  } catch (error) {
    res.status(400).json({ message: 'Error updating sprint', error: error.message });
  }
});

// DELETE: Delete a sprint by ID
router.delete('/remove/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findByIdAndDelete(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    res.status(204).send(); // No content to return
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sprint', error: error.message });
  }
});

// READ: Get all sprints by sprintOwnerId



module.exports = router;
