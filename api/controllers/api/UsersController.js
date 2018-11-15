/**
 * Api/UsersController
 *
 * @description :: Server-side logic for managing api/users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    _config: {
        model: ['Tokens','Users']
    },
    profileUpdate:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            
            if(user_id) {                
                UserDataService.updateUserProfile(req,user_id).then(function(user_data){
                    
                    if(user_data) { 
                        ApiService.setApiRes("msg",'Your profile update successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",user_data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",users);
                return res.json(ApiService.returnRes());
            }
        });       
    },
    getProfile:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                user_id = req.param('user_id');
                ApiService.getUserDetail(user_id).then(function(user_data){
                    if(user_data){
                        ApiService.setApiRes("msg",'User data!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("token",token);
                        ApiService.setApiRes("data",user_data);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'User not found!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("token",token);
                        ApiService.setApiRes("data",{});
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    getUserEditMaster:function(req,res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                ApiService.getUserEditMaster().then(function(data_arr) {
                    if(data_arr) {
                        ApiService.setApiRes("msg",'user master table!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("token",token);
                        ApiService.setApiRes("data",data_arr);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        return res.json(ApiService.returnRes());
                    }
                });
            }  else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    addEducation: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.CreateEducation(req,user_id,'api').then(function(education_service){
                    if(education_service.status == 'OK') {
                        ApiService.setApiRes("msg",education_service.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",education_service.data);
                        ApiService.setApiRes("token",token);
                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",education_service.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    updateEducation: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.UpdateEducation(req,user_id,'api').then(function(education_service){
                    if(education_service.status == 'OK') {
                        ApiService.setApiRes("msg",education_service.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",education_service.data);
                        ApiService.setApiRes("token",token);
                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",education_service.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    deleteEducation: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                console.log(req.param("id"));
                UserDataService.deleteEducation(req,user_id,'api').then(function(education_service){
                    if(education_service.status == 'OK') {
                        ApiService.setApiRes("msg",education_service.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    addExperience: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.CreateExperience(req,user_id,'api').then(function(ExperienceService){
                    if(ExperienceService.status == 'OK') {
                        ApiService.setApiRes("msg",ExperienceService.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",ExperienceService.data);
                        ApiService.setApiRes("token",token);
                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",ExperienceService.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    updateExperience: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.updateExperience(req,user_id,'api').then(function(ExperienceService){
                    if(ExperienceService.status == 'OK') {
                        ApiService.setApiRes("msg",ExperienceService.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",ExperienceService.data);
                        ApiService.setApiRes("token",token);
                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",ExperienceService.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    deleteExperience: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.deleteExperience(req,user_id,'api').then(function(ExperienceService){
                    if(ExperienceService.status == 'OK') {
                        ApiService.setApiRes("msg",ExperienceService.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",ExperienceService.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    addProject: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.CreateProject(req,user_id,'api').then(function(project_data){
                    if(project_data.status == 'OK') {
                        ApiService.setApiRes("msg",project_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",project_data.data);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",project_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    updateProject: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.updateProject(req,user_id,'api').then(function(project_data){
                    if(project_data.status == 'OK') {
                        ApiService.setApiRes("msg",project_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",project_data.data);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",project_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    deleteProject: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.deleteProject(req,user_id,'api').then(function(project_data){
                    if(project_data.status == 'OK') {
                        ApiService.setApiRes("msg",project_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",project_data.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    addSocial: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.CreateSocial(req,user_id).then(function(project_id){
                    if(project_id) {
                        ApiService.setApiRes("msg",'Social detail add successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{'status':project_id});
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    getSocialsList : function(req,res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id){
                Socials.find().exec(function (err, arr_socials){
                    if(arr_socials) {
                        ApiService.setApiRes("msg",'Social detail add successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",arr_socials);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    checkLoginid : function(req,res){

        login_id = req.param("login_id");
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(login_id != undefined && user_id) {
                Users.count({'login_id':login_id}).exec(function(err,users){
                    if(users == 0){
                        ApiService.setApiRes("msg",'Login id available');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid argument!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    peopleYouKnow : function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.peopleYouKnow(req,user_id).then(function(peopleYouKnowList){
                    if(peopleYouKnowList) {
                        ApiService.setApiRes("msg",'People May You Know!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{'peopleYouKnowList':peopleYouKnowList,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url});
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    sendConnectionRequest: function(req, res) { 
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.sendConnectionRequest(req,user_id).then(function(ServiceData){
                    if(ServiceData.status == 'OK') {
                        ApiService.setApiRes("msg",ServiceData.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",ServiceData.data);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",ServiceData.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",ServiceData.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    cancelConnectionRequest: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.cancelConnectionRequest(req,user_id).then(function(cancelConnectionRequestStatus){
                    if(cancelConnectionRequestStatus) {
                        ApiService.setApiRes("msg",'Invitation cancel successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    rejectConnectionRequest: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.rejectConnectionRequest(req,user_id).then(function(rejectConnectionRequestStatus){
                    if(rejectConnectionRequestStatus) {
                        ApiService.setApiRes("msg",'Connection request reject successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    acceptConnectionRequest: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.acceptConnectionRequest(req,user_id).then(function(acceptConnectionRequestStatus){
                    console.log(acceptConnectionRequestStatus);
                    if(acceptConnectionRequestStatus) {
                        ApiService.setApiRes("msg",'Connection request accept successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    pendingReceivedInvitationList : function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.getPendingReceivedInvitationList(req,user_id).then(function(pendingReceivedInvitationList){
                    if(pendingReceivedInvitationList) {
                        ApiService.setApiRes("msg",'Pending received invitation list');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",pendingReceivedInvitationList);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("token",token);
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    pendingSentInvitationList: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.getPendingSentInvitationList(req,user_id).then(function(pendingSentInvitationList){
                    if(pendingSentInvitationList) {
                        ApiService.setApiRes("msg",'Pending sent invitation list');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",pendingSentInvitationList);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("token",token);
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
	
    myConnectionList: function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.myConnectionList(req,user_id).then(function(myConnectionList){
                    if(myConnectionList) {
                        ApiService.setApiRes("msg",'My connection list');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",myConnectionList);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("token",token);
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    followUnfollow : function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.followUnfollow(req,user_id).then(function(followUnfollow){
                    if(followUnfollow) {
                        ApiService.setApiRes("msg",'Follow unfolloew process successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    followList : function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.getFollowList(req,user_id).then(function(followList){
                    if(followList) {
                        ApiService.setApiRes("msg",'Follow unfolloew process successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",followList);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    updateProfileCover : function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.updateProfileCover(req,user_id).then(function(ServiceData){
                    if(ServiceData.status == 'OK') {
                        ApiService.setApiRes("msg",ServiceData.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",ServiceData.data);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",ServiceData.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    updateProfileImage : function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.updateProfileImage(req,user_id).then(function(ServiceData){
                    if(ServiceData.status == 'OK') {
                        ApiService.setApiRes("msg",ServiceData.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",ServiceData.data);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",ServiceData.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    mastertables : function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.masterTables(req,user_id).then(function(updateProfileImageStatus){
                    if(updateProfileImageStatus) {
                        ApiService.setApiRes("msg",'Master Tabls List!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",updateProfileImageStatus);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
        
    },
    userListForVerifyRequest : function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.userListForVerifyRequest(req,user_id).then(function(userListForVerifyRequestList){
                    if(userListForVerifyRequestList.status == 'OK') {
                        ApiService.setApiRes("msg",'User List For Verifyrequest!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",userListForVerifyRequestList.data);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    company_list:function(){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.companyList(req,user_id).then(function(userListForVerifyRequestList){
                    if(userListForVerifyRequestList.status == 'OK') {
                        ApiService.setApiRes("msg",'User List For Verifyrequest!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",userListForVerifyRequestList.data);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    useReferral:function(req,res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.useReferral(req,user_id,'api').then(function(ServiceData){
                    console.log(ServiceData);
                    if(ServiceData.status == 'OK') {
                        ApiService.setApiRes("msg",ServiceData.message);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        console.log("come in else");
                        ApiService.setApiRes("msg",ServiceData.message);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    referAfriend:function(req,res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.referAfriend(req,user_id).then(function(ServiceData){
                    console.log(ServiceData);
                    if(ServiceData.status == 'OK') {
                        ApiService.setApiRes("msg",ServiceData.message);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        console.log("come in else");
                        ApiService.setApiRes("msg",ServiceData.message);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    mywallet:function(req,res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.mywallet(req,user_id).then(function(ServiceData){
                    if(ServiceData.status == 'OK') {
                        ApiService.setApiRes("msg",ServiceData.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",ServiceData.data);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        console.log("come in else");
                        ApiService.setApiRes("msg",ServiceData.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    walletData:function(req,res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.walletData(req,user_id).then(function(ServiceData){
                    if(ServiceData.status == 'OK') {
                        ApiService.setApiRes("msg",ServiceData.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",ServiceData.data);
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",ServiceData.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    ForgotPasswordSendOtp:function(req,res){
        UserDataService.ForgotPasswordSendOtp(req,'api').then(function(serviceResponce){
            if(serviceResponce.status == 'OK') {
                ApiService.setApiRes("msg",serviceResponce.message);
                ApiService.setApiRes("status",true);
                ApiService.setApiRes("data",serviceResponce.data);
                return res.json(ApiService.returnRes());
            } else {
                ApiService.setApiRes("msg",serviceResponce.message);
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    changePasswordWithOtp:function(req,res){
        UserDataService.changePasswordWithOtp(req,'api').then(function(serviceResponce){
            if(serviceResponce.status == 'OK') {
                ApiService.setApiRes("msg",serviceResponce.msg);
                ApiService.setApiRes("status",true);
                ApiService.setApiRes("data",serviceResponce.data);
                return res.json(ApiService.returnRes());
            } else {
                ApiService.setApiRes("msg",serviceResponce.msg);
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },

    getBlockUserslist : function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                BlockUserService.BlockUserList(req,user_id).then(function(BlockList){                    
                    if(BlockList) {
						BlockList.profile_image_url=sails.config.appUrlwPort + sails.config.profile_image_url;
                        ApiService.setApiRes("msg",'Block users list');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",BlockList);

                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },

    unblockUser : function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            
            var blockid =  (typeof req.param("id")!='undefined' && req.param("id")!='')?req.param("id"):'';
            if(blockid==''){
                ApiService.setApiRes("msg",'Id is required');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
            if(user_id) {
                BlockUserService.unblockUser(blockid).then(function(unblockStatus){                    
                    if(unblockStatus) {
                        ApiService.setApiRes("msg",'User Unblock successfully');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },

    blockUser : function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            var to_user_id =  (typeof req.param("to_user_id")!='undefined' && req.param("to_user_id")!='')?req.param("to_user_id"):'';
            if(to_user_id==''){
                ApiService.setApiRes("msg",'Block user id is required');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }

            if(user_id) {
                BlockUserService.blockUser(user_id,to_user_id).then(function(blockStatus){                    
                    if(blockStatus) {
                        ApiService.setApiRes("msg",'User block successfully');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },

    closeMyAccount:function(req,res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                var reason =  (typeof req.param("reason")!='undefined' && req.param("reason")!='')?req.param("reason"):'';
                if(reason==''){
                    ApiService.setApiRes("msg",'Please select any reason for close account.');
                    ApiService.setApiRes("status",false);
                    ApiService.setApiRes("data",{});
                    return res.json(ApiService.returnRes());
                }

                Users.findOne({id:user_id}).exec(function (err, user){
                    if (err) {
                        ApiService.setApiRes("msg",'Error on find user data');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                    if (!user) {
                        ApiService.setApiRes("msg",'User not found');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                    
                    var login_name = (typeof user.name!='undefined')?user.name:'';
                    
                    UserDataService.closeMyAccount(req,user_id,login_name).then(function(closeAccount){                    
                        if(closeAccount) {

                            //logout current user
                            var token_arr = {'token':token};
                            Tokens.destroy(token_arr).exec(function (err) {
                                if(err){
                                    ApiService.setApiRes("msg",'Your account closed successfully but Fail to logout');
                                    ApiService.setApiRes("status",true);
                                    ApiService.setApiRes("data",{});
                                    //ApiService.setApiRes("token",token);                        
                                    return res.json(ApiService.returnRes());
                                }

                                ApiService.setApiRes("msg",'Your account has been closed successfully.');
                                ApiService.setApiRes("status",true);
                                ApiService.setApiRes("data",{});
                                //ApiService.setApiRes("token",token);                        
                                
                                return res.json(ApiService.returnRes());
                            });
                        } else {
                            ApiService.setApiRes("msg",'Something went wrong. Please try again.');
                            ApiService.setApiRes("status",false);
                            ApiService.setApiRes("data",{});
                            ApiService.setApiRes("token",token);
                            return res.json(ApiService.returnRes());
                        }
                    });
                 });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },

    closeAccountReasons : function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.closeAccountReasons(req,user_id).then(function(results){                    
                    if(results) {
                        ApiService.setApiRes("msg",'Reasons list');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",results);

                        //ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);

                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },

    getMySocialLinks : function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                UserDataService.getMySocialLinks(req,user_id).then(function(results){                    
                    if(results) {
                        ApiService.setApiRes("msg",'My Social URL List');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",results);

                        ApiService.setApiRes("token",token);                        
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid Token!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },

}