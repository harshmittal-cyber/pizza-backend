const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const cors = require("cors");



app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.json());

const corsOption = {
    credentials: true,
    origin: [
        "http://localhost:2000",
        "http://localhost:2001",
        "http://localhost:3000",
        "http://localhost:3001"
    ]
}

app.use(cors(corsOption))


app.get('/', (req, res) => {
    res.send('Hi i am from hungrypizza')
})

module.exports = app
