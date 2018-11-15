/**
 * Api/VerifyController
 *
 * @description :: Server-side logic for managing api/Verify
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    SendEmailVerifyCode:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            
            if(user_id) {
                console.log('--------service_data-------');   
                VerifyService.SendEmailVerifyCode(req,user_id).then(function(service_data){
                    console.log(service_data);
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data._verify);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    companyList:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            
            if(user_id) {
                console.log('--------service_data-------');   
                VerifyService.company_list(req,user_id).then(function(service_data){
                    console.log(service_data);
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data._verify);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    SendPhoneVerifyCode:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            
            if(user_id) {
                VerifyService.SendPhoneVerifyCode(req,user_id).then(function(service_data){
                    console.log(service_data);
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data._verify);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    VerifyPhoneOTP:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            
            if(user_id) {
                VerifyService.VerifyPhoneOTP(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data._verify);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    getDocType:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            
            if(user_id) {
                VerifyService.getVerified(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    saveVerified:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.saveVerified(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    updateVerifyRecord:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.UpdateVerifyRecord(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    deleteVerifyRecords:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.DeleteVerifyRecords(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    
    storeEducationForVerify:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            
            if(user_id) {
                VerifyService.storeEducationForVerify(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    storeExperienceForVerify:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.storeExperienceForVerify(req,user_id,'api').then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },

    getVerifiedList:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.getVerifiedList(req,user_id).then(function(service_data){
                    console.log("come 456789");
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },

    getVerifiedListWithFilter: function(req,res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.getVerifiedListWithFilter(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    
    getOneVerifyData:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.getOneVerifyData(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    sendVerifyDataRequest:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.StoreUserVerifyDataRequest(req,user_id,'api').then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    VerifyEmailOTP:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.VerifyEmailOTP(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    CancelUserVerifyRequest:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.CancelUserVerifyRequest(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    GetVerifyRequestData:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.GetVerifyRequestData(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    getOneVerifyRequestData:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.getOneVerifyRequestData(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    ignoreVerifyRequest:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.IgnoreVerifyRequest(req,user_id,'api').then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    dataAccessRequestList:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.dataAccessRequestList(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    
    /*
        ATHORIZED SCREEN
    */

    pendingAccessDocumentRequests:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.ApiPendingAccessDocumentRequests(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    
    completeDataAccessRequest:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.ApiCompleteDataAccessRequest(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },

    /* END */

    dataVerify:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.verifyRequestByBlockchain(req,user_id,'api').then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },

    /*
        REQUEST DATA ACCESS SCREEN START
    */

    sendDataAccessRequest:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id != false) {
                VerifyService.StoreDataAccessRequest(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },

    completeDataAccessList:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.dataCompleteAccessList(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",token);
                return res.json(ApiService.returnRes());
            }
        });       
    },

    pendingDataAccessList:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.dataAccessPendingList(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",token);
                return res.json(ApiService.returnRes());
            }
        });       
    },
    /*
        REQUEST DATA ACCESS SCREEN END
    */

    
    dataAccessRequestHistoryList:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.dataAccessRequest(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    authorizeList:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.authorizeList(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
    pendingVerifyRequestList:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.pendingVerifyRequestList(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",token);
                return res.json(ApiService.returnRes());
            }
        });       
    },
    completedVerifyRequestList:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.completedVerifyRequestList(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",token);
                return res.json(ApiService.returnRes());
            }
        });       
    },
    authorizeAllowOrDeny:function(req, res){
        var token = req.headers.token;
        console.log("come 123 authorizeAllowOrDeny");
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.authorizeAllowDeny(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",token);
                return res.json(ApiService.returnRes());
            }
        });       
    },
    cancelRequestData:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                var type_param = 'C';
                VerifyService.resendORcancelrequestdata(req,user_id,type_param).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.message);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.message);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",token);
                return res.json(ApiService.returnRes());
            }
        });       
    },
    resendRequestData:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                var type_param = 'R';
                VerifyService.resendORcancelrequestdata(req,user_id,type_param).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.message);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.message);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",token);
                return res.json(ApiService.returnRes());
            }
        });       
    },
    AuthorizeDataPdf:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.AuthorizeDataPdf(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",token);
                return res.json(ApiService.returnRes());
            }
        });       
    },
    VerifyByUser:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.VerifyByUser(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",token);
                return res.json(ApiService.returnRes());
            }
        });       
    },
    verifyRequestedToUser:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                VerifyService.verifyRequestedToUser(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",token);
                return res.json(ApiService.returnRes());
            }
        });       
    },

}