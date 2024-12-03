const express = require('express');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "demo",
    insecureAuth: true,
    port: 3306
})

const fetchadmindashboardactivitydata = (request, response) => {
    let query = `SELECT faculty.fname,activity.aid,activity.aname,faculty.fdepartment,activity.aacademic_year,activity.adate FROM faculty Inner JOIN activity ON faculty.fid=activity.afid order by activity.adate DESC`;
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data) {
            console.log(data);
            response.send({ data });
        }
    })
}
const addusercredentials = (request, response) => {
    const { fname, fpassword, femail_ID } = request.body;

    let query = `insert into faculty(fname,fpassword,femail,adminpermission) values('${fname}','${fpassword}','${femail_ID}','false')`;
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
            response.send(err);
        } else if (data.affectedRows > 0) {
            response.json({ msg: "Added successfully" });
        }
    })
}
const fetchusercredentials = (request, response) => {
    let query = `select fid,fname,fdepartment,femail from faculty where adminpermission='false'`;
    console.log("cintrol");

    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data) {
            console.log(data);
            response.send({ data });
        }
    })
}
const deleteusercredentials = (request, response) => {
    let { fid } = request.body;
    console.log(fid);

    let sql = `delete from activity where afid=${fid}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            response.send(err);
        } else if (data.affectedRows >= 0) {
            let query = `delete from faculty where fid=${fid}`;

            db.query(query, (err2, data2) => {
                if (err2) {
                    console.log(err2);
                    response.send(err2);
                } else if (data2.affectedRows >= 0) {
                    console.log("con");
                    response.json({ msg: "Deleted Successfully" })
                }
            })
        }
    })
}

const downloadactivitypdf = (request, response) => {
    const aid = request.params.aid;
    console.log(aid);
    let sql = `select aupload_file from activity where aid=${aid}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            response.send(err);
        } else if (data.length != 0) {
            // console.log(data.aupload_file);
            response.setHeader("Content-Type", "application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=user_document.pdf");
            response.send(data[0].aupload_file);
        }
    })
}

module.exports =
{
    fetchadmindashboardactivitydata,
    addusercredentials,
    fetchusercredentials,
    deleteusercredentials,
    downloadactivitypdf
}