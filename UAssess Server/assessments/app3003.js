const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');

require('./config/global');

var app = express();

mongoose.connect('mongodb://localhost:27017/'+db_name, { auth: { user: db_username, password: db_password}, useNewUrlParser: true });

app.use(cors());
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.use('/api', require('./routes/api'));

//ec2-35-154-172-174.ap-south-1.compute.amazonaws.com
app.listen('3003', base_url);
console.log('Server started at port 3003');