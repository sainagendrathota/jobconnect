
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId:{
    type:Number,
    unique:true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  email:{
    type:String,
    required:true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Software Development',
      'Marketing',
      'Design',
      'Finance',
      'Human Resources'
    ]
  },
  jobDescription: {
    type: String,
    required: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
