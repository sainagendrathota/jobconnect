const express=require('express');
const { jobseekerRegister,loginControl, recruiterRegister
} = require('../controllers/authController');
const router=express.Router();
router.route('/jobregister').post(jobseekerRegister);
router.route('/recruiterregister').post(recruiterRegister);
router.route('/login').post(loginControl); 

module.exports=router;