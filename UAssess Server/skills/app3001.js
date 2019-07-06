const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');

require('./config/global');

var app = express();

mongoose.connect('mongodb://' + db_username + ':' + db_password  + '@ds261096.mlab.com:61096/uassess', {
    useCreateIndex: true,
    useNewUrlParser: true
});

app.use(cors());
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use('/api', require('./routes/api'));
app.listen("3001", base_url);
console.log('Server started at port 3001');
