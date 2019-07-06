const mongoose = require('mongoose');

const assessmentCollection = mongoose.Schema({
    title: { type: String, required: [true, 'title required']},
    icon: { type: String, required: false, default: ""},
    companyLogo: { type: String, required: false, default:""},
    frontCoverImage:{ type: String, required: [true, 'Front cover required']},
    expiryDate: { type: Date, required: [true, 'expiry date required']},
    duration: { type: Number, required: false, default: 0},
    noOfAttempts: { type: Number, required: [true, 'noOfAttempts required']},
    attemptsInterval: { type: Number, required: [true, 'attemptsInterval required']},
    licenseKey: { type: String, required: [true, 'licenseKey required']},
    freeTest: { type: Boolean, required: false, default: false},
    reportGeneration: { type: Boolean, required: false, default: true},
    displayReportToUser: { type: Boolean, required: [true, 'displayReportToUser required']},
    displayReportToCompany: { type: Boolean, required: [true, 'displayReportToCompany required']},
    ownerId: { type: String, required: false, default: ""},
    skills: { type: Array, required: false},
    competencies: { type: Array, required: false},
    subCompetencies: { type: Array, required: false},
    companyId: { type: String, required: [true, 'companyId required']},
    description: { type: String, required: [true, 'description required']},
    summary: { type: String, required: false, default: ""},
    noOfQuestions: { type: Number, required: [true, 'noOfQuestions required']},
    participents: { type: Array, required: false , default: []},
    screenRecord: { type: Boolean, required: false, default: false},
    videoRecord: { type: Boolean, required: false, default: false},
    assessmentType: {type: String, required: false, default: "objective"},
    active: { type: Boolean, required: false, default: true },
    createdBy: { type: String, required: [true, 'createdBy required']},
    updatedBy: { type: String, required: false, default: ""}
}, { timestamps: true, versionKey: false})

module.exports = mongoose.model('assessments',assessmentCollection);