const Assessment = require('../models/companyAssessments.model');
const UserAssessment = require("../models/userAssessments.model");
var Request = require('request');
var Fs = require('fs');
const uuidv1 = require('uuid/v1');
require('../config/messages');
require('../config/global');

module.exports = {
    createCompanyAssessment: function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED});
        }
        if(!("title" in input) || input.title.length == 0){
            return res.send({"code":"1", "message":TITLE_REQUIRED});
        }
        if(!("description" in input) || input.description.length == 0){
            return res.send({"code":"1", "message":"Description required"});
        }
        if(!("expiryDate" in input) || input.expiryDate.length == 0){
            return res.send({"code":"1", "message":"Expiry date required"});
        }else{
            var pattern = /^\d{4}[-](0[1-9]|1[0-2])[-](0[1-9]|[12][0-9]|3[01])$/;
            if(pattern.test(input.expiryDate) == false){
                return res.send({"code":"1", "message":"Expiry date invalid" });
            }else{
                var todayISO = new Date();
                var todayISOWOTime = new Date((todayISO.toISOString().slice(0,10)));
                var expiryDateISO = new Date(input.expiryDate);
                var todayMs = todayISOWOTime.getTime();
                var expiryDateMs = expiryDateISO.getTime();
                if(todayMs > expiryDateMs){
                    return res.send({"code":"1", "message":"Expiry Date should be greater than or equal to today"});
                }
            }
        }
        if("duration" in input){
            if(input.duration.length > 0){
                if(typeof input.duration !== 'number'){
                    return res.send({ "code": "1", "message": "Duration not valid, must be a number", "data": input});
                }
                var pattern = /^\d{1,3}$/;
                if(pattern.test(input.duration) == false){
                    return res.send({ "code": "1", "message": "Duration not valid, must be a three digit number", "data": input});
                }
            }
        }
        if(!("noOfQuestions" in input) || input.noOfQuestions.length == 0){
            return res.send({"code":"1", "message":"noOfQuestions required"});
        }else{
            if(typeof input.noOfQuestions !== 'number'){
                return res.send({ "code": "1", "message": "noOfQuestions not valid, must be a number", "data": input});
            }
            var pattern = /^\d{1,2}$/;
            if(pattern.test(input.noOfQuestions) == false){
                return res.send({ "code": "1", "message": "noOfQuestions not valid, must be a two digit number", "data": input});
            }
        }
        if(!("displayReportToCompany" in input) || input.displayReportToCompany.length == 0){
            return res.send({"code":"1", "message":"displayReportToCompany required"});
        }else{
            if(typeof input.displayReportToCompany !== 'boolean'){
                return res.send({ "code": "1", "message": "displayReportToCompany not valid, must be a Boolean", "data": input});
            }
        }
        if(!("displayReportToUser" in input) || input.displayReportToUser.length == 0){
            return res.send({"code":"1", "message":"displayReportToUser required"});
        }else{
            if(typeof input.displayReportToUser !== 'boolean'){
                return res.send({ "code": "1", "message": "displayReportToUser not valid, must be a Boolean", "data": input});
            }
        }
        if("freeTest" in input){
            if(typeof input.freeTest !== 'boolean'){
                return res.send({ "code": "1", "message": "Free test not valid, must be a Boolean", "data": input});
            }
        }
        if("reportGeneration" in input){
            if(typeof input.reportGeneration !== 'boolean'){
                return res.send({ "code": "1", "message": "Report Generation not valid, must be a Boolean", "data": input});
            }
        }
        if(!("noOfAttempts" in input) || input.noOfAttempts.length == 0){
            return res.send({"code":"1", "message":"noOfAttempts required"});
        }else{
            if(typeof input.noOfAttempts !== 'number'){
                return res.send({ "code": "1", "message": "noOfAttempts not valid, must be a number", "data": input});
            }
        }
        if(!("attemptsInterval" in input) || input.attemptsInterval.length == 0){
            return res.send({"code":"1", "message":"attemptsInterval required"});
        }else{
            if(typeof input.attemptsInterval !== 'number'){
                return res.send({ "code": "1", "message": "attemptsInterval not valid, must be a number", "data": input});
            }
        }
        if(!("companyId" in input) || input.companyId.length == 0){
            return res.send({"code":"1", "message":"companyId required"});
        }
        if(!("frontCoverImage" in input) || input.frontCoverImage.length < 15){
            return res.send({"code":"1", "message":"Front Cover Image required", "data": input});
        }
        if("skills" in input){
            if(input.skills.length > 0){
                let skillIds = [];
                input.skills.forEach(element => {
                    if(skillIds.indexOf(element.id) > -1){
                        return res.send({ "code": "1", "message": "Skills contains duplicate Id", "data": element});
                    }
                    skillIds.push(element.id);
                });
            }
        }
        if("competencies" in input){
            if(input.competencies.length > 0){
                let compIds = [];
                input.competencies.forEach(element => {
                    if(compIds.indexOf(element.id) > -1){
                        return res.send({ "code": "1", "message": "Competencies contains duplicate Id", "data": element});
                    }
                    compIds.push(element.id);
                });
            }
        }
        if("subCompetencies" in input){
            if(input.competencies.length > 0){
                let subcompIds = [];
                input.subCompetencies.forEach(element => {
                    if(subcompIds.indexOf(element.id) > -1){
                        return res.send({ "code": "1", "message": "Sub Competencies contains duplicate Id", "data": element});
                    }
                    subcompIds.push(element.id);
                });
            }
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if("companyId" in input){
                    let data = {"token":input.token, "companyId":input.companyId};
                    module.exports.getCompanyProfile(data, function(companyRes){
                        if(companyRes === false){
                            return res.send({"code":"1", "message":"Invalid Company Id", "data":input});
                        }else{
                            if(companyRes.length > 0){
                                input.companyLogo = companyRes;
                            }else{
                                input.companyLogo = "";
                            }  
                            if(profile.privilegeRoles.indexOf("UassessAdmin")>-1 || profile.privilegeRoles.indexOf("CompanyAdmin")>-1){
                                var result = module.exports.getUniqueKey();
                                var fcimage = "";
                                result.then(function(key){
                                    if(key == false){
                                        return res.send({"code":"1", "message":"License key not generated", "data": input});
                                    }
                                    input.licenseKey = key.toString();
                                    input.createdBy = profile.id;
                                    Assessment.find({"title":input.title, "companyId":input.companyId}).then(function(existresult){
                                        if(existresult.length > 0){
                                            return res.send({"code":"1", "message":"Assessment title already exist, please update", "data":input});
                                        }else{
                                            Assessment.find({"licenseKey":input.licenseKey}).then(function(existlicense){
                                                if(existlicense.length == 0){
                                                    if(input.frontCoverImage.indexOf("http") == -1){
                                                        if(Buffer.from(input.frontCoverImage, 'base64').toString('base64') !== input.frontCoverImage){
                                                            return res.send({"code":"1", "message":"Invalid Base64/URL", "data":input});
                                                        }else{
                                                            fcimage = "base64";
                                                        }
                                                    }else{                                                        
                                                        let fcimageurlsplit = input.frontCoverImage.split("frontCovers");
                                                        if(fcimageurlsplit[1] !== undefined){
                                                            input.frontCoverImage = "public/frontCovers"+fcimageurlsplit[1];
                                                        }else{
                                                            return res.send({"code":"1", "message":"Invalid URL", "data":input});
                                                        }
                                                        fcimage = "http";
                                                    }
                                                    if(fcimage == "base64")
                                                    {
                                                        var path = 'public/frontCovers/'+uuidv1()+'.jpg';
                                                        Fs.writeFile(path, input.frontCoverImage, 'base64', function(err){
                                                            if(!err){
                                                                input.frontCoverImage = path;
                                                                Assessment.create(input).then(function(result){
                                                                    if(result){
                                                                        let resultObj = result.toObject();
                                                                        resultObj.id = resultObj._id;
                                                                        delete resultObj._id;
                                                                        resultObj.expiryDate = resultObj.expiryDate.toISOString().slice(0,10);
                                                                        return res.send({"code":"0", "message":SUCCESS, "data": resultObj});
                                                                    }
                                                                }).catch(function(error){
                                                                    return res.send({"code":"1", "message":error.message, "data": input});
                                                                });                                                                                                        
                                                            }else{
                                                                return res.send({"code":"1", "message":err.message, "data":input});
                                                            }
                                                        })
                                                    }else{
                                                        Assessment.create(input).then(function(result){
                                                            if(result){
                                                                let resultObj = result.toObject();
                                                                resultObj.id = resultObj._id;
                                                                delete resultObj._id;
                                                                resultObj.expiryDate = resultObj.expiryDate.toISOString().slice(0,10);
                                                                return res.send({"code":"0", "message":SUCCESS, "data": resultObj});
                                                            }
                                                        }).catch(function(error){
                                                            return res.send({"code":"1", "message":error.message, "data": input});
                                                        });                                                                                                        
                                            }
                                                }else{
                                                    return res.send({"code":"1", "message":"Assessment not created, please try later", "data":input});
                                                }
                                            })
                                        }
                                    })
                                })
                            }else{
                                return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                            }            
                        }
                    })
                }
            }else{
                return res.send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    getCompanyProfile: function(data, callback){
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://"+base_url+":3000/api/get-company-profile",
            "body": JSON.stringify(data)
        }, (error, response, body) => {
            if(error) {
                return callback(false);
            }
            var companyResult = JSON.parse(body);
            console.log(companyResult);
            if(companyResult.code == '0'){
                companyLogo = companyResult.data.logo;
                return callback(companyLogo);
            }else{
                return callback(false);
            }
        });
    },
    updateCompanyAssessment: function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED});
        }
        if(!("assessmentId" in input) || input.assessmentId.length == 0){
            return res.send({"code":"1", "message":"Assessment Id required"});
        }
        if("expiryDate" in input){
            var pattern = /^\d{4}[-](0[1-9]|1[0-2])[-](0[1-9]|[12][0-9]|3[01])$/;
            if(pattern.test(input.expiryDate) == false){
                return res.send({"code":"1", "message":"Expiry date invalid" });
            }else{
                var todayISO = new Date();
                var todayISOWOTime = new Date((todayISO.toISOString().slice(0,10)));
                var expiryDateISO = new Date(input.expiryDate);
                var todayMs = todayISOWOTime.getTime();
                var expiryDateMs = expiryDateISO.getTime();
                console.log(todayMs , expiryDateMs);
                if(todayMs >= expiryDateMs){
                    return res.send({"code":"1", "message":"Expiry Date should be greater than today"});
                }
            }
        }
        if("duration" in input){
            if(typeof input.duration !== 'number'){
                return res.send({ "code": "1", "message": "Duration not valid, must be a number", "data": input});
            }
            var pattern = /^\d{1,3}$/;
            if(pattern.test(input.duration) == false){
                return res.send({ "code": "1", "message": "Duration not valid, must be a three digit number", "data": input});
            }
        }
        if("noOfQuestions" in input){
            if(typeof input.noOfQuestions !== 'number'){
                return res.send({ "code": "1", "message": "noOfQuestions not valid, must be a number", "data": input});
            }
            var pattern = /^\d{1,2}$/;
            if(pattern.test(input.noOfQuestions) == false){
                return res.send({ "code": "1", "message": "noOfQuestions not valid, must be a two digit number", "data": input});
            }
        }
        if("displayReportToCompany" in input){
            if(typeof input.displayReportToCompany !== 'boolean'){
                return res.send({ "code": "1", "message": "displayReportToCompany not valid, must be a Boolean", "data": input});
            }
        }
        if("displayReportToUser" in input){
            if(typeof input.displayReportToUser !== 'boolean'){
                return res.send({ "code": "1", "message": "displayReportToUser not valid, must be a Boolean", "data": input});
            }
        }
        if("freeTest" in input){
            if(typeof input.freeTest !== 'boolean'){
                return res.send({ "code": "1", "message": "Free test not valid, must be a Boolean", "data": input});
            }
        }
        if("reportGeneration" in input){
            if(typeof input.reportGeneration !== 'boolean'){
                return res.send({ "code": "1", "message": "Report Generation not valid, must be a Boolean", "data": input});
            }
        }
        if("attemptsInterval" in input){
            if(typeof input.attemptsInterval !== 'number'){
                return res.send({ "code": "1", "message": "attemptsInterval not valid, must be a Boolean", "data": input});
            }
        }
        if("noOfAttempts" in input){
            if(typeof input.noOfAttempts !== 'number'){
                return res.send({ "code": "1", "message": "noOfAttempts not valid, must be a Boolean", "data": input});
            }
        }
        if("skills" in input){
            if(input.skills.length > 0){
                let skillIds = [];
                input.skills.forEach(element => {
                    if(skillIds.indexOf(element.id) > -1){
                        return res.send({ "code": "1", "message": "Skills contains duplicate Id", "data": element});
                    }
                    skillIds.push(element.id);
                });
            }
        }
        if("competencies" in input){
            if(input.competencies.length > 0){
                let compIds = [];
                input.competencies.forEach(element => {
                    if(compIds.indexOf(element.id) > -1){
                        return res.send({ "code": "1", "message": "Competendies contains duplicate Id", "data": element});
                    }
                    compIds.push(element.id);
                });
            }
        }
        if("subCompetencies" in input){
            if(input.competencies.length > 0){
                let subcompIds = [];
                input.subCompetencies.forEach(element => {
                    if(subcompIds.indexOf(element.id) > -1){
                        return res.send({ "code": "1", "message": "Sub Competendies contains duplicate Id", "data": element});
                    }
                    subcompIds.push(element.id);
                });
            }
        }

        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1 || profile.privilegeRoles.indexOf("CompanyAdmin")>-1){
                    Assessment.findById(input.assessmentId).then(function(result){
                        if(result){
                            var i = 0;
                            if("frontCoverImage" in input){
                                if(input.frontCoverImage.length > 0){
                                    if(input.frontCoverImage.indexOf("http") == -1){
                                        if(Buffer.from(input.frontCoverImage, 'base64').toString('base64') !== input.frontCoverImage){
                                            return res.send({"code":"1", "message":"Invalid Base64/URL", "data":input});
                                        }else{
                                            fcimage = "base64";
                                        }
                                    }else{                                                        
                                        let fcimageurlsplit = input.frontCoverImage.split("frontCovers");
                                        if(fcimageurlsplit[1] !== undefined){
                                            input.frontCoverImage = "public/frontCovers"+fcimageurlsplit[1];
                                            result.frontCoverImage = input.frontCoverImage;
                                        }else{
                                            return res.send({"code":"1", "message":"Invalid URL", "data":input});
                                        }
                                        fcimage = "http";
                                    }
                                    
                                    if(fcimage == "base64")
                                    {
                                        var path = 'public/frontCovers/'+uuidv1()+'.jpg';
                                        Fs.writeFile(path, input.frontCoverImage, 'base64', function(err){
                                            if(!err){
                                                input.frontCoverImage = path; 
                                                result.frontCoverImage = path;
                                                i = i + 1;                                                                            
                                            }else{
                                                return res.send({"code":"1", "message":err.message, "data":input});
                                            }
                                        })
                                    }else{
                                        i = i + 1;
                                    }
                                }
                            }else{
                                i = i + 1;
                            }
                            if(i > 0){
                                if("title" in input){ result.title = input.title; }
                                if("icon" in input){ result.icon = input.icon; }
                                if("expiryDate" in input){ result.expiryDate = input.expiryDate; }
                                if("duration" in input){ result.duration = input.duration; }
                                if("noOfAttempts" in input){ result.noOfAttempts = input.noOfAttempts; }
                                if("attemptsInterval" in input){ result.attemptsInterval = input.attemptsInterval; }
                                if("licenseKey" in input){ result.licenseKey = input.licenseKey; }
                                if("freeTest" in input){ result.freeTest = input.freeTest; }
                                if("reportGeneration" in input){ result.reportGeneration = input.reportGeneration; }
                                if("displayReportToUser" in input){ result.displayReportToUser = input.displayReportToUser; }
                                if("displayReportToCompany" in input){ result.displayReportToCompany = input.displayReportToCompany; }
                                if("ownerId" in input){ result.ownerId = input.ownerId; }
                                if("skills" in input){ result.skills = input.skills; }
                                if("competencies" in input){ result.competencies = input.competencies; }
                                if("subCompetencies" in input){ result.subCompetencies = input.subCompetencies; }
                                if("screenRecord" in input){ result.screenRecord = input.screenRecord; }
                                if("videoRecord" in input){ result.videoRecord = input.videoRecord; }
                                //if("companyId" in input){ result.companyId = input.companyId; }
                                if("description" in input){ result.description = input.description; }
                                if("summary" in input){ result.summary = input.summary; }
                                if("noOfQuestions" in input){ result.noOfQuestions = input.noOfQuestions; }
                                if("participents" in input){ result.participents = input.participents; }
                                
                                result.updatedBy = profile.id;
                                if(result.save()){
                                    let resultObj = result.toObject();
                                    resultObj.id = resultObj._id;
                                    delete resultObj._id;
                                    resultObj.expiryDate = resultObj.expiryDate.toISOString().slice(0,10);
                                    return res.send({"code":"0", "message":SUCCESS, "data": resultObj});
                                }
                            }
                        }else{
                            return res.send({ "code": "1", "message": "Assessment does not exist or Invalid Assessment Id"});
                        }
            
                    }).catch(function(err){
                        if(err.name == 'ValidationError'){
                            var splitedText = err.message.split(',');
                            var message = splitedText[0].split(':')[2].trim();
                            return res.send({ "code": "1", "message": message});
                        }else{
                            return res.send({ "code": "1", "message": err.message});
                        }
                    });
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },

    getCompanyAssessments: function(req, res){
        let input = req.body;
        let filterObj = {};
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED});
        }
        if("licenseKey" in input){
            if(input.licenseKey.length == 0){
                return res.send({"code":"1", "message":"License Key should not be empty"});
            }else{
                filterObj.licenseKey = input.licenseKey;
            }
        }else{
            if(!("companyId" in input) || input.companyId.length == 0){
                return res.send({"code":"1", "message":"company Id required"});
            }else{
                filterObj.companyId = input.companyId;
            }
        }
        if("active" in input){
            if(input.active !== false && input.active !== true ){
                return res.send({"code":"1", "message":INVALID_ACTIVE_VALUE, "data": input});
            }else{
                filterObj.active = input.active;
            }
        }
        
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                let totalAssessments = 0;
                let ongoingAssessments = 0;
                let totalAssessee = 0;
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1 || profile.privilegeRoles.indexOf("CompanyAdmin")>-1){
                    Assessment.find(filterObj).then(function(result){
                        var resultArr = [];
                        totalAssessments = totalAssessments + result.length;
                        if(result.length > 0){
                            result.forEach((row, index)=>{
                                var resultObj = row.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                if(resultObj.frontCoverImage.indexOf("http") == -1){
                                    resultObj.frontCoverImage = server_base_url + "/3003" + resultObj.frontCoverImage.split("public")[1];
                                }
                                resultObj.expiryDate = resultObj.expiryDate.toISOString().slice(0,10);
                                var today = new Date();
                                var todayMS = today.getTime();
                                var expDate = new Date(resultObj.expiryDate);
                                var expDateMS = expDate.getTime();
                                if(todayMS < expDateMS){
                                    ongoingAssessments = ongoingAssessments + 1;
                                }
                                totalAssessee = totalAssessee + resultObj.participents.length;                                
                                resultArr.push(resultObj);
                                if(Object.is(result.length -1, index)){
                                    return res.send({ "code": "0", "message": SUCCESS, "totalAssessments":totalAssessments, "ongoingAssessments":ongoingAssessments, "totalAssessee":totalAssessee, "data": resultArr});
                                }
                            })
                        }else{
                            return res.send({ "code": "0", "message": SUCCESS, "data": resultArr});
                        }
                    }).catch(function(err){
                        return res.send({ "code":"1", "message":err.message, "data":input});
                    });
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },

    updateStatus : function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED});
        }
        if(!("assessmentId" in input) || input.assessmentId.length == 0){
            return res.send({"code":"1", "message":"assessment Id required"});
        }
        if(!("active" in input) || input.active.length == 0){
            return res.send({"code":"1", "message":ACTIVE_REQUIRED, "data": input});
        }else{
            if(input.active !== false && input.active !== true ){
                return res.send({"code":"1", "message":INVALID_ACTIVE_VALUE, "data": input});
            }
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1 || profile.privilegeRoles.indexOf("CompanyAdmin")>-1){
                    Assessment.findById(input.assessmentId).then(function(result){
                        if(result == null){
                            return res.send({ "code": "1", "message": "Assessment not exist", "data": input});
                        }else{
                            result.active = input.active;
                            result.updatedBy = profile.id;
                            result.save(function(){
                                var resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                resultObj.expiryDate = resultObj.expiryDate.toISOString().slice(0,10);
                                if(input.active){
                                    return res.send({ "code": "0", "message": ACTIVATED, "data": resultObj});
                                }else{
                                    return res.send({ "code": "0", "message": DEACTIVATED, "data": resultObj});
                                }
                            });
                        }
                    }).catch(function(){
                        return res.send({ "code": "1", "message": "Assessment ID not valid", "data": input});
                    });
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    // getAssessmentByKey: function(req, res){
    //     var input = req.body;
    //     if(!("token" in input) || input.token.length == 0){
    //         return res.send({"code":"1", "message":TOKEN_REQUIRED});
    //     }
    //     if(!("licenseKey" in input)){
    //         return res.send({"code":"1", "message":"License Key field required"});
    //     }
    //     if(!("fetch" in input)){
    //         return res.send({"code":"1", "message":"Fetch field required"});
    //     }
    //     let keyPatt = /^\d{6}$/;
    //     if(input.licenseKey.length == 0 || keyPatt.test(input.licenseKey) == false){
    //         return res.send({"code":"1", "message":INVALID_LICENSE_KEY});
    //     }
    //     if(input.fetch !== "single" && input.fetch !== "all"){
    //         return res.send({"code":"1", "message":"Fetch is not valid, it should be single/all"});
    //     }
    //     Assessment.find({"licenseKey":input.licenseKey}).then(function(result){
    //         if(result.length == 1){
    //             result.forEach((element)=>{
    //                 var resultObj = element.toObject();
    //                 resultObj.id = resultObj._id;
                    
    //                 if(input.fetch == "single"){
    //                     console.log(input.fetch);
                        
    //                     Request.post({
    //                         "headers": { "content-type": "application/json" },
    //                         "url": "http://"+base_url+":3002/api/get-random-questions",
    //                         "body": JSON.stringify({
    //                             "questionIdsToSkip":[],
	//                             "competency":{"id":"5bffd3c4a1f3eb6f10a98444", "level":"333"}
    //                         })
    //                     }, (error, response, body) => {
    //                         if(error) {
    //                             console.log(error);
    //                             return res.send({ "code":"1", "message":"Server error"});
    //                         }
    //                         var data = JSON.parse(body);
    //                         if(data.code == '0'){
    //                             var question = data.data;
    //                             question.id = question._id;
    //                             delete question._id;
    //                             delete question.createdBy;
    //                             delete question.updatedBy;
    //                             //delete question.ownerId;
    //                             resultObj.question = question;
    //                         }else{
    //                             resultObj.question = {};
    //                         }
    //                         //console.dir(JSON.parse(body));
    //                         delete resultObj._id;
    //                         delete resultObj.competencies;
    //                         delete resultObj.subCompetencies;
    //                         delete resultObj.skills;
    //                         delete resultObj.createdBy;
    //                         delete resultObj.updatedBy;
    //                         delete resultObj.ownerId;
    //                         return res.send({ "code":"0", "message":SUCCESS, "data": resultObj});
        
    //                     });
    //                 }
    //             })
    //         }else if( result.length > 1){
    //             return res.send({ "code":"0", "message":SUCCESS, "data": result[0]});
    //         }else{
    //             return res.send({ "code":"1", "message":"Invalid license key", "data":input});
    //         }
    //     }).catch(function(){
    //         return res.send({ "code":"1", "message":"Somthing went wrong", "data":input});
    //     });
    // },
    getUniqueKey: async function(){
        let assessmentKey = Math.floor(Math.random() * 899999 + 100000);
        let unique = false;
        while (!unique) {
            try {
                const property = await (Assessment.find({"licenseKey":assessmentKey}).exec());
                console.log(property);
                if (property.length == 0) {
                    console.log("not exist");
                    if(assessmentKey.length == 6){
                        unique = true;
                    }else{
                        unique = false;
                    }
                    return assessmentKey;
                } else {
                    console.log("exist");
                    unique = false;
                }
                console.log(unique);
            } catch (e) {
                console.log('exception: ' + e);
                unique = true;
                return false;
            }
        }
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
                //return res.send({ "code":"1", "message":"Server error"});
            }
            var data = JSON.parse(body);
            //console.log(data);
            if(data.code == '0'){
                question = data.data;
                question.id = question._id;
                delete question._id;
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

    getCompetencyInfo: function(request, callback){
    
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://"+base_url+":3001/api/get-competencies",
            "body": JSON.stringify(request)
        }, (error, response, body) => {
            if(error) {
                callback(false);
            }
            var jsonResult = JSON.parse(body);
            
            if(jsonResult.code == '0'){
                callback(jsonResult);
            }else{
                callback(false);
            }
        })

    },
    getAssessment: function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length  == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED});
        }
        if(!("licenseKey" in input) || input.licenseKey.length == 0){
            return res.send({"code":"1", "message":LICENSE_KEY_REQUIRED});
        }
        let keyPatt = /^\d{6}$/;
        if(keyPatt.test(input.licenseKey) == false){
            return res.send({"code":"1", "message":INVALID_LICENSE_KEY});
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
                    Assessment.findOne({"licenseKey":input.licenseKey}).then(function(result){
                        if(result){
                            return res.send(result);
                        }
                    })
                }
            }
        })
    },
    submitAssessment: function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length  == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED});
        }
        if(!("licenseKey" in input) || input.licenseKey.length == 0){
            return res.send({"code":"1", "message":LICENSE_KEY_REQUIRED});
        }
        let keyPatt = /^\d{6}$/;
        if(keyPatt.test(input.licenseKey) == false){
            return res.send({"code":"1", "message":INVALID_LICENSE_KEY});
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
                    Assessment.findOne({"licenseKey":input.licenseKey}).then(function(result){
                        if(result){
                            return res.send(result);
                        }
                    })
                }
            }
        })
    },
    getAssessmentReports: function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length  == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED});
        }
        if(!("licenseKey" in input) || input.licenseKey.length == 0){
            return res.send({"code":"1", "message":LICENSE_KEY_REQUIRED});
        }
        let keyPatt = /^\d{6}$/;
        if(keyPatt.test(input.licenseKey) == false){
            return res.send({"code":"1", "message":INVALID_LICENSE_KEY});
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
            //console.log(body);
            
            if(body.code == "0"){
                if("id" in body.data){
                    let profileId = body.data.id;
                    Assessment.findOne({"licenseKey":input.licenseKey}).then(function(resultA){
                        if(resultA){
                            UserAssessment.find({ "licenseKey": input.licenseKey }).select({ avgScore: 1, profileId: 1, status: 1, updatedAt: 1 }).then(function(resultB){
                                let profileIds = [];
                                resultB.forEach((element, index)=>{
                                    profileIds.push(element.profileId);
                                });
                                if(profileIds.length > 0){
                                    Request.post({
                                        "headers":{ 'Content-Type': 'application/json'},
                                        "url": "http://"+base_url+":3000/api/get-users-profile",
                                        "body": JSON.stringify({"profileIds":profileIds})
                                    }, (error, response, body)=>{
                                        if(error){
                                            console.log(error);
                                        }
                                        var response = JSON.parse(body);
                                        let result = [];
                                        console.log(response);
                                        resultB.forEach((element, index)=>{
                                            response.data.forEach((user)=>{
                                                if(user.id == element.profileId){
                                                    var obj = element.toObject();
                                                    obj.id = obj._id;
                                                    delete obj._id;
                                                    delete obj.updatedAt;
                                                    let date = new Date(element.updatedAt);
                                                    let updated = date.toISOString().slice(0, 10);
                                                    obj.name = user.name;
                                                    obj.email = user.email;
                                                    obj.date = updated;
                                                    result.push(obj);
                                                }
                                            })
                                            if(Object.is(resultB.length -1, index)){
                                                return res.send(result);
                                            }
                                        })
                                    })
                                }
                            })
                        }else{
                            return res.send({"code":"1", "message": INVALID_LICENSE_KEY});
                        }
                    }).catch(function(err){
                        return res.send({"code":"1", "message":err.message});
                    })
                }
            }else{
                return res.send({"code":"1", "message":body.message});
            }
        })
    },
    getAssessmentLatestReports: function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length  == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED});
        }
        if(!("licenseKey" in input) || input.licenseKey.length == 0){
            return res.send({"code":"1", "message":LICENSE_KEY_REQUIRED});
        }
        let keyPatt = /^\d{6}$/;
        if(keyPatt.test(input.licenseKey) == false){
            return res.send({"code":"1", "message":INVALID_LICENSE_KEY});
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
            //console.log(body);
            
            if(body.code == "0"){
                if("id" in body.data){
                    let profileId = body.data.id;
                    Assessment.findOne({"licenseKey":input.licenseKey}).then(function(resultA){
                        if(resultA){
                            UserAssessment.find({ "licenseKey": input.licenseKey }).select({ avgScore: 1, profileId: 1, status: 1, updatedAt: 1 }).then(function(resultB){
                                if(resultB.length > 0){
                                    let profileIds = [];
                                    resultB.forEach((element, index)=>{
                                        profileIds.push(element.profileId);
                                    });
                                    if(profileIds.length > 0){
                                        Request.post({
                                            "headers":{ 'Content-Type': 'application/json'},
                                            "url": "http://"+base_url+":3000/api/get-users-profile",
                                            "body": JSON.stringify({"profileIds":profileIds})
                                        }, (error, response, body)=>{
                                            if(error){
                                                console.log(error);
                                            }
                                            var profileIds = JSON.parse(body);
                                            // let result = [];
                                            //console.log(body);
                                            // return res.send(body);
                                            var latestAssessments = Promise.all(profileIds.data.map(row => {
                                                return UserAssessment.findOne({"licenseKey":input.licenseKey, "profileId":row.id}, {}, {sort:{'createdAt':-1}}).select({ avgScore: 1, profileId: 1, status: 1, updatedAt: 1, screenRecordId: 1, videoRecordId: 1 }).then(latest => {
                                                    if(latest) {
                                                        var newObj = latest.toObject();
                                                        let date = new Date(newObj.updatedAt);
                                                        let updated = date.toISOString().slice(0, 10);
                                                        newObj.id = newObj._id;
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
                                                let allParticipants = [];
                                                resultA.participents.forEach((email, index)=>{
                                                    let i = 0;
                                                    newResult.forEach((element, key)=>{                                         
                                                        if(element.email == email){
                                                            i++;
                                                            allParticipants.push(element);
                                                        }
                                                        if(Object.is(newResult.length -1, key)){
                                                            if(i == 0){
                                                                let invited = {
                                                                    "avgScore": "",
                                                                    "status": "invited",
                                                                    "profileId": "",
                                                                    "name": "",
                                                                    "email": "",
                                                                    "date": ""
                                                                };
                                                                invited.email = email;
                                                                allParticipants.push(invited);
                                                            }
                                                        }
                                                    });
                                                    if(Object.is(resultA.participents.length -1, index)){
                                                        let data = {};
                                                        data.participents = allParticipants;
                                                        data.title = resultA.title;
                                                        data.assessmentType = resultA.assessmentType;
                                                        data.expiryDate = resultA.expiryDate.toISOString().slice(0,10);
                                                        let todayMS = new Date().getTime();
                                                        let expDateMS = new Date(data.expiryDate).getTime();
    
                                                        let daysLeft = Math.round(((expDateMS - todayMS) / 86400000 ));
                                                        data.daysLeft = daysLeft;
                                                        return res.send({"code":"0", "message":"Success","data":data});
                                                    }
                                                });
                                            })
                                        })
                                    }    
                                }else{
                                    let allParticipants = [];
                                    if(resultA.participents.length > 0){
                                        resultA.participents.forEach((email, index)=>{
                                            let invited = {
                                                "avgScore": "",
                                                "status": "invited",
                                                "profileId": "",
                                                "name": "",
                                                "email": "",
                                                "date": ""
                                            };
                                            invited.email = email;
                                            allParticipants.push(invited);
                                            
                                            if(Object.is(resultA.participents.length -1, index)){
                                                let data = {};
                                                data.participents = allParticipants;
                                                data.title = resultA.title;
                                                data.assessmentType = resultA.assessmentType;
                                                data.expiryDate = resultA.expiryDate.toISOString().slice(0,10);
                                                let todayMS = new Date().getTime();
                                                let expDateMS = new Date(data.expiryDate).getTime();
    
                                                let daysLeft = Math.round(((expDateMS - todayMS) / 86400000 ));
                                                data.daysLeft = daysLeft;
                                                return res.send({"code":"0", "message":"Success","data":data});
                                            }
                                        });
                                    }else{
                                        let allParticipants = [];
                                        let data = {};
                                        data.participents = allParticipants;
                                        data.title = resultA.title;
                                        data.assessmentType = resultA.assessmentType;
                                        data.expiryDate = resultA.expiryDate.toISOString().slice(0,10);
                                        let todayMS = new Date().getTime();
                                        let expDateMS = new Date(data.expiryDate).getTime();

                                        let daysLeft = Math.round(((expDateMS - todayMS) / 86400000 ));
                                        data.daysLeft = daysLeft;
                                        return res.send({"code":"0", "message":"Success","data":data});
                                    }
                                }
                            })
                        }else{
                            return res.send({"code":"1", "message": INVALID_LICENSE_KEY});
                        }
                    }).catch(function(err){
                        return res.send({"code":"1", "message":err.message});
                    })
                }
            }else{
                return res.send({"code":"1", "message":body.message});
            }
        })
    },
    addParticipants: function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("licenseKey" in input) || input.licenseKey.length == 0){
            return res.send({"code":"1", "message":LICENSE_KEY_REQUIRED, "data": input});
        }
        if(!("emailIds" in input) || input.emailIds.length == 0){
            return res.send({"code":"1", "message":"email Ids required", "data": input});
        }
        Assessment.findOne({"licenseKey":input.licenseKey}).then(function(result){
            //result.participents = input.emailIds;
            console.log(result);
            if(result){
                result.participents = [ ...new Set(result.participents.concat(input.emailIds))];
                result.save(function(err){
                    if(!err){
                        return res.send({"code":"0", "message":SUCCESS});
                    }else{
                        return res.send({"code":"1", "message":"fail"});
                    }
                })            
            }else{
                return res.send({"code":"1", "message":INVALID_LICENSE_KEY});
            }
        }).catch(function(err){
            return res.send({"code":"1", "message":err.message});
        })
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

}