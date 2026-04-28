const express=require('express');
const app=express();
const jobseeker=require('../models/jobseekermodel');
const recruiter=require('../models/recuritermodel');

exports.jobseekerRegister=async(req,res)=>{
    console.log(req.body);
     const { username, email, password, phonenumber } = req.body;
    if(!username || !email || !password || !phonenumber){
       return  res.status(402).json({msg:"Required all the fields"});
    }
    try{
        const existingmail=await jobseeker.findOne({email});
        if(existingmail){
            return res.status(401).json({msg:"Email already exist"});
            
        }
        const user=await jobseeker.create(req.body);
        if(user){
            return res.status(201).json({sucess:true,msg:"Registered successfully"});
        }

    }
    catch(e){
        console.log(e);
        return res.status(501).json({error:e});
    }
    
}


exports.recruiterRegister=async(req,res)=>{
    
    const { companyname, email, password } = req.body;

    if(!companyname || !email || !password){
        console.log(req.body);
       return  res.status(402).json({msg:"Required all the fields"});
    }
    try{
        const existingrecruiter=await recruiter.findOne({email});
        if(existingrecruiter){
            return res.status(401).json({msg:"Email already exist"});
            
        }
        const user=recruiter.create(req.body);
        if(user){
            return res.status(201).json({sucess:true,msg:"Registered successfully"});
        }

    }
    catch(e){
        console.log(e);
        return res.status(501).json({error:e});
    }
    
}


exports.loginControl=async(req,res)=>{
   console.log(req.body);

   const {email, password,role } = req.body;

    if(!role || !email || !password){
        console.log(req.body);
       return  res.status(402).json({msg:"Required all the fields"});
    }
    try{
        if(role=='jobseeker')
        {
            const existinguser= await jobseeker.findOne({email});
            if(existinguser)
            {
                if(existinguser.password==password)
                     return res.status(200).json({success:true,msg:"Successfully logged in!"});
                else 
                    return  res.status(400).json({msg:"Wrong password!"});    
            }
            return res.status(401).json({msg:"User not found!"});
        }
        else if(role=='recruiter'){
                 const existinguser= await recruiter.findOne({email});
            if(existinguser)
            {
                if(existinguser.password==password)
                     return res.status(200).json({success:true,msg:"Successfully logged in!"});
                else 
                    return  res.status(400).json({msg:"Wrong password!"});    
            }
            return res.status(401).json({msg:"User not found!"});
        }
    }
    catch(e)
    {
        console.log(e);
    }
}