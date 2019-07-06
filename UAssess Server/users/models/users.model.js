const mongoose = require('mongoose');

const usersCollection = mongoose.Schema({
    userId: { type: String, required: [true, 'User ID field is required']},
    email: { type: String, required: [true, 'Email field is required']},
    name: { type: String, required: [true, 'Name field is required']},
    password: { type: String, required: [true, 'Password field is required']},
    authType: { type: String, required: [true, 'Authentication type required']},
    // clientId: { type: String, required: false, default:""},
    privilegeRoles: { type: Array, required: [true, 'Privilege roles field is required']},
    phone: { type: String, required: false, default: ""},
    profileImage: { type: String, required: false, default:""},
    companyId: { type: String, required: false, default: ""},
    jobRole: { type: String, required: false, default:""},
    createdBy: { type: String, required: false, default:""}
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('users', usersCollection);