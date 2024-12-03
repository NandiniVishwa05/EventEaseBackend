const { request, response } = require('express');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "demo",
    insecureAuth: true,
    port: 3306
})

const fetchingfaculty = (request, response) => {
    // console.log(request.params.admin);

    let str = request.params.admin.toString();
    console.log(str);
    // console.log(request.params.email);
    // console.log(request.params.password);

    let sqlquery = `select fid,femail,fpassword,adminpermission from faculty where femail='${request.params.email}' AND fpassword='${request.params.password}' AND adminpermission='${str}'`;
    db.query(sqlquery, (err, data) => {
        if (err) {
            console.log(err);
            response.send(err)
        } else if (data.length != 0) {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                if (request.params.email === data[i].femail && request.params.password === data[i].fpassword && str === data[i].adminpermission) {
                    console.log(typeof (data[i].fpassword));
                    console.log("valid");
                    response.json({ msg: "ValidUserandadmin", fid: data[0].fid });
                }
            }
        } else if (data.length == 0) {
            console.log(data);
            response.json({ msg: "InvalidUserandadmin" });
        }

    })
}

const verifyuser = (request, response) => {
    // let { email, password, admin } = request.body;
    let str = request.params.admin.toString();
    let sqlquery = `select femail,fpassword,adminpermission,fdepartment,fphone_number from faculty where femail='${request.params.email}' AND fpassword='${request.params.password}' AND adminpermission='${request.params.admin}'`;
    db.query(sqlquery, (err, data) => {
        if (err) {
            response.send(err)
        } else if (data.length != 0) {
            for (let i = 0; i < data.length; i++) {
                if (request.params.email === data[i].femail && request.params.password === data[i].fpassword && str === data[i].adminpermission) {
                    if (str === "true" && data[i].adminpermission === "true") {
                        response.json({ msg: "Admin" });
                    } else if (data[i].fdepartment === null && data[i].fphone_number === null) {
                        response.json({ msg: "NewUser" })
                    } else {
                        response.json({ msg: "OldUser" })
                    }
                }
            }
        } else if (data.length == 0) {
            console.log(data);
            response.json({ msg: "Invalid User and Admin" });
        }
    })
}

module.exports = { fetchingfaculty, verifyuser };