const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const router = require('./routes/router')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

dotenv.config();
app.use(cookieParser());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(express.json({ limit: "2mb" }));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["POST", "GET"],
    credentials: true
}));

app.use('/', router)

app.listen(process.env.PORT, () => {
    console.log("App started at PORT : ", process.env.PORT);
})  