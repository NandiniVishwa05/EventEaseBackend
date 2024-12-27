const express = require('express')
const router = express.Router();
const { fetchingfaculty, verifyuser, checkValidEmail, insertNewPassword, verifytoken, logout } = require('../Controller/LoginPage/LoginPageController.js');
const { sendmail } = require('../Controller/LoginPage/OtpPageController.js');
const { fetchfname } = require('../Controller/UserForm/UserformController.js');
const { insertfdata } = require('../Controller/UserForm/UserformController.js');
const { fetchactivitydata } = require('../Controller/UserDashboard/UserDashboardController.js')
const { insertactivitydata } = require('../Controller/UserDashboard/UserDashboardController.js');
const { updateactivitydata } = require('../Controller/UserDashboard/UserDashboardController.js');
const { deleteActivityData } = require('../Controller/UserDashboard/UserDashboardController.js');
const { fetchdatabyfilter } = require('../Controller/UserDashboard/UserDashboardController.js');
const { fetchuserdetails } = require('../Controller/UserDashboard/UserDashboardController.js');
const { fetchadmindashboardactivitydata } = require('../Controller/AdminDashboard/AdminDashboardController.js');
const { addusercredentials } = require('../Controller/AdminDashboard/AdminDashboardController.js');
const { fetchusercredentials } = require('../Controller/AdminDashboard/AdminDashboardController.js')
const { deleteusercredentials } = require('../Controller/AdminDashboard/AdminDashboardController.js')
const { downloadactivitypdf } = require('../Controller/AdminDashboard/AdminDashboardController.js')
const { fetchzipfile } = require('../Controller/AdminDashboard/AdminDashboardController.js')
const { fetchfilteruserdetail } = require('../Controller/AdminDashboard/AdminDashboardController.js');
const { fetchfilteradmindashboarddata } = require('../Controller/AdminDashboard/AdminDashboardController.js');
const { insertdepartmentdetail } = require('../Controller/AdminDashboard/AdminDashboardController.js');
const { fetchdepartmenttabledata } = require('../Controller/AdminDashboard/AdminDashboardController.js');
const { deletedepartmentdata, deletemultipleactivity } = require('../Controller/AdminDashboard/AdminDashboardController.js');
//Module 1 - Login Page 
router.get('/verifycredentials/:email/:password/:admin', fetchingfaculty);
router.post('/sendmail', sendmail);
router.post('/insertNewPassword', insertNewPassword);
router.get('/checkuser/:email/:password/:admin', verifyuser);
router.get('/checkValidEmail/:email', checkValidEmail);
router.get('/logout', logout);

//Module 2
router.get('/fetchfname', verifytoken, fetchfname);
router.post('/insertfdata', verifytoken, insertfdata);

//Module 3
router.post('/insertactivitydata', verifytoken, insertactivitydata);
router.get('/fetchactivitydata', verifytoken, fetchactivitydata);
router.post('/updateactivitydata', verifytoken, updateactivitydata);
router.post('/deleteActivityData', verifytoken, deleteActivityData);
router.get('/fetchuserdetails', verifytoken, fetchuserdetails);
router.get('/fetchdatabyfilter/:aname/:aacademic_year', verifytoken, fetchdatabyfilter);

//Module 4
router.get('/fetchadmindashboardactivitydata', verifytoken, fetchadmindashboardactivitydata);
router.post('/addusercredentials', verifytoken, addusercredentials);
router.get('/fetchusercredentials', verifytoken, fetchusercredentials);
router.post('/deleteusercredentials', verifytoken, deleteusercredentials);
router.get('/downloadactivitypdf/:aid', verifytoken, downloadactivitypdf);
router.post('/fetchzipfile', verifytoken, fetchzipfile);
router.get('/fetchfilteruserdetail/:name', verifytoken, fetchfilteruserdetail);
router.get('/fetchfilteradmindashboarddata/:ayear/:adept', verifytoken, fetchfilteradmindashboarddata);
router.post('/insertdepartmentdetail', verifytoken, insertdepartmentdetail);
router.get('/fetchdepartmenttabledata', verifytoken, fetchdepartmenttabledata);
router.get('/deletedepartmentdata/:dept', verifytoken, deletedepartmentdata);
router.post('/deletemultipleactivity', verifytoken, deletemultipleactivity);

module.exports = router;
