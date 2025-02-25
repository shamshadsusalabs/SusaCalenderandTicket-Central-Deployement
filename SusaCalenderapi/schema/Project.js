const mongoose = require('mongoose');

// Create a Schema for Project
const projectSchema = new mongoose.Schema({
  projectID: {
    type: String,
    required: false, // Ensure projectID is required
    unique: true, // Ensure projectID is unique
  },
  projectName: {
    type: String,
    required: true, // Make the projectName field required
    trim: true, // Remove whitespace
  },
  projectOwner: {
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for the projectOwner
    required: true, // Make the projectOwner field required
    ref: 'users', // Reference to the User model, if you have one
  },
  selectedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for each selected user
      ref: 'users', // Reference to the User model for each selected user
    }
  ],
}, {
  timestamps: true, // Automatically create createdAt and updatedAt fields
});

// Pre-save hook to generate projectID
projectSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments({ projectName: this.projectName });
    this.projectID = `${this.projectName}-${1001 + count}`; // Generate projectID in the desired format
  }
  next();
});

// Create a Model from the Schema
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
