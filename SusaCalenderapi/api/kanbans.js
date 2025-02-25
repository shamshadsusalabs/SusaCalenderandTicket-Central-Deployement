const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const KanbanSchemas = require('../schema/Kanbans');


router.put('/update-status/:id', [
    // Validate the status field
    check('status').isIn(['Open', 'Closed', 'Dependency', 'Progress']).withMessage('Invalid status value. Valid values are: Open, Closed, Dependency, Progress.')
], async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;  // New status value

    // Basic validation for id format (assuming it's an ObjectId)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: 'Invalid event ID format' });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Find the event by ID
        const event = await KanbanSchemas.findById(id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Set the corresponding date field based on the status
        if (status === 'Progress') {
            event.status = status;
            event.progressDate = new Date();  // Set current date for progressDate
        } else if (status === 'Closed') {
            event.status = status;
            event.closingDate = new Date();  // Set current date for closingDate
        } else {
            event.status = status;
        }

        // Save the updated event
        await event.save();

        console.log('Status updated successfully:', event);
        return res.status(200).json({
            msg: 'Event status updated successfully',
            event: event
        }); // Respond with the updated event
    } catch (error) {
        console.error("Server error:", error.message);
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

router.put('/update-event/:id', async (req, res) => {
    const { id } = req.params;
    const { sprintId, projectOwner, title, description, tickethours } = req.body;

    // Basic validation for id format (assuming it's an ObjectId)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: 'Invalid event ID format' });
    }

    try {
        // Find the event by ID
        const event = await KanbanSchemas.findById(id);
        
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Only update fields if they are provided, otherwise retain the existing values
        if (sprintId) event.sprintId = sprintId;
        if (projectOwner) event.projectOwner = projectOwner;
        if (title) event.title = title;
        if (description) event.description = description;
        if (tickethours) event.tickethours = tickethours;

        // Set the modifiedDate to the current date and time
        event.modifiedDate = new Date();

        // Save the updated event
        await event.save();

        console.log('Event updated successfully:', event);
        return res.status(200).json(event);
    } catch (error) {
        console.error("Server error:", error.message);
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

router.get('/events/user/:userId', async (req, res) => {
    const { userId } = req.params;

    console.log(`Fetching Kanban events for user ID: ${userId}`);

    // Basic validation for userId format (assuming it's an ObjectId)
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: 'Invalid user ID format' });
    }

    try {
        // Find events where the ticketowner matches the userId
        const ticketOwnerEvents = await KanbanSchemas.find({ ticketowner: userId });

        // Find events where the selectedUsers array contains the userId
        const selectedUserEvents = await KanbanSchemas.find({ selectedUsers: userId });

        // Combine the two results (avoid duplicates based on _id)
        let allEvents = [...ticketOwnerEvents, ...selectedUserEvents];

        // Remove duplicates based on _id
        allEvents = allEvents.filter((value, index, self) => 
            index === self.findIndex((t) => (
                t._id.toString() === value._id.toString()
            ))
        );

        // Sort events by creationDate in descending order
        allEvents.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

        // Check if there are any events
        if (allEvents.length === 0) {
            console.log('No Kanban events found for this user');
            return res.status(404).json({ msg: 'No Kanban events found for this user' });
        }

        console.log(`Found Kanban events:`, allEvents);
        return res.status(200).json(allEvents); // Return sorted events in the same format
    } catch (error) {
        console.error("Server error:", error.message);
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
});





router.post('/add', async (req, res) => {
    try {
        // Fetch the last inserted ticket
        const lastTicket = await KanbanSchemas.findOne().sort({ ticketId: -1 });
        
        // Initialize ticketNumber based on the last ticket's ID or start from 1001
        let ticketNumber;
        if (lastTicket && lastTicket.ticketId) {
            // Split the ticketId to extract the number
            const lastTicketIdParts = lastTicket.ticketId.split('-');
            const lastNumber = parseInt(lastTicketIdParts[1], 10); // Ensure it is parsed as a number
            ticketNumber = isNaN(lastNumber) ? 1001 : lastNumber + 1; // Fallback to 1001 if parsing fails
        } else {
            ticketNumber = 1001; // Start from 1001 if no previous tickets exist
        }

        const ticketId = `tk-${ticketNumber}`; // Format ticket ID

     

        const holiday = new KanbanSchemas({
            ticketId,
            name: req.body.name,
            statusId: req.body.statusId,
            index: req.body.index,
            title: req.body.title,
            description: req.body.description,
            imageURL: req.body.imageURL,
            priority: req.body.priority,
            modifiedDate: req.body.modifiedDate,
            creationDate: req.body.creationDate,
            closingDate: req.body.closingDate,
            progressDate: req.body.progressDate,
            projectOwner: req.body.projectOwner,
       
            tickethours: req.body.tickethours,
            ticketowner: req.body.ticketowner,
            sprintId: req.body.sprintId, // Added new field
            projectId: req.body.projectId, 
            status:req.body.status,
            selectedUsers:req.body. selectedUsers
          
        });

        await holiday.save();
        res.json(holiday);
    } catch (error) {
        console.log(error.message); // Log error message
        return res.status(500).json({ msg: "Server Error" });
    }
});




// Route to add a reply to a specific comment on a ticket
router.post('/tickets/:ticketId/comment/:commentId', [
    check('userName', 'User name is required').not().isEmpty(),
    check('reply', 'Reply text is required').not().isEmpty(),
    check('userId', 'User ID is required').not().isEmpty(),
    check('creationDate', 'Creation date is required').not().isEmpty(),
], async (req, res) => {
    const { ticketId, commentId } = req.params; // ticketId is expected to be the MongoDB _id
    console.log(`Received request to add reply to comment: ${commentId} on ticket: ${ticketId}`);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { userName, reply, userId, creationDate } = req.body;
    console.log(`Request body:`, { userName, reply, userId, creationDate });

    try {
        // Find the ticket by its MongoDB _id using findOne
        const ticket = await KanbanSchemas.findOne({ _id: ticketId });
        console.log(`Found ticket:`, ticket);
        
        if (!ticket) {
            console.log('Ticket not found');
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        // Find the specific comment by commentId
        const comment = ticket.comment.id(commentId); // Use the commentId as the MongoDB _id for the comment
        console.log(`Found comment:`, comment);
        
        if (!comment) {
            console.log('Comment not found');
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // Create a new reply object
        const newReply = {
            userName,
            reply,
            userId,
            creationDate,
        };
        console.log(`New reply object:`, newReply);

        // Push the new reply into the replies array of the specific comment
        comment.replies.push(newReply);
        await ticket.save(); // Save the updated ticket
        console.log(`Reply added to comment successfully.`);

        res.status(201).json(newReply); // Respond with the new reply
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});
router.post('/tickets/comment/:ticketId', [
    check('userId', 'User ID is required').not().isEmpty(),
    check('userName', 'User name is required').not().isEmpty(),
    check('comment', 'Comment text is required').not().isEmpty(),
    check('creationDate', 'Creation date is required').not().isEmpty() // Validate creationDate
], async (req, res) => {
    const { ticketId } = req.params; // Get the ticketId from the params
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, userName, comment, creationDate } = req.body; // Extract userId, userName, comment, and creationDate from the body

    try {
        // Find the ticket by ticketId (which is actually _id)
        const ticket = await KanbanSchemas.findOne({ _id: ticketId });
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        // Create a new comment object according to the defined schema
        const newComment = {
            userId, // Include userId
            userName, // Include userName
            comment, // The comment text
            creationDate: new Date(creationDate), // Use the date from the frontend
            ticketId: ticketId, // Link to the Kanban ticket
            replies: [] // Initialize with empty replies array
        };

        // Push the new comment into the comments array
        ticket.comment.push(newComment);
        await ticket.save();

        res.status(201).json(newComment); // Respond with the new comment
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Route to add a reply to a specific comment in a ticket



router.post('/tickets/byIds', async (req, res) => {
    const { ids } = req.body;
  
    try {
      // Fetch tickets that match any of the IDs in the array
      const tickets = await KanbanSchemas.find({ _id: { $in: ids } });
      res.json(tickets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Example in Express.js

  



router.get('/getall', async (req, res) => {
    try {
        // Fetch policies in reverse order by sorting by `_id` in descending order
        let policies = await KanbanSchemas.find().sort({ _id: -1 });
        res.json(policies);
    } catch (err) {
        res.json({ msg: err.message });
    }
});







router.post(
    '/remove',
    async (req,res) => {
        try{
            let employer = await KanbanSchemas.findOne({"_id"  : req.body.id});
            if (!employer) {
                return res.status(401).json("Schedule not found");
            }
            await KanbanSchemas.deleteOne({"_id"  : req.body.id});
            return res.status(200).json("Schedule Deleted");
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : error.message});
        }
    }
);

router.post('/update',async (req,res) => {
    try {
        let {id} = req.query;
        let employer = await KanbanSchemas.findById(id);
        if (!employer) {
            return res.status(401).json("Employer not found");
        }
        let obj = {
            status : req.body.status
        }
        Object.assign(employer, req.body);
        await employer.save();
        res.json(employer);
    } catch (error) {
        console.log(error.message);
        return res.status(500);
    }
});

router.get('/details',(req,res,next)=>{
    let {id}=req.query;
    KanbanSchemas.findById(id).then(result=>
         {res.status(200).json(result)
     }).catch(error=>{
                 console.log(error);
                     res.status(500).json(
                         {error:error}
                     )
     })
 });


router.get('/detailsid/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Debug: Check incoming ID
        console.log("Incoming ID:", id);

        // Find all tickets where ticketowner matches the provided ID and closingDate is actually null
        const tickets = await KanbanSchemas.find({ 
            ticketowner: id,
            closingDate: null // Ensure that closingDate is actually null
        }).select(
            '_id name statusId index title description priority modifiedDate closingDate creationDate progressDate ticketId projectOwner projectName tickethours resources ticketowner comment projectID'
        );

        // Debug: Check retrieved tickets
        console.log("Retrieved Tickets:", tickets);

        if (tickets.length === 0) {
            return res.status(404).json({ msg: "No active tickets found for this owner" });
        }

        res.status(200).json(tickets);
    } catch (error) {
        console.error(error); // Improved error logging
        return res.status(500).json({ error: error.message });
    }
});






module.exports = router;