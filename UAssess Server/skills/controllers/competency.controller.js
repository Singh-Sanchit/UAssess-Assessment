const Competencies = require('../models/competency.model');
const Skills = require('../models/skill.model');
const Request = require('request');
require('../config/messages');

module.exports = {
    createCompetencies: function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("competencies" in input) || input.competencies.length == 0){
            return res.send({"code":"1", "message":"Competencies required", "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    var compArr = [];
                    var labelArr = [];
                    input.competencies.forEach(element => {
                        element.createdBy = profile.id;
                        compArr.push(element);
                        if(labelArr.indexOf(element.label) > -1){
                            return res.status(200).send({ "code": "1", "message": "Competency label exist multiple times in the requests", "data": element});
                        }
                        if("description" in element){
                            if(typeof element.description !== 'string'){
                                return res.status(200).send({ "code": "1", "message": "Description should be a string", "data": element});
                            }
                        }
                        labelArr.push(element.label);
                    });
                    if(labelArr.length > 0){
                        Competencies.findOne({ label: { $in: labelArr } }).then(function(result){
                            if(result !== null){
                                var resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                return res.status(200).send({ "code": "1", "message": "Competency exist", "data": resultObj});
                            }else{
                                Competencies.insertMany(compArr).then(function(result){
                                    if(result){
                                        var resultArr = [];
                                        result.forEach((row, index)=>{
                                            var resultObj = row.toObject();
                                            resultObj.id = resultObj._id;
                                            delete resultObj._id;
                                            resultArr.push(resultObj);
                                            if(Object.is(result.length -1, index)){
                                                return res.status(200).send({ "code": "0", "message": CREATED_SUCCESS, "data": resultArr});
                                            }
                                        })
                                    }
                                });
                            }
                        }).catch(function(err){
                            return res.status(200).send({ "code": "1", "message": err.message, "data": input});
                        });
                    }         
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    updateCompetency: function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("competencyId" in input) || input.competencyId.length == 0){
            return res.send({"code":"1", "message":"Competency Id required", "data": input});
        }

        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    if("label" in input){
                        if(typeof input.label !== 'string'){
                            return res.status(200).send({ "code": "1", "message": "Label not valid, must be a string", "data": input});
                        }
                        if(input.label.length > 0){
                            Competencies.countDocuments({ label: input.label, _id: { $ne: input.competencyId}}).then(function(count){
                                if(count > 0){
                                    return res.status(200).send({ "code": "1", "message": "Label already exist", "data": input});
                                }
                            })
                        }
                    }
            
                    Competencies.findById(input.competencyId).then(function(result){
                        if(result == null){
                            return res.status(200).send({ "code": "1", "message": "competency not exist", "data": input});
                        }else{
                            if("label" in input){ result.label = input.label; }
                            if("description" in input){
                                if(typeof input.description !== 'string'){
                                    return res.status(200).send({ "code": "1", "message": "Description not valid, must be a string", "data": input});
                                }else{
                                    result.description = input.description;
                                }
                            }
                        
                            if(input.subCompetencyIds && input.subCompetencyIds.length > 0){
                                if(input.subCompetencyIds.indexOf("") > -1 || input.subCompetencyIds.indexOf(null) > -1 ){
                                    return res.status(200).send({ "code": "1", "message": "sub competencies contains empty", "data": input});
                                }else{
                                    result.subCompetencyIds = input.subCompetencyIds;
                                }
                            }                        
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
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Competency ID not valid", "data": input});
                    });            
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
        
    },
    getCompetencies : function(req, res){
        let input = req.body;
        let filters = {};
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("active" in input) || input.active.length == 0){
            return res.send({"code":"1", "message":"Active field is required", "data": input});
        }else{
            if(input.active !== false && input.active !== true ){
                return res.send({"code":"1", "message":"Invalid Active values, It should be true/false", "data": input});
            }
        }
        filters.active = input.active;
        if("ids" in input){
            if(input.ids.length > 0){
                filters._id = {$in:input.ids};
            }
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                // if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    Competencies.find(filters).then(function(result){
                        if(result.length == 0){
                            return res.status(200).send({ "code": "0", "message": "Success", "data": []});
                        }else{
                            var resultArr = [];
                            result.forEach((row, index)=>{
                                var resultObj = row.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                resultArr.push(resultObj);
                                if(Object.is(result.length -1, index)){
                                    return res.status(200).send({ "code": "0", "message": "Success", "data": resultArr});
                                }
                            })
                        }
                    }).catch(function(err){
                        return res.status(200).send({ "code": "1", "message": err.message, "data": input});
                    });
                // }else{
                //     return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                // }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    updateStatus : function(req, res){
        var input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("competencyId" in input) || input.competencyId.length == 0){
            return res.send({"code":"1", "message":"Competency Id required", "data": input});
        }
        if(!("active" in input) || input.active.length == 0){
            return res.send({"code":"1", "message":"Active field is required", "data": input});
        }else{
            if(input.active !== false && input.active !== true ){
                return res.send({"code":"1", "message":"Invalid Active values, It should be true/false", "data": input});
            }
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    Competencies.findById(input.competencyId).then(function(result){
                        if(result == null){
                            return res.status(200).send({ "code": "1", "message": "Competency not exist", "data": input});
                        }else{
                            result.active = input.active;
                            result.updatedBy = profile.id;
                            result.save(function(){
                                var resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                if(input.active){
                                    return res.status(200).send({ "code": "0", "message": "Competency Activated", "data": resultObj});
                                }else{
                                    return res.status(200).send({ "code": "0", "message": "Competency Deactivated", "data": resultObj});
                                }
                            });
                        }
                    }).catch(function(){
                        return res.status(200).send({ "code": "1", "message": "Competency ID not valid", "data": input});
                    });
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
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