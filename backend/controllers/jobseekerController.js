const express=require('express');
const allJobs=require('../models/postjobmodel');
const appliedJobs= require('../models/appliedjobs');
exports.getJobs=async(req,res)=>{

    const {location,category}=req.body;
    // if(!location || !category) 
    // {
    //     return res.status(400).json({msg:"all fileds required"});
    // }
    // console.log(req.body);

    try{
        if(!category && !location)
        {
             const filteredJobs= await allJobs.find();
         return res.status(200).json({success:true,jobs:filteredJobs,msg:"successfully retrieved jobs"});
        }
        if(!category)
        {
            const filteredJobs= await allJobs.find({location:location});
         return res.status(200).json({success:true,jobs:filteredJobs,msg:"successfully retrieved jobs"});
        }
        else if(!location)
        {
          const filteredJobs= await allJobs.find({category:category});
         return res.status(200).json({success:true,jobs:filteredJobs,msg:"successfully retrieved jobs"});

        }
         const filteredJobs= await allJobs.find({location:location,category:category});
          console.log(filteredJobs);
         return res.status(200).json({success:true,jobs:filteredJobs,msg:"successfully retrieved jobs"});
    }
    catch(e)
    {
        return res.status(502).json({error:e,msg:"failed to fetch"});
        
    }
}

exports.applyJob=async(req,res)=>{
    const {jobId, jobTitle, jobseekerEmail,resumeUrl,coverLetter}=req.body;
  console.log(req.body);
    if(!jobId || !jobTitle || !jobseekerEmail || !resumeUrl)
    {
           return res.status(400).json({message:"require all fileds"});
    }
    try{
         const postedJob = await allJobs.findOne({ jobId: jobId });
         const recruiterEmail = postedJob?.email; // optional chaining to avoid error if job is null
         const category= postedJob?.category;
          const newApplication = await appliedJobs.create({
            jobId,
            jobTitle,
            jobseekerEmail,
            recruiterEmail,
            category,
            resumeUrl,
            coverLetter 
             });
         res.status(200).json({success:true,message:"Successfully applied",application:newApplication});
    }
    catch(e){
         res.status(400).json({success:false,error:e});
    }
}

exports.myApplications=async(req,res)=>{
    const{jobseekerEmail}=req.body;
    if(!jobseekerEmail)
    {
        res.status(400).json({success:false,message:"All fields required"});
    }
    try{
    const applications= await appliedJobs.find({jobseekerEmail:jobseekerEmail});
    if(applications)
    {
        return res.status(200).json({success:true,
            applications:applications,message:"Successfully required the fields"})
    }
    else{
        return res.status(400).json({succes:false,message:"No Applications"});
    }
    }
    catch(e)
    {
        return res.status(400).json({succes:false,error:e});
    }
}