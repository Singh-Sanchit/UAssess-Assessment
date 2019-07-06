const Companies = require('../models/company.model');
const Token = require('../models/token.model');
const Users = require('../models/users.model');
const Fs = require('fs');
require('../config/messages');

module.exports = {
    createCompanyProfile: function(req, res){
        let input = req.body;
        //const phonePattern = /^\+?\d*\ ?\d*$/; // eg: +91 9080
        let phonePattern = /^[0-9]{10,12}$/;
        let base64 = false;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    if(!("name" in input) || input.name.length == 0){
                        return res.send({"code":"1", "message":"Company name required", "data": input});
                    }
                    if(!("manager" in input) || input.manager.length == 0){
                        return res.send({"code":"1", "message":"Manager name required", "data": input});
                    }
                    if(!("phone" in input)){
                        return res.send({"code":"1", "message":PHONE_NUMBER_REQUIRED, "data": input});
                    }else if(phonePattern.test(input.phone) == false){
                        return res.send({"code":"1", "message":INVALID_PHONE, "data": input});
                    }
                    if(!("country" in input) || input.country.length == 0){
                        return res.send({"code":"1", "message":"Country name required", "data": input});
                    }
                    if(!("region" in input) || input.region.length == 0){
                        return res.send({"code":"1", "message":"Region name required", "data": input});
                    }
                    if(!("logo" in input) || input.logo.length == 0){
                        return res.send({"code":"1", "message":"Logo required as URL / Base64", "data": input});
                    }
                    if("logo" in input && input.logo.length !== 0){
                        if(input.logo.indexOf('http') < 0){
                            if(Buffer.from(input.logo, 'base64').toString('base64') !== input.logo){
                                return res.status(200).send({"code":"1", "info":"", "message":"Invalid Base64 Logo"});
                            }else{
                                base64 = true;                        
                            }
                        }
                    }
                    Companies.find({name: input.name}).then(function(resultA){
                        if(resultA.length == 0){
                            input.createdBy = profile._id;
                            Companies.create(input).then(function(resultB){
                                if(resultB){
                                    resultObj = resultB.toObject();
                                    resultObj.id = resultObj._id;
                                    delete(resultObj._id);
                                    if(base64){
                                        var path = 'companyLogos/'+resultObj.id+'.jpg';
                                        Fs.writeFile('public/'+path, input.logo, 'base64', function(err){
                                            if(!err){
                                                var logoUrl = server_base_url+"/3000/"+path;
                                                resultB.logo = logoUrl;
                                                resultB.save(function(){
                                                    resultObj.logo = logoUrl;
                                                    return res.send({"code":"0", "message": SUCCESS, "data": resultObj});
                                                })
                                            }else { console.log("logo not uploaded");}
                                        })
                                    }else{
                                        return res.send({"code":"0", "message":SUCCESS, "data": resultObj});
                                    }
                                }
                            }).catch(function(errB){
                                return res.send({"code":"1", "message":FAIL, "data":errB});
                            })
                        }else{
                            return res.send({"code":"1", "message":"Company exist", "data":input});
                        }
                    }).catch(function(errA){
                        return res.send({"code":"1", "message":FAIL, "data":errA});
                    })
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    updateCompanyProfile: function(req, res){
        let input = req.body;
        let phonePattern = /^[0-9]{10,12}$/;
        let base64 = false;

        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    if(!("id" in input) || input.id.length == 0){
                        return res.send({"code":"1", "message":"Company Id required", "data": input});
                    }
                    if(!("name" in input) || input.name.length == 0){
                        return res.send({"code":"1", "message":"Company name required", "data": input});
                    }
                    if("name" in input){
                        if(input.name.length == 0){
                            return res.send({"code":"1", "message":"Company name required", "data": input});
                        }
                    }
                    if("manager" in input){
                        if(input.manager.length == 0){
                            return res.send({"code":"1", "message":"Manager name required", "data": input});
                        }
                    }
                    if("phone" in input){
                        if(input.phone.length <= 5){
                            return res.send({"code":"1", "message":PHONE_NUMBER_REQUIRED, "data": input});
                        }
                        if(phonePattern.test(input.phone) == false){
                            return res.send({"code":"1", "message":INVALID_PHONE, "data": input});
                        }
                    }
                    if("country" in input ){
                        if(input.country.length == 0){
                            return res.send({"code":"1", "message":"Country name required", "data": input});
                        }
                    }
                    if("region" in input){
                        if(input.region.length == 0){
                            return res.send({"code":"1", "message":"Region name required", "data": input});
                        }
                    }
                    if("logo" in input && input.logo.length !== 0){
                        if(input.logo.indexOf('http') < 0){
                            if(Buffer.from(input.logo, 'base64').toString('base64') !== input.logo){
                                return res.status(200).send({"code":"1", "info":"", "message":"Invalid Base64 Logo"});
                            }else{
                                base64 = true;                        
                            }
                        }
                    }
                    Companies.findById(input.id).then(function(resultA){
                        if(resultA){
                            Companies.countDocuments({ name: input.name, _id: { $ne: input.id}}).then(function(resultB){
                                if(resultB == 0){
                                    resultA.name = input.name;
                                    resultA.updatedBy = profile._id;
                                    if("license" in input){ resultA.license = input.license; }
                                    if("phone" in input){ resultA.phone = input.phone; }
                                    if("bu" in input){ resultA.bu = input.bu; }
                                    if("manager" in input){ resultA.manager = input.manager; } 
                                    if("country" in input){ resultA.country = input.country; }
                                    if("region" in input){ resultA.region = input.region; }
                                    if("logo" in input){
                                        if(input.logo.indexOf('http') >= 0){
                                            resultA.logo = input.logo;
                                        }
                                    }
                                    resultA.save(function(err){
                                        if(!err){
                                            resultObj = resultA.toObject();
                                            resultObj.id = resultObj._id;
                                            delete(resultObj._id);
                                            if(base64){
                                                var path = 'companyLogos/'+resultA._id+'.jpg';
                                                Fs.writeFile('public/'+path, input.logo, 'base64', function(err){
                                                    if(!err){
                                                        var logoUrl = server_base_url+"/3000/"+path;
                                                        resultObj.logo = logoUrl;
                                                        resultA.save(function(){
                                                            return res.send({"code":"0", "message":UPDATED_SUCCESS, "data": resultObj});
                                                        })
                                                    }else { console.log("logo not uploaded");}
                                                })
                                            }else{
                                                return res.send({"code":"0", "message":UPDATED_SUCCESS, "data": resultObj});
                                            }        
                                        }
                                    })
                                }else{
                                    return res.send({"code":"1", "message":"Company exist with same name", "data":input});
                                }
                            }).catch(function(errB){
                                return res.send({"code":"1", "message":FAIL, "data":errB});
                            })             
                        }else{
                            return res.send({"code":"1", "message":"Company not exist", "data":input});
                        }
                    }).catch(function(errA){
                        return res.send({"code":"1", "message":FAIL, "data":errA});
                    })    
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    getCompanies: function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("UassessAdmin")>-1){
                    filters = {};
                    if("country" in input && input.country !== null){
                        if(input.country.length > 0){
                            filters.country = input.country;
                        }
                    }
                    if("region" in input  && input.region !== null){
                        if(input.region.length > 0){
                            filters.region = input.region;
                        }
                    }
                    Companies.find(filters).then(function(result){
                        var newResult = [];
                        if(result.length > 0){
                            result.forEach(function(row, index){
                                var resultObj = row.toObject();
                                resultObj.id = row._id;
                                delete resultObj._id;
                                newResult.push(resultObj);
                                if(Object.is(result.length -1, index)){
                                    return res.send({"code":"0", "message":SUCCESS, "data":newResult});
                                }
                            })
                        }else{
                            return res.send({"code":"0", "message":SUCCESS, "data":newResult});
                        }
                    }); 
                }else{
                    return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    getCompanyProfile: function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("companyId" in input) || input.companyId.length == 0){
            return res.send({"code":"1", "message":"CompanyId required", "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                // if(profile.privilegeRoles.indexOf("UassessAdmin")>-1 || profile.privilegeRoles.indexOf("CompanyAdmin")>-1){
                    Companies.findById(input.companyId).then(function(result){
                        //console.log("result = "+result);
                        if(result){
                            let resultObj = result.toObject();
                            resultObj.id = resultObj._id;
                            delete resultObj._id;
                            //delete resultObj.createdAt;
                            //delete resultObj.updatedAt;
                            //delete resultObj.bu;
                            //delete resultObj.license;
                            //delete resultObj.createdBy;
                            return res.send({"code":"0", "message":SUCCESS, "data": resultObj});
                        }else{
                            return res.send({"code":"1", "message":"Invalid CompanyId", "data": input});
                        }
                    }).catch(function(err){
                        if(err.name == 'ValidationError'){
                            var splitedText = err.message.split(',');
                            var message = splitedText[0].split(':')[2].trim();
                            return res.send({ "code": "1", "message": message, "data": input});
                        }else if(err.name == 'CastError'){
                            return res.send({ "code": "1", "message": "Invalid CompanyId", "data": input});
                        }else{
                            return res.send({ "code": "1", "message": err.message,"data": input});
                        }
                    });
                // }else{
                //     return res.send({"code":"1", "message":PERMISSION_DENIED, "data": input});
                // }
            }else{
                return res.status(200).send({ "code": "1", "message": INVALID_TOKEN, "data": input});
            }
        })
    },
    consumeLicense: function(req, res){
        let input = req.body;
        if(!("token" in input) || input.token.length == 0){
            return res.send({"code":"1", "message":TOKEN_REQUIRED, "data": input});
        }
        if(!("companyId" in input) || input.companyId.length == 0){
            return res.send({"code":"1", "message":"CompanyId required", "data": input});
        }
        module.exports.validateToken(input.token, function(profile){
            if(profile){
                if(profile.privilegeRoles.indexOf("Assessee")>-1){
                    Companies.findById(input.companyId).then(function(result){
                        console.log("result = "+result);
                        result.license = result.license - 1;
                        result.save(function(err){
                            if(!err){
                                let resultObj = result.toObject();
                                resultObj.id = resultObj._id;
                                delete resultObj._id;
                                return res.send({"code":"0", "message":SUCCESS, "data": resultObj});
                            }else{
                                return res.send({"code":"1", "message":FAIL, "data": input});
                            }    
                        })
                    }).catch(function(err){
                        return res.send({ "code": "1", "message": err.message, "data": input});
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
        Token.findOne({"token":token}).then(function(response){
            if(response !== null){
                if("profileId" in response){
                    Users.findById(response.profileId).then(function(result){
                        if(result){
                            callback(result);
                        }else{
                            callback(false);
                        }
                    })
                }else{
                    callback(false);
                }
            }else{
                callback(false);
            }
        });
    },
}