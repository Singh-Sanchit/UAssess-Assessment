const mongoose = require('mongoose');

const userAssessmentCollection = mongoose.Schema({
    profileId: { type: String, required: [true, 'profile Id required']},
    licenseKey: { type: String, required: [true, 'License Key required']},
    assessmentId: { type: String, required: [true, 'Assessment Id required']},
    questionIds: { type: Array, required: false, default:[]}, // given question Ids to user
    skills: {type: Array, required: false, default:[]},
    competencies: {type: Array, required: false, default:[]},
    subCompetencies: {type: Array, required: false, default:[]},
    noOfQuestions: { type: Number, required: [true, 'noOfQuestions required']},
    userKeys: { type: Array, required: false, default:[]}, // user answer keys
    avgScore: { type: String, required: false, default:""}, // total avg score
    axisScore: { type: Object, required: false, default: {}}, // users avg score of each axis
    status: { type: String, required: false, default: "pending"},
    isAssessmentStarted: { type: Boolean, required: false, default: false},
    screenRecordId: { type: String, required: false, default: ""},
    videoRecordId: { type: String, required: false, default: ""}
}, { timestamps: true, versionKey: false})

module.exports = mongoose.model('userAssessments',userAssessmentCollection);