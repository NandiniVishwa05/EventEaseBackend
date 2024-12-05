const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
dotenv.config();
app.use(express.json({ limit: "100mb" }));
app.use(cors());
const router = require('./routes/router')

app.use('/', router)

app.listen(process.env.PORT, () => {
    console.log("App started at PORT : ", process.env.PORT);
})  