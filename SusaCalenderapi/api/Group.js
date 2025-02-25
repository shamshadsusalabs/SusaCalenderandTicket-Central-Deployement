const express = require('express');
const router = express.Router();
const Group = require('../schema/Group');

// Create a new group
router.post('/create', async (req, res) => {
    try {
        console.log('Received group creation request:', req.body); // Log the request body

        const { name, participants, adminId } = req.body;

        console.log('Group name:', name); // Log the group name
        console.log('Participants:', participants); // Log the participants
        console.log('Admin ID:', adminId); // Log the admin ID

        const group = new Group({
            name,
            admin: adminId,
            members: [adminId, ...participants],
            messages: []
        });

        console.log('Saving group to the database...'); // Log the database save attempt
        await group.save(); // Save the group to the database
        console.log('Group saved successfully:', group); // Log the saved group details

        res.status(201).json(group); // Send success response
        console.log('Response sent successfully'); // Log response sent
    } catch (error) {
        console.error('Error creating group:', error); // Log the error
        res.status(500).json({ error: 'Failed to create group' });
    }
});

router.get('/getByMemberId/:memberId', async (req, res) => {
    const { memberId } = req.params;

    try {
        const groups = await Group.find({ members: memberId }); // Find all groups where the memberId is in the members array
        if (groups.length === 0) {
            return res.status(404).json({ message: 'No groups found for this member' });
        }
        res.json(groups); // Send the array of groups as a response
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});




module.exports = router;
