const express = require('express')
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "eventease",
    insecureAuth: true,
    port: 3306
})

const insertactivitydata = (request, response) => {
    const {  activity_name, academic_year, activity_date, male_student, female_student, pdf } = request.body;

    intmale = parseInt(male_student);
    intfemale = parseInt(female_student);
    const base64Data = pdf.replace(/^data:application\/pdf;base64,/, "");
    const binaryData = Buffer.from(base64Data, "base64");

    console.log(binaryData);
    // Insert PDF binary data into MySQL database
    let query = `insert into activity(afid,aname,aacademic_year,adate,afemale_student,amale_student,aupload_file) values(${request.user.fid},'${activity_name}','${academic_year}','${activity_date}',${intfemale},${intmale},?)`;
    db.query(query, [binaryData], (err, data) => {
        if (err) {
            console.log("error yaha pe hai ", err);
            response.json({ msg: "error" })
        } else if (data.affectedRows > 0) {
            response.json({ msg: "Success" });
        }
    })
}

const fetchactivitydata = (request, response) => {

    console.log(request.user);
    let fid = request.user.fid

    // let fid = request.params.fid;
    // console.log(fid);

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
    const { aid, activity_name, academic_year, activity_date, male_student, female_student } = request.body;
    intmale = parseInt(male_student);
    intfemale = parseInt(female_student);

    let query = `update activity set aname='${activity_name}',aacademic_year='${academic_year}',adate='${activity_date}',afemale_student=${female_student},amale_student=${male_student} where afid=${request.user.fid} and aid=${aid}`;
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

    const { aid } = request.body;
    let query = `delete from activity where afid=${request.user.fid} and aid=${aid}`;
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.affectedRows > 0) {
            response.json({ msg: "Data Deleted Successfully" });
        }
    })
}
const fetchuserdetails = (request, response) => {
    const fid = request.user.fid;

    let query = `select department.dname,fname,femail,fprofile_pic from faculty inner join department on faculty.fdid=department.did where fid=${fid}`

    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            const base64Image = Buffer.from(data[0].fprofile_pic).toString("base64");
            const imageData = `data:image/jpeg;base64,${base64Image}`;
            response.json({ userdata: data, userpic: imageData });
        }
    })
}
const fetchdatabyfilter = (request, res) => {
    let query;
    let fid = parseInt(request.user.fid)
    console.log(request.params.fid);
    console.log(request.params.aacademic_year);
    console.log(request.params.aname);

    if (request.params.aname == "emptyinpfield") {
        query = `select aid,aname,aacademic_year,adate,afemale_student,amale_student,aupload_file from activity where aacademic_year='${request.params.aacademic_year}' and afid=${fid}`;
    } else if (request.params.aacademic_year === "Select...") {
        query = `select * from activity where aname like '%${request.params.aname}%' and afid=${fid}`;
    } else {
        query = `select aid,aname,aacademic_year,adate,afemale_student,amale_student,aupload_file from activity where aname LIKE '%${request.params.aname}%' and aacademic_year='${request.params.aacademic_year}' and afid=${fid}`;
    }
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else if (data.length > 0) {
            res.send(data);
        } else {
            console.log(data);
            res.send({ msg: "empty" })
        }
    })

}
module.exports = {
    insertactivitydata,
    fetchactivitydata,
    updateactivitydata,
    deleteActivityData,
    fetchuserdetails,
    fetchdatabyfilter
}
