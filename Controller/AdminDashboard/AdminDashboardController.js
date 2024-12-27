const express = require('express');
const mysql = require('mysql2');

const fs = require('fs');
const archiver = require('archiver');
const { log } = require('console');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "eventease",
    insecureAuth: true,
    port: 3306
})

const fetchadmindashboardactivitydata = (request, response) => {
    let query = `SELECT faculty.fname,activity.aid,activity.aname,department.dname,activity.aacademic_year,activity.adate FROM faculty Inner JOIN activity ON faculty.fid=activity.afid inner join department on faculty.fdid=department.did order by activity.adate DESC`;
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data) {
            // console.log(data);
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
    let query = `select faculty.fid,faculty.fname,department.dname,faculty.femail from faculty inner join department on faculty.fdid=department.did where adminpermission='false'`;
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
    let sql = `select aupload_file from activity where aid=${aid}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            response.send(err);
        } else if (data.length != 0) {
            response.setHeader("Content-Type", "application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=user_document.pdf");
            response.send(data[0].aupload_file);
        }
    })
}
const fetchzipfile = (req, res) => {
    let { aidarray } = req.body.data;
    console.log(aidarray);
    const placeholders = aidarray.map(() => '?').join(',');
    let sql = `SELECT aname,aupload_file FROM activity WHERE aid IN (${placeholders})`;
    //SELECT auoplaod_file from activity where aid in (22,24);
    //SELECT auoplaod_file from activity where aid in (?,?);
    //[22,24]
    console.log(aidarray);

    db.query(sql, aidarray, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            res.setHeader('Content-Disposition', 'attachment; filename=pdfs.zip');
            res.setHeader('Content-Type', 'application/zip');

            const archive = archiver('zip', { zlib: { level: 9 } });
            archive.pipe(res);

            try {
                // Append each PDF file to the ZIP archive
                data.forEach((row) => {
                    const fileBuffer = Buffer.from(row.aupload_file); // Convert BLOB to Buffer
                    archive.append(fileBuffer, { name: `${row.aname}.pdf` });
                });

                // Finalize the archive
                archive.finalize();
            } catch (error) {
                console.error('Error creating ZIP archive:', error);
                res.status(500).send('Error creating ZIP file');
            }
        }
    })
}

const deletemultipleactivity = (req, res) => {
    console.log("hello");

    const { arr } = req.body.data;

    // Generate placeholders for the SQL query
    const placeholders = arr.map(() => '?').join(',');

    // SQL query
    const sql = `DELETE FROM activity WHERE aid IN (${placeholders})`;

    // Execute query
    db.query(sql, arr, (err, data) => {
        if (err) {
            console.error('Error deleting records:', err);
            // return res.status(500).json({ error: 'Failed to delete records' });
            res.json({ deleted: false })
        } else if (data.affectedRows > 0) {
            res.json({ deleted: true });
        }
    });
}

const fetchfilteruserdetail = (request, response) => {
    const name = request.params.name;
    console.log(name);

    let query = `select fname,department.dname,femail from faculty inner join department on faculty.fdid=department.did where fname LIKE '%${name}%' and adminpermission = 'false'`;
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.length > 0) {
            response.send(data);
        } else {
            response.send({ msg: "UserNotExist" })
        }
    })
}
const fetchfilteradmindashboarddata = (request, response) => {

    const ayear = request.params.ayear;
    const adept = request.params.adept;
    let query;
    console.log("Year = " + typeof (ayear) + " dept = " + typeof (adept));
    if (adept == "Select...") {
        query = `SELECT faculty.fname,activity.aid,activity.aname,department.dname,activity.aacademic_year,activity.adate FROM faculty Inner JOIN activity ON faculty.fid=activity.afid inner join department on faculty.fdid=department.did where activity.aacademic_year='${ayear}' order by activity.adate DESC;`;
    } else if (ayear === "Select...") {
        query = `SELECT faculty.fname,activity.aid,activity.aname,department.dname,activity.aacademic_year,activity.adate FROM faculty Inner JOIN activity ON faculty.fid=activity.afid inner join department on faculty.fdid=department.did where department.dname='${adept}' order by activity.adate DESC;`;
    } else {
        query = `SELECT faculty.fname,activity.aid,activity.aname,department.dname,activity.aacademic_year,activity.adate FROM faculty Inner JOIN activity ON faculty.fid=activity.afid inner join department on faculty.fdid=department.did where department.dname='${adept}' and activity.aacademic_year='${ayear}' order by activity.adate DESC;`;
    }
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.length > 0) {
            response.send({ msg: "found", data });
        } else {
            response.send({ msg: "datanotfound" })
        }
    })
}
const insertdepartmentdetail = (request, response) => {
    let { dept } = request.body;
    console.log(dept);
    let sql = `insert into department(dname) values('${dept}')`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            response.send(err);
        } else if (data.affectedRows >= 0) {
            response.json({ msg: "Inserted Successfully" })
        }
    })
}
const fetchdepartmenttabledata = (request, response) => {
    let sql = `select * from department`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            response.send(err);
        } else if (data) {
            response.json(data)
        } else {
            response.send({ msg: "empty" })
        }
    })
}
const deletedepartmentdata = (request, response) => {
    let deptdid = request.params.dept;
    let sql = `delete from department where did=${deptdid}`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            response.send(err);
        } else if (data.affectedRows >= 0) {
            response.json({ msg: "Deleted Successfully" })
        }
    })
}
module.exports =
{
    fetchadmindashboardactivitydata,
    addusercredentials,
    fetchusercredentials,
    deleteusercredentials,
    downloadactivitypdf,
    fetchzipfile,
    fetchfilteruserdetail,
    fetchfilteradmindashboarddata,
    insertdepartmentdetail,
    fetchdepartmenttabledata,
    deletedepartmentdata,
    deletemultipleactivity
}