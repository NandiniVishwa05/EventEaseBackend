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

const fetchfname = (request, response) => {
    let fid = parseInt(request.params.fid);
    // console.log(fid);
    let sqlquery = `select fname from faculty where fid=${fid}`;
    db.query(sqlquery, (err, data) => {
        if (err) {
            response.send(err);
        } else if (data.length != 0) {
            response.json({ fname: data[0].fname })
            // console.log(data[0].fname);
        }
    })
}

const insertfdata = (request, response) => {
    const { fid, fdept, fjoiningdate, phoneno, image } = request.body;

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Buffer.from(base64Data, "base64");
    // console.log(binaryData);
    let query = `update faculty set fdepartment='${fdept}',fjoining_date='${fjoiningdate}',fphone_number='${phoneno}',fprofile_pic=? where fid=${fid}`;
    db.query(query, [binaryData], (err, data) => {
        if (err) {
            console.log(err);
            response.send(err);
        } else if (data.length != 0) {
            console.log("inserted");
            response.json({ msg: "InsertedSuccessfully" })
        }
    })
}
module.exports = {
    fetchfname,
    insertfdata
}