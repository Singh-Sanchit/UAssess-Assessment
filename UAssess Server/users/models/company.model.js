const mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var companyCollection = new Schema({
    name: { type: String, required: [true, 'Company Name required']},
    logo: { type: String, required: false, default:""},
    license: { type: Number, required: false, default: 0},
    manager: { type: String, required: [true, 'Manager name field is required']},
    phone: { type: String, required: [true, 'Phone field is required']},
    bu: { type: String, required: false, default: ""},
    country: { type: String, required: false, default: ""},
    region: { type: String, required: false, default: ""},
    createdBy: { type: String, required: false, default: ""},
    updatedBy: { type: String, required: false, default: ""},
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('companies', companyCollection);

