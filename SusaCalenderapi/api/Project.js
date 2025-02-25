const express = require('express');
const router = express.Router();
const Project = require('../schema/Project');


router.get('/getAll', async (req, res) => {
  try {
    // Fetch only the most recent 5 projects, sorted in descending order
    const projects = await Project.find().sort({ _id: -1 }).limit(10);
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({ message: 'Error retrieving projects' });
  }
});

// Import the Project model
router.get('/projects/owner/:ownerId', async (req, res) => {
  const { ownerId } = req.params;

  try {
    // Find all projects where projectOwner matches ownerId
    const projects = await Project.find({ projectOwner: ownerId });
    
    // Check if any projects were found
    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this owner' });
    }

    // Log each project individually
    projects.forEach(project => console.log(project));

    // Send the projects as a response
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});
// CREATE: Create a new project
router.post('/Createprojects', async (req, res) => {
  const { projectName, projectOwner, selectedUsers } = req.body;

  // Validate required fields
  if (!projectName || !projectOwner) {
    return res.status(400).json({ message: 'Project name and owner are required' });
  }

  try {
    // Create new project with selectedUsers array
    const newProject = new Project({
      projectName,
      projectOwner,
      selectedUsers // Pass selectedUsers array from the request body
    });

    // Save the project to the database
    await newProject.save();
    
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating project', error });
  }
});

  
// READ: Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().populate('projectOwner', 'name'); // Populate projectOwner if you have a User model
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

// READ: Get a single project by ID


// UPDATE: Update a project by ID
router.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { projectName, projectOwner } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { projectName, projectOwner },
      { new: true } // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating project', error });
  }
});

// DELETE: Delete a project by ID
router.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting project', error });
  }
});

module.exports = router;
