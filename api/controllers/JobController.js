/**
 * JobController
 *
 * @description :: Server-side logic for managing jobs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment')

module.exports = {
	
    postJob: function(req, res){
        var user_id = req.user.id;
        
        if(req.method == 'POST'){
            JobService.saveJobPost(req,user_id).then(function(status_save) {
                if(status_save) {
					if(typeof status_save != 'undefined') {
						/* Activity Log Insert */
						ActivityLogsService.addActivityLog({
							owner_id: req.user.id,
							module: 'job',
							action: 'create',
							object_id: status_save,
							type: 'web'
						});
					}

                    request.addFlash('success', 'Job post save successfully!');
                    return res.redirect('/jobs/myjob');
                }
            });
        }
        JobService.getJobType().then(function(job_type){
            JobService.getCurrencyCode().then(function(currencyCode){
                JobService.getJobExperience().then(function(job_experience){
                    JobService.getSkill().then(function(skill_list){
                        JobService.getIndustries().then(function(Industries){
                            JobService.getAuthorCompany(user_id).then(function(CurrentCompany){
                                UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
                                    return res.view('job/manage_job',{
                                        'job_types':job_type,
                                        'currencyCodes':currencyCode,
                                        'skill_lists' : skill_list,
                                        'Industries' : Industries,
                                        'job_experiences':job_experience,
                                        'CurrentCompanys':CurrentCompany,
                                        userData:userInfo,
                                        'page_type':'post_job',
                                        status: 'OK',
                                        title: 'Post job'
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },

    jobs:function(req, res){
        var user_id = (typeof req.user != 'undefined' && typeof req.user.id != 'undefined') ? req.user.id : 0; 
        JobService.getJobType().then(function(job_type){
            JobService.getJobExperience().then(function(job_experience){
                JobService.getJob(req).then(function(data){
                    JobService.getJobpostDuration(req).then(function(jobpostduration){
                        var return_arr = {
                            Jobs:   data,
                            job_post_duration:jobpostduration,
                            'job_types':job_type,
                            'user_id' : user_id,
                            'job_experiences':job_experience,
                            status: 'OK', 
                            title:  'Jobs'
                        }
                        return_arr['title']= 'Find and Post Your Job | Lynked.World';
                        return_arr['keywords']='Find and Post your Job. Find Internship, Part-Time Job, Contract Job, Freelance Job';
            
                        if(req.isAuthenticated()){
                            UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
                                return_arr['userData'] = userInfo;
                                return_arr['isLogin'] = 1;
                                return res.view('job/list',return_arr);
                            });
                        } else {
                            return_arr['isLogin'] = 0;
                            return_arr['layout'] = 'layouts/loginLayout';
                            return res.view('job/list',return_arr);
                        }
                    });
                });
            });
        });
    },
	
    jobDetail: function(req, res){
        JobService.jobDetail(req,req.user.id).then(function(result){
            if(result && result.length > 0){
                var company_id = 0;
                if(typeof result[0].company_id != 'undefined' && typeof result[0].company_id.id!='undefined' && result[0].company_id.id!=''){
                    company_id = result[0].company_id.id;
                }
                CompanyTeamMembers.find({company_id:company_id,select:['id']})
                    .populate('user_id',{select:['name','slug','profile_image','headline','address']})
                    .populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
                    .populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
            
                    .exec(function(err,list_members){ 
                    UserDataService.UserInfoForJobs(req.user.id).then(function(userInfo){
                        UserDataService.UserDetails(req,result[0].user_id.id).then(function(job_userInfo){
                            JobService.getPeopleAlsoViewedJob(req,req.user.id).then(function(PeopleAlsoViewedJobService){
                                FollowService.companyFollowCount(req,company_id).then(function(company_follow_count){

                                    var job_title =  'Jobs | Lynked World';
                                  if(typeof result[0].title!='undefined'){
                                        job_title =  result[0].title+' | Lynked World';
                                    }

                                    return res.view('job/detail',{
                                        Job:   result[0],
                                        userData:userInfo,
                                        PeopleAlsoViewedJobs : PeopleAlsoViewedJobService.data,
                                        company_follow_count : company_follow_count,
                                        my_team:list_members,
                                        job_userInfo : job_userInfo,
                                        status: 'OK', 
                                        title:  job_title
                                    });
                                });
                            });
                        });
                    });
                });
            } else {
                return res.json({status:result,'msg':'job note found'});
            }
        });
    },
	
    bookMark: function(req, res){
        var bookmark_val = (typeof req.param("bookmark")!='undefined')?req.param("bookmark"):'';
        if(bookmark_val==''){
            return res.json({status:"Error",'msg':'Bookmark Fail,Please try again'});
        }
        
        JobService.bookMark(req,req.user.id).then(function(result){
            if(result){
				if(typeof result != 'undefined') {
					if(result === true){ result = null; }
					/* Activity Log Insert */
					ActivityLogsService.addActivityLog({
						owner_id: req.user.id,
						module: 'job',
						action: 'bookmark',
						object_id: result,
						type: 'web'
					});
				}
                if(bookmark_val==1){
                    return res.json({status:"OK",'msg':'Job Bookmark successfully'});
                }else{
                    return res.json({status:"OK",'msg':'Job Bookmark remove successfully'});
                }
            } else {
                return res.json({status:"Error",'msg':'Bookmark Fail,Please try again'});
            }
        });
    },
	
    bookMarkedJob: function(req, res){
        var user_id = req.user.id;
        JobService.getJob(req,1).then(function(data) {
            UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
                return res.view('job/manage_job',{
                    'Jobs':data,
                    'page_type':'bookmarks',
                    'user_id' : user_id,
                    status: 'OK',
                    title: 'Bookmark Job',
                    userData:userInfo
                });
            });
        });
    },
	
    myJob: function(req, res){
        var user_id = req.user.id;
        JobService.getJob(req,2).then(function(data) {
            UserDataService.UserInfoForJobs(req,req.user.id).then(function(userInfo){
                return res.view('job/manage_job',{
                    'Jobs':data,
                    'user_id' : user_id,
                    'show_like_comment':true,
                    'page_type':'my_jobs',
                    status: 'OK',
                    title: 'My job',
                    userData:userInfo
                });
            });
        });
    },

    myApplication: function(req, res){
        var user_id = req.user.id;
        Applyjob.find({user_id:req.user.id}).sort('createdAt desc').populateAll().exec(function(err,data){
            UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
                // return res.json(data);
                return res.view('job/manage_job',{
                    'Jobs':data,
                    'page_type':'my_application',
                    'user_id' : user_id,
                    status: 'OK',
                    title: 'My Application',
                    userData:userInfo
                });
            });
        });
    },

    getJobsListAjax: function(req,res){
        var user_id = (typeof req.user != 'undefined' && typeof req.user.id != 'undefined') ? req.user.id : 0; 
        JobService.getJob(req).then(function(data){
            var layout ='' 
            if(req.isAuthenticated()){
                layout='job/job_list.ejs';
            }else{
                layout='job/without_login_job_list.ejs'
            }

            return res.render(layout,{
                Jobs:data
            });
        });
    },


    editJob: function(req,res){
        var user_id = req.user.id;
        var job_id  = req.param('id');

        JobService.getJobType().then(function(job_type){
            JobService.getCurrencyCode().then(function(currencyCode){
                JobService.getJobExperience().then(function(job_experience){
                    JobService.getSkill().then(function(skill_list){
                        JobService.getIndustries().then(function(Industries){
                            JobService.getAuthorCompany(user_id).then(function(CurrentCompany){
                                UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
                                    Feeds.findOne({id:job_id}).exec(function (err, jobData){
                                        Job_skills.find({job_id:job_id}).exec(function (err, skills){
                                          if (err) {
                                            return res.serverError(err);
                                          }
                                          if (!jobData) {
                                            return res.notFound('Could not find job data, sorry.');
                                          }

                                           var skill_arr = [];
                                           if(skills.length>0){
                                                skills.forEach(function(data, index){
                                                    skill_arr.push(data.skill_id);
                                                });
                                            }
                                            
                                            return res.view('job/manage_job',{
                                                'job_types':job_type,
                                                'currencyCodes':currencyCode,
                                                'skill_lists' : skill_list,
                                                'Industries' : Industries,
                                                'job_experiences':job_experience,
                                                'CurrentCompanys':CurrentCompany,
                                                'my_skill':skill_arr,
                                                'job':jobData,
                                                userData:userInfo,
                                                'page_type':'edit_post_job',
                                                status: 'OK',
                                                title: 'Update Job Detail | Lynked World'                            
                                            });
                                         });
                                     });
                                });                           
                            });
                        });
                    });
                });
            });
        });
    },

    updateJob:function(req,res){
        var user_id = req.user.id;
        var job_id  = (typeof req.param('id')!='undefined' && req.param('id')!='')?req.param('id'):'';

        if(job_id==''){
            return res.json({status:"Error",'msg':'ID not found'});
        }

        var job_arr = {user_id : user_id};
        var title_new = '';

        if(typeof req.param("title")!='undefined' && req.param("title")!=''){
            job_arr.title   =  req.param("title");
            title_new       =  req.param("title");
        }
        if(typeof req.param("company")!='undefined' && req.param("company")!=''){
            job_arr.company_id =req.param("company");
        }
        if(typeof req.param("location")!='undefined' && req.param("location")!=''){
            job_arr.location =req.param("location");
        }
        if(typeof req.param("industrie")!='undefined' && req.param("industrie")!=''){
            job_arr.industrie_id =req.param("industrie");
        }
        if(typeof req.param("job_type")!='undefined' && req.param("job_type")!=''){
            job_arr.job_type_id =req.param("job_type");
        }
        if(typeof req.param("experience")!='undefined' && req.param("experience")!=''){
            job_arr.experience_id =req.param("experience");
        }
        if(typeof req.param("salary")!='undefined' && req.param("salary")!=''){
            job_arr.salary =req.param("salary");
        }
        if(typeof req.param("description")!='undefined' && req.param("description")!=''){
            job_arr.feed_details =req.param("description");
        }

        if(typeof req.param("status")!='undefined' && req.param("status")!=''){
            job_arr.status =req.param("status");
        }

        if(typeof req.param("contact_job_poster")!='undefined' && req.param("contact_job_poster")!=''){
            job_arr.contact_job_poster =req.param("contact_job_poster");
        }else{
             job_arr.contact_job_poster='';
        }

        Feeds.findOne({id:job_id}).exec(function (err, job_data){
            if (err) {
                return res.json({data:err,status:"Error",'msg':'Fail to update'});
            }
            if (!job_data) {
                return res.json({status:"Error",'msg':'Record not found'});
            }
            
            var job_slug    = title_new.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLowerCase();
                job_slug    = job_slug + Math.floor(Math.random()*(1-10000+1)+1);
            
            Feeds.find({slug:job_slug}).exec(function(err,found){
                if(found.length>0){
                    job_slug =  job_slug + Math.floor(Math.random()*(1-10000+1)+1);
                }

                if(title_new.toLowerCase().trim()!=job_data.title.toLowerCase().trim()){
                    job_arr.slug=job_slug;
                }
                
                Feeds.update(job_id,job_arr).exec(function afterwards(err, updated){
                    if (err) {
                       return res.json({data:err,status:"Error",'msg':'Fail to update'});
                    }

                    if(typeof req.param("skills")!='undefined' && req.param("skills")!=''){
                        skills = req.param("skills");

                        Job_skills.destroy({job_id:job_id}).exec(function (err){
                            if (err) {
                                console.log(err);
                            }
                            
                            if(Array.isArray(skills)){
                                var skill_id = skills;
                            }else{
                                var skill_id = [skills];
                            }
                               
                            skill_id.forEach(function(skill, index){
                                var _newSkill = {};
                                Skills.count({id:skill}).sort('title').exec(function (err, found){
                                    if(found>0){
                                        _newSkill = {
                                            job_id:job_id,
                                            skill_id:skill
                                        };
                                        Job_skills.create(_newSkill).exec(function(err,result){});

                                    }else{
                                        var skill_data={title:skill.trim()};
                                         Skills.findOne({ title:skill.trim()}).exec(function (err, sdata){
                                            if(!sdata){
                                                 Skills.create(skill_data).exec(function (err, data){
                                                    _newSkill = {
                                                        job_id:job_id,
                                                        skill_id:data.id
                                                    };
                                                    Job_skills.create(_newSkill).exec(function(err,result){});
                                                });
                                             }else{
                                                _newSkill = {
                                                    job_id:job_id,
                                                    skill_id:sdata.id
                                                };
                                                Job_skills.create(_newSkill).exec(function(err,result){});
                                             }
                                        });
                                    }
                                })
                            });
                        });
                    }
                    return res.json({status:"OK",'msg':'Job detail update successfully'});
                });
            });
        });
    },

    deleteJobData: function(req,res){
        var user_id = (typeof req.user!='undefined' && req.user!='')?req.user.id:'';
        var job_id = (typeof req.param('id')!='undefined' && req.param('id')!='')?req.param('id'):'';

        if(job_id==''){
            return res.json({status:"Error",'msg':'ID not found'});
        }

        if(user_id==''){
            return res.json({status:"Error",'msg':'User not found,Please try again'});
        }

        
        Feeds.findOne({id:job_id}).exec(function(err,_blog){
            if(req.user.id!=_blog.user_id){
                return res.json({status:"Error",'msg':'Internal server error.'});
            }

            Feeds.update(job_id,{is_deleted:1,status:0}).exec(function(){
                return res.json({status:"OK",'msg':'Job deleted successfully'});
            });
        });

        /*Feeds.destroy({id:job_id}).exec(function (err){
            if (err) {
                return res.json({status:"Error",'msg':'Fail to delete'});
            }
            Applyjob.destroy({feed_id:job_id}).exec(function (err){
                if(err) {
                    return res.json({status:"Error",'msg':'Fail to delete'});
                }
                Job_bookmark.destroy({job_id:job_id}).exec(function (err){
                    if(err) {
                        return res.json({status:"Error",'msg':'Fail to delete'});
                    }
                    Job_skills.destroy({job_id:job_id}).exec(function (err){
                        if(err) {
                            return res.json({status:"Error",'msg':'Fail to delete'});
                        }
                        FeedComment.destroy({feed_id:job_id}).exec(function (err){
                            if(err) {
                                return res.json({status:"Error",'msg':'Fail to delete'});
                            }
                            Feedlike.destroy({feed_id:job_id}).exec(function (err){
                                if(err) {
                                    return res.json({status:"Error",'msg':'Fail to delete'});
                                }
                                FeedMedia.destroy({feed_id:job_id}).exec(function (err){
                                    if(err) {
                                        return res.json({status:"Error",'msg':'Fail to delete'});
                                    }
                                    
                                    return res.json({status:"OK",'msg':'Job deleted successfully'});
                                });
                            });
                        });
                    });
                });
            });
        });*/
    },

    load_more_jobs:function(req,res){
        var user_id = (typeof req.user != 'undefined' && typeof req.user.id != 'undefined') ? req.user.id : 0; 
        JobService.getJob(req).then(function(data){
             if(req.isAuthenticated()){
                return res.render('ajax/load_more_job',{
                    Jobs:data
                });
            }else{
                 return res.render('ajax/load_more_job_without_login',{
                    Jobs:data
                });
            }
        });
    },

    received_application:function(req,res){
        var user_id = req.user.id;
        var filter = {
            user_id:user_id,
            type:"J",
            is_deleted : { "!" : 1 },
            // applyjob : { "$elemMatch": { "$size": 0 } }
        };

        Feeds.find(filter)
        .populate("applyjob")
        .populate("applyjob.user_id")
        .populate('applyjob.user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
        .populate('applyjob.user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
        .sort("createdAt DESC")
        .exec(function(err,appliedjobs){
            // return res.json(appliedjobs);
            UserDataService.UserDetails(req,user_id).then(function(userInfo){
                return res.view('job/manage_job',{
                    status: 'OK',
                    title: 'Received Application',
                    page_type:'receivedapplication',
                    userData:userInfo,
                    appliedJobs:appliedjobs,
                    moment: moment,
                });
            });
        });
    }
};

