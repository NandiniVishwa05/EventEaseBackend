const express = require('express');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "eventease",
    insecureAuth: true,
    port: 3306
})

const fetchfname = (request, response) => {
    // let fid = parseInt(request.params.fid);
    // console.log(fid);
    let sqlquery = `select fname from faculty where fid=${request.user.fid}`;
    db.query(sqlquery, (err, data) => {
        if (err) {
            response.send(err);
        } else if (data.length != 0) {
            response.json(data);
        }
    })
}

const insertfdata = (request, response) => {
    const {  fdept, fjoiningdate, phoneno, image ,did} = request.body;

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Buffer.from(base64Data, "base64");
    // console.log(binaryData);
    let query = `update faculty set fdid=${did},fjoining_date='${fjoiningdate}',fphone_number='${phoneno}',fprofile_pic=? where fid=${request.user.fid}`;
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