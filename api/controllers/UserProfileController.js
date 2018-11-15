/**
 * UserProfileController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var path = require("path");
var fs = require('fs');

module.exports = {
   
    //Start Education
    CreateEducation: function(req, res) {
        UserDataService.CreateEducation(req,req.user.id,'web').then(function(UpdateEducationData){
            return res.json(UpdateEducationData);
        });
    },

    UpdateEducation: function(req, res) {
		UserDataService.UpdateEducation(req,req.user.id,'web').then(function(UpdateEducationData){
            return res.json(UpdateEducationData);
        });
    },
    
    deleteEducation: function(req, res) {
		UserDataService.deleteEducation(req,req.user.id,'api').then(function(education_service){
            return res.json(education_service);
        });
	},
    
    getOneEducation: function(req, res) {
        var id = req.param("id");
        return UserEducations.findOne()
        .populate('educationdocs',{sort:{createdAt:1}})
        .populate('educationdocs.verify_request_id',{select:['status'],where:{status:1},limit:1})
        .where({id:id}).exec(function(err, edu) {
            
            var school_name = (typeof edu.school!='undefined') ? edu.school.trim() : "";
            var degree      = (typeof edu.degree!='undefined') ? edu.degree.trim() : "";
            var study_field = (typeof edu.study_field!='undefined') ? edu.study_field.trim() : "";
            var degree_type = (typeof edu.degree_type!='undefined') ? edu.degree_type.trim() : "";
            var from_year   = (typeof edu.from_year!='undefined') ? edu.from_year.trim() : "";
            var to_year     = (typeof edu.to_year!='undefined') ? edu.to_year.trim() : "";
            var description = (typeof edu.description!='undefined') ? edu.description.trim() : "";
            
            edu.edu_string = school_name+'-'+degree+'-'+study_field+'-'+degree_type+'-'+from_year+'-'+to_year+'-'+description;
            
            return res.json(edu); 
        });
    },

    addProject: function(req, res) {
        //console.log("store project..............req.params = " + JSON.stringify(req.params.all()));
		UserDataService.CreateProject(req,req.user.id,'web').then(function(project_service){
            return res.json(project_service);
        });
    },
	
	updateProject: function(req, res) {
        //console.log("Store Education..............req.params = " + JSON.stringify(req.params.all()));
		UserDataService.updateProject(req,req.user.id,'web').then(function(project_service){
            return res.json(project_service);
        });
    },
	
    deleteProject: function(req, res) {
		UserDataService.deleteProject(req,req.user.id,'web').then(function(project_service){
            return res.json(project_service);
        });
	},
    
    getOneProject: function(req, res) {
        var id = req.param("id");
        return UserProjects.findOne()
        .populate('projectdocs',{sort:{createdAt:1}})
        .populate('projectdocs.verify_request_id',{select:['status'],where:{status:1},limit:1})
        .where({id:id}).exec(function(err, project) {

            var title       = (typeof project.title!='undefined') ? project.title.trim() : "";
            var project_url = (typeof project.project_url!='undefined') ? project.project_url : "";
            var company_id  = (typeof project.company_id!='undefined') ? project.company_id.trim() : "";
            var location    = (typeof project.location!='undefined') ? project.location.trim() : "";
            var from_month  = (typeof project.from_month!='undefined') ? project.from_month.trim() : "";
            var from_year   = (typeof project.from_year!='undefined') ? project.from_year.trim() : "";
            var to_month    = (typeof project.to_month!='undefined') ? project.to_month.trim() : "";
            var to_year     = (typeof project.to_year!='undefined') ? project.to_year.trim() : "";
            var description = (typeof project.description!='undefined') ? project.description.trim() : "";
            
            project.project_string = title+'-'+project_url+'-'+company_id+'-'+location+'-'+from_month+'-'+from_year+'-'+to_month+'-'+to_year+'-'+description;

            return res.json(project); 
        });
    },

    //Manage Experience data 
    addExperience: function(req, res) {
        //console.log("store project..............req.params = " + JSON.stringify(req.params.all()));
		UserDataService.CreateExperience(req,req.user.id,'web').then(function(ExperienceResponce){
            return res.json(ExperienceResponce); 
        })
    },

    updateExperience: function(req, res) {
        UserDataService.updateExperience(req,req.user.id,'web').then(function(ExperienceResponce){
            return res.json(ExperienceResponce); 
        })
    },

    deleteExperience: function(req, res) {
        
        UserDataService.deleteExperience(req,req.user.id,'web').then(function(ExperienceResponce){
            return res.json(ExperienceResponce); 
        })
	},
    
    getOneExperience: function(req, res) {
        var id = req.param("id");
        return UserExperiences.findOne()
        .populate('experiencedocs',{sort:{createdAt:1}})
        .populate('experiencedocs.verify_request_id',{select:['status'],where:{status:1},limit:1})
        .where({id:id}).exec(function(err, _exp) {

            var title       = (typeof _exp.title!='undefined') ? _exp.title.trim() : "";
            var company_id  = (typeof _exp.company_id!='undefined') ? _exp.company_id.trim() : "";
            var location    = (typeof _exp.location!='undefined') ? _exp.location.trim() : "";
            var from_month  = (typeof _exp.from_month!='undefined') ? _exp.from_month.trim() : "";
            var from_year   = (typeof _exp.from_year!='undefined') ? _exp.from_year.trim() : "";
            var to_month    = (typeof _exp.to_month!='undefined') ? _exp.to_month.trim() : "";
            var to_year     = (typeof _exp.to_year!='undefined') ? _exp.to_year.trim() : "";
            var current_work= (typeof _exp.current_work!='undefined') ? _exp.current_work : "";
            var description = (typeof _exp.description!='undefined') ? _exp.description.trim() : "";
            
            _exp.exp_string = title+'-'+company_id+'-'+location+'-'+from_month+'-'+from_year+'-'+to_month+'-'+to_year+'-'+current_work+'-'+description;

            return res.json(_exp); 
        });
    },

    //*********User Social Media************//
    
    addSocial: function(req, res) {
        //console.log("store Social..............req.params = " + JSON.stringify(req.params.all()));
		////console.log(req.allParams());
        
        UserSocials.destroy({user_id:req.param("user_id")}).exec(function (err){
            if (err) {
                return res.negotiate(err);
            }
        
            Socials.find({ select: ['id'] }).exec(function(err,socials) {
                var _newSocials = [];
                socials.forEach(function(social, index){
                    var _newSocial = {
                        user_id     : req.param("user_id"),
                        social_id   : social.id,
                        link   : req.param("social["+social.id+"]")
                    };
                    if(req.param("social["+social.id+"]")!='') {
                        _newSocials.push(_newSocial);
                    }
                });
                UserSocials.create(_newSocials).then(function (_socials) {
                    //console.log("Social created: " + JSON.stringify(_socials));
                    _socials.forEach(function(social, index){
                        if(typeof social.id != 'undefined') {
                            /* Activity Log Insert */
                            ActivityLogsService.addActivityLog({
                                owner_id: req.user.id,
                                module: 'profile_social',
                                action: 'create',
                                object_id: social.id,
                                type: 'web'
                            });
                        }
                    });
                    return res.json({
                        socials: _socials,
                        status: 'OK',
                        msg:'Social link added successfully'
                    });
                }).catch(function (error) {
                    //console.log("Validation MESSAGE .............." + JSON.stringify(error.Errors));
                    return res.json({
                        social: _newSocials,
                        status: 'Error',
                        statusDescription: error,
                        title: 'Add a new Social Error'
                    });
                });
            });
        });
    },

    sentRecommendation: function(req, res) {
        var _newRec = {
            user_id         : req.param("user_id"),
            recommended_id  : req.param("recommended_id"),
            status          : 0,
            is_delete       : 0       
        };
        UserRecommendations.findOne().where({recommended_id:req.param("recommended_id"),user_id:req.param("user_id")}).exec(function(err, _recExist) {
            if(_recExist){
                return res.json({
                   status: 'Error',
                    msg:'Recommendation request already sent to this user'
                });
            }else{
                UserRecommendations.create(_newRec).then(function (_exp) {
                    var textdata = "Received recommendation request from <a href='/profile/'>"+req.user.name+"</a>";
                    NotificationService.addNotification({
                        user_id: req.param("user_id"),
                        feed_id: "",
                        from_user_id: req.param("recommended_id"),
                        notification_text: textdata,
                        type: 'web'
                    });

                    return res.json({
                        recommend: _newRec,
                        status: 'OK',
                        msg:'Recommendation request has been sent successfully'
                    });

                }).catch(function (error) {
                    //console.log("Validation Error..............");
                    //console.log("Validation MESSAGE .............." + JSON.stringify(error.Errors));
                    return res.json({
                        recommend: _newRec,
                        status: 'Error',
                        statusDescription: error,
                        title: 'Add a new Recommend Error'
                    });
                });
            }
        });
    },

    //privacy settings    
    privacySetting: function(req, res) {
        var userID = req.user.id;
        Privacy.find({status:1}).populate('privacyoptions').exec(function(err,privacy) {
            UserPrivacySettings.find({select:['privacy_option_id'],user_id:userID}).exec(function(errs,userprivacy){
                UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
                    return res.view('user/privacy-setting',{
                        status: 'OK',
                        title: 'Privacy Settings',
                        privacy:privacy,
                        userprivacy:userprivacy,
                        userData:userInfo,
                        activepage:'privacy'
                    });
                });
            });
        });
    },

    StorePrivacySetting: function(req,res){
        var user_setting = [];
        var privacy_option = req.param('privacy_option_id');
        
        if(Array.isArray(privacy_option)){
            privacy_option = privacy_option;
        }else{
            privacy_option = [privacy_option];
        }


        var userID = req.param("user_id");
		//user setting array
        privacy_option.forEach(function(ids, index){
            var _newRecord = {
                user_id             : userID,
                privacy_option_id   : ids
            };
            if(userID!='') {
                user_setting.push(_newRecord);
            }
        });
        //delete all and store user settings
        UserPrivacySettings.destroy({user_id:userID}).exec(function (err){
            if(err){ 
                return res.negotiate(err); 
            }
            UserPrivacySettings.create(user_setting).then(function (data) {
				data.forEach(function(single_data, index){
					if(typeof single_data.id != 'undefined') {
						/* Activity Log Insert */
						ActivityLogsService.addActivityLog({
							owner_id: req.user.id,
							module: 'user_privacy',
							action: 'update',
							object_id: single_data.id,
							type: 'web'
						});
					}
				});
                return res.json({
					privacy: data,
					status: 'OK',
					msg:'Privacy settings save successfully'
				});
            }).catch(function (error) {
                //console.log("Validation Error..............");
                //console.log("Validation MESSAGE .............." + JSON.stringify(error.Errors));
                return res.json({
                    privacy: user_setting,
                    status: 'Error',
                    statusDescription: error,
                    title: '*fields are required'
                });
            });
        });
    },

    AcceptRecommendation:function (req,res){
        var update_rec = {
            recommendation:req.param('recommendation'),
            status:1,
            is_delete: 0,
        }
        UserRecommendations.findOne().where({id:req.param("id")}).exec(function(err, recommend) {
             if(recommend){
                UserRecommendations.update(req.param("id"),update_rec).then(function (_rec) {
                    if(typeof req.param("id") != 'undefined') {
                        /* Activity Log Insert */
                        ActivityLogsService.addActivityLog({
                            owner_id: req.user.id,
                            module: 'profile_recommendation',
                            action: 'update',
                            object_id: req.param("id"),
                            type: 'web'
                        });
                    }

                    var textdata = "Accept recommendation request from <a href='/profile/'>"+req.user.name+"</a>";
                    NotificationService.addNotification({
                        user_id: recommend.recommended_id,
                        feed_id: "",
                        from_user_id: req.user.id,
                        notification_text: textdata,
                        type: 'web'
                    });

                    return res.json({
                        recommendation: _rec,
                        status: 'OK',
                        msg:'Recommendation accept successfully'
                    });

                }).catch(function (error) {
                    //console.log("Recommendation error .............." + JSON.stringify(error.Errors));
                    return res.json({
                        recommendation: update_rec,
                        status: 'Error',
                        title: 'Update Recommendation Error',
                        msg:'Fail to accept Recommendation'
                    });
                });
            }
        });
    },

    DeclineRecommendation:function(req,res){
        var rid = req.param('id');
        UserRecommendations.findOne().where({id:rid}).exec(function(err, recommend) {
            if(recommend){
                UserRecommendations.destroy({id:rid}).exec(function (err){
                    if (err) {
                    //return res.negotiate(err);
                        return res.json({
                            status: 'Error',
                            msg:'Fail Request decline successfully'
                        });
                    }
                    return res.json({
                        r_id: rid,
                        status: 'OK',
                        msg:'Request decline successfully'
                    });
                });
            }else{
                return res.json({
                    status: 'Error',
                    msg:'Record not exist'
                });
            }
        });
    },

    HideRecommendation:function(req,res){
        var rid = req.param('id');
        var update_rec = {
            is_delete:1
        }
        
        UserRecommendations.update(rid,update_rec).then(function (_rec) {
            if(typeof req.param("id") != 'undefined') {
                /* Activity Log Insert */
                ActivityLogsService.addActivityLog({
                    owner_id: req.user.id,
                    module: 'profile_recommendation',
                    action: 'delete',
                    object_id: req.param("id"),
                    type: 'web'
                });
            }
            return res.json({
                recommendation: _rec,
                status: 'OK',
                msg:'Recommendation hide successfully'
            });
        }).catch(function (error) {
            //console.log("Recommendation error .............." + JSON.stringify(error.Errors));
            return res.json({
                recommendation: update_rec,
                status: 'Error',
                title: 'Update Recommendation Error',
                msg:'Fail to hide Recommendation'
            });
        });
    },
	
    RemoveProfileImage: function(req,res){
     var uid = req.param('id');
        Users.findOne().where({id:uid}).exec(function(err,_user) {
        if(typeof _user.profile_image!='undefined' && _user.profile_image!=''){
            var fs = require('fs');
            var filePath = './assets/uploads/users/'+_user.profile_image;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        var updateData = {profile_image:''};
            Users.update({id:_user.id},updateData).exec(function afterwards(err, updated){
                if (err) {
                    return res.json({
                        imagedata: _user,
                        status: 'Error',
                        msg:'Fail to remove profile successfully'
                    });
                }

                 return res.json({
                    imagedata: _user,
                    status: 'OK',
                    msg:'Profile image remove successfully'
                });
            });
        });
    },

    RemoveCoverImage: function(req,res){
        var uid = req.param('id');
        Users.findOne().where({id:uid}).exec(function(err,_user) {
        if(typeof _user.cover_image!='undefined' && _user.cover_image!=''){
            var fs = require('fs');
            var filePath = './assets/uploads/users/'+_user.cover_image;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        var updateData = {cover_image:''};
            Users.update({id:_user.id},updateData).exec(function afterwards(err, updated){
                if (err) {
                    return res.json({
                        imagedata: _user,
                        status: 'Error',
                        msg:'Fail to remove profile successfully'
                    });
                }

                 return res.json({
                    imagedata: _user,
                    status: 'OK',
                    msg:'Cover image remove successfully'
                });
            });
        });
    },

    CronUpdateUserName : function(req,res){
        console.log('Welcome to Crontab');

        if(typeof req.user=='undefined'){
            return res.json('Please login for run this cron');
        }

        Users.find().sort('createdAt').exec(function (err, result){
            if (err) {  
                return res.serverError(err);
            }

            result.forEach(function(user, index){
                var user_id = '';
                var userName= '';
                user_id     = user.id;
                userName    = user.name.trim();
                userName    = userName.charAt(0).toUpperCase() + userName.slice(1);
                
                console.log('=======update user first letter======>',userName);
                var _userUpdate = {
                    name     : userName
                };

                if(user_id!='' && userName!=''){
                    Users.update(user_id,_userUpdate).then(function (udata){
                            //update record
                        }).catch(function (error) {
                        return res.json('Fail to update record');
                    });
                }
            });
        });
        
        return res.json('Update user first letter');
    }
};