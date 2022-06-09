const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const cors = require("cors");
const errorMiddleware = require('./middleware/error')
const path = require('path')
//import routes
const adminroutes = require('./router/adminroute')
const categoryroutes = require('./router/categoryroute');
const itemroutes = require('./router/itemroute')
const userroutes = require('./router/userroute');
const cartroutes = require('./router/cartroute');
const addressroutes = require('./router/addressroute');
const orderroutes = require('./router/orderroute');
const paymentRoutes = require('./router/paymentRoute');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser())
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", parameterLimit: 50000, extended: false }));

app.use('/storage', express.static('storage'));

const corsOption = {
    credentials: true,
    origin: [
        "http://localhost:2000",
        "http://localhost:2001",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://hungrypizza.herokuapp.com",
        "https://hungrypizza.herokuapp.com",
        "https://hungryadmin.herokuapp.com",
        "http://hungryadmin.herokuapp.com",
        "https://hungry-70626.web.app",
        "https://hungry-70626.firebaseapp.com"
    ]
}

app.use(cors(corsOption))
app.use('/api/admin', adminroutes);
app.use('/api/category', categoryroutes)
app.use('/api/item', itemroutes);
app.use('/api/user', userroutes);
app.use('/api/cart', cartroutes);
app.use('/api/address', addressroutes);
app.use('/api/order', orderroutes);
app.use('/api/payment', paymentRoutes);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Hi i am from hungrypizza')
})

module.exports = app
