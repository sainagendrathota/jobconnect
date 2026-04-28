
const express = require('express');
const postJob = require('../models/postjobmodel');
const appliedJobs=require('../models/appliedjobs');
async function generateNextJobId() {
  const lastJob = await postJob.findOne().sort({ jobId: -1 }).lean();
  if (!lastJob || typeof lastJob.jobId !== 'number') {
    return 100000;
  }
  return lastJob.jobId + 1;
}


exports.postJob=async (req, res) => {
  try {
    const { jobTitle, companyName,email, location, category, jobDescription } = req.body;
    
    if(!jobTitle || !companyName || !email || !location || !category || !jobDescription)
    {
      return res.status(400).json({msg:"required all fileds"});
    }
    const newJobId = await generateNextJobId();
    const newJob = new postJob({
      jobId:newJobId,
      jobTitle,
      companyName,
      email,
      location,
      category,
      jobDescription
    });
    
    await newJob.save();
   
    res.status(201).json({ success: true, message: 'Job posted successfully!', job: newJob });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ success: false,error:error, message: 'Server error while posting job' });
  }
}

exports.getAllJobs=async(req,res)=>{
  try{
    const {email}=req.query;
    console.log(email);
    if(!email)
    {
      return res.status(400).json({msg:"require all fileds"});
    }

    const alljobs=await postJob.find({email:email});
     return res.status(200).json({success:true,joblist:alljobs,msg:"successfully retrieved all jobs"});
  }
  catch(e)
  {
      return res.status(500).json({error:e, msg:"error occured"});
  }
}

exports.getApplicants=async(req,res)=>{
  const {jobId}=req.body;
  if(!jobId)
  {
    return res.status(400).json({"message":"job id is required"});
  }
  try{
     const applicants= await appliedJobs.find({jobId:jobId,status:"Pending"});
    return res.status(200).json({succes:true,"message":"retrieved the applicants",applicants:applicants});
  }
    catch(e)
    {
       return res.status(400).json({success:false,"message":"error occured"});
    }
  
}
exports.updateApplicant=async(req,res)=>{
  const {jobId, jobseekerEmail, status}=req.body;
  if(!jobId ||!jobseekerEmail || !status)
  {
    return res.status(400).json({message:"All fileds required",success:false});
  }
  try{
        const updatedApplication = await appliedJobs.findOneAndUpdate(
              { jobId: jobId, jobseekerEmail: jobseekerEmail },
              { status: status },
              { new: true } 
      );
      if (!updatedApplication) {
        res.status(400).json({success:false,message:"cannot updated try again",})
      } else {
        res.status(200).json({success:true,message:"Successfully upated the applicant"});
      }
  }
  catch(e)
  {
    res.status(400).json({succes:false, error:e});
  }
}