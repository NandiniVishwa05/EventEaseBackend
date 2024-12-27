const { request, response } = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "eventease",
    insecureAuth: true,
    port: 3306
})

const fetchingfaculty = (request, response) => {
    let str = request.params.admin.toString();

    let sqlquery = `select fid,fname,femail,adminpermission,fdid from faculty where femail='${request.params.email}' AND fpassword='${request.params.password}' AND adminpermission='${str}'`;
    try {

        db.query(sqlquery, (err, data) => {
            if (err) {
                console.log(err);
                response.send(err)
            } else if (data.length != 0) {
                console.log(data[0]);
                const token = jwt.sign(
                    data[0],
                    process.env.jwtskey,
                    { expiresIn: '1h' }
                );

                response.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 3600000
                })
                response.json({ msg: "ValidUserandadmin", fid: data[0].fid });

            } else if (data.length == 0) {
                console.log(data);
                response.json({ msg: "InvalidUserandadmin" });
            }

        })
    } catch (error) {
        console.log(error);
    }
}

const verifyuser = (request, response) => {
    // let { email, password, admin } = request.body;
    let str = request.params.admin.toString();
    let sqlquery = `select femail,fpassword,adminpermission,fdid,fphone_number from faculty where femail='${request.params.email}' AND fpassword='${request.params.password}' AND adminpermission='${request.params.admin}'`;
    db.query(sqlquery, (err, data) => {
        if (err) {
            response.send(err)
        } else if (data.length != 0) {
            for (let i = 0; i < data.length; i++) {
                if (request.params.email === data[i].femail && request.params.password === data[i].fpassword && str === data[i].adminpermission) {
                    if (str === "true" && data[i].adminpermission === "true") {
                        response.json({ msg: "Admin" });
                    } else if (data[i].fdid === null && data[i].fphone_number === null) {
                        response.json({ msg: "NewUser" })
                    } else {
                        response.json({ msg: "OldUser" })
                    }
                }
            }

        } else if (data.length == 0) {
            // console.log(data);
            response.json({ msg: "Invalid User and Admin" });
        }
    })

}

const checkValidEmail = (req, res) => {
    let email = req.params.email;
    console.log(email);

    let sql = `select femail from faculty where femail='${email}' and adminpermission='false'`;
    db.query(sql, (err, data) => {
        if (err) {
            response.send(err);

        } else if (data.length > 0) {
            // console.log(data[0].femail);
            res.json(data);
        } else {
            res.send({ msg: "UserNotExist" });
        }
    })
}
const insertNewPassword = (request, res) => {
    let { password, email } = request.body;

    let query = `update faculty set fpassword='${password}' where femail = '${email}';`
    db.query(query, (err, data) => {
        if (err) {
            // console.log(err);
            response.send(err)
        } else if (data.affectedRows > 0) {
            res.send({ msg: "Password Updated" })
        } else {
            res.send({ msg: "Invalid Email" });
        }
    })
}

const verifytoken = (req, res, next) => {
    let token = req.cookies.token;
    // console.log(token);

    if (token) {
        jwt.verify(token, process.env.jwtskey, (err, decoded) => {
            if (err) {
                console.log("Invalid token");
                res.send({ msg: "InvalidToken" })
            } else {
                console.log("Valid token");
                req.user = decoded;
                next();
            }
        })
    } else {
        console.log("No token");
        res.send({ msg: "NoToken" });
    }
}

const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });

    res.json({ msg: 'LoggedOut' });
}

module.exports = { fetchingfaculty, verifyuser, checkValidEmail, insertNewPassword, verifytoken, logout };