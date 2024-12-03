const express = require('express')
const router = express.Router();
const { fetchingfaculty, verifyuser } = require('../Controller/LoginPage/LoginPageController.js');
const { sendmail } = require('../Controller/LoginPage/OtpPageController.js');
const { fetchfname } = require('../Controller/UserForm/UserformController.js');
const { insertfdata } = require('../Controller/UserForm/UserformController.js');
const { fetchactivitydata } = require('../Controller/UserDashboard/UserDashboardController.js')
const { insertactivitydata } = require('../Controller/UserDashboard/UserDashboardController.js');
const { updateactivitydata } = require('../Controller/UserDashboard/UserDashboardController.js');
const { deleteActivityData } = require('../Controller/UserDashboard/UserDashboardController.js');
const { fetchuserdetails } = require('../Controller/UserDashboard/UserDashboardController.js');
const { fetchadmindashboardactivitydata } = require('../Controller/AdminDashboard/AdminDashboardController.js');
const { addusercredentials } = require('../Controller/AdminDashboard/AdminDashboardController.js');
const { fetchusercredentials } = require('../Controller/AdminDashboard/AdminDashboardController.js')
const { deleteusercredentials } = require('../Controller/AdminDashboard/AdminDashboardController.js')
const { downloadactivitypdf } = require('../Controller/AdminDashboard/AdminDashboardController.js')
//Module 1 - Login Page 
router.get('/verifycredentials/:email/:password/:admin', fetchingfaculty);
router.post('/sendmail', sendmail);
router.get('/checkuser/:email/:password/:admin', verifyuser);

//Module 2
router.get('/fetchfname/:fid', fetchfname);
router.post('/insertfdata', insertfdata);

//Module 3
router.post('/insertactivitydata', insertactivitydata);
router.get('/fetchactivitydata/:fid', fetchactivitydata);
router.post('/updateactivitydata', updateactivitydata);
router.post('/deleteActivityData', deleteActivityData);
router.get('/fetchuserdetails/:fid', fetchuserdetails);

//Module 4
router.get('/fetchadmindashboardactivitydata', fetchadmindashboardactivitydata);
router.post('/addusercredentials', addusercredentials);
router.get('/fetchusercredentials', fetchusercredentials);
router.post('/deleteusercredentials',deleteusercredentials);
router.get('/downloadactivitypdf/:aid', downloadactivitypdf);

module.exports = router;

