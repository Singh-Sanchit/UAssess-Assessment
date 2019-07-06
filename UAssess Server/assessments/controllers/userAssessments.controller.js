const Assessment = require('../models/companyAssessments.model');
const UserAssessment = require("../models/userAssessments.model");
var Request = require('request');
const { Parser } = require('json2csv');
var Fs = require('fs');
const uuidv1 = require('uuid/v1');
require('../config/messages');

module.exports = {
getAssessmentOneQuestion: function(req, res){
    var input = req.body;
    if(!("token" in input) || input.token.length == 0){
        return res.send({"code":"1", "message":TOKEN_REQUIRED});
    }
    if(!("licenseKey" in input)){
        return res.send({"code":"1", "message":"License Key field required"});
    }
    let keyPatt = /^\d{6}$/;
    if(input.licenseKey.length == 0 || keyPatt.test(input.licenseKey) == false){
        return res.send({"code":"1", "message":"License Key not valid"});
    }
    Request.post({
        "headers":{ 'Content-Type': 'application/json'},
        "url": "http://"+base_url+":3000/api/get-my-profile",
        "body": JSON.stringify({"token":input.token})
    }, (error, response, body)=>{
        if(error){
            console.log(error);
        }
        var body = JSON.parse(body);
        console.log(body);
        
        if(body.code == "0"){
            if("id" in body.data){
                let profileId = body.data.id;
                Assessment.findOne({"licenseKey":input.licenseKey, "participents":{$in:body.data.email}}).then(function(result){
                    if(result){
                        var todayISO = new Date();
                        var todayMs = todayISO.getTime();
                        var expiryDateMs = result.expiryDate.getTime();
                        console.log(todayISO, result.expiryDate);
                        if(todayMs > expiryDateMs){
                            return res.send({"code":"1", "message":"Assessment Expired, Please contact your Manager"});
                        }else{
                            var questionIdsToSkip = [];
                            var questions = [];
                            UserAssessment.findOne({"licenseKey":input.licenseKey, "profileId":body.data.id},{},{ sort: { 'createdAt' : -1 }}).then(function(myAssess){
                                console.log("hhh"+myAssess);
                                //return res.send(myAssess);
                                if(myAssess && myAssess.status == "pending"){
                                    
                                    // questionIdsToSkip = resultA.questionIds;
                                    // userAssessStatus = true;
                                    input.noOfQuestions = result.noOfQuestions;
                                    return res.send({ "code":"1", "message":"Assessment started, and it's not submitted", "data":input});
                                }else{
                                    var data = {};
                                    var userAssess = {};
                                    userAssess.noOfQuestions = result.noOfQuestions;
                                    userAssess.assessmentId = result._id;
                                    userAssess.profileId = body.data.id;
                                    userAssess.licenseKey = input.licenseKey;
                                    userAssess.reportGeneration = input.reportGeneration;
                                    console.log("assessment ID"+userAssess.assessmentId);
                                    if(result.competencies.length > 0){
                                        userAssess.competencies = [];
                                        result.competencies.forEach(row => {
                                            if("questionIdsToSkip" in data){
                                                row.taken = 0;
                                                userAssess.competencies.push(row);
                                            }else{
                                                row.taken = 1;
                                                data = {
                                                    "questionIdsToSkip":[],
                                                    "competency":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                }
                                                userAssess.competencies.push(row);
                                            }
                                        });
                                    }   
    
                                    if(result.subCompetencies.length > 0){
                                        userAssess.subCompetencies = [];
                                        result.subCompetencies.forEach(row => {
                                            
                                            if("questionIdsToSkip" in data){
                                                row.taken = 0;
                                                userAssess.subCompetencies.push(row);
                                            }else{
                                                row.taken = 1;
                                                data = {
                                                    "questionIdsToSkip":[],
                                                    "subCompetency":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                }
                                                userAssess.subCompetencies.push(row);
                                            }
                                        });
                                    }
                                    
                                    if(result.skills.length > 0){
                                        userAssess.skills = [];
                                        result.skills.forEach(row => {
                                            if("questionIdsToSkip" in data){
                                                row.taken = 0;
                                                userAssess.skills.push(row);
                                            }else{
                                                row.taken = 1;
                                                data = {
                                                    "questionIdsToSkip":[],
                                                    "skill":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                }
                                                userAssess.skills.push(row);
                                            }
                                        });
                                    }
    
                                    // if("questionIdsToSkip" in data){
                                    //     return res.send({ "code":"1", "message":"Assessment does not have any Skills", "data":input});
                                    // }
                                            if("questionIdsToSkip" in data){
                                                module.exports.getRandomQuestion(data, function(questionRes){
                                                    //console.log(questionRes);
                                                    if(questionRes){
                                                        var questionCount = data.questionIdsToSkip.length;
                                                        console.log(questionCount, data);
                                                        UserAssessment.create(userAssess).then(function(resultA){
                                                            if(resultA){
                                                                console.log(questionIdsToSkip);
                                                                var resultObj = result.toObject();
                                                                resultObj.id = resultA._id;
                                                                delete resultObj._id;
                                                                resultObj.assessmentId = result._id;
                                                                resultObj.data = questionRes;
                                                                questionRes.qno = questionCount+1;
                                                                let axisId = "";
                                                                let skillId = "";
                                                                let axisName = "";
                                                                if("competency" in data){
                                                                    axisId = data.competency.id;
                                                                    skillId = data.competency.skillId;
                                                                    axisName = "competencies";
                                                                }
                                                                else if("subCompetency" in data){
                                                                    axisId = data.subCompetency.id;
                                                                    skillId = data.subCompetency.skillId;
                                                                    axisName = "subCompetencies";
                                                                }
                                                                else if("skill" in data){
                                                                    axisId = data.skill.id;
                                                                    skillId = data.skill.id;
                                                                    axisName = "skills";
                                                                }
    
                                                                if(axisId != "" && skillId != ""){
                                                                    resultA.questionIds.push({"id":questionRes.id, "status":"pending", "axisId":axisId, "skillId":skillId, "axisName":axisName});
                                                                    if(resultA.save()){
                                                                        return res.status(200).send({ "code":"0", "message":SUCCESS, "data": resultObj});                         
                                                                    }
                                                                }
                                                                // resultA.questionIds.push({"id":questionRes.id, "status":"pending"});
                                                                // if(resultA.save()){
                                                                //     return res.status(200).send({ "code":"0", "message":SUCCESS, "data": resultObj});                         
                                                                // }
                                                            }
                                                        })
                                                    }else{
                                                        return res.status(200).send({ "code":"1", "message":"Questions are empty for given assessment, please contact the admin"});                         
                                                    }
                                                    //resultObj.assessmentId = resultA._id;
                                                    // if("skill" in data){
                                                    //     resultObj.skillId = data.skill.id;
                                                    // }
                                                    // if("competency" in data){
                                                    //     resultObj.competencyId = data.competency.id;
                                                    // }
                                                    // if("subCompetency" in data){
                                                    //     resultObj.subCompetencyId = data.subCompetency.id;
                                                    // }
                                                });
                                            }
                                        
                                }
                            });    
                        }                        
                    }else{
                        return res.send({ "code":"1", "message":"Invalid license key / Not Invited, Please contact your Manager", "data":input});
                    }
                }).catch(function(error){
                    return res.send({ "code":"1", "message":error.message, "data":input});
                });
            }
        }else{
            return res.send(body);
        }
    })
    
},

submitAssessmentOneQuestion: function(req, res){
    var input = req.body;
    if(!("token" in input) || input.token.length == 0){
        return res.send({"code":"1", "message":TOKEN_REQUIRED});
    }
    if(!("licenseKey" in input) || input.licenseKey.length == 0){
        return res.send({"code":"1", "message":"License Key required"});
    }

    module.exports.validateToken(input.token, function(resultA){
        console.log("A");
        if(resultA){
            //console.log("A1");
            UserAssessment.findOne({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id}).then(function(resultB){
                //console.log(resultB);
                if(resultB){
                   //console.log("B");
                    let data = {"questionId":input.key.id};
                    module.exports.getQuestionById(data, function(questionRes){
                        var answerKeys = [];
                        var answer = null;
                        var preNextIds = {next: "", previous: ""};
                        var screenRecordId = input.screenRecordId;
                        var videoRecordId = input.videoRecordId;
                        console.log();
                        if(questionRes.optionType == "file"){
                            console.log("fileeeee");
                            UserAssessment.findOneAndUpdate({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id, "questionIds.id":input.key.id}, {"$set":{"questionIds.$.status":"completed", "questionIds.$.answer":"file", "isAssessmentStarted":true, "screenRecordId":screenRecordId, "videoRecordId":videoRecordId}},{new: true}).then(function(resultC){
                                if(resultC){
                                    console.log(resultC.questionIds);
                                    if("questionId" in input){
                                        if(input.questionId.length !== 0){
                                            let go = false;
                                            let allUserKeys = [];
                                            if(resultC.userKeys.length > 0){
                                                resultC.userKeys.forEach((keys, index)=>{
                                                        if(keys.id != input.key.id){
                                                            allUserKeys.push(keys);
                                                        }
                                                        if(Object.is(resultC.userKeys.length -1, index)){
                                                            allUserKeys.push(input.key);
                                                            go = true;
                                                        }
                                                    })
                                            }else{
                                                go = true;
                                            }
                                            if(go){
                                                resultC.userKeys = allUserKeys;
                                                if(resultC.save(function(err, resultE){
                                                    console.log("A");
                                                    let selectedAnswer = "";
                                                    let options = false;
                                                    let questionNo = 1;
                                                    if(resultC.userKeys.length > 0){  
                                                        console.log("A1");                                                      
                                                        resultC.userKeys.forEach((element, index)=>{ 
                                                            console.log(element.id, input.questionId);                                                            
                                                            if(element.id == input.questionId){                                                                
                                                                options = true;
                                                                selectedAnswer = element.answer; 
                                                                console.log("ss "+selectedAnswer);                                                               
                                                            }
                                                        })
                                                    }else{options = true;}
                                                    if(resultC.questionIds.length > 0){    
                                                        console.log("A2");                                                    
                                                        resultC.questionIds.forEach((question, index, key)=>{
                                                            if(question.id == input.questionId){
                                                                console.log(question.id, input.questionId); 
                                                                options = true;
                                                                questionNo = index+1;
                                                                if(resultC.questionIds[index+1] != undefined){
                                                                    preNextIds.next = resultC.questionIds[index+1].id;
                                                                }
                                                                if(resultC.questionIds[index-1] != undefined){
                                                                    preNextIds.previous = resultC.questionIds[index-1].id;
                                                                }
                                                            }
                                                        })
                                                    }else{options = true;}
                                                    if(options){
                                                        let data = {"questionId": input.questionId};
                                                        module.exports.getQuestionById(data, function(resultQ){
                                                            if(resultQ){
                                                                resultQ.selectedAnswer = selectedAnswer;
                                                                resultQ.prevnext = preNextIds;
                                                                resultQ.qno = questionNo;
                                                                return res.send({"code":"0", "info":"1", "message":SUCCESS, "data":resultQ});
                                                            }else{
                                                                return res.send({"code":"1", "message":"Question not exist", "data": input});
                                                            }
                                                        })                                                    
                                                    }        
                                                }));
                                            }                                                   
                                        }
                                    }else{
                                    console.log("B");
                                    UserAssessment.findOne({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id}).then(function(resultD){
                                        resultD.userKeys.push(input.key);
                                        var allUserKeys = [];
                                        let go = false;
                                        if(resultD.userKeys.length > 0){
                                            resultD.userKeys.forEach((keys, index)=>{
                                                if(keys.id != input.key.id){
                                                    allUserKeys.push(keys);
                                                }
                                                if(Object.is(resultD.userKeys.length -1, index)){
                                                    allUserKeys.push(input.key);
                                                    go = true;
                                                }
                                            })
                                        }else{
                                            go = true;
                                        }
                                        if(go){
                                        resultD.userKeys = allUserKeys;
                                        if(resultD.save(function(err, resultE){
                                            //console.log("C");
                                            var data = {};
                                            var takenQuestionIds = [];
                                            resultE.questionIds.forEach(ele=>{
                                                takenQuestionIds.push(ele.id);
                                            })
                                            let filteredIds = takenQuestionIds.filter((t={},e=>!(t[e]=e in t)));
                                            //console.log(filteredIds.length, resultE.noOfQuestions);
                                            var a = false;

                                            // if(filteredIds.length == resultE.noOfQuestions){
                                            //     return res.send({"code":"0", "message":ASSESSMENT_COMPLETED});
                                            // }else
                                            
                                            if(filteredIds.length > 0){
                                                //console.log(filteredIds);
                                                a = true;
                                                if(!("questionIdsToSkip" in data)){
                                                    if(resultE.competencies.length > 0){
                                                        resultE.competencies.every(function(row) {                                       
                                                            if("taken" in row){
                                                                console.log(row);
                                                                if(row.count > row.taken){
                                                                    data = {
                                                                        "questionIdsToSkip":filteredIds,
                                                                        "competency":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                                    }
                                                                    // updateTakenCount.push("competencies");
                                                                    // updateTakenCount.push(row.taken+1);
                                                                    // return false;
                                                                    let taken = row.taken+1;
                                                                    UserAssessment.updateOne({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id, "competencies.id":row.id}, {"$set":{"competencies.$.taken":taken}}).then(function(resultC){
                                                                        if(resultC){
                                                                            return false;
                                                                        }
                                                                    })
                                                                }else{
                                                                    return true;
                                                                }
                                                            }else{
                                                                data = {
                                                                    "questionIdsToSkip":filteredIds,
                                                                    "competency":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                                }
                                                                let taken = row.taken+1;
                                                                    UserAssessment.updateOne({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id, "competencies.id":row.id}, {"$set":{"competencies.$.taken":taken}}).then(function(resultC){
                                                                        if(resultC){
                                                                            return false;
                                                                        }
                                                                    })
                                                            }
                                                        })
                                                    }
                                                }
                                                if(!("questionIdsToSkip" in data)){
                                                    if(resultE.subCompetencies.length > 0){
                                                        resultE.subCompetencies.every(function(row) {
                                                            if("taken" in row){
                                                                console.log("loop sub comp : "+resultE.competencies.length, row.taken);
                                                                if(row.count > row.taken){
                                                                    data = {
                                                                        "questionIdsToSkip":filteredIds,
                                                                        "subCompetency":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                                    }
                                                                    let taken = row.taken+1;
                                                                    UserAssessment.updateOne({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id, "subCompetencies.id":row.id}, {"$set":{"subCompetencies.$.taken":taken}}).then(function(resultC){
                                                                        if(resultC){
                                                                            return false;
                                                                        }
                                                                    })  
                                                                }else{
                                                                    return true;
                                                                }
                                                            }else{
                                                                data = {
                                                                    "questionIdsToSkip":filteredIds,
                                                                    "subCompetency":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                                }
                                                                let taken = row.taken+1;
                                                                    UserAssessment.updateOne({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id, "subCompetencies.id":row.id}, {"$set":{"subCompetencies.$.taken":taken}}).then(function(resultC){
                                                                        if(resultC){
                                                                            return false;
                                                                        }
                                                                    })
                                                            }
                                                        })
                                                    }
                                                }
                                                if(!("questionIdsToSkip" in data)){
                                                    if(resultE.skills.length > 0){
                                                        resultE.skills.every(function(row) {
                                                            if("taken" in row){
                                                                if(row.count > row.taken){
                                                                    data = {
                                                                        "questionIdsToSkip":filteredIds,
                                                                        "skill":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                                    }
                                                                    return false;
                                                                }else{
                                                                    return true;
                                                                }
                                                            }else{
                                                                data = {
                                                                    "questionIdsToSkip":filteredIds,
                                                                    "skill":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                                }
                                                                return false;
                                                            }
                                                        })
                                                    }
                                                }
                                            }    
                                            if(a){
                                                let allCompleted = false;
                                                if(!("questionIdsToSkip" in data)){
                                                    UserAssessment.findOne({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id, questionIds: { $elemMatch: { status: "pending"}}}).then(function(pendingResult){
                                                        if(pendingResult){
                                                            pendingResult.questionIds.forEach((ques, index, key)=>{
                                                                if(ques.status == "pending"){
                                                                    let data = {"questionId": ques.id};
                                                                    module.exports.getQuestionById(data, function(resultQ){
                                                                        if(resultQ){
                                                                            resultQ.qno = index+1;
                                                                            // let resultA = resultA.toObject();
                                                                            // resultA.id = resultA._id;
                                                                            // delete resultA._id;
                                                                            if(pendingResult.questionIds[index+1] != undefined){
                                                                                preNextIds.next = pendingResult.questionIds[index+1].id;
                                                                            }
                                                                            if(pendingResult.questionIds[index-1] != undefined){
                                                                                preNextIds.previous = pendingResult.questionIds[index-1].id;
                                                                            }
                                                                            resultQ.prevnext = preNextIds;
                                                                            return res.send({"code":"0", "info":"1", "message":SUCCESS, "data":resultQ});
                                                                        }else{
                                                                            return res.send({"code":"1", "message":"Question not exist", "data": input});
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                            //return res.send(pendingResult.questionIds);
                                                        }else{
                                                            resultE.status = "completed";
                                                            if(resultE.save(function(err, resultG){
                                                                let data = {};
                                                                let filteredQuestionIds = [];
                                                                resultG.questionIds.forEach((element, index)=>{
                                                                    if(element.answer !== "file"){
                                                                        filteredQuestionIds.push(element);
                                                                    }
                                                                    if(Object.is(resultG.questionIds.length -1, index)){
                                                                        data.questionIds = filteredQuestionIds;
                                                                        data.token = input.token;
                                                                        module.exports.getSkillsAvg2(data, function(response){
                                                                            resultE.avgScore = response.avgScore;
                                                                            resultE.axisScore = response.axisScore;
                                                                            response.reportId = resultE._id;
                                                                            response.assessmentId = resultE.assessmentId;
                                                                            if(resultE.save(function(err, resultFinal){
                                                                                module.exports.getPushNotificationId(input.token, function(notification){
                                                                                    if(notification){
                                                                                        module.exports.webPushNotification(notification.pushNotificationId, resultE._id, resultE.assessmentId, input.licenseKey); 
                                                                                        module.exports.consumeLicense(input.licenseKey, input.token);
                                                                                        Assessment.findOne({"licenseKey": input.licenseKey}).then(function(assessment){
                                                                                            if(assessment){
                                                                                                response.reportGeneration = assessment.reportGeneration;
                                                                                                return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                                                                            }else{
                                                                                                return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                                                                            }
                                                                                        }).catch(function(err){
                                                                                            return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                                                                        });
                                                                                    }else{
                                                                                        Assessment.findOne({"licenseKey": input.licenseKey}).then(function(assessment){
                                                                                            if(assessment){
                                                                                                response.reportGeneration = assessment.reportGeneration;
                                                                                                return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                                                                            }else{
                                                                                                return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                                                                            }
                                                                                        }).catch(function(err){
                                                                                            return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }));
                                                                        });
                                                                    }
                                                                })                                                                
                                                            }));
                                                        }
                                                    });
                                                }else{
                                                    //console.log(data);
                                                    module.exports.getRandomQuestion(data, function(questionRes){
                                                        //console.log(questionRes);
                                                        // var resultObj = resultE.toObject();
                                                        // resultObj.id = resultObj._id;
                                                        // delete resultObj._id;
                                                        // resultObj.data = questionRes;
                                                        let questionCount = data.questionIdsToSkip.length;
                                                        questionRes.qno = questionCount+1;
                                                        //console.log(questionRes);
                                                        if(questionRes !== false){
                                                        if("id" in questionRes){
                                                            let axisId = "";
                                                            let axisName = "";
                                                            let skillId = "";
                                                            if("competency" in data){
                                                                axisId = data.competency.id;
                                                                skillId = data.competency.skillId;
                                                                axisName = "competencies";
                                                            }
                                                            else if("subCompetency" in data){
                                                                axisId = data.subCompetency.id;
                                                                skillId = data.subCompetency.skillId;
                                                                axisName = "subCompetencies";
                                                            }
                                                            else if("skill" in data){
                                                                axisId = data.skill.id;
                                                                skillId = data.skill.id;
                                                                axisName = "skills";
                                                            }
                                                            if(axisId != "" && skillId != ""){
                                                                resultE.questionIds.push({"id":questionRes.id, "status":"pending", "axisId":axisId, "skillId":skillId, "axisName":axisName});
                                                                if(resultE.save()){
                                                                    //console.log("D");
                                                                    resultE.questionIds.forEach((ele, index, key)=>{
                                                                        
                                                                        if(questionRes.id == ele.id){
                                                                            //console.log(ele.id, questionRes.id, resultE.questionIds[index-1].id);
                                                                            preNextIds.next = "";
                                                                            preNextIds.previous = resultE.questionIds[index-1].id;
                                                                        }
                                                                        if(Object.is(resultE.questionIds.length -1, index)){
                                                                            //console.log("E");
                                                                            //console.log(preNextIds);
                                                                            questionRes.prevnext = preNextIds;
                                                                            return res.status(200).send({ "code":"0", "info":"1", "message":SUCCESS, "data": questionRes});                         
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        }else{
                                                            return res.status(200).send({ "code":"1", "message":"No more questions, Please contact admin", "data": questionRes});                
                                                        }
                                                        }else{
                                                            return res.status(200).send({ "code":"1", "message":"No more questions, Please contact admin", "data": questionRes});
                                                        }
                                                    });
                                                }
                                            }
                                            
                                        })); 
                                        }
                                    }) }
                                }
                            })                
                        }else{
                            questionRes.options.forEach((element, key)=>{
                                if(element.answer == true){
                                    answerKeys.push(element.id);
                                }
                                if(Object.is(questionRes.options.length - 1, key)){
                                  console.log("arr comp ",answerKeys.toString(), input.key.answer.toString());
    
                                    if(answerKeys.toString() == input.key.answer.toString()){
                                        answer = "pass";
                                    }else{
                                        let x = input.key.answer;
                                        let y = answerKeys;
                                        console.log(x,y)
                                        if( typeof x == "object" && typeof y == "object"){
                                            if(x.length == y.length && x.reduce((a, b) => a && y.includes(b), true)){
                                                answer = "pass";
                                            }else{
                                                answer = "fail";
                                            }
                                        }else{
                                            answer = "fail";
                                        }
                                    }
                                    if(answer !== null){
                                        UserAssessment.findOneAndUpdate({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id, "questionIds.id":input.key.id}, {"$set":{"questionIds.$.status":"completed", "questionIds.$.answer":answer, "isAssessmentStarted":true, "screenRecordId":screenRecordId, "videoRecordId":videoRecordId}},{new: true}).then(function(resultC){
                                            if(resultC){
                                                if("questionId" in input){
                                                    if(input.questionId.length !== 0){
                                                        let go = false;
                                                        let allUserKeys = [];
                                                        if(resultC.userKeys.length > 0){
                                                            resultC.userKeys.forEach((keys, index)=>{
                                                                    if(keys.id != input.key.id){
                                                                        allUserKeys.push(keys);
                                                                    }
                                                                    if(Object.is(resultC.userKeys.length -1, index)){
                                                                        allUserKeys.push(input.key);
                                                                        go = true;
                                                                    }
                                                                })
                                                        }else{
                                                            go = true;
                                                        }
                                                        if(go){
                                                            resultC.userKeys = allUserKeys;
                                                            if(resultC.save(function(err, resultE){
                                                                console.log("A");
                                                                let selectedAnswer = "";
                                                                let options = false;
                                                                let questionNo = 1;
                                                                if(resultC.userKeys.length > 0){  
                                                                    console.log("A1");                                                      
                                                                    resultC.userKeys.forEach((element, index)=>{ 
                                                                        console.log(element.id, input.questionId);                                                            
                                                                        if(element.id == input.questionId){                                                                
                                                                            options = true;
                                                                            selectedAnswer = element.answer; 
                                                                            console.log("ss "+selectedAnswer);                                                               
                                                                        }
                                                                    })
                                                                }else{options = true;}
                                                                if(resultC.questionIds.length > 0){    
                                                                    console.log("A2");                                                    
                                                                    resultC.questionIds.forEach((question, index, key)=>{
                                                                        if(question.id == input.questionId){
                                                                            console.log(question.id, input.questionId); 
                                                                            options = true;
                                                                            questionNo = index+1;
                                                                            if(resultC.questionIds[index+1] != undefined){
                                                                                preNextIds.next = resultC.questionIds[index+1].id;
                                                                            }
                                                                            if(resultC.questionIds[index-1] != undefined){
                                                                                preNextIds.previous = resultC.questionIds[index-1].id;
                                                                            }
                                                                        }
                                                                    })
                                                                }else{options = true;}
                                                                if(options){
                                                                    let data = {"questionId": input.questionId};
                                                                    module.exports.getQuestionById(data, function(resultQ){
                                                                        if(resultQ){
                                                                            resultQ.selectedAnswer = selectedAnswer;
                                                                            resultQ.prevnext = preNextIds;
                                                                            resultQ.qno = questionNo;
                                                                            return res.send({"code":"0", "info":"1", "message":SUCCESS, "data":resultQ});
                                                                        }else{
                                                                            return res.send({"code":"1", "message":"Question not exist", "data": input});
                                                                        }
                                                                    })                                                    
                                                                }        
                                                            }));
                                                        }                                                   
                                                    }
                                                }else{
                                                console.log("B");
                                                UserAssessment.findOne({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id}).then(function(resultD){
                                                    resultD.userKeys.push(input.key);
                                                    var allUserKeys = [];
                                                    let go = false;
                                                    if(resultD.userKeys.length > 0){
                                                        resultD.userKeys.forEach((keys, index)=>{
                                                            if(keys.id != input.key.id){
                                                                allUserKeys.push(keys);
                                                            }
                                                            if(Object.is(resultD.userKeys.length -1, index)){
                                                                allUserKeys.push(input.key);
                                                                go = true;
                                                            }
                                                        })
                                                    }else{
                                                        go = true;
                                                    }
                                                    if(go){
                                                    resultD.userKeys = allUserKeys;
                                                    if(resultD.save(function(err, resultE){
                                                        //console.log("C");
                                                        var data = {};
                                                        var takenQuestionIds = [];
                                                        resultE.questionIds.forEach(ele=>{
                                                            takenQuestionIds.push(ele.id);
                                                        })
                                                        let filteredIds = takenQuestionIds.filter((t={},e=>!(t[e]=e in t)));
                                                        //console.log(filteredIds.length, resultE.noOfQuestions);
                                                        var a = false;
    
                                                        // if(filteredIds.length == resultE.noOfQuestions){
                                                        //     return res.send({"code":"0", "message":ASSESSMENT_COMPLETED});
                                                        // }else
                                                        
                                                        if(filteredIds.length > 0){
                                                            //console.log(filteredIds);
                                                            a = true;
                                                            if(!("questionIdsToSkip" in data)){
                                                                if(resultE.competencies.length > 0){
                                                                    resultE.competencies.every(function(row) {                                       
                                                                        if("taken" in row){
                                                                            console.log(row);
                                                                            if(row.count > row.taken){
                                                                                data = {
                                                                                    "questionIdsToSkip":filteredIds,
                                                                                    "competency":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                                                }
                                                                                // updateTakenCount.push("competencies");
                                                                                // updateTakenCount.push(row.taken+1);
                                                                                // return false;
                                                                                let taken = row.taken+1;
                                                                                UserAssessment.updateOne({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id, "competencies.id":row.id}, {"$set":{"competencies.$.taken":taken}}).then(function(resultC){
                                                                                    if(resultC){
                                                                                        return false;
                                                                                    }
                                                                                })
                                                                            }else{
                                                                                return true;
                                                                            }
                                                                        }else{
                                                                            data = {
                                                                                "questionIdsToSkip":filteredIds,
                                                                                "competency":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                                            }
                                                                            let taken = row.taken+1;
                                                                                UserAssessment.updateOne({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id, "competencies.id":row.id}, {"$set":{"competencies.$.taken":taken}}).then(function(resultC){
                                                                                    if(resultC){
                                                                                        return false;
                                                                                    }
                                                                                })
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                            if(!("questionIdsToSkip" in data)){
                                                                if(resultE.subCompetencies.length > 0){
                                                                    resultE.subCompetencies.every(function(row) {
                                                                        if("taken" in row){
                                                                            console.log("loop sub comp : "+resultE.competencies.length, row.taken);
                                                                            if(row.count > row.taken){
                                                                                data = {
                                                                                    "questionIdsToSkip":filteredIds,
                                                                                    "subCompetency":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                                                }
                                                                                let taken = row.taken+1;
                                                                                UserAssessment.updateOne({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id, "subCompetencies.id":row.id}, {"$set":{"subCompetencies.$.taken":taken}}).then(function(resultC){
                                                                                    if(resultC){
                                                                                        return false;
                                                                                    }
                                                                                })  
                                                                            }else{
                                                                                return true;
                                                                            }
                                                                        }else{
                                                                            data = {
                                                                                "questionIdsToSkip":filteredIds,
                                                                                "subCompetency":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                                            }
                                                                            let taken = row.taken+1;
                                                                                UserAssessment.updateOne({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id, "subCompetencies.id":row.id}, {"$set":{"subCompetencies.$.taken":taken}}).then(function(resultC){
                                                                                    if(resultC){
                                                                                        return false;
                                                                                    }
                                                                                })
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                            if(!("questionIdsToSkip" in data)){
                                                                if(resultE.skills.length > 0){
                                                                    resultE.skills.every(function(row) {
                                                                        if("taken" in row){
                                                                            if(row.count > row.taken){
                                                                                data = {
                                                                                    "questionIdsToSkip":filteredIds,
                                                                                    "skill":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                                                }
                                                                                return false;
                                                                            }else{
                                                                                return true;
                                                                            }
                                                                        }else{
                                                                            data = {
                                                                                "questionIdsToSkip":filteredIds,
                                                                                "skill":{"id":row.id, "level":row.level, "skillId":row.skillId}
                                                                            }
                                                                            return false;
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        }    
                                                        if(a){
                                                            let allCompleted = false;
                                                            if(!("questionIdsToSkip" in data)){
                                                                UserAssessment.findOne({"licenseKey":input.licenseKey, "status":"pending", "profileId":resultA.id, questionIds: { $elemMatch: { status: "pending"}}}).then(function(pendingResult){
                                                                    if(pendingResult){
                                                                        pendingResult.questionIds.forEach((ques, index, key)=>{
                                                                            if(ques.status == "pending"){
                                                                                let data = {"questionId": ques.id};
                                                                                module.exports.getQuestionById(data, function(resultQ){
                                                                                    if(resultQ){
                                                                                        resultQ.qno = index+1;
                                                                                        // let resultA = resultA.toObject();
                                                                                        // resultA.id = resultA._id;
                                                                                        // delete resultA._id;
                                                                                        if(pendingResult.questionIds[index+1] != undefined){
                                                                                            preNextIds.next = pendingResult.questionIds[index+1].id;
                                                                                        }
                                                                                        if(pendingResult.questionIds[index-1] != undefined){
                                                                                            preNextIds.previous = pendingResult.questionIds[index-1].id;
                                                                                        }
                                                                                        resultQ.prevnext = preNextIds;
                                                                                        return res.send({"code":"0", "info":"1", "message":SUCCESS, "data":resultQ});
                                                                                    }else{
                                                                                        return res.send({"code":"1", "message":"Question not exist", "data": input});
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                        //return res.send(pendingResult.questionIds);
                                                                    }else{
                                                                        resultE.status = "completed";
                                                                        if(resultE.save(function(err, resultG){
                                                                            let data = {};
                                                                            let filteredQuestionIds = [];
                                                                            resultG.questionIds.forEach((element, index)=>{
                                                                                if(element.answer !== "file"){
                                                                                    filteredQuestionIds.push(element);
                                                                                }
                                                                                if(Object.is(resultG.questionIds.length -1, index)){
                                                                                    data.questionIds = filteredQuestionIds;
                                                                                    data.token = input.token;
                                                                                    module.exports.getSkillsAvg2(data, function(response){
                                                                                        resultE.avgScore = response.avgScore;
                                                                                        resultE.axisScore = response.axisScore;
                                                                                        response.reportId = resultE._id;
                                                                                        response.assessmentId = resultE.assessmentId;
                                                                                        if(resultE.save(function(err, resultFinal){
                                                                                            module.exports.getPushNotificationId(input.token, function(notification){
                                                                                                if(notification){
                                                                                                    module.exports.webPushNotification(notification.pushNotificationId, resultE._id, resultE.assessmentId, input.licenseKey); 
                                                                                                    module.exports.consumeLicense(input.licenseKey, input.token);
                                                                                                    Assessment.findOne({"licenseKey": input.licenseKey}).then(function(assessment){
                                                                                                        if(assessment){
                                                                                                            response.reportGeneration = assessment.reportGeneration;
                                                                                                            return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                                                                                        }else{
                                                                                                            return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                                                                                        }
                                                                                                    }).catch(function(err){
                                                                                                        return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                                                                                    });
                                                                                                }else{
                                                                                                    Assessment.findOne({"licenseKey": input.licenseKey}).then(function(assessment){
                                                                                                        if(assessment){
                                                                                                            response.reportGeneration = assessment.reportGeneration;
                                                                                                            return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                                                                                        }else{
                                                                                                            return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                                                                                        }
                                                                                                    }).catch(function(err){
                                                                                                        return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }));
                                                                                    });
                                                                                }
                                                                            });
                                                                        }));
                                                                    }
                                                                });
                                                            }else{
                                                                //console.log(data);
                                                                module.exports.getRandomQuestion(data, function(questionRes){
                                                                    //console.log(questionRes);
                                                                    // var resultObj = resultE.toObject();
                                                                    // resultObj.id = resultObj._id;
                                                                    // delete resultObj._id;
                                                                    // resultObj.data = questionRes;
                                                                    let questionCount = data.questionIdsToSkip.length;
                                                                    questionRes.qno = questionCount+1;
                                                                    //console.log(questionRes);
                                                                    if(questionRes !== false){
                                                                    if("id" in questionRes){
                                                                        let axisId = "";
                                                                        let axisName = "";
                                                                        let skillId = "";
                                                                        if("competency" in data){
                                                                            axisId = data.competency.id;
                                                                            skillId = data.competency.skillId;
                                                                            axisName = "competencies";
                                                                        }
                                                                        else if("subCompetency" in data){
                                                                            axisId = data.subCompetency.id;
                                                                            skillId = data.subCompetency.skillId;
                                                                            axisName = "subCompetencies";
                                                                        }
                                                                        else if("skill" in data){
                                                                            axisId = data.skill.id;
                                                                            skillId = data.skill.id;
                                                                            axisName = "skills";
                                                                        }
                                                                        if(axisId != "" && skillId != ""){
                                                                            resultE.questionIds.push({"id":questionRes.id, "status":"pending", "axisId":axisId, "skillId":skillId, "axisName":axisName});
                                                                            if(resultE.save()){
                                                                                //console.log("D");
                                                                                resultE.questionIds.forEach((ele, index, key)=>{
                                                                                    
                                                                                    if(questionRes.id == ele.id){
                                                                                        //console.log(ele.id, questionRes.id, resultE.questionIds[index-1].id);
                                                                                        preNextIds.next = "";
                                                                                        preNextIds.previous = resultE.questionIds[index-1].id;
                                                                                    }
                                                                                    if(Object.is(resultE.questionIds.length -1, index)){
                                                                                        //console.log("E");
                                                                                        //console.log(preNextIds);
                                                                                        questionRes.prevnext = preNextIds;
                                                                                        return res.status(200).send({ "code":"0", "info":"1", "message":SUCCESS, "data": questionRes});                         
                                                                                    }
                                                                                });
                                                                            }
                                                                        }
                                                                    }else{
                                                                        return res.status(200).send({ "code":"1", "message":"No more questions, Please contact admin", "data": questionRes});                
                                                                    }
                                                                    }else{
                                                                        return res.status(200).send({ "code":"1", "message":"No more questions, Please contact admin", "data": questionRes});
                                                                    }
                                                                });
                                                            }
                                                        }
                                                        
                                                    })); 
                                                    }
                                                }) }
                                            }
                                        })                
                                    }
                                }
                            })    
                        }
                    })

                    // resultB.userKeys.push(input.key);
                    // resultB.questionIds.push({"id":input.key.id, "status":"submitted"});
                    // if(resultB.save()){

                    //     return res.send({"code":"0", "message":SUCCESS});
                    // }
                }else{
                    UserAssessment.findOne({"licenseKey":input.licenseKey, "status":"completed", "profileId":resultA.id},{}, {sort:{'createdAt':-1}}).then(function(resultB){
                        // console.log(resultB);
                        // if(resultB){
                        //     let data = resultB.questionIds;
                        //     module.exports.getMyScore(data, function(response){
                        //         return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                        //     });
                        // }
                        let response = {};
                        if(resultB){
                            response.reportId = resultB._id;
                            response.avgScore = resultB.avgScore;
                            response.axisScore = resultB.axisScore;
                            response.assessmentId = resultB.assessmentId;
                            module.exports.getPushNotificationId(input.token, function(notification){
                                if(notification){
                                    module.exports.webPushNotification(notification.pushNotificationId, resultB._id, resultB.assessmentId, input.licenseKey);                                     
                                    Assessment.findOne({"licenseKey": input.licenseKey}).then(function(assessment){
                                        if(assessment){
                                            response.reportGeneration = assessment.reportGeneration;
                                            return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                        }else{
                                            return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                        }
                                    }).catch(function(err){
                                        return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                    });                                                                                     
                                }else{
                                    Assessment.findOne({"licenseKey": input.licenseKey}).then(function(assessment){
                                        if(assessment){
                                            response.reportGeneration = assessment.reportGeneration;
                                            return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                        }else{
                                            return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                        }
                                    }).catch(function(err){
                                        return res.send({ "code":"0", "info":"0", "message":ASSESSMENT_COMPLETED, "data":response});
                                    });                                
                                }
                            });
                        }else{
                            return res.send({ "code":"1", "info":"0", "message":"Assessment not exist","data":input});
                        }
                    })
                }
            })
        }else{
            return res.send({ "code":"1", "message":"Invalid token", "data": input});                
        }
    })
    // UserAssessment.findOne({""}).then(function(resultA){

    // })
},
getMyAssessments: function(req, res){
    var input = req.body;
    if(!("token" in input) || input.token.length == 0){
        return res.send({"code":"1", "message":TOKEN_REQUIRED});
    }
    module.exports.validateToken(input.token, function(profile){
        if(profile){
            if(profile.privilegeRoles.indexOf("Assessee")>-1){
                if(profile.authType == "Guest"){
                    module.exports.getLatestUserAssessments(profile.id, function(result){
                        return res.send(result);
                    });
                }else{
                    if(profile.clientId.length > 0){
                        Request.post({
                            "headers":{ 'Content-Type': 'application/json'},
                            "url": "http://"+base_url+":3000/api/get-guest-profile-ids",
                            "body": JSON.stringify({"token":input.token, "clientId":profile.clientId})
                        }, (error, response, body)=>{                            
                            if(error){
                                return res.send({"code":"1", "message":"Something went wrong"});
                            }else{
                                let result = JSON.parse(body);
                                if(result.data.length >0){
                                    UserAssessment.updateMany({"profileId":{$in:result.data}}, {"$set":{"profileId":profile.id}}).then(function(resultC){
                                        if(resultC){
                                            Request.post({
                                                "headers":{ 'Content-Type': 'application/json'},
                                                "url": "http://"+base_url+":3000/api/delete-guest-profiles",
                                                "body": JSON.stringify({"token":input.token, "profileIds":result.data})
                                            }, (error, response, body2)=>{
                                                if(error){
                                                    return res.send({"code":"1", "message":"Something went wrong"});
                                                }else{
                                                    module.exports.getLatestUserAssessments(profile.id, function(result){
                                                        return res.send(result);
                                                    });
                                                }
                                            })
                                        }
                                    })                                           
                                }else{
                                    module.exports.getLatestUserAssessments(profile.id, function(result){
                                        return res.send(result);
                                    });            
                                }
                            }
                        })
                    }else{
                        module.exports.getLatestUserAssessments(profile.id, function(result){
                            return res.send(result);
                        });
                    }
                }
            }else{
                return res.send({"code":"1", "message":"You are not an Assessee", "data": input});
            }
        }else{
            return res.status(200).send({ "code": "1", "message": "Invalid Token", "data": input});
        }
    })
},
getUserAssessments: function(req, res){
    var input = req.body;
    if(!("token" in input) || input.token.length == 0){
        return res.send({"code":"1", "message":TOKEN_REQUIRED});
    }
    module.exports.validateToken(input.token, function(profile){
        if(profile){
            if(profile.privilegeRoles.indexOf("Assessee")>-1){
                if(profile.authType == "Guest"){
                    module.exports.getLatestUserAssessments(profile.id, function(result){
                        return res.send(result);
                    });
                }else{
                    if(profile.clientId.length > 0){
                        Request.post({
                            "headers":{ 'Content-Type': 'application/json'},
                            "url": "http://"+base_url+":3000/api/get-guest-profile-ids",
                            "body": JSON.stringify({"token":input.token, "clientId":profile.clientId})
                        }, (error, response, body)=>{                            
                            if(error){
                                return res.send({"code":"1", "message":"Something went wrong"});
                            }else{
                                let result = JSON.parse(body);
                                if(result.data.length >0){
                                    UserAssessment.updateMany({"profileId":{$in:result.data}}, {"$set":{"profileId":profile.id}}).then(function(resultC){
                                        if(resultC){
                                            Request.post({
                                                "headers":{ 'Content-Type': 'application/json'},
                                                "url": "http://"+base_url+":3000/api/delete-guest-profiles",
                                                "body": JSON.stringify({"token":input.token, "profileIds":result.data})
                                            }, (error, response, body2)=>{
                                                if(error){
                                                    return res.send({"code":"1", "message":"Something went wrong"});
                                                }else{
                                                    module.exports.getUserCompletedAssessments(profile.id, function(completedResult){
                                                        module.exports.getUserPendingAssessments(profile.id, function(pendingResult){
                                                            let allResult = completedResult.concat(pendingResult);
                                                            return res.send({"code":"0", "message":SUCCESS, "data": allResult});
                                                        });
                                                    });
                                                }
                                            })
                                        }
                                    })                                           
                                }else{
                                    module.exports.getUserCompletedAssessments(profile.id, function(completedResult){
                                        module.exports.getUserPendingAssessments(profile.id, function(pendingResult){
                                            let allResult = completedResult.concat(pendingResult);
                                            return res.send({"code":"0", "message":SUCCESS, "data": allResult});
                                        });
                                    });            
                                }
                            }
                        })
                    }else{
                        module.exports.getUserCompletedAssessments(profile.id, function(completedResult){
                            module.exports.getUserPendingAssessments(profile.id, function(pendingResult){
                                let allResult = completedResult.concat(pendingResult);
                                return res.send({"code":"0", "message":SUCCESS, "data": allResult});
                            });
                        });
                    }
                }
            }else{
                return res.send({"code":"1", "message":"You are not an Assessee", "data": input});
            }
        }else{
            return res.status(200).send({ "code": "1", "message": "Invalid Token", "data": input});
        }
    })
},
getLatestUserAssessments: function(profileId, callback){
    UserAssessment.find({"profileId":profileId}).distinct('licenseKey', function (err, licensekeys) {
        latestUserAssessments = Promise.all(licensekeys.map(key => {
            return UserAssessment.findOne({"licenseKey":key,"profileId":profileId},{},{sort:{'createdAt':-1}}).then(result=> {
                return result;
            })
        }));
        latestUserAssessments.then(function(resultA) {
            if(resultA.length > 0) {
                var updatedAssessments = Promise.all(resultA.map(row => {
                    return Assessment.findOne({"licenseKey":row.licenseKey}).then(result => {
                        if(result) {
                            var rowRes = row.toObject();
                            rowRes.id = row._id;
                            delete rowRes._id;
                            var newObj = result.toObject();
                            rowRes.title = newObj.title;
                            rowRes.icon = newObj.icon;
                            rowRes.companyLogo = newObj.companyLogo;
                            rowRes.expiryDate = newObj.expiryDate.toISOString().slice(0,10);
                            rowRes.duration = newObj.duration;
                            rowRes.noOfQuestions = newObj.noOfQuestions;
                            rowRes.summary = newObj.summary;
                            rowRes.description = newObj.description;
                            rowRes.displayReportToUser = newObj.displayReportToUser;
                            rowRes.freeTest = newObj.freeTest;
                            rowRes.reportGeneration = newObj.reportGeneration;
                            rowRes.attemptsInterval = newObj.attemptsInterval;
                            rowRes.noOfAttempts = newObj.noOfAttempts;
                            return rowRes;
                        }
                    });
                }));
                updatedAssessments.then(function(result){
                    callback({"code":"0", "message":SUCCESS, "data":result});
                })
            }else{
                callback({"code":"0", "message":SUCCESS, "data":[]});
            }
        });
    });    
},
getUserCompletedAssessments: function(profileId, callback){
    UserAssessment.find({"profileId":profileId}).distinct('licenseKey', function (err, licensekeys) {
        latestUserAssessments = Promise.all(licensekeys.map(key => {
            return UserAssessment.findOne({"licenseKey":key,"profileId":profileId, "status": "pending"},{},{sort:{'createdAt':-1}}).then(result=> {
                return result;
            })
        }));
        latestUserAssessments = Promise.all(licensekeys.map(key => {
            return UserAssessment.find({"licenseKey":key,"profileId":profileId, "status": "completed"},{},{sort:{'createdAt':-1}}).then(result=> {
               
                var completedAssessments = [];
                for (let index = 0; index < result.length; index++) {
                    let mainAssessment = result[0].toObject();
                    if(index === 0){
                        let compObj = {};
                        compObj.id = mainAssessment._id;
                        compObj.avgScore = mainAssessment.avgScore;
                        compObj.startDate = mainAssessment.createdAt.toISOString().slice(0,10);
                        completedAssessments.push(compObj);
                    }else{
                        let repeatAssessment = result[index].toObject();
                        let compObj = {};
                        compObj.id = repeatAssessment._id;
                        compObj.avgScore = repeatAssessment.avgScore;
                        compObj.startDate = repeatAssessment.createdAt.toISOString().slice(0,10);
                        completedAssessments.push(compObj);                        
                    }
                    if(result.length === index+1){
                        delete mainAssessment.questionIds;
                        delete mainAssessment.skills;
                        delete mainAssessment.competencies;
                        delete mainAssessment.subCompetencies;
                        delete mainAssessment.userKeys;
                        delete mainAssessment.axisScore;
                        mainAssessment.completedAssessments = completedAssessments;
                        return mainAssessment;    
                    }
                }
            })
        }));
        latestUserAssessments.then(function(resultA) {
            console.log(resultA);
            filterResult = resultA.filter(Boolean);
            if(filterResult.length > 0) {
                var updatedAssessments = Promise.all(filterResult.map(row => {
                    return Assessment.findOne({"licenseKey":row.licenseKey}).then(result => {
                        if(result) {
                            var rowRes = row;
                            rowRes.id = row._id;
                            delete rowRes._id;
                            var newObj = result.toObject();
                            rowRes.title = newObj.title;
                            rowRes.icon = newObj.icon;
                            rowRes.expiryDate = newObj.expiryDate.toISOString().slice(0,10);
                            rowRes.duration = newObj.duration;
                            rowRes.noOfQuestions = newObj.noOfQuestions;
                            rowRes.summary = newObj.summary;
                            rowRes.description = newObj.description;
                            rowRes.displayReportToUser = newObj.displayReportToUser;
                            rowRes.freeTest = newObj.freeTest;
                            rowRes.reportGeneration = newObj.reportGeneration;
                            rowRes.attemptsInterval = newObj.attemptsInterval;
                            rowRes.noOfAttempts = newObj.noOfAttempts;
                            return rowRes;
                        }
                    });
                }));
                updatedAssessments.then(function(result){
                    callback(result);
                })
            }else{
                callback([]);
            }
        });
    });    
},
getUserPendingAssessments: function(profileId, callback){
    UserAssessment.find({"profileId":profileId}).distinct('licenseKey', function (err, licensekeys) {
        latestUserAssessments = Promise.all(licensekeys.map(key => {
            return UserAssessment.findOne({"licenseKey":key,"profileId":profileId, "status": "pending"},{},{sort:{'createdAt':-1}}).then(result=> {
                return result;
            })
        }));
        latestUserAssessments.then(function(resultA) {
            console.log(resultA);
            filterResult = resultA.filter(Boolean);
            if(filterResult.length > 0) {
                var updatedAssessments = Promise.all(filterResult.map(row => {
                    return Assessment.findOne({"licenseKey":row.licenseKey}).then(result => {
                        if(result) {
                            var rowRes = row.toObject();
                            rowRes.id = row._id;
                            delete rowRes._id;
                            var newObj = result.toObject();
                            rowRes.title = newObj.title;
                            rowRes.icon = newObj.icon;
                            rowRes.expiryDate = newObj.expiryDate.toISOString().slice(0,10);
                            rowRes.duration = newObj.duration;
                            rowRes.noOfQuestions = newObj.noOfQuestions;
                            rowRes.summary = newObj.summary;
                            rowRes.description = newObj.description;
                            rowRes.displayReportToUser = newObj.displayReportToUser;
                            rowRes.freeTest = newObj.freeTest;
                            rowRes.reportGeneration = newObj.reportGeneration;
                            rowRes.attemptsInterval = newObj.attemptsInterval;
                            rowRes.noOfAttempts = newObj.noOfAttempts;
                            return rowRes;
                        }
                    });
                }));
                updatedAssessments.then(function(result){
                    callback(result);
                })
            }else{
                callback([]);
            }
        });
    });    
},
getUserAssessmentDetails: function(req, res){
    var input = req.body;
    if(!("token" in input) || input.token.length == 0){
        return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
    }
    if(!("licenseKey" in input) || input.licenseKey.length == 0){
        return res.send({"code":"1", "message":"License Key required", "data": input});
    }
    module.exports.validateToken(input.token, function(profile){
        if(profile){
            UserAssessment.find({"licenseKey":input.licenseKey,"profileId":profile.id}, {}, {sort:{"createdAt":-1}}).then(result=> {
               
                var completedAssessments = [];
                if(result.length > 0){
                    for (let index = 0; index < result.length; index++) {
                        let mainAssessment = result[0].toObject();
                        if(index === 0){
                            if(mainAssessment.status == "completed"){
                                let compObj = {};
                                compObj.id = mainAssessment._id;
                                compObj.avgScore = mainAssessment.avgScore;
                                compObj.startDate = mainAssessment.createdAt.toISOString().slice(0,10);
                                completedAssessments.push(compObj);
                            }
                        }else{
                            let repeatAssessment = result[index].toObject();
                            let compObj = {};
                            compObj.id = repeatAssessment._id;
                            compObj.avgScore = repeatAssessment.avgScore;
                            compObj.startDate = repeatAssessment.createdAt.toISOString().slice(0,10);
                            completedAssessments.push(compObj);                        
                        }
                        if(result.length === index+1){
                            delete mainAssessment.questionIds;
                            delete mainAssessment.skills;
                            delete mainAssessment.competencies;
                            delete mainAssessment.subCompetencies;
                            delete mainAssessment.userKeys;
                            delete mainAssessment.axisScore;
                            mainAssessment.completedAssessments = completedAssessments;
                            Assessment.findOne({"licenseKey":mainAssessment.licenseKey}).then(result2 => {
                                if(result) {
                                    mainAssessment.id = mainAssessment._id;
                                    delete mainAssessment._id;
                                    var newObj = result2.toObject();
                                    mainAssessment.title = newObj.title;
                                    mainAssessment.icon = newObj.icon;
                                    mainAssessment.companyLogo = newObj.companyLogo;
                                    mainAssessment.expiryDate = newObj.expiryDate.toISOString().slice(0,10);
                                    mainAssessment.duration = newObj.duration;
                                    mainAssessment.noOfQuestions = newObj.noOfQuestions;
                                    mainAssessment.summary = newObj.summary;
                                    mainAssessment.description = newObj.description;
                                    mainAssessment.displayReportToUser = newObj.displayReportToUser;
                                    mainAssessment.screenRecord = newObj.screenRecord;
                                    mainAssessment.videoRecord = newObj.videoRecord;
                                    mainAssessment.assessmentType = newObj.assessmentType;
                                    mainAssessment.freeTest = newObj.freeTest;
                                    mainAssessment.reportGeneration = newObj.reportGeneration;
                                    mainAssessment.attemptsInterval = newObj.attemptsInterval;
                                    mainAssessment.noOfAttempts = newObj.noOfAttempts;
                                    return res.send({"code":"0", "message":SUCCESS, "data":mainAssessment});    
                                }else{
                                    return res.send({"code":"1", "message":FAIL, "data":input});    
                                }
                            }).catch(function(err){
                                return res.send({"code":"1", "message":err.message, "data":input});
                            });
                        }
                    }
                }else{
                    return res.send({"code":"0", "message":SUCCESS, "data":[]});    
                }
            }).catch(function(err){
                return res.send({"code":"1", "message":err.message, "data":input});
            });
        }
    });
},
getUserSummary: function(req, res){
    var input = req.body;
    if(!("token" in input) || input.token.length == 0){
        return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
    }
    if(!("reportId" in input) || input.reportId.length == 0){
        return res.send({"code":"1", "message":"report Id required", "data": input});
    }
    module.exports.validateToken(input.token, function(profile){
        if(profile){
            UserAssessment.findById(input.reportId).then(function(result){
                if(result){
                    Assessment.findOne({"licenseKey":result.licenseKey}).then(result2 => {
                        if(result) {
                            var assessment = result2.toObject();
                            let resultObj = result.toObject();
                            resultObj.id = resultObj._id;
                            resultObj.reportGeneration = assessment.reportGeneration;
                            resultObj.title = assessment.title;
                            resultObj.description = assessment.description;
                            resultObj.assessmentType = assessment.assessmentType;
                            resultObj.displayReportToUser = assessment.displayReportToUser;
                            delete resultObj._id;
                            return res.send({"code":"0", "message":SUCCESS, "data":resultObj});
                        }
                    })
                }else{
                    return res.send({"code":"1", "message":"Invalid Report Id", "data":input});
                }
            }).catch(function(err){
                return res.send({"code":"1", "message":err.message, "data":input});
            });
        }else{
            return res.status(200).send({ "code": "1", "message": "Invalid Token", "data": input});
        }
    })
},
getWebAssessment: function(req, res){
    var input = req.body;
    if(!("token" in input) || input.token.length == 0){
        return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
    }
    if(!("licenseKey" in input) || input.licenseKey.length == 0){
        return res.send({"code":"1", "message":"key required", "data": input});
    }
    // if(!("questionId" in input) || input.questionId.length == 0){
    //     return res.send({"code":"1", "message":"question Id required", "data": input});
    // }
    let keyPatt = /^\d{6}$/;
    if(input.licenseKey.length == 0 || keyPatt.test(input.licenseKey) == false){
        return res.send({"code":"1", "message":"License Key not valid"});
    }

    var preNextIds = {next: "", previous: ""};
    console.log("A");
    module.exports.validateToken(input.token, function(resultA){
        if(resultA){
            let profileId = resultA.id;
            console.log("A");
            Assessment.findOne({"licenseKey":input.licenseKey}).then(function(result){
                if(result){
                    var todayISO = new Date();
                    var todayMs = todayISO.getTime();
                    var expiryDateMs = result.expiryDate.getTime();
                    if(todayMs > expiryDateMs){
                        return res.send({"code":"1", "message":"Assessment Expired, Please contact your Manager"});
                    }else{
                        UserAssessment.findOne({"licenseKey":input.licenseKey, "profileId":profileId, "status":"pending"},{},{sort:{'createdAt':-1}}).then(function(myAssess){
                            if(myAssess){
                                console.log("B");
                                if(!("questionId" in input) || input.questionId.length == 0){
                                    console.log("qustion Id not exist");
                                    myAssess.questionIds.forEach((ele, index)=>{
                                        //console.log(ele);
                                        let count = 0;
                                        let noPending = {};
                                        let questionNo = 1;
                                        if(ele.status == "pending"){
                                            count++;
                                            let data = {"questionId": ele.id};
                                            console.log(data);
                                            questionNo = index+1;
                                            module.exports.getQuestionById(data, function(resultB){
                                                if(resultB){
                                                    resultB.qno = questionNo;
                                                    // let resultA = resultA.toObject();
                                                    // resultA.id = resultA._id;
                                                    // delete resultA._id;
                                                    if(myAssess.questionIds[index+1] != undefined){
                                                        preNextIds.next = myAssess.questionIds[index+1].id;
                                                    }
                                                    if(myAssess.questionIds[index-1] != undefined){
                                                        preNextIds.previous = myAssess.questionIds[index-1].id;
                                                    }
                                                    resultB.prevnext = preNextIds;
                                                    resultB.noOfQuestions = myAssess.noOfQuestions;
                                                    return res.send({"code":"0", "message":SUCCESS, "data":resultB});
                                                }else{
                                                    return res.send({"code":"1", "message":"Question not exist", "data": input});
                                                }
                                            })
                                        }else{
                                            noPending = {"questionId": ele.id};
                                            questionNo = index+1;  
                                        }
                                        if(Object.is(myAssess.questionIds.length -1, index)){
                                            if(count == 0)                                        
                                            module.exports.getQuestionById(noPending, function(resultB){
                                                if(resultB){
                                                    resultB.qno = questionNo;
                                                    // let resultA = resultA.toObject();
                                                    // resultA.id = resultA._id;
                                                    // delete resultA._id;
                                                    if(myAssess.questionIds[index+1] != undefined){
                                                        preNextIds.next = myAssess.questionIds[index+1].id;
                                                    }
                                                    if(myAssess.questionIds[index-1] != undefined){
                                                        preNextIds.previous = myAssess.questionIds[index-1].id;
                                                    }
                                                    resultB.prevnext = preNextIds;
                                                    resultB.noOfQuestions = myAssess.noOfQuestions;
                                                    return res.send({"code":"0", "message":SUCCESS, "data":resultB});
                                                }else{
                                                    return res.send({"code":"1", "message":"Question not exist", "data": input});
                                                }
                                            })
                                            //return res.send({"code":"1", "message":ASSESSMENT_COMPLETED, "data": input});                                        
                                        }
                                    })                                
                                }else{
                                    console.log("qustion Id exist");
                                    let qid = false; 
                                    var questionNo = 1;
                                    if(myAssess.questionIds.length > 0){
                                        myAssess.questionIds.forEach((ele, index)=>{
                                            console.log(ele.id, input.questionId);
                                            if(ele.id == input.questionId){
                                                qid = true;
                                                console.log("qid "+qid);
                                                questionNo = index +1;
                                                if(myAssess.questionIds[index+1] != undefined){
                                                    preNextIds.next = myAssess.questionIds[index+1].id;
                                                }
                                                if(myAssess.questionIds[index-1] != undefined){
                                                    preNextIds.previous = myAssess.questionIds[index-1].id;
                                                }                                     
                                            }                                     
                                        })
                                    }else{
                                        qid = true;
                                    }
                                    console.log(qid);
                                    if(qid){
                                        let data = {"questionId": input.questionId};
                                        let selectedAnswer = "";
                                        console.log("qid - true");
                                        module.exports.getQuestionById(data, function(resultA){
                                            if(resultA){
                                                resultA.qno = questionNo;
                                                // let resultA = resultA.toObject();
                                                // resultA.id = resultA._id;
                                                // delete resultA._id;
                                                console.log("qid - true : " + myAssess.userKeys.length);
                                                resultA.prevnext = preNextIds;
                                                if(myAssess.userKeys.length > 0){
                                                    console.log(myAssess.userKeys);
                                                    myAssess.userKeys.forEach((element, index)=>{
                                                        if(element.id == input.questionId){
                                                            console.log(element.id, input.questionId);
                                                            selectedAnswer = element.answer;
                                                            resultA.selectedAnswer = selectedAnswer;
                                                            return res.send({"code":"0", "message":SUCCESS, "data":resultA});
                                                        }
                                                        if(Object.is(myAssess.userKeys.length -1, index)){
                                                            return res.send({"code":"0", "message":SUCCESS, "data":resultA});
                                                        }
                                                    })
                                                }else{
                                                    return res.send({"code":"0", "message":SUCCESS, "data":resultA});
                                                }
                                            }else{
                                                return res.send({"code":"1", "message":"Question not exist", "data": input});
                                            }
                                        })
                                    }else{
                                        return res.send({"code":"1", "message":"Question not exist", "data": input});
                                    }
                                }
                            }else{
                                return res.send({"code":"1", "message":"Assessment not active", "data":input});
                            }
                        });                        
                    }                           
                }else{
                    return res.status(200).send({ "code":"1", "message":"Invalid license key", "data":input});
                }
            }).catch(function(err){
                return res.status(200).send({ "code":"1", "message":err.message, "data":input});
            });
        }else{
            return res.send({"code":"1", "message":"Invalid Token", "data": input});
        }
    });
},

getRandomQuestion: function(data, callback){
    //console.log(data);
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://"+base_url+":3002/api/get-random-questions",
            "body": JSON.stringify(data)
        }, (error, response, body) => {
            if(error) {
                console.log(error);
                //return res.status(200).send({ "code":"1", "message":"Server error"});
            }
            var data = JSON.parse(body);
            //console.log(data);
            if(data.code == '0'){
                question = data.data;
                delete question.createdBy;
                delete question.updatedBy;
                //delete question.ownerId;
                //console.log(question);
                callback(question);
            }else{
                callback(false);
            }
        });
    
},
getQuestionById: function(data, callback){
    //console.log(data);
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://"+base_url+":3002/api/get-question-by-id",
        "body": JSON.stringify(data)
    }, (error, response, body) => {
        if(error) {
            console.log(error);
            //return res.status(200).send({ "code":"1", "message":"Server error"});
        }
        var data = JSON.parse(body);
        //console.log(data);
        if(data.code == '0'){
            question = data.data;
            delete question.createdBy;
            delete question.updatedBy;
            //delete question.ownerId;
            //console.log(question);
            callback(question);
        }else{
            callback(false);
        }
    });    
},
getSkillsAvg2: function(dataObj, callback){
    console.log(dataObj);
    var avgScore = 0;
    var axisScoreArr = [];
    var skillAxisScoreArr = [];
    let axisScore = {"skills":[], "competencies":[], "subCompetencies":[]};
    var pass = 0;
    var axis = [];
    var skillAxis = [];
    var axisNames = [];
    var skillIds = [];
    var compIds = [];
    var axisFail = [];
    var skillAxisFail = [];
    var data = dataObj.questionIds; 
    let token = dataObj.token;
    totalAxis = data.reduce((p,c) => (p[c.axisId] ? p[c.axisId]++ : p[c.axisId] = 1,p),{});
    totalSkillAxis = data.reduce((p,c) => (p[c.skillId] ? p[c.skillId]++ : p[c.skillId] = 1,p),{});
    
    data.forEach((ele , key)=>{          
        if(ele.answer == "pass"){
            pass = pass + 1;
            //console.log(pass);
            axis.push({"id": ele.axisId});
            skillAxis.push({"id": ele.skillId});
        }else if(ele.answer == "fail"){
            axisFail.push({"id": ele.axisId});
            skillAxisFail.push({"id": ele.skillId});
        }
        if(Object.is(data.length -1, key)){
            if(pass == 0){
                avgScore = 0;
                axisFailFilter = axisFail.reduce((p,c) => (p[c.id] ? p[c.id]++ : p[c.id] = 1,p),{});
                skillAxisFailFilter = skillAxisFail.reduce((p,c) => (p[c.id] ? p[c.id]++ : p[c.id] = 1,p),{});
                if(axisFailFilter){
                    for(let key1 in totalSkillAxis){
                        var i = 0;                            
                        for(var key2 in skillAxisFailFilter){
                            if(key1 == key2){
                                console.log("k1 "+key1);
                                i = i+1;
                                skillIds.push(key1);
                                skillAxisScoreArr.push({"id":key1, "score":0});
                            }                                
                        }
                        if(i == 0){
                            console.log("k2 "+key1);
                            skillIds.push(key1);
                            skillAxisScoreArr.push({"id":key1, "score":0});
                        }           
                    }
                    for(let key1 in totalAxis){
                        var i = 0;
                        for(var key2 in axisFailFilter){
                            if(key1 == key2){
                                i = i+1;
                                axisScoreArr.push({"id":key1, "score":0});
                            }                                
                        }
                        if(i == 0){
                            axisScoreArr.push({"id":key1, "score":0});
                        }                           
                    }
                    if(axisScoreArr.length > 0){
                        axisScoreArr.forEach((row, key)=>{
                            console.log("k2");
                            data.forEach((axis)=>{
                                //console.log(axis.axisId, row.id);
                                if(axis.axisId == row.id){
                                    if(axis.axisName == "competencies"){                                           
                                        compIds.push(row.id);
                                        axisScore.competencies.push(row);
                                        return;
                                    }else if(axis.axisName == "subCompetencies"){
                                        axisScore.subCompetencies.push(row);
                                        return;
                                    }
                                }
                            })
                            //console.log("kids "+skillIds);
                            if(Object.is(axisScoreArr.length -1, key)) {
                                console.log("k2");
                                //var skillsScore = Object.values(axisScore.skills.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{}));
                                var competenciesScore = Object.values(axisScore.competencies.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{}));
                                var subCompetenciesScore = Object.values(axisScore.subCompetencies.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{}));
                                let data = {"token":token,"active":true,"ids":skillIds};
                                //console.log(data);
                                Request.post({
                                    "headers": { "content-type": "application/json" },
                                    "url": "http://"+base_url+":3001/api/get-skills",
                                    "body": JSON.stringify(data)
                                }, (error, response, body) => {
                                    if(error) {
                                        console.log("k3");

                                        console.log(error);
                                    }
                                    var jsonResult = JSON.parse(body);
                                    
                                    if(jsonResult.code == '0'){
                                        console.log("k4");

                                        //console.log(jsonResult);
                                        let skillAxisScoreArrNew = [];
                                        jsonResult.data.forEach((element, index)=>{
                                            
                                            skillAxisScoreArr.forEach((row)=>{
                                                //console.log(row.id, element.id, index);
                                                if(row.id == element.id){
                                                    row.label = element.label;
                                                    row.description = element.description;
                                                    skillAxisScoreArrNew.push(row);
                                                }
                                            })
                                            if(Object.is(jsonResult.data.length -1, index)){

                                                if(compIds.length > 0){
                                                    compe = [];
                                                    console.log("COMP");
                                                    let request = {"token":token,"active":true,"ids":compIds};
                                                    Request.post({
                                                        "headers": { "content-type": "application/json" },
                                                        "url": "http://"+base_url+":3001/api/get-competencies",
                                                        "body": JSON.stringify(request)
                                                    }, (error, response, body) => {                                                    
                                                        var jsonResult = JSON.parse(body);
                                                        jsonResult.data.forEach((com, index)=>{
                                                            axisScore.competencies.forEach((ele)=>{
                                                                if(ele.id == com.id){
                                                                    ele.label = com.label;
                                                                    ele.description = com.description;
                                                                    compe.push(ele);
                                                                }
                                                            })                                                                
                                                            if(Object.is(jsonResult.data.length -1, index)){
                                                                var competenciesScore2 = Object.values(compe.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{}));
                                                                let finalScore = {"skills": skillAxisScoreArrNew, "competencies":competenciesScore2, "subCompetencies":subCompetenciesScore};
                                                                let score = {"avgScore":avgScore, "axisScore": finalScore};                                            
                                                                callback(score);
                                                            }
                                                        });
                                                    })
                                                }else{
                                                    let finalScore = {"skills": skillAxisScoreArrNew, "competencies":competenciesScore, "subCompetencies":subCompetenciesScore};
                                                    let score = {"avgScore":avgScore, "axisScore": finalScore};                                            
                                                    callback(score);
                                            }
                                            }
                                        })
                                    }
                                })
                            }                          
                        })
                    }

                }

            }else{

            // console.log("pass" + pass);
            avgScore = Math.round(((( pass / data.length ) * 10)) * 10) / 10;
            if(axis.length > 0){
                axisPass = axis.reduce((p,c) => (p[c.id] ? p[c.id]++ : p[c.id] = 1,p),{});
                skillAxisPass = skillAxis.reduce((p,c) => (p[c.id] ? p[c.id]++ : p[c.id] = 1,p),{});
                // totalAxis.every((row, key)=>{
                //     console.log(row, key);
                // })
                if(axisPass){
                    // console.log("skillAxisPass");
                    // console.log(skillAxisPass);
                    // console.log("totalSkillAxis");
                    // console.log(totalSkillAxis);

                    for(let key1 in totalSkillAxis){
                        var i = 0;                            
                        for(var key2 in skillAxisPass){
                            if(key1 == key2){
                                console.log("k1 "+key1);
                                i = i+1;
                                skillIds.push(key1);
                                let score = (skillAxisPass[key1]/totalSkillAxis[key1])*10;
                                skillAxisScoreArr.push({"id":key1, "score":Math.round(score * 10) / 10 });
                            }                                
                        }
                        if(i == 0){
                            console.log("k2 "+key1);
                            skillIds.push(key1);
                            skillAxisScoreArr.push({"id":key1, "score":0});
                        }           
                    }
                    for(let key1 in totalAxis){
                        var i = 0;
                        for(var key2 in axisPass){
                            if(key1 == key2){
                                i = i+1;
                                let score = (axisPass[key1]/totalAxis[key1])*10;
                                axisScoreArr.push({"id":key1, "score":Math.round(score * 10) / 10});
                            }                                
                        }
                        if(i == 0){
                            axisScoreArr.push({"id":key1, "score":0});
                        }                           
                    }
                    if(axisScoreArr.length > 0){
                        axisScoreArr.forEach((row, key)=>{
                            data.forEach((axis)=>{
                                //console.log(axis.axisId, row.id);
                                if(axis.axisId == row.id){
                                    if(axis.axisName == "competencies"){                                           
                                        
                                        compIds.push(row.id);
                                        axisScore.competencies.push(row);
                                        return;
                                    }else if(axis.axisName == "subCompetencies"){
                                        axisScore.subCompetencies.push(row);
                                        return;
                                    }
                                }
                            })
                            //console.log("kids "+skillIds);
                            if(Object.is(axisScoreArr.length -1, key)) {
                                  
                                //var skillsScore = Object.values(axisScore.skills.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{}));
                                var competenciesScore = Object.values(axisScore.competencies.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{}));
                                var subCompetenciesScore = Object.values(axisScore.subCompetencies.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{}));
                                let data = {"token":token,"active":true,"ids":skillIds};
                                //console.log(data);
                                Request.post({
                                    "headers": { "content-type": "application/json" },
                                    "url": "http://"+base_url+":3001/api/get-skills",
                                    "body": JSON.stringify(data)
                                }, (error, response, body) => {
                                    if(error) {
                                        console.log(error);
                                    }
                                    var jsonResult = JSON.parse(body);
                                    
                                    if(jsonResult.code == '0'){
                                        //console.log(jsonResult);
                                        let skillAxisScoreArrNew = [];
                                        jsonResult.data.forEach((element, index)=>{
                                            
                                            skillAxisScoreArr.forEach((row)=>{
                                                //console.log(row.id, element.id, index);
                                                if(row.id == element.id){
                                                    row.label = element.label;
                                                    row.description = element.description;
                                                    skillAxisScoreArrNew.push(row);
                                                }
                                            })
                                            if(Object.is(jsonResult.data.length -1, index)){

                                                if(compIds.length > 0){
                                                    compe = [];
                                                    console.log("COMP");
                                                    let request = {"token":token,"active":true,"ids":compIds};
                                                    Request.post({
                                                        "headers": { "content-type": "application/json" },
                                                        "url": "http://"+base_url+":3001/api/get-competencies",
                                                        "body": JSON.stringify(request)
                                                    }, (error, response, body) => {                                                    
                                                        var jsonResult = JSON.parse(body);
                                                        jsonResult.data.forEach((com, index)=>{
                                                            axisScore.competencies.forEach((ele)=>{
                                                                if(ele.id == com.id){
                                                                    ele.label = com.label;
                                                                    ele.description = com.description;
                                                                    compe.push(ele);
                                                                }
                                                            })                                                                
                                                            if(Object.is(jsonResult.data.length -1, index)){
                                                                var competenciesScore2 = Object.values(compe.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{}));
                                                                let finalScore = {"skills": skillAxisScoreArrNew, "competencies":competenciesScore2, "subCompetencies":subCompetenciesScore};
                                                                let score = {"avgScore":avgScore, "axisScore": finalScore};                                            
                                                                callback(score);
                                                            }
                                                        });
                                                    })
                                                }else{
                                                    let finalScore = {"skills": skillAxisScoreArrNew, "competencies":competenciesScore, "subCompetencies":subCompetenciesScore};
                                                    let score = {"avgScore":avgScore, "axisScore": finalScore};                                            
                                                    callback(score);
                                            }
                                            }
                                        })
                                    }
                                })
                            }                          
                        })
                        //return res.send({"avgScore":avgScore, "axisScore": axisScore});
                    }

                }
            }else{                    
                let score = {"avgScore":avgScore, "axisScore": axisScore};
                callback(score);
            }
            }
        }
    })
},
getPushNotificationId: function(token, callback){
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://"+base_url+":3000/api/get-push-notification-id",
        "body": JSON.stringify({"token":token})
    }, (error, response, body) => {
        if(error) {
            console.log(error);
            return false;
        }
        var result = JSON.parse(body);
        if(result.code == '0'){
            console.log(true);
            callback(result.data);
        }else{
            console.log(false);
            callback(false);
        }
    });
},
webPushNotification:function(pushNotificationId, reportId, assessmentId, key){

    console.log(pushNotificationId, reportId);
    olddata = {"message":"Thanks to submit your assessment, Please download your assessment report", "url":"http://ec2-35-154-172-174.ap-south-1.compute.amazonaws.com:3003/api/download-report/"+reportId, "assessmentId":assessmentId, "reportId":reportId, "testKey":key};

    const headers = {
        'Authorization': 'key=AIzaSyDlsMbI6Aro4S7SswAOhZWHA3ft43J3VbI',
        'Content-Type': 'application/json'
    }
    const data= {
        // "notification": {
        //     "title":"UAssess",
        //     "body":"Assessment completed, download the report",
        //     "click_action": "http://ec2-35-154-172-174.ap-south-1.compute.amazonaws.com:3003/api/download-report/"+reportId
        // },
        //'registration_ids': pushNotificationId,
        'data': {"body":olddata},
        "to": pushNotificationId
        }
    Request.post({
        "headers":headers,
        "url": "https://fcm.googleapis.com/fcm/send",
        "body": JSON.stringify(data)
    }, (error, response, body)=>{
        if(error){
            console.log("Error!");
        }else{
            console.log("Done!");
        }
    }
    );
},
validateToken: function(token, callback){
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://"+base_url+":3000/api/get-my-profile",
        "body": JSON.stringify({"token":token})
    }, (error, response, body) => {
        if(error) {
            console.log(error);
            return false;
        }
        var result = JSON.parse(body);
        if(result.code == '0'){
            console.log(true);
            callback(result.data);
        }else{
            console.log(false);
            callback(false);
        }
    });
},
getMyScoreTest: function(req, res){

    let questionIds =  [
        {
            "id": "5cad729a095a760ddd9cef5f",
            "status": "completed",
            "axisId": "5cad4697d1adb714cb0bc29e",
            "skillId": "5cada2662eebff18f25e658f",
            "axisName": "competencies",
            "answer": "pass"
        },
        {
            "id": "5cad81ed095a760ddd9cef63",
            "status": "completed",
            "axisId": "5cad4697d1adb714cb0bc29c",
            "skillId": "5cada2662eebff18f25e658f",
            "axisName": "competencies",
            "answer": "pass"
        },
        {
            "id": "5cad816f095a760ddd9cef62",
            "status": "completed",
            "axisId": "5cad4697d1adb714cb0bc29c",
            "skillId": "5cada2662eebff18f25e658f",
            "axisName": "competencies",
            "answer": "pass"
        },
        {
            "id": "5cad80ba095a760ddd9cef61",
            "status": "completed",
            "axisId": "5cad4697d1adb714cb0bc29c",
            "skillId": "5cada2662eebff18f25e658f",
            "axisName": "competencies",
            "answer": "pass"
        },
        {
            "id": "5cad8022095a760ddd9cef60",
            "status": "completed",
            "axisId": "5cad4697d1adb714cb0bc29c",
            "skillId": "5cada2662eebff18f25e658f",
            "axisName": "competencies",
            "answer": "pass"
        },
        {
            "id": "5cad82f4095a760ddd9cef66",
            "status": "completed",
            "axisId": "5cad4697d1adb714cb0bc2a1",
            "skillId": "5cad425b371a040dd1b01cf0",
            "axisName": "competencies",
            "answer": "pass"
        },
        {
            "id": "5cad8471095a760ddd9cef69",
            "status": "completed",
            "axisId": "5cad4697d1adb714cb0bc2a1",
            "skillId": "5cad425b371a040dd1b01cf0",
            "axisName": "competencies",
            "answer": "pass"
        },
        {
            "id": "5cad8590095a760ddd9cef6c",
            "status": "completed",
            "axisId": "5cad4697d1adb714cb0bc2a3",
            "skillId": "5cad425b371a040dd1b01cf0",
            "axisName": "competencies",
            "answer": "pass"
        },
        {
            "id": "5cad8557095a760ddd9cef6b",
            "status": "completed",
            "axisId": "5cad4697d1adb714cb0bc2a3",
            "skillId": "5cad425b371a040dd1b01cf0",
            "axisName": "competencies",
            "answer": "pass"
        },
        {
            "id": "5cad92ccd3042618ffbbbd7a",
            "status": "completed",
            "axisId": "5cad4697d1adb714cb0bc2a0",
            "skillId": "5cad425b371a040dd1b01cf0",
            "axisName": "competencies",
            "answer": "pass"
        },
        {
            "id": "5cad932cd3042618ffbbbd7b",
            "status": "completed",
            "axisId": "5cad4697d1adb714cb0bc2a0",
            "skillId": "5cad425b371a040dd1b01cf0",
            "axisName": "competencies",
            "answer": "pass"
        },
        {
            "id": "5cad828c095a760ddd9cef65",
            "status": "completed",
            "axisId": "5cad4697d1adb714cb0bc2a6",
            "skillId": "5cad425b371a040dd1b01cf0",
            "axisName": "competencies",
            "answer": "pass"
        },
        {
            "id": "5cad823c095a760ddd9cef64",
            "status": "completed",
            "axisId": "5cad4697d1adb714cb0bc2a6",
            "skillId": "5cad425b371a040dd1b01cf0",
            "axisName": "competencies",
            "answer": "file"
        }
    ];
    let data = {};
    data.questionIds = questionIds;
    data.token = "e5def8b0-4ed0-11e9-92ab-f18cc4f209e6";
    module.exports.getSkillsAvg2(data, function(response){
        return res.send(response);
    });
},
consumeLicense: function(licenseKey, token){
    console.log("Consume "+licenseKey);
    Assessment.findOne({"licenseKey":licenseKey}).then(function(result){
        let data = {"token":token, "companyId":result.companyId};
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://"+base_url+":3000/api/consume-license",
            "body": JSON.stringify(data)
        }, (error, response, body) => {
            if(error) {
                console.log(error);
                return false;
            }
            var result = JSON.parse(body);
            if(result.code == '0'){
                console.log(true);
            }else{
                console.log(false);
            }
        });
    })
    },
    downloadCSVReport: function(req, res){
        let key = req.params.key;
        let headers = ["h1","h2","h3","h4"].join(",");
        let row1    = ["r1","r2","r3","r4"].join(",");
        let row2    = ["t1","t2","t3","t4"].join(",");

        let writeStream = headers+"\n"+row1+"\n"+row2+"\n";

        UserAssessment.find({"licenseKey":key}).select("profileId").then(function(resultIds){
            console.log(resultIds);
            if(resultIds.length > 0){
                let profileIds = [];
                resultIds.forEach((element, index)=>{
                    profileIds.push(element.profileId);
                    if(Object.is(resultIds.length-1, index)){
                        let uniqArr = new Set(profileIds);
                        let uniqProfileIds = [...uniqArr];
                        Request.post({
                            "headers":{ 'Content-Type': 'application/json'},
                            "url": "http://"+base_url+":3000/api/get-users-profile",
                            "body": JSON.stringify({"profileIds":uniqProfileIds})
                        }, (error, response, body)=>{
                            if(error){
                                console.log(error);
                            }
                            var profiles = JSON.parse(body);
                            var latestAssessments = Promise.all(profiles.data.map(row => {
                                return UserAssessment.findOne({"licenseKey":key, "profileId":row.id, "status":"completed"}, {}, {sort:{'createdAt':-1}}).select({ avgScore: 1, profileId: 1, status: 1, updatedAt: 1, axisScore: 1 }).then(latest => {
                                    if(latest) {
                                        var newObj = latest.toObject();
                                        let date = new Date(newObj.updatedAt);
                                        let updated = date.toISOString().slice(0, 10);
                                        delete newObj._id;
                                        delete newObj.updatedAt;
                                        newObj.name = row.name;
                                        newObj.email = row.email;
                                        newObj.date = updated;
                                        return newObj;
                                    }
                                });
                            }));
                            latestAssessments.then(function(newResult){
                                // return res.send(newResult);

                                let reportRows = [];
                                let fields = ["name", "email", "avgScore", "status"];
                                if(newResult.length > 0){
                                    fields.push("\nSkills\n");

                                    newResult.forEach((elementall, indexall)=>{
                                        if(elementall.status == "completed" && "axisScore" in elementall){
                                            
                                            newResult[indexall].axisScore.skills.forEach((element, index)=>{
                                        
                                                console.log(element);
                                                fields.push(element.label);
                                                // element.axisScore.skills.forEach((skill, index)=>{
                                                //     element.skill.label = skill
                                                // })
                                                if(Object.is(newResult[indexall].axisScore.skills.length -1, index)){
                                                    // const json2csvParser = new Parser({});
                                                    // const csv = json2csvParser.parse(newResult);
                                                    fields.push("\nCompetencies\n");
                                                    newResult[0].axisScore.competencies.forEach((element, index)=>{
                                                        
                                                        console.log(element);
                                                        fields.push(element.label);
                                                        // element.axisScore.skills.forEach((skill, index)=>{
                                                        //     element.skill.label = skill
                                                        // })
                                                        if(Object.is(newResult[indexall].axisScore.competencies.length -1, index)){
                                                            // const json2csvParser = new Parser({});
                                                            // const csv = json2csvParser.parse(newResult);
                                                            fields = fields.join("\n");
                                                            let fs = require("fs");
                                                            let filename = "public/csv-reports/"+key+".csv";
                                                            fs.writeFile(filename, fields, (err) => {
                                                                if (err) throw err;
                                                                return res.download(filename);
                                                            });
                                                        }
                                                    });
                
                                                    // fields = fields.join("\n");
                                                    // let fs = require("fs");
                                                    // let filename = "public/csv-reports/"+key+".csv";
                                                    // fs.writeFile(filename, fields, (err) => {
                                                    //     if (err) throw err;
                                                    //     return res.download(filename);
                                                    // });
                                                }
                                            });
                                        }else{

                                        }
                                    })
                                    
                                }
                            });    
                        })
                    }
                });
            }else{
                return res.send({"code":"1", "message":"No more reports to download"});
            }
        }).catch((err)=>{
            return res.send(err);
        });
    },
    downloadCSVReport2: function(req, res){
        let key = req.params.key;

        UserAssessment.find({"licenseKey":key}).select("profileId").then(function(resultIds){
            console.log(resultIds);
            if(resultIds.length > 0){
                let profileIds = [];
                resultIds.forEach((element, index)=>{
                    profileIds.push(element.profileId);
                    if(Object.is(resultIds.length-1, index)){
                        let uniqArr = new Set(profileIds);
                        let uniqProfileIds = [...uniqArr];
                        Request.post({
                            "headers":{ 'Content-Type': 'application/json'},
                            "url": "http://"+base_url+":3000/api/get-users-profile",
                            "body": JSON.stringify({"profileIds":uniqProfileIds})
                        }, (error, response, body)=>{
                            if(error){
                                console.log(error);
                            }
                            var profiles = JSON.parse(body);
                            var latestAssessments = Promise.all(profiles.data.map(row => {
                                return UserAssessment.findOne({"licenseKey":key, "profileId":row.id, "status":"completed"}, {}, {sort:{'createdAt':-1}}).select({ avgScore: 1, profileId: 1, status: 1, updatedAt: 1, axisScore: 1}).then(latest => {
                                    console.log(latest);
                                    if(latest) {
                                        var newObj = latest.toObject();
                                        if(typeof newObj.axisScore === 'undefined'){
                                            return null;
                                        }else{
                                            let date = new Date(newObj.updatedAt);
                                            let updated = date.toISOString().slice(0, 10);
                                            delete newObj._id;
                                            delete newObj.updatedAt;
                                            newObj.name = row.name;
                                            newObj.email = row.email;
                                            newObj.date = updated;
                                            return newObj;
                                        }
                                    }
                                });
                            }));
                            latestAssessments.then(function(newResults){
                                const newResult = newResults.filter( i => i );
                                // return res.send(newResult);
                                let reportRows = [];
                                let nameArr = ["Name"];
                                let emailArr = ["Email"];
                                let avgScoreArr = ["Avg Score"];
                                let dateArr = ["Date"];
                                let skillsArr = [];
                                let competenciesArr = [];
                                let competenciesHeader = ["\nCompetencies\n"];
                                let i = 0;
                                if(newResult.length > 0){
                                    newResult.forEach((element, index1)=>{
                                        if(element){
                                            nameArr.push(element.name);
                                            emailArr.push(element.email);
                                            avgScoreArr.push(element.avgScore);
                                            dateArr.push(element.date);
                                            if(Object.is(newResult.length-1, index1)){
                                                //return res.send(newResult[0]);
                                                // newResult[0].forEach((element)=>{
                                                //     console.log(typeof element.axisScore);
                                                //     if(typeof element.axisScore === 'undefined') {
                                                //         console.log("undefined ....");
                                                //     }
                                                //     else {
                                                //     }
                                                // })
                                                newResult[0].axisScore.skills.forEach((skillAxis, index2)=>{
                                                    skillsRow = [];
                                                    skillsRow.push(skillAxis.label);
                                                    newResult.forEach((element2, index3)=>{
                                                        if(element2){
                                                            if("axisScore" in element2){
                                                                if(typeof element2.axisScore.skills[index2] === 'undefined') {
                                                                    skillsRow.push("");
                                                                }
                                                                else {
                                                                    let skill = element2.axisScore.skills[index2];
                                                                    //console.log(skill);
                                                                    skillsRow.push(skill.score);
                                                                }
                                                            }
                                                        }else{
                                                            skillsRow.push("");
                                                        }
                                                        if(Object.is(newResult.length-1, index3)){
                                                            console.log(skillsArr);
                                                            skillsArr.push(skillsRow);
                                                        }
                                                    })
                                                })

                                                newResult[0].axisScore.competencies.forEach((compAxis, index2)=>{
                                                    compRow = [];
                                                    compRow.push(compAxis.label);
                                                    newResult.forEach((element2, index3)=>{
                                                        if(element2){
                                                            if("axisScore" in element2){
                                                                if(typeof element2.axisScore.competencies[index2] === 'undefined') {
                                                                    compRow.push("");
                                                                }
                                                                else {
                                                                    let comp = element2.axisScore.competencies[index2];
                                                                    //console.log(skill);
                                                                    compRow.push(comp.score);
                                                                }
                                                            }
                                                        }else{
                                                            compRow.push("");
                                                        }
                                                        if(Object.is(newResult.length-1, index3)){
                                                            console.log(competenciesArr);
                                                            competenciesArr.push(compRow);
                                                        }
                                                    })
                                                })
                                            }                                            
                                        }
                                        if(Object.is(newResult.length-1, index1)){
                                            reportRows.push(nameArr.join(","), emailArr.join(","), avgScoreArr.join(","), dateArr.join(","));
                                            reportRows.push("\nSkills\n");
                                            skillsArr.forEach((element, index)=>{
                                                reportRows.push(element.join(","));
                                                if(Object.is(skillsArr.length-1, index)){
                                                    reportRows.push("\nCompetencies\n");
                                                    competenciesArr.forEach((element1, index1)=>{
                                                        reportRows.push(element1.join(","));
                                                        if(Object.is(competenciesArr.length-1, index1)){
                                                            i = i+1;
                                                        }
                                                    })
                                                    // i = i+1;
                                                }
                                            })
                                        }
                                    })
                                }
                                if(i > 0){
                                    let fs = require("fs");
                                    let filename = "public/csv-reports/"+key+".csv";
                                    fs.writeFile(filename, reportRows.join("\n"), (err) => {
                                        if (err) throw err;
                                        return res.download(filename);
                                    });                                   
                                    //return res.send(reportRows.join("\n"));
                                }
                            });    
                        })
                    }
                });
            }else{
                return res.send({"code":"1", "message":"No more reports to download"});
            }
        }).catch((err)=>{
            return res.send(err);
        });
    }
}