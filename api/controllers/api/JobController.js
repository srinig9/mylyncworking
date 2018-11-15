/**
 * Api/AuthController
 *
 * @description :: Server-side logic for managing api/auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    _config: {
        model: ['Tokens','Users']
    },
    saveJobPost :function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                JobService.saveJobPost(req,user_id).then(function(JobServiceStatus) {
                    if(JobServiceStatus) { 
                        ActivityLogsService.addActivityLog({
							owner_id: user_id,
							module: 'job',
							action: 'saveJobPost',
							object_id: JobServiceStatus,
							type: 'api'
						});
                        ApiService.setApiRes("msg",'Job post successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",JobServiceStatus);
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
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });  
    },
    masterJobPostDrop : function(req,res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                    JobService.getJobType().then(function(job_type){
                        JobService.getJobExperience().then(function(job_experience){
                            JobService.getSkill().then(function(skill_list){
                                JobService.getIndustries().then(function(Industries){
                                    JobService.getAuthorCompany(user_id).then(function(CurrentCompany){
                                        if(job_type && job_experience && skill_list && Industries && CurrentCompany) {
                                            JobServiceStatus = {'job_types' : job_type,
                                                                'skill_lists' : skill_list,
                                                                'Industries' : Industries,
                                                                'job_experiences' : job_experience,
                                                                'CurrentCompanys' : CurrentCompany};
                                            ApiService.setApiRes("msg",'Job post masters!');
                                            ApiService.setApiRes("status",true);
                                            ApiService.setApiRes("data",JobServiceStatus);
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
                            });
                        });
                    });
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });  
    },
    myJobs : function(req,res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            
            if(user_id) {
                JobService.getJob(req,2,user_id).then(function(data) {                    
                    if(data) { 
                        data = {'jobs':data,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url}
                        ApiService.setApiRes("msg",'My jobs list!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",data);
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
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });  
    },
    bookMark: function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                JobService.bookMark(req).then(function(result){
                    if(data) { 
                        ApiService.setApiRes("msg",'My jobs list!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",data);
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
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        }); 
    },
    jobsList: function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                JobService.getJob(req,null,user_id).then(function(result) {
                    if(result) { 
                        data = {'jobs':result,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url};
                        ApiService.setApiRes("msg",'jobs list!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",data);
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
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        }); 
    },
    jobApply: function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                JobService.jobApply(req,user_id).then(function(result) {
                    if(result.status == "OK") { 
                        ApiService.setApiRes("msg",result.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",result.msg);
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
}