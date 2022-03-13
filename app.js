const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const cors = require("cors");
const errorMiddleware = require('./middleware/error')

//import routes
const adminroutes = require('./router/adminroute')
const categoryroutes = require('./router/categoryroute');

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
app.use('/api/admin', adminroutes);
app.use('/api/category', categoryroutes)


app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Hi i am from hungrypizza')
})

module.exports = app
