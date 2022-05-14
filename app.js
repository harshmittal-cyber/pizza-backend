const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const cors = require("cors");
const errorMiddleware = require('./middleware/error')
const multer = require('multer');
const path = require('path')
//import routes
const adminroutes = require('./router/adminroute')
const categoryroutes = require('./router/categoryroute');
const itemroutes = require('./router/itemroute')

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser())
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", parameterLimit: 50000 }));

app.use('/storage', express.static('storage'));

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
app.use('/api/admin', adminroutes);
app.use('/api/category', categoryroutes)
app.use('/api/item', itemroutes)

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Hi i am from hungrypizza')
})

module.exports = app
