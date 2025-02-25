const mongoose = require('mongoose');

// Define the Ticket schema
const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true },
  title: { type: String, required: true },
  tickethours: { type: Number, required: true },
  _id: { type: String, required: true } // Assuming _id is passed as a string from your fetched tickets
});

// Define the Project schema
const projectSchema = new mongoose.Schema({
  projectID: { type: String, required: true },
  projectName: { type: String, required: true },
  projectOwner: { type: String, required: true }
});

// Define the Resource schema
const resourceSchema = new mongoose.Schema({
  id: { type: String, required: true },  // Resource ID
  name: { type: String, required: true } // Resource Name
});

// Define the Sprint schema
const sprintSchema = new mongoose.Schema({
  sprintId: { type: String, unique: true }, // Add sprintId field
  project: { type: projectSchema, required: true }, // Include project as a sub-document

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tickets: [ticketSchema], // Array of tickets
  resources: [resourceSchema], // Array of resources
  sprintOwnerId: { type: String, required: true }, // Owner ID as a string
  totalHours: { type: Number, required: false }, // Total hours for the sprint
  status: { type: String, default: 'open' } // Status field with default value 'open'
}, { timestamps: true });

// Pre-save middleware to generate a unique sprintId
sprintSchema.pre('save', async function (next) {
  if (!this.sprintId) {
    const lastSprint = await mongoose.model('Sprint').findOne().sort({ createdAt: -1 });
    let lastIdNumber = 1000; // Starting point for IDs (SP1001)

    if (lastSprint && lastSprint.sprintId) {
      lastIdNumber = parseInt(lastSprint.sprintId.substring(2)) + 1; // Increment last ID number
    }

    this.sprintId = `SP${lastIdNumber}`;
  }
  next();
});

// Custom validation to ensure endDate is after startDate
sprintSchema.pre('validate', function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date.'));
  }
  next();
});


sprintSchema.pre('save', function(next) {
  // Calculate total hours from tickets
  const totalHours = this.tickets.reduce((sum, ticket) => sum + ticket.tickethours, 0);
  this.totalHours = totalHours;

  // Calculate the maximum allowed hours based on resources
  const maxAllowedHours = this.resources.length * 48;

  // Check if total hours exceed the allowed hours
  if (totalHours > maxAllowedHours) {
    return next(new Error(`Total hours (${totalHours}) exceed the allowed limit (${maxAllowedHours}) based on resources.`));
  }

  next();
});
// Create the Sprint model
const Sprint = mongoose.model('Sprint', sprintSchema);

module.exports = Sprint;
