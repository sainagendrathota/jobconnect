const express=require('express');
const router=express.Router();

const{getJobs, applyJob, myApplications}=require('../controllers/jobseekerController');
router.route('/getjobs').post(getJobs);
router.route('/apply-job').post(applyJob);
router.route('/my-applications').post(myApplications);
module.exports=router;