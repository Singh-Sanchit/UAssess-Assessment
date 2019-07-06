const mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var inviteCollection = new Schema({
    companyId: { type: String, required: false, default:''},
    email: { type: String, required: [true, 'Email Id required']},
    privilegeRole: { type: String, required: [true, 'Privilege role required']},
    invitedBy: { type: String, required: false, default: ""}
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('invite', inviteCollection);

