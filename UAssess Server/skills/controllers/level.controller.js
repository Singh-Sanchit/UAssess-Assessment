const Levels = require('../models/level.model');
const Request = require('request');
require('../config/messages');

module.exports = {
    createLevel : function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("label" in input) || input.label.length == 0){
            return res.send({"code":"1", "message":LABEL_REQUIRED, "data": input});
        }else{
            if(typeof input.label !== 'string'){
                return res.status(200).send({ "code": "1", "message": "Label not valid, must be a string", "data": input});
            }
        }
        if(!("levelNo" in input) || input.levelNo.length == 0){
            return res.send({"code":"1", "message":"Level Number required", "data": input});
        }
        if(!("time" in input) || input.time.length == 0){
            return res.send({"code":"1", "message":"Time required", "data": input});
        }else{
            if(typeof input.time !== 'string'){
                return res.status(200).send({ "code": "1", "message": "Time not valid, must be a string", "data": input});
            }
            var pattern = /^\d{1,3}$/;
            if(pattern.test(input.time) == false){
                return res.status(200).send({ "code": "1", "message": "Time not valid, must be a three digit number", "data": input});
            }
        }
        if("description" in input){
            if(typeof input.description !== 'string'){
                return res.status(200).send({ "code": "1", "message": "Description not valid, must be a string", "data": input});
            }
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    Levels.findOne({label: input.label}).then(function(result){
                        if(result == null){
                            input.createdBy = profile.id;
                            Levels.create(input).then(function(result){
                                if(result){
                                    var resultObj = result.toObject();
                                    resultObj.id = resultObj._id;
                                    delete resultObj._id;
                                    return res.status(200).send({ "code": "0", "message": CREATED_SUCCESS, "data": resultObj});
                                }else{
                                    return res.status(200).send({ "code": "1", "message": FAIL, "data": input});
                                }
                            });                
                        }else{
                            input.id = result._id;
                            return res.status(200).send({ "code": "1", "message": EXIST, "data": input});
                        }
                    });
                }else{
                    return res.send({"code":"1", "message": PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },

    updateLevel : function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("levelId" in input) || input.levelId.length == 0){
            return res.send({"code":"1", "message":"Level Id required", "data": input});
        }
        if("levelNo" in input){
            if(typeof input.levelNo !== 'number'){
                return res.status(200).send({ "code": "1", "message": "Level number not valid, must be a integer", "data": input});
            }
        }
        if("time" in input){
            if(typeof input.time !== 'string'){
                return res.status(200).send({ "code": "1", "message": "Label not valid, must be a string", "data": input});
            }
            if(input.time.length != 2 || /^\d+$/.test(input.time) == false){
                return res.status(200).send({ "code": "1", "message": "Time not valid, must be a two digit number", "data": input});
            }
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){   
                    if("label" in input){
                        if(typeof input.label !== 'string'){
                            return res.status(200).send({ "code": "1", "message": "Label not valid, must be a string", "data": input});
                        }
                        if(input.label.length > 0){
                            Levels.countDocuments({ label: input.label, _id: { $ne: input.levelId}}).then(function(count){
                                if(count > 0){
                                    return res.status(200).send({ "code": "1", "message": "Level already exist", "data": input});
                                }
                            })
                        }
                    }             
                    Levels.findById(input.levelId).then(function(result){
                        if(result == null){
                            return res.status(200).send({ "code": "1", "message": "Level not exist", "data": input});
                        }
                        else{
                            if("label" in input){ result.label = input.label; }
                            if("levelNo" in input){ result.levelNo = input.levelNo; }
                            if("description" in input){ result.description = input.description; }
                            result.updatedBy = profile.id;
                            result.save(function(error){
                                if(!error){
                                    var resultObj = result.toObject();
                                    resultObj.id = resultObj._id;
                                    delete resultObj._id;
                                    return res.status(200).send({ "code": "0", "message": UPDATED_SUCCESS, "data": resultObj});
                                }else{
                                    return res.status(200).send({ "code": "1", "message": FAIL, "data": input});
                                }
                            });
                        }
                    }).catch(function(err){
                        return res.status(200).send({ "code": "1", "message": err.message, "data": input});
                    });
                }else{
                    return res.send({"code":"1", "message": PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    getLevels : function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("active" in input)){
            return res.send({"code":"1", "message":ACTIVE_REQUIRED, "data": input});
        }
        if(input.active !== false && input.active !== true ){
            return res.send({"code":"1", "message":INVALID_ACTIVE_VALUE, "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    Levels.find({ active : input.active }).then(function(result){
                        if(result == null){
                            return res.status(200).send({ "code": "1", "message": NOT_EXIST, "data": input});
                        }else{
                            var resultArr = [];
                            result.forEach((row, index)=>{
                                var resultObj = row.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                resultArr.push(resultObj);
                                if(Object.is(result.length -1, index)){
                                    return res.status(200).send({ "code": "0", "message": SUCCESS, "data": resultArr});
                                }
                            })
                        }
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Level ID not valid", "data": input});
                    });
                }else{
                    return res.send({"code":"1", "message": PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    updateStatus : function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("levelId" in input) || input.levelId.length == 0){
            return res.send({"code":"1", "message":"Level Id required", "data": input});
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
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    Levels.findById(input.levelId).then(function(result){
                        if(result == null){
                            return res.status(200).send({ "code": "1", "message": "Level not exist", "data": input});
                        }else{
                            result.active = input.active;
                            result.updatedBy = profile.id;
                            result.save(function(){
                                var resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                if(input.active){
                                    return res.status(200).send({ "code": "0", "message": ACTIVATED, "data": resultObj});
                                }else{
                                    return res.status(200).send({ "code": "0", "message": DEACTIVATED, "data": resultObj});
                                }
                            });
                        }
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Level ID not valid", "data": input});
                    });
                }else{
                    return res.send({"code":"1", "message": PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
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