
const express = require('express');
const router = express.Router();
const {postJob,getAllJobs, getApplicants,updateApplicant} = require('../controllers/recruiterController'); // Adjust the path as needed

router.post('/post-job',postJob);
router.get('/get-alljobs',getAllJobs);
router.post('/get-applicants',getApplicants);
router.post('/update-applicant',updateApplicant);
module.exports = router;
