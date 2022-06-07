const app = require("./app");
const path = require('path');
const dotenv = require("dotenv").config();
const database = require('./config/mongoose')

const port = process.env.PORT || 4000

database();

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1)
});


app.listen(port, () => {
    console.log(`Server is working on ${port}`);
});

process.on("unhandledRejection", (err, promise) => {
    console.log(`ErrorRejection:${err.message}`);
});