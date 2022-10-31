const express = require('express')
require('dotenv').config()
const path = require('path');
const fileUpload = require("express-fileupload");
const cors = require('cors')
const app = express()
const port = process.env['PORT']

const { sequelize } = require('./models')

const Routes = require('./routes/routes')

if (process.env['NODE_ENV'] === 'production') {
    sequelize.sync()
} else if (process.env['NODE_ENV'] === 'development') {
    sequelize.sync({ alter: true })
}

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({createParentPath: true}));
app.use(Routes);
// app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    // responds to client or test with error
    res.status(err.status || 500).json({
        message: "this is not the web page you're looking for. - obi-wan codenobi"
    })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app