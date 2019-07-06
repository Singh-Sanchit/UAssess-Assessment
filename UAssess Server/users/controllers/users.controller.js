const Users = require('../models/users.model');
const Token = require('../models/token.model');
const Invite = require('../models/invite.model');
const Companies = require('../models/company.model');
const md5 = require('md5');
const uuidv1 = require('uuid/v1');
const Fs = require('fs');
const nodemailer = require("nodemailer");
var validator = require('validator');
var Request = require('request');
require('../config/global');
require('../config/messages');

module.exports = {
    register: function(req, res, next){
        let input = req.body;
        let phoneRExp = /^[0-9]{10,12}$/;
        let privilegeRoles = ["UassessAdmin", "CompanyAdmin", "Assessee"];
        if(!("email" in input) || input.email.length == 0){
            return res.send({"code":"1", "message":EMAIL_REQUIRED, "data": input});
        }
        if(!validator.isEmail(input.email)){
            return res.send({"code":"1", "message":INVALID_EMAIL, "data": input});
        }else{
            input.email = input.email.toLowerCase();
        }
        if(!("password" in input) || input.password.length == 0){
            return res.send({"code":"1", "message":PASSWORD_REQUIRED, "data": input});
        }else if(input.password.length < 4){
            return res.send({"code":"1", "message":"Password required minimum 4 charactors", "data": input});
        }
        if(!("name" in input) || input.name == null || input.name.length == 0){
            return res.send({"code":"1", "message":NAME_REQUIRED, "data": input});
        }else if(typeof input.name !== "string"){
            return res.send({"code":"1", "message":"Invalid name, should contain only letters", "data": input});
        }
        if("phone" in input){ 
            if(!phoneRExp.test(input.phone)){
                return res.status(200).send({"code":"1", "message":INVALID_PHONE, "data":input});
            }
        }
        if("privilegeRole" in input && input.privilegeRole.length > 0){
            if(privilegeRoles.indexOf(input.privilegeRole) < 0){
                return res.send({"code":"1", "message": INVALID_PRIVILEGE_ROLE, "data": input});
            }
        }else{
            return res.send({"code":"1", "message":PRIVILEGE_ROLE_REQUIRED, "data": input});
        }
        input.userId = input.email;
        input.authType = 'Default';
        if(input.privilegeRole !== 'Assessee'){
            input.privilegeRoles = ["Assessee", input.privilegeRole];
            if(input.privilegeRole == "CompanyAdmin"){
                if(!("companyId" in input) || input.companyId.length == 0){
                    return res.send({"code":"1", "message":"Company Id required", "data": input});
                }else{
                    let hex = /^[0-9a-fA-F]{24}$/;
                    if(!hex.test(input.companyId)){
                        return res.send({"code":"1", "message":"Invalid Company Id", "data": input});
                    }else{
                        Companies.findById(input.companyId).then(function(result){
                            if(!result){
                                return res.send({"code":"1", "message":"Invalid Company Id", "data": input});
                            }else{
                                module.exports.addUser(input, function(response){
                                    return res.send(response);
                                })
                            }
                        }).catch((err)=>{
                            return res.send({"code":"1","message":err.message});
                        });
                    }
                }
            }else if(input.privilegeRole == "UassessAdmin"){
                if("companyId" in input){
                    delete input.companyId;
                }
                module.exports.addUser(input, function(response){
                    return res.send(response);
                })
            }
        }else{
            input.privilegeRoles = input.privilegeRole;
            module.exports.addUser(input, function(response){
                return res.send(response);
            })
        }
    },
    addUser: function(input, callback){
        Users.find({userId: input.email, authType: 'Default'}).then(function(resultA){
            if(resultA.length == 0){
                input.password = md5(input.password);
                Users.create(input).then(function(resultB){
                    if(resultB){
                        var tokenObj = {};
                        tokenObj.profileId = resultB._id;
                        if("pushNotificationId" in input){
                            tokenObj.pushNotificationId = input.pushNotificationId;
                        }
                        if("appVersion" in input){
                            tokenObj.appVersion = input.appVersion;
                        }
                        if("clientId" in input){
                            tokenObj.clientId = input.clientId;
                        }
                        tokenObj.token = uuidv1();
                        tokenObj.authType = input.authType;
                        Token.create(tokenObj).then(function(resultC){
                            if(resultC){
                                let resultBObj = resultB.toObject();
                                resultBObj.token = resultC.token;
                                delete resultBObj._id;
                                delete resultBObj.password;
                                delete resultBObj.authType;
                                delete resultBObj.userId;
                                delete resultBObj.role;                                                                      
                                delete resultBObj.updatedBy;
                                delete resultBObj.createdBy;
                                delete resultBObj.privilages;
                                callback({"code":"0", "message":"Success", "data":resultBObj});        
                            }
                        }).catch(function(err){
                            callback({"code":"1", "message":err.message});
                        })
                    }
                }).catch(function(err){
                    callback({"code":"1", "message":err.message});
                })
            }else{
                callback({"code":"1", "message":"User Exist, Please Login"});
            }
        }).catch(function(err){
            callback({"code":"1", "message":err.message});
        })
    },
    login: function(req, res){
        let input = req.body;
        let authType = ["Default", "Google", "LinkedIn", "Guest"];
        let phoneRExp = /^[0-9]{10,12}$/;
        if(!("clientId" in input) || input.clientId.length == 0){
            return res.send({"code":"1", "message":CLIENT_ID_REQUIRED, "data": input}); 
        }
        if("phone" in input){
            if(!phoneRExp.test(input.phone)){
                return res.status(200).send({"code":"1", "message":INVALID_PHONE, "data":input});
            }
        }
        if("authType" in input && input.authType.length > 0){
            if(authType.indexOf(input.authType) < 0){
                return res.send({"code":"1", "message":INVALID_AUTH_TYPE, "data": input}); 
            }
            if(input.authType == "Default"){
                input.userId = input.userId.toLowerCase();
                if(!("userId" in input) || input.userId.length == 0){
                    return res.send({"code":"1", "message":USER_ID_REQUIRED, "data": input});
                }
                if(!("password" in input) || input.password.length == 0){
                    return res.send({"code":"1", "message":PASSWORD_REQUIRED, "data": input});
                }
                Users.find({userId: input.userId, authType: input.authType}).then(function(resultA){
                    if(resultA.length == 1){
                        var resultA = resultA[0];
                        if(resultA.password == md5(input.password)){
                            var tokenObj = {};
                            tokenObj.token = uuidv1();
                            tokenObj.authType = input.authType;
                            tokenObj.profileId = resultA._id;
                            if("appVersion" in input){
                                tokenObj.appVersion = input.appVersion;
                            }
                            if("pushNotificationId" in input){
                                tokenObj.pushNotificationId = input.pushNotificationId;
                            }
                            if("clientId" in input){
                                tokenObj.clientId = input.clientId;
                            }
                            Token.create(tokenObj).then(function(resultB){
                                if(resultB){
                                    let resultBObj = resultA.toObject();
                                    resultBObj.token = resultB.token;
                                    delete resultBObj._id;
                                    delete resultBObj.password;
                                    delete resultBObj.role;
                                    delete resultBObj.authType;
                                    delete resultBObj.userId;
                                    delete resultBObj.updatedBy;
                                    delete resultBObj.createdBy;
                                    delete resultBObj.privilages;
                                    return res.send({"code":"0", "message":SUCCESS, "data":resultBObj});        
                                }
                            }).catch(function(err){
                                return res.send({"code":"1", "message": err.message});
                            })
                        }else{
                            return res.send({"code":"1", "message":"Password does not match", "data": input});
                        }
                    }else if(resultA.length > 1){
                        return res.send({"code":"1", "message":"Multiple user exist for same user ID", "data": input});
                    }else{
                        return res.send({"code":"1", "message":USER_NOT_EXIST, "data": input});
                    }
                }).catch(function(err){
                    return res.send({"code":"1", "message": err.message});
                })
            }else{
                Users.findOne({userId: input.userId, authType: input.authType}).then(function(resultA){
                    if(resultA){
                        if("phone" in input){
                            resultA.phone = input.phone;
                        }
                        if("name" in input){
                            resultA.name = input.name;
                        }
                        if(resultA.save(function(err){
                            var tokenObj = {};
                            tokenObj.profileId = resultA._id;
                            tokenObj.token = uuidv1();
                            tokenObj.authType = input.authType;
                            if("appVersion" in input){
                                tokenObj.appVersion = input.appVersion;
                            }
                            if("pushNotificationId" in input){
                                tokenObj.pushNotificationId = input.pushNotificationId;
                            }
                            if("clientId" in input){
                                tokenObj.clientId = input.clientId;
                            }
                            Token.create(tokenObj).then(function(resultB){
                                if(resultB){
                                    let resultBObj = resultA.toObject();
                                    resultBObj.token = resultB.token;
                                    delete resultBObj._id;
                                    delete resultBObj.password;
                                    delete resultBObj.role;
                                    delete resultBObj.authType;
                                    delete resultBObj.userId;
                                    delete resultBObj.updatedBy;
                                    delete resultBObj.createdBy;
                                    delete resultBObj.privilages;
                                    return res.send({"code":"0", "message":SUCCESS, "data":resultBObj});        
                                }
                            }).catch(function(err){
                                return res.send({"code":"1", "message":err.message});
                            })
                        }));             

                    }else{
                        if(!("userId" in input) || input.userId.length == 0){
                            return res.send({"code":"1", "message":USER_ID_REQUIRED, "data": input});
                        }
                        if(input.authType !== "Guest"){
                            if(!("email" in input) || input.email.length == 0){
                                return res.send({"code":"1", "message":EMAIL_REQUIRED, "data": input});
                            }
                            if("email" in input){
                                if(!validator.isEmail(input.email)){
                                    return res.send({"code":"1", "message":INVALID_EMAIL, "data": input});
                                }
                            }
                            if(!("name" in input) || input.name.length == 0){
                                return res.send({"code":"1", "message":NAME_REQUIRED, "data": input});
                            }
                            if(!("email" in input) || input.email.length == 0){
                                return res.send({"code":"1", "message":EMAIL_REQUIRED, "data": input});
                            }     
                        }
                        input.createdBy = "self";
                        input.privilegeRoles = "Assessee";
                        input.password = "null";
                        Users.create(input).then(function(resultB){
                            if(resultB){
                                var tokenObj = {};
                                tokenObj.profileId = resultB._id;
                                tokenObj.token = uuidv1();
                                tokenObj.authType = input.authType;
                                if("pushNotificationId" in input){
                                    tokenObj.pushNotificationId = input.pushNotificationId;
                                }
                                if("appVersion" in input){
                                    tokenObj.appVersion = input.appVersion;
                                }
                                if("clientId" in input){
                                    tokenObj.clientId = input.clientId;
                                }
                                Token.create(tokenObj).then(function(resultC){
                                    if(resultC){
                                        let resultBObj = resultB.toObject();
                                        resultBObj.token = resultC.token;
                                        delete resultBObj._id;
                                        delete resultBObj.password;
                                        delete resultBObj.authType;
                                        delete resultBObj.userId;
                                        delete resultBObj.role;                                                                      
                                        delete resultBObj.updatedBy;
                                        delete resultBObj.createdBy;
                                        delete resultBObj.privilages;
                                        return res.send({"code":"0", "message":SUCCESS, "data":resultBObj});        
                                    }
                                }).catch(function(err){
                                    return res.send({"code":"1", "message":err.message});
                                })
                            }
                        }).catch(function(err){
                            return res.send({"code":"1", "message":err.message});
                        })
                    }
                }).catch(function(err){
                    return res.send({"code":"1", "message":err.message});
                })
            }
        }else{
            return res.send({"code":"1", "message":AUTH_TYPE_REQUIRED, "data": input});
        }
    },
    getMyProfile: function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":"Token required", "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                Users.findById(profile.profileId).then(function(resultB){
                    if(resultB){
                        resultObj = resultB.toObject();
                        resultObj.id = resultObj._id;
                        resultObj.clientId = profile.clientId;
                        delete resultObj._id;
                        delete resultObj.password;
                        delete resultObj.companyId;
                        delete resultObj.createdBy;
                        delete resultObj.userId;
                        //delete resultObj.privilegeRoles;
                        //delete resultObj.authType;
                        return res.send({"code":"0", "message":SUCCESS, "data": resultObj});
                    }else{
                        return res.send({"code":"1", "message":INVALID_TOKEN, "data": input});
                    }
                }).catch(function(err){
                    return res.send({"code":"1", "message":err.message});
                })                
            }else{
                return res.send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },

    updateMyProfile: function(req, res){
        let input = req.body;

        if(!("token" in input) || input.token.length == 0){
                return res.send({"code":"1", "message":INVALID_TOKEN, "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                base64 = false;
                Users.findById(profile.profileId).then(function(resultB){
                    if(resultB){
                        let phoneRExp = /^[0-9]{10,12}$/;
                        if("name" in input){ resultB.name = input.name; }
                        if("phone" in input){
                            if(!phoneRExp.test(input.phone)){
                                return res.status(200).send({"code":"1", "message":INVALID_PHONE, "data":input});
                            }else{
                                resultB.phone = input.phone;
                            }
                        }
                        if("jobRole" in input){ resultB.jobRole = input.jobRole; }
                        //if("companyId" in input){ resultB.companyId = input.companyId; }
                        if("profileImage" in input){
                            if(input.profileImage.indexOf('http') < 0){
                                if(Buffer.from(input.profileImage, 'base64').toString('base64') !== input.profileImage){
                                    return res.status(200).send({"code":"1", "message":"Invalid Base64 or URL"});
                                }else{
                                    base64 = true;                        
                                }
                            }else{
                                resultB.profileImage = input.profileImage;
                            }
                        }
                        resultB.save(function(err){
                            if(!err){
                                resultObj = resultB.toObject();
                                resultObj.id = resultObj._id;
                                delete(resultObj._id);
                                delete resultObj.password;
                                delete resultObj.companyId;
                                delete resultObj.userId;
                                delete resultObj.privilegeRoles;
                                delete resultObj.authType;
                                delete resultObj.createdBy;
                                if(base64){
                                    var path = 'profileImages/'+resultB._id+'.jpg';
                                    Fs.writeFile('public/'+path, input.profileImage, 'base64', function(err){
                                        if(!err){
                                            var url = server_base_url+"/3000/"+path;
                                            resultB.profileImage = url;
                                            resultObj.profileImage = url;
                                            resultB.save(function(err){                                                    
                                                if(!err){                                                        
                                                    return res.send({"code":"0", "message":UPDATED_SUCCESS, "data": resultObj});
                                                }
                                            })
                                        }else { console.log("Image not uploaded");}
                                    })
                                }else{
                                    return res.send({"code":"0", "message":UPDATED_SUCCESS, "data": resultObj});
                                }
                            }else{
                                return res.send({"code":"0", "message":SUCCESS, "data": input});
                            }
                        })
                    }
                }).catch(function(err){
                    return res.send({"code":"1", "message":err.message});
                })
        
            }else{
                return res.send({"code":"1", "message":INVALID_TOKEN, "data": input});
            }
        })
    },
    changeMyPassword: function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("currentPassword" in input) || input.currentPassword.length == 0){
            return res.send({"code":"1", "message":"Current Password required", "data": input});
        }
        if(!("newPassword" in input) || input.newPassword.length == 0){
            return res.send({"code":"1", "message":"New Password required", "data": input});
        }
        if(input.newPassword.length < 4){
            return res.send({"code":"1", "message":"New Password length should be min 4", "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                Users.findById(profile.profileId).then(function(resultB){
                    if(resultB.authType == 'Default'){
                        if(resultB.password == md5(input.currentPassword)){
                            resultB.password = md5(input.newPassword);
                            resultB.save(function(err){
                                if(!err){
                                    return res.send({"code":"0", "message":"Password changed Successfully"});
                                }else{
                                    return res.send({"code":"1", "message":"Password not updated", "data": input});
                                }
                            })
                        }else{
                            return res.send({"code":"1", "message":"Incorrect current password", "data": input});
                        }
                    }else{
                        return res.send({"code":"1", "message":"Can not change password for social logins", "data": input});
                    }
                })
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    inviteAdmin: function(req, res){
        let input = req.body;
        let privilegeRoles = ["UassessAdmin", "CompanyAdmin"];
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if("privilegeRole" in input && input.privilegeRole.length > 0){
            if(privilegeRoles.indexOf(input.privilegeRole) < 0){
                return res.send({"code":"1", "message":INVALID_PRIVILEGE_ROLE, "data": input});
            }
        }else{
            return res.send({"code":"1", "message":PRIVILEGE_ROLE_REQUIRED, "data": input});
        }
        if(!("email" in input) || input.email.length == 0){
            return res.send({"code":"1", "message":EMAIL_REQUIRED, "data": input});
        }
        if(input.privilegeRole == "CompanyAdmin"){
            if(!("companyId" in input) || input.companyId.length == 0){
                return res.send({"code":"1", "message":"companyId required", "data": input});
            }
            Invite.find({email: input.email, privilegeRole: input.privilegeRole, companyId: input.companyId}).then(function(resultA){
                if(resultA.length == 0){
                    //input.invitedBy = input.token;
                    Invite.create(input).then(function(result){
                        if(result){
                            var data = {};
                            data.toEmail = input.email;
                            url = base_url+":3000/register?id="+result._id;
                            role = "Company Admin";
                            data.message = "<h2>Hi,</h2><br><div>You are Invited as "+role+" please <a href="+url+">click here</a> to register <br><br>Regards,<br>Appzoy Ltd";
                            data.subject = "Invitation from Uassess";
                            var email = module.exports.sendMail(data);
                            email.then(function(result){
                                console.log(result);
                                return res.send({"code":"0"});
                            }).catch(console.error);
                        }
                    })
                }else{
                    var data = {};
                    var inviteObj = resultA[0].toObject();
                    data.toEmail = input.email;
                    url = base_url+":3000/register?id="+inviteObj._id;
                    role = "Company Admin";
                    data.message = "<h2>Hi,</h2><br><div>You are Invited as "+role+" please <a href="+url+">click here</a> to register <br><br>Regards,<br>Appzoy Ltd";
                    data.subject = "Invitation from Uassess";
                    var email = module.exports.sendMail(data);
                    email.then(function(result){
                        console.log(result);
                        return res.send({"code":"0"});
                    }).catch(console.error);
                }
            })
        }else{
            Invite.find({email: input.email, privilegeRole: "UassessAdmin"}).then(function(resultA){
                if(resultA.length == 0){
                    Invite.create(input).then(function(result){
                        if(result){
                            var data = {};
                            data.toEmail = input.email;
                            url = base_url+":3000/register?id="+result._id;
                            role = "Uassess Admin";
                            data.message = "<h2>Hi,</h2><br><div>You are Invited as "+role+" please <a href="+url+">click here</a> to register <br><br>Regards,<br>Appzoy Ltd";
                            data.subject = "Invitation from Uassess";
                            var email = module.exports.sendMail(data);
                            email.then(function(result){
                                console.log(result);
                                return res.send({"code":"0"});
                            }).catch(console.error);
                        }
                    })
                }else{
                    var data = {};
                    var inviteObj = resultA[0].toObject();
                    data.toEmail = input.email;
                    url = base_url+":3000/register?id="+inviteObj._id;
                    role = "Uassess Admin";
                    data.message = "<h2>Hi,</h2><br><div>You are Invited as "+role+" please <a href="+url+">click here</a> to register <br><br>Regards,<br>Appzoy Ltd";
                    data.subject = "Invitation from Uassess";
                    var email = module.exports.sendMail(data);
                    email.then(function(result){
                        console.log(result);
                        return res.send({"code":"0"});
                    }).catch(console.error);
                }
            })
        }
    },
    inviteAssessee: function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("licenseKey" in input) || input.licenseKey.length == 0){
            return res.send({"code":"1", "message":"License Key required", "data": input});
        }
        if(!("emailIds" in input) || input.emailIds.length == 0){
            return res.send({"code":"1", "message":"email Ids required", "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1 || profile.privilegeRoles.indexOf("CompanyAdmin")>-1){
                    var data = {};
                    if(typeof input.emailIds == 'string'){
                        data.toEmail = input.emailIds;
                    }else{
                        data.toEmail = input.emailIds.toString();
                    }
                    url = "https://play.google.com/store/apps/details?id=com.ipl.assessnow&hl=en&referrer="+input.licenseKey;
                    data.message = "<h4>Hi,</h4><p>You are invited for new Assessment, use <b>"+input.licenseKey+"</b> as your key.</p><p><a href='"+url
                    +"'>Download App Now</a></p><br><p>Thanks and Regards,<br>Uassess Team</p>";
                    data.subject = "Invitation from Uassess";
                    var email = module.exports.sendMail(data);
                    email.then(function(result){
                        console.log(result);
                        return res.send({"code":"0", "message":"Email sent successfully"});
                    }).catch(console.error);
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },

    inviteAssesseeLoop: function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("licenseKey" in input) || input.licenseKey.length == 0){
            return res.send({"code":"1", "message":"License Key required", "data": input});
        }
        if(!("emailIds" in input) || input.emailIds.length == 0){
            return res.send({"code":"1", "message":"email Ids required", "data": input});
        }
        if(typeof input.emailIds !== 'string'){
            return res.send({"code":"1", "message":"Email Ids should be in string", "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                //url = "https://play.google.com/store/apps/details?id=com.ipl.assessnow&hl=en";
                appDownloadLink = "https://play.google.com/store/apps/details?id=com.ipl.assessnow&hl=en&referrer="+input.licenseKey;
                if(server_base_url == "https://api.uassess.com"){
                    webAssessmentLink = "https://app.uassess.com/login/"+input.licenseKey;
                }else{
                    webAssessmentLink = "http://"+base_url+":8081/login/"+input.licenseKey;
                }
                var emailArr = input.emailIds.split(',');
                var emailIdsArr = [];
                emailArr.forEach((element, index) => {
                    var nameEmail = element.split(' ');
                    if(nameEmail.length > 2){
                        return res.send({"code":"1", "message":"Please provide single name, eg : 'example example@uassess.com'", "data": input});
                    }else if(nameEmail.length == 2){
                        emailIdsArr.push(nameEmail[1])
                    }else{
                        emailIdsArr.push(nameEmail[0])
                    }
                    if(Object.is(emailArr.length -1 , index)){
                        let params = input;
                        params.emailIds = emailIdsArr;
                        Request.post({
                            "headers": { "content-type": "application/json" },
                            "url": "http://"+base_url+":3003/api/add-participants",
                            "body": JSON.stringify(params)
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
                    }
                });    
        
                emailArr.forEach((element, key) => {
                    var data = {};
                    var assessee = element.split(' ');
                    //console.log(assessee.length);
                    if(assessee.length > 1){
                        //console.log(assessee);
                        data.message = "<h4>Hi "+assessee[0]+",</h4><p>You are invited for new Assessment, use <b>"+input.licenseKey+"</b> as your key.</p><p>Take an assessment from the <a href='"+webAssessmentLink+"' style='color:#1078a3'>Web Assessment Link</a></p><br><p>Thanks and Regards,<br>Uassess Team</p>";
                    }else{
                        data.message = "<h4>Hi,</h4><p>You are invited for new Assessment, use <b>"+input.licenseKey+"</b> as your key.</p><p>Take an assessment from the <a href='"+webAssessmentLink+
                        "' style='color:#1078a3'>Web Assessment Link</a></p><br><p>Thanks and Regards,<br>Uassess Team</p>";
                    }
                    data.toEmail = element;
                    data.subject = "Invitation from Uassess";
                    var email = module.exports.sendMail(data);
                    email.then(function(result){
                        console.log(result);
                    }).catch(console.error);

                    if(Object.is(emailArr.length - 1, key)) {
                        console.log(key); 
                        return res.send({"code":"0", "message":"Emails sent successfully"});
                    }
                });
            }else{
                return res.send({"code":"1", "message":INVALID_TOKEN, "data": input});
            }
        });
    },


    registerCommon: function(req, res){
        let input = req.body;
        let privilegeRoles = ["uassessAdmin", "companyAdmin", "assessee"];
        if("privilegeRole" in input){
            if(input.privilegeRole.length > 0){
                if(privilegeRoles.indexOf(input.privilegeRole) < 0){
                    return res.send({"code":"1", "message":INVALID_PRIVILEGE_ROLE, "data": input});
                }
            }
        }else{
            return res.send({"code":"1", "message":PRIVILEGE_ROLE_REQUIRED, "data": input});
        }
        if(!("userId" in input) || input.userId.length == 0){
            return res.send({"code":"1", "message":USER_ID_REQUIRED, "data": input});
        }
        if(!("password" in input) || input.password.length == 0){
            return res.send({"code":"1", "message":PASSWORD_REQUIRED, "data": input});
        }
        input.userId = input.email;
        input.authType = 'Default';
        input.privilegeRoles = ['Assessee'];
        Users.find({userId: input.userId, authType: 'Default'}).then(function(resultA){
            if(resultA.length == 0){
                input.password = md5(input.password);
                Users.create(input).then(function(resultB){
                    if(resultB){
                        return res.send({"code":"0", "message":SUCCESS});
                    }
                }).catch(function(err){
                    return res.send({"code":"1", "message":err.message});
                })
            }else{
                return res.send({"code":"1", "message":"User Exist, Please Login"});
            }
        })
    },
    
    logout: function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }else{
            Token.findOneAndDelete({token: input.token}).then(function(result){
                if(result){
                    return res.send({"code":"0", "message":SUCCESS});
                }else{
                    return res.send({"code":"1", "message":INVALID_TOKEN, "data": input});
                }
            }).catch(function(err){
                return res.send({"code":"1", "message":err.message});
            })
        }
    },
    // validateToken: async function(token){
    //     try{
    //         var active = await (Token.find({token: token}).exec());
    //         if(active.length > 0){
    //             return true;
    //         }else{
    //             return false;
    //         }
    //     } catch (e){
    //         return false;
    //     }
    // },
    sendMail: async function(data){

        console.log(data);
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let account = await nodemailer.createTestAccount();
      
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "uassess.com",
          //port: 587,
          port:465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: email_from,
            pass: email_pass
          }
        });
      
        // setup email data with unicode symbols
        let mailOptions = {
          from: '"UAssess 👻" <'+email_from+'>', // sender address
          to: data.toEmail, // list of receivers
          subject: data.subject, // Subject line
          //text: "You are Invited as "+data.role+" please click the url to register : "+ data.url, // plain text body
          html: data.message  // html body
        };
      
        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions)
      
        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    },

    getGuestProfileIds: function(req, res){
        let input = req.body;
        // console.log(input);
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("clientId" in input) || input.clientId.length == 0){
            return res.send({"code":"1", "message":CLIENT_ID_REQUIRED, "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                    Token.find({"clientId":input.clientId, "authType":"Guest"}).then(function(resultB){
                        if(resultB){
                            let profileIds = [];
                            if(resultB.length >0){
                                resultB.forEach((ele, index)=>{
                                    resultObj = ele.toObject();
                                    profileIds.push(resultObj.profileId);
                                    if(Object.is(resultB.length -1, index)){
                                        return res.send({"code":"0", "message":SUCCESS, "data": profileIds});
                                    }
                                })
                            }else{
                                return res.send({"code":"0", "message":SUCCESS, "data": profileIds});
                            }
                        }else{
                            return res.send({"code":"1", "message":"Something went wrong", "data": input});
                        }
                    }).catch(function(err){
                        return res.send({"code":"1", "message":err.message});
                    })
                }else{
                    return res.send({"code":"1", "message":INVALID_TOKEN, "data": input});
                }
            })
    },
    deleteGuestProfiles: function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("profileIds" in input) || input.profileIds.length == 0){
            return res.send({"code":"1", "message":"Profile IDs required", "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                Users.deleteMany({"_id":{ $in: input.profileIds }, "authType":"Guest"}).then(function(resultB){
                    if(resultB){
                        return res.send({"code":"0", "message":SUCCESS});
                    }else{
                        return res.send({"code":"1", "message":"Something went wrong", "data": input});
                    }
                }).catch(function(err){
                    return res.send({"code":"1", "message":err.message});
                })
            }else{
                return res.send({"code":"1", "message":INVALID_TOKEN, "data": input});
            }
        })
    },

    getArrayOfemails: function(req, res){
        return res.send({"licenseKey":"123456", "emailIds":["Deeba deeba@appzoy.com", "Kavitha kavitha@appzoy.com", "Nagaraj nagaraj@appzoy.com"]});
    },

    getUsersProfile: function(req, res){
        let input = req.body;
        Users.find({'_id': {$in:input.profileIds}}).select('name email').then(function(result){
            console.log(result);
            if(result){
                let profiles = [];
                result.forEach((ele, i)=>{
                    resultObj = ele.toObject();
                    resultObj.id = resultObj._id;
                    delete resultObj._id;
                    profiles.push(resultObj);
                    if(Object.is(result.length -1, i)){
                        return res.send({"code":"0", "message":SUCCESS, "data": profiles});
                    }
                    })
            }else{
                return res.send({"code":"1", "message":FAIL, "data": input});
            }
        }).catch(function(err){
            return res.send({"code":"1", "message":err.message});
        })
    },
    getPushNotificationId: function(req, res){

        Token.findOne({'token': req.body.token}).select('pushNotificationId').then(function(result){
            console.log(result);
            if(result){
                return res.send({"code":"0", "message":SUCCESS, "data": result});
            }else{
                return res.send({"code":"1", "message":FAIL, "data": input});
            }
        }).catch(function(err){
            return res.send({"code":"1", "message":err.message});
        })
    },
    sendFeedback: function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("name" in input) || input.name.length == 0){
            return res.send({"code":"1", "message":"Name required", "data": input});
        }
        if(!("email" in input) || input.email.length == 0){
            return res.send({"code":"1", "message":"Email required", "data": input});
        }
        if(!("subject" in input) || input.subject.length == 0){
            return res.send({"code":"1", "message":"Subject required", "data": input});
        }
        if(!("message" in input) || input.message.length == 0){
            return res.send({"code":"1", "message":"Message required", "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                let input = req.body;
                var data = {};
                data.toEmail = "info@uassess.com";
                data.subject = "Customer Feedback";
                data.message = "<div><p>Name: "+input.name+"</p><p>Email: "+input.email+"</p><p>Subject: "+input.subject+"</p><p>Message: "+input.message+"</p></div>";
                var email = module.exports.sendMail(data);
                email.then(function(result){
                    console.log(result);
                    return res.send({"code":"0", "message":"Thanks for Feedback"});
                }).catch(console.error);
            }
        });
    },    
    validateToken: function(token, callback){
        Token.findOne({"token":token}).then(function(response){
            if(response !== null){
                if("profileId" in response){
                    callback(response);
                }else{
                    callback(false);
                }
            }else{
                callback(false);
            }
        });
    }
}