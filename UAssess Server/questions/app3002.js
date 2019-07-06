const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var multer  = require('multer');
var path = require('path');
var cors = require('cors');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/titleFiles');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString()+ file.originalname);
    }
});

require('./config/global');
var app = express();
mongoose.connect('mongodb://' + db_username + ':' + db_password  + '@ds261096.mlab.com:61096/uassess', {
    useCreateIndex: true,
    useNewUrlParser: true
});

app.use(cors());

app.use("/", express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.use(multer({ storage: storage }).any()); // any gives all requested data to the server
app.use('/api', require('./routes/api'));

app.listen('3002', base_url);
console.log('Server started at port 3002');

module.exports = app;
