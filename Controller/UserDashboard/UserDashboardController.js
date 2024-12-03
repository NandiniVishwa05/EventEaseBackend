const express = require('express')
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "demo",
    insecureAuth: true,
    port: 3306
})

const insertactivitydata = (request, response) => {
    const { afid, activity_name, academic_year, activity_date, male_student, female_student, pdf } = request.body;

    intmale = parseInt(male_student);
    intfemale = parseInt(female_student);
    const base64Data = pdf.replace(/^data:application\/pdf;base64,/, "");
    const binaryData = Buffer.from(base64Data, "base64");

    console.log(binaryData);
    // Insert PDF binary data into MySQL database
    let query = `insert into activity(afid,aname,aacademic_year,adate,afemale_student,amale_student,aupload_file) values(${afid},'${activity_name}','${academic_year}','${activity_date}',${intfemale},${intmale},?)`;
    db.query(query, [binaryData], (err, data) => {
        if (err) {
            console.log(err);
            response.json({ msg: "error" })
        } else if (data.affectedRows > 0) {
            response.json({ msg: "Success" });
        }
    })
}

const fetchactivitydata = (request, response) => {
    let fid = request.params.fid;
    console.log(fid);

    let query = `select aid,aname,aacademic_year,adate,afemale_student,amale_student from activity where afid=${fid}`;
    db.query(query, (err, data) => {
        if (err) {
            response.json({ msg: "error" })
        } else if (data.length === 0) {
            response.json({ msg: "No Records Found" });
        } else {
            response.json({ msg: "Activity Data Fetched", "data": data });
            console.log(data);

        }
    })
}
const updateactivitydata = (request, response) => {
    const { aid, afid, activity_name, academic_year, activity_date, male_student, female_student } = request.body;
    intmale = parseInt(male_student);
    intfemale = parseInt(female_student);

    let query = `update activity set aname='${activity_name}',aacademic_year='${academic_year}',adate='${activity_date}',afemale_student=${female_student},amale_student=${male_student} where afid=${afid} and aid=${aid}`;
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);

            // response.json({ msg: "error" })
        } else if (data.affectedRows > 0) {
            response.json({ msg: "Success" });
        }
    })
}
const deleteActivityData = (request, response) => {
    console.log("hello");

    const { aid, afid } = request.body;
    let query = `delete from activity where afid=${afid} and aid=${aid}`;
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.affectedRows > 0) {
            response.json({ msg: "Data Deleted Successfully" });
        }
    })
}
const fetchuserdetails = (request, response) => {
    const fid = request.params.fid;
    let query = `select fdepartment,fname,femail,fprofile_pic from faculty where fid=${fid}`
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);

        } else {
            const base64Image = Buffer.from(data[0].fprofile_pic).toString("base64");
            const imageData = `data:image/jpeg;base64,${base64Image}`;
            response.json({ userdata: data, userpic: imageData });
        }
    })
}
module.exports = {
    insertactivitydata,
    fetchactivitydata,
    updateactivitydata,
    deleteActivityData,
    fetchuserdetails
}
