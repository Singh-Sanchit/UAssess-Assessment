const mongoose = require('mongoose');

const tokenCollection = mongoose.Schema({
    profileId: {type: String, required: [true, 'Profile Id required']},
    token: {type: String, required: [true, 'Token String required']},
    pushNotificationId: {type: String, required: false, default:""},
    clientId: { type: String, required: false, default:""},
    authType: { type: String, required: [true, 'Authentication type required']},
    appVersion: {type: String, required: false}
}, {timestamps: true, versionKey: false});

module.exports = mongoose.model('token', tokenCollection);