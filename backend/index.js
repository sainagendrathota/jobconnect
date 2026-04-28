const express=require('express');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
require('dotenv').config();
const MONGO_URL=process.env.MONGO_URL;
app.use(express.json());
app.use(cors());

const auth=require('./routes/authRoute');
app.use('/auth',auth);
const recruiter=require('./routes/recruiterRoute');
app.use('/recruiter',recruiter);
const jobseeker=require('./routes/jobseekerRoute');
app.use('/jobseeker',jobseeker);
mongoose.connect(MONGO_URL).then(()=>{
    console.log("DB is Connected");
    app.listen(5000,()=>{
        console.log("running in port 5000");
    })
})
