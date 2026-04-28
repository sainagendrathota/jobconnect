const mongoose=require('mongoose');

const appliedjob= mongoose.Schema({
    jobId:{
      type:Number,
      required:true
    },
    jobTitle:{
       type:String,
       required:true
    },
    jobseekerEmail:{
        type:String,
        required:true
    },
    recruiterEmail:{
        type:String,
        required:true
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
    resumeUrl:{
      type:String,
      required:true
    },
    coverLetter:{
      type:String
    },
    status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports=mongoose.model("appliedjob",appliedjob);