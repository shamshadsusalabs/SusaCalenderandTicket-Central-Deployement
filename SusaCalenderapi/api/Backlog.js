// Import Backlog model

const express = require('express');
const router = express.Router();
const Backlog = require('../schema/Backlog'); // Import Backlog model
const KanbanSchemas = require('../schema/Kanbans'); // Import Kanban model
const Sprint = require('../schema/sprint'); // Import Sprint model
const moment = require('moment');
async function updateLatestSprintBacklogs() {
    try {
        // Step 1: Fetch the latest sprint based on endDate
        const latestSprint = await Sprint.findOne().sort({ endDate: -1 });
        if (!latestSprint) {
            console.log("No sprints found");
            return { success: false, message: "No sprints found" };
        }

        console.log("Latest Sprint Data:", latestSprint);

        // Step 2: Extract the ticketIds from the latest sprint's tickets array
        const ticketIds = latestSprint.tickets.map(ticket => ticket.ticketId);
        console.log("Extracted Ticket IDs from Sprint:", ticketIds);

        // Step 3: Query Kanban schema for these ticketIds and check status
        const kanbanData = await Kanban.find({ ticketId: { $in: ticketIds } });

        // Step 4: Filter tickets where status is not "Closed" and match ticket owner
        const ticketsToUpdate = [];
        kanbanData.forEach(ticket => {
            if (ticket.status !== "Closed") {
                const ticketOwner = ticket.ticketOwner;
                if (ticketOwner) {
                    ticketsToUpdate.push({ ticketId: ticket.ticketId, ticketOwner });
                }
            }
        });

        if (ticketsToUpdate.length > 0) {
            // Step 6: Insert into the Backlog model with ticketId and ticketOwner
            await Backlog.insertMany(ticketsToUpdate);
            console.log("Backlogs updated successfully:", ticketsToUpdate);
            return { success: true, message: "Backlogs updated successfully", data: ticketsToUpdate };
        } else {
            console.log("No tickets to update");
            return { success: false, message: "No tickets to update, all are closed" };
        }
    } catch (error) {
        console.error("Error occurred:", error);
        return { success: false, message: "Server error", error };
    }
}

module.exports = updateLatestSprintBacklogs;
// Route to get all backlogs
router.get('/all', async (req, res) => {
    try {
        // Query the database to get all backlogs
        const backlogs = await Backlog.find({});
        console.log("Database query results:", backlogs);

        if (backlogs.length === 0) {
            console.log("No backlogs found");
            return res.status(404).json({ message: "No backlogs found" });
        }

        // Extract the ticketIds from the backlogs
        const ticketIds = backlogs.map(backlog => backlog.ticketId);
        console.log("Filtered Ticket IDs:", ticketIds);

        if (ticketIds.length > 0) {
            // Query the KanbanSchemas for the data related to these ticketIds and sort by creationDate (descending)
            const kanbanData = await KanbanSchemas.find({ ticketId: { $in: ticketIds } })
                .sort({ creationDate: -1 }); // Sorting by creationDate in descending order
            console.log("Kanban Data for ticketIds (sorted):", kanbanData);

            // Return both backlogs and Kanban data
            return res.status(200).json({ backlogs, kanbanData });
        }

        // If no ticketIds found in the backlogs
        res.status(404).json({ message: "No ticketIds found in the backlogs" });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Route to get all backlogs by ticketOwner
router.get('/ticketOwner/:ownerId', async (req, res) => {
    try {
        // Get ticketOwner from route parameters
        const { ownerId: ticketOwner } = req.params;
        console.log("Requested ticketOwner:", ticketOwner);

        if (!ticketOwner) {
            console.log("ticketOwner parameter is missing");
            return res.status(400).json({ message: "ticketOwner is required" });
        }

        // Query the database to find all documents where `ticketOwner` matches
        const backlogs = await Backlog.find({ ticketOwner });
        console.log("Database query results:", backlogs);

        if (backlogs.length === 0) {
            console.log("No matching backlogs found for ticketOwner:", ticketOwner);
            return res.status(404).json({ message: "No matching backlogs found" });
        }

        // Filter out the backlogs and retrieve all the ticketIds
        const ticketIds = backlogs.map(backlog => backlog.ticketId);
        console.log("Filtered Ticket IDs:", ticketIds);

        if (ticketIds.length > 0) {
            // Query the KanbanSchemas for the data related to these ticketIds and sort by creationDate (descending)
            const kanbanData = await KanbanSchemas.find({ ticketId: { $in: ticketIds } })
                .sort({ creationDate: -1 }); // Sorting by creationDate in descending order
            console.log("Kanban Data for ticketIds (sorted):", kanbanData);

            // Return both backlogs and Kanban data
            return res.status(200).json({ backlogs, kanbanData });
        }

        // If no ticketIds found in the backlogs
        res.status(404).json({ message: "No ticketIds found in the backlogs" });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
