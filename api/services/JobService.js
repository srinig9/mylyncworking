var Promise = require('promise');
var moment = require('moment')
var path = require("path");
var fs = require('fs');
module.exports = {
    _config: {
        model: ['Job_type','UserCompany','Job_salary','Job_experience','Job_post','FeedSpams']
    },
	
    getJobType: function() {
        var promise = new Promise(function (resolve, reject) {
        var jobarr='';
            Job_type.find().exec(function (err, Job_type){
                if(err){
                    resolve(false);
                } else {
                    var count = 0;
                    Job_type.forEach(function(val,indx){
                        //jobarr.job_data=Job_type[indx];
                        Job_type[indx].count = 0
                        var promise_Feeds_count = new Promise(function (resolve_Feeds_count, reject_Feeds_count) {
                           Feeds.find({job_type_id:val.id},{select:['job_type_id']}).exec(function (error, Feeds_found) {
                            if(Feeds_found.length > 0){
                                resolve_Feeds_count({job_type_id : Feeds_found[0].job_type_id,job_count : Feeds_found.length});
                            } else {
                                resolve_Feeds_count(false);
                            }
                           });
                       });
                        promise_Feeds_count.then(function(count_data){
                            count++;
                            if(count_data) {
                                for(i = 0 ;i<Job_type.length ; i++){
                                    if(Job_type[i].id ==count_data.job_type_id) {
                                        Job_type[i].count = count_data.job_count
                                    }
                                }
                                 //console.log(Job_type);
                            }
                            if(count == Job_type.length){
                                 resolve(Job_type);
                            }
                        });
                    });
                }
            });
        });
        return promise;
    },
	
    getSkill: function(){
             
        var promise = new Promise(function (resolve, reject) {
            Skills.find().sort('title').exec(function (err, skills){
                if(err){
                    resolve(false);
                } else {
                    resolve(skills);
                }
            });
        });
        return promise;
    },
	
    getJobExperience: function() {
        var promise = new Promise(function (resolve, reject) {
            Job_experience.find().exec(function (err, job_experience){
                if(err){
                    resolve(false);
                } else {
                     var count = 0;

                      job_experience.forEach(function(val,indx){
                        job_experience[indx].count = 0
                        var promise_Feeds_count = new Promise(function (resolve_Feeds_count, reject_Feeds_count) {
                           Feeds.find({experience_id:val.id},{select:['experience_id']}).exec(function (error, Feeds_found) {
                            if(Feeds_found.length > 0){
                                resolve_Feeds_count({experience_id : Feeds_found[0].experience_id,job_count : Feeds_found.length});
                            } else {
                                resolve_Feeds_count(false);
                            }
                           });
                       });
                        promise_Feeds_count.then(function(count_data){
                            count++;
                            if(count_data) {
                                for(i = 0 ;i<job_experience.length ; i++){
                                    if(job_experience[i].id ==count_data.experience_id) {
                                        job_experience[i].count = count_data.job_count
                                    }
                                }
                                 //console.log(Job_type);
                            }
                            if(count == job_experience.length){
                                 resolve(job_experience);
                            }
                        });
                    });
                }
            });
        });
        return promise;
    },
	
    getIndustries: function(user_id) {
        var promise = new Promise(function (resolve, reject) {
            Industries.find().exec(function(err, industries) {
                 if(err){
                    resolve(false);
                } else {
                    resolve(industries);
                }
            });
        });
        return promise;
    },
	
    getCurrencyCode: function(user_id) {
        var promise = new Promise(function (resolve, reject) {
            Currency_code.find().exec(function(err, Currency_code) {
                 if(err){
                    resolve(false);
                } else {
                    resolve(Currency_code);
                }
            });
        });
        return promise;
    },
    
    getAuthorCompany: function(user_id) {
        var promise = new Promise(function (resolve, reject) {
            CompanyTeamMembers.find({user_id : user_id,allow_job_post:1}).populate("company_id",{select:['company_name']}).exec(function(err,User_Company){
                if(err){
                    resolve(false);
                } else {
                    console.log(User_Company);
                    resolve(User_Company);
                }
            });
        });
        return promise;
    },
    
    saveJobPost: function(req,user_id){
        var job_slug = req.param("title").replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLowerCase();
        return new Promise(function (resolve, reject) {
            Feeds.find({slug:job_slug}).exec(function(err,found){
                if(found.length > 0){
                    job_slug =  job_slug + Math.floor(Math.random()*(1-10000+1)+1);
                }
                var job_arr = {
                    user_id : user_id,
                    contact_job_poster : req.param("contact_job_poster"), 
                    title : req.param("title"),
                    group_id : '',
                    type : "J",
                    privacy : '0',
                    slug: job_slug,
                    company_id : req.param("company"),
                    location : req.param("location"),
                    industrie_id : req.param("industrie"),
                    job_type_id : req.param("job_type"),
                    experience_id : req.param("experience"),
                    salary : req.param("salary"),
                    feed_details : req.param("description"),
                    status : '1'
                };

                Feeds.create(job_arr).exec(function (err, records) {
                    if(err){
                        resolve(false);
                    }else{
                        skills = req.param("skills");
                        // Add Job Skill
                        if(typeof skills != 'undefined' && skills != ''){
                            if(Array.isArray(skills)){
                                skill_id = skills;
                            }else{
                                skill_id = [skills];
                            }
                            skill_id.forEach(function(skill, index){
                                var _newSkill = {};

                                Skills.count({id:skill}).sort('title').exec(function (err, found){
                                    if(found>0){
                                        _newSkill = {
                                            job_id:records.id,
                                            skill_id:skill
                                        };
                                        Job_skills.create(_newSkill).exec(function(err,result){});

                                    }else{
                                        var skill_data={title:skill.trim()};

                                         Skills.findOne({ title:skill.trim()}).exec(function (err, sdata){
                                            if(!sdata){
                                                 Skills.create(skill_data).exec(function (err, data){
                                                    _newSkill = {
                                                        job_id:records.id,
                                                        skill_id:data.id
                                                    };
                                                    Job_skills.create(_newSkill).exec(function(err,result){});
                                                });
                                             }else{
                                                _newSkill = {
                                                    job_id:records.id,
                                                    skill_id:sdata.id
                                                };
                                                Job_skills.create(_newSkill).exec(function(err,result){});
                                             }
                                        });
                                    }
                                })
                            });
                            // resolve(records.id);
                        }
                        // END
                        resolve(records.id);
                    }
                });
            });
        });
    },
	
    getJob: function(req,job_type = null,pass_user_id = null){
        var filter  = {};
        var user_id = (typeof req.user != 'undefined' && typeof req.user.id != 'undefined') ? req.user.id : 0; 
        if(pass_user_id != null){
            user_id = pass_user_id;
        }

        if(job_type == null) {
            filter  = {'type':'J','status':'1'};
        } else if(job_type == 1) {//bookmarks
            filter  = {'type':'J','status':'1','jobBookmarks':{user_id : {"$exists" : true, "$ne" : ""}}};
        } else if(job_type == 2) {//my posted job
            
            if(req.path=="/jobs/myjob"){
                filter  = {'type':'J','user_id':user_id};
            }
            else{
                filter  = {'type':'J','status':'1','user_id':user_id};
            }
        }

        if(req.method == 'POST') {
            if(req.param("keywords") != undefined && req.param("keywords") != ''){
                filter['$or'] =[
                                { title: { 'like': '%'+req.param("keywords")+'%' } },
                                { salary: { 'like': '%'+req.param("keywords")+'%' } },
                                { location: { 'like': '%'+req.param("keywords")+'%' }},
                                { feed_details: { 'like': '%'+req.param("keywords")+'%' }}
                            ];
            } 

            if(req.param("search_job_type") != undefined && req.param("search_job_type") != ''){
                filter['job_type_id'] = req.param("search_job_type").split(',');
            }
            if(req.param("search_job_experience") != undefined && req.param("search_job_experience") != ''){
                filter['experience_id'] = req.param("search_job_experience").split(',');
            }
            if(req.param("location") != undefined && req.param("location") != ''){
                filter['location'] = {'like':'%'+req.param("location")+"%"};
            }
             if(req.param("contact_job_poster") != undefined && req.param("contact_job_poster") != ''){
                filter['contact_job_poster'] = req.param("contact_job_poster").trim();
            }

            var date_condition={};
            var past24hours = moment().subtract(24, 'hours').toDate();
            var pastweek = moment().subtract(1, 'week').toDate();
            var pastmonth = moment().subtract(1, 'month').toDate();



            if(req.param("any_job")== undefined){
                if(req.param("past_24") != undefined && req.param("past_24") != ''){
                     filter['$or'] = [ { createdAt: {">":past24hours}}];
                }
                if(req.param("past_week") != undefined && req.param("past_week") != ''){
                    filter['$or'] = [ { createdAt: {">":pastweek}}];
                }
                if(req.param("past_month") != undefined && req.param("past_month") != ''){
                    filter['$or'] = [ { createdAt: {">":pastmonth}}];
                }
            }
        }

        if(user_id == 0) {
            filter['is_feature_job'] = 1;
        }

        var page_no = 1;
        if(req.param("page_no") != undefined && req.param("page_no") != ''){
            page_no = req.param("page_no");
        }

        var promise = new Promise(function (resolve, reject) {
            FeedSpams.find({user_id:user_id}).exec(function(err,FeedSpams){
                var SpamsFeeds = [];
                if(FeedSpams.length>0){
                    FeedSpams.forEach(function(FeedSpam, index){
                        SpamsFeeds.push(FeedSpam.feed_id);
                    });
                }

                if(SpamsFeeds.length>0){
                    filter['id'] =  { "$nin" : SpamsFeeds };
                }

            //Job_post.find().populate('Users').populate('UserExperiences').populate('Job_type').populate('Job_experience').populate('Job_salary').exec(function(err, data) {
            Feeds.find(filter)
                .populate('jobBookmarks',{'where' : {user_id:user_id}})
                .populate('user_id',{'select':['slug','name','profile_image']})
                .populate('company_id',{'select':['id','company_name']})
                .populate('company_id.companydata',{select : ['slug','cover_image','profile_image','email']})
                .populate('job_type_id',{'select':['id','title']})
                .populate('experience_id',{'select':['id','title']})
                .populate('feedcomments', { sort: 'createdAt ASC' })
                .populate('feedcomments.commentlikes')
                .populate('feedcomments.commentreply')
                .populate('feedcomments.commentreply.commentlikes')
                .populate('feedcomments.commentreply.user_id', {'select':['slug','name','profile_image']})
                .populate('feedcomments.user_id', {'select':['slug','name','profile_image']})
                .populate('feedlikes')
                .paginate({page:page_no, limit: 4})
                .sort('createdAt DESC')
                .then(function(data) {
                    
                    data.feed_count=data.length;

                    resolve(data);
                }).catch(function(err) {
                    console.log(err);
                });
            });
        });
        return promise;
    },
    
    bookMark: function(req,user_id) {

        var bookmark_arr = {user_id : user_id,job_id : req.param("job_id")};
        var bookmark = req.param("bookmark");
        
        var promise = new Promise(function (resolve, reject) {
            if(bookmark == 1) {
                Job_bookmark.create(bookmark_arr).exec(function (err, records) {
                    if(err) {
                        resolve(false);
                    } else {
                        resolve(records.id);
                    }
                });
            } else {
                Job_bookmark.destroy(bookmark_arr).exec(function (err) {
                    if(err) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            }
        });
        return promise;
    },
	
    jobDetail: function(req,user_id){

        var job_slug = req.param("slug");
        var promise = new Promise(function (resolve, reject) {
            Feeds.find({'type':'J','status':'1','slug':job_slug})
                .populate('jobBookmarks',{'where' : {user_id:user_id}})
                .populate('user_id',{'select':['id','name','profile_image','slug','cover_image']})
                .populate('industrie_id',{'select':['id','name']})
                .populate('company_id')
                .populate('company_id.companydata',{select : ['slug','cover_image','profile_image','email']})
                .populate('job_type_id',{'select':['id','title']})
                .populate('experience_id',{'select':['id','title']})
                .populate('jobSkills')
                .populate('jobSkills.skill_id')
                .then(function(data) {
                    console.log(JSON.stringify(data));
                    if(data[0].company_id != undefined  && data[0].company_id.companydata.length > 0 ) {
                        var industry_id = data[0].company_id.companydata[0]['industry_id'];
                       
                        Industries.findOne({"id" : industry_id}).exec(function(err,arr_industries){
                            data[0]['company_id']['email'] = data[0]['company_id']['companydata'][0]['email'];
                            data[0].company_id['user_companydata'] = data[0].company_id.companydata[0];
                            data[0].company_id.companydata = arr_industries;
                            resolve(data);
                        });
                    } else {
                        resolve(data);
                    }
                }).catch(function(err) {
                    console.log(err);
                });
        });
        return promise;
    },
	
    searchJob: function(req){
        var filter = {'type':'J'};
        if(req.param("keyword") != undefined && req.param("keyword") != ''){
            filter = {'type':'J','title': { 'like': '%'+req.param("keyword")+'%' } };
        }
        var promise = new Promise(function (resolve, reject) {          

            Feeds.find(filter)
                .populate('user_id',{'select':['id','name','profile_image']})
                .populate('company_id',{'select':['id','company_name']})
                .populate('company_id.companydata',{select : ['slug','cover_image','profile_image','email']})
                .populate('job_type_id',{'select':['id','title']})
                .populate('experience_id',{'select':['id','title']})
                .sort('createdAt DESC')
                .then(function(data) {
                    resolve(data);
                }).catch(function(err) {
                    console.log(err);
                });
        });
        return promise;
    },
	
    getPeopleAlsoViewedJob: function(req,user_id){
        var promise = new Promise(function (resolve, reject) {
            Feeds.find({title:{"$exists" : true, "$ne" : ""},'type':'J'})
                .populate('user_id',{'select':['slug','name','profile_image']})
                .populate('company_id',{'select':['id','company_name']})
                .populate('company_id.companydata',{select : ['slug','cover_image','profile_image','email']})
                .populate('job_type_id',{'select':['id','title']})
                .populate('experience_id',{'select':['id','title']})
                .sort('createdAt DESC')
                .paginate({page: 1, limit: 5})
                .then(function(data) {
                    console.log(data);
                    resolve({status:'OK',msg:"People also viewed job list!",data:data});
                }).catch(function(err) {
                    resolve({status:'Error',msg:"Error, People also viewed job list!",data:data});
                });
        });
        return promise;
    },

    getJobpostDuration: function(req,user_id){
        var past24hours = moment().subtract(24, 'hours').toDate();
        var pastweek = moment().subtract(1, 'week').toDate();
        var pastmonth = moment().subtract(1, 'month').toDate();
        var filter = {'type':'J','status':'1'};

        var promise = new Promise(function (resolve, reject) {
            Feeds.find(filter).where({ "createdAt" : { ">": past24hours } }).exec(function(err,past24hoursJobs){
                Feeds.find(filter).where({ "createdAt" : { ">": pastweek } }).exec(function(err,pastweekJobs){
                    Feeds.find(filter).where({ "createdAt" : { ">": pastmonth } }).exec(function(err,pastmonthJobs){
                        Feeds.count(filter).exec(function countCB(error, all_jobs) {
                            resolve({"past24hoursJobs":past24hoursJobs, "pastweekJobs":pastweekJobs, "pastmonthJobs":pastmonthJobs,"all_jobs":all_jobs});
                        })
                    });
                });
            });
        });
        return promise;
    },

    follow: function(req, user_id) {
		return new Promise(function (fulfill, reject){
			var _newfollow = {
			    company_id: req.param("company_id"),
			    user_id: user_id,
			    status: '0',
			    is_authorized: '0',
			    is_member: '0'
			};
            Follow.find({company_id: req.param("company_id"), user_id: user_id}).exec(function(err,found){
                if(found.length < 0 && req.param("company_id")!=""){
                    Follow.create(_newfollow).exec(function(err,_follow){
                        fulfill(_follow);
                    });
                }
                fulfill("");
            });
			
		});
	},

	jobApply: function(req,user_id){
		return new Promise(function (fulfill, reject){
            var company_id = req.param("company_id") != undefined ? req.param("company_id") : '';
            if(req.param("job_id")=='undefined' || req.param("job_id")==''){
                fulfill({
                    status: "Error",
                    msg: "Job ID can not blank"
                });
            }
             var _newapplyJob = {
                user_id: user_id,
                feed_id: req.param("job_id"),
                company_id: company_id,
            };
            
            Applyjob.count({user_id:user_id,feed_id:req.param("job_id")}).exec(function countCB(error, found) {
                if(found>0){
                    fulfill({
                        status: "Error",
                        msg: "You have already applied for this Job"
                    });
                } else {
                    req.file('filename').upload({
                        dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/applyjob'),
                        maxBytes: 5000000,  //5mb
                    },function (err, uploadedFiles) {
                        if(err) {
                            fulfill({
                                status: "Error",
                                msg: "Something went wrong. Please try again."
                            });
                        } else if(uploadedFiles.length==0) {
                            _newapplyJob.resume='';
                        } else {
                            var allowedTypes = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/doc', 'application/docx', 'application/DOC', 'application/DOCX'];
                            var extension = uploadedFiles[0].type;

                            if(allowedTypes.indexOf(extension)=== -1){
                                fulfill({
                                    status:'Error',
                                    msg: 'File type is not valid'
                                });
                            }
                            
                            var fd = uploadedFiles[0].fd;
                            var myarr = fd.split("\\");
                            var filename = path.basename(myarr[myarr.length-1]);
                            _newapplyJob.resume = filename;
                        }

                        Applyjob.create(_newapplyJob).exec(function(err,_data){
                            if(err){
                                fulfill({
                                    status: "Error",
                                    msg: "Something went wrong. Please try again111."
                                });
                            }
                            if(company_id != ''){
                                JobService.follow(req,user_id).then(function(data){
                                    fulfill({
                                        status: "OK",
                                        msg: "Job has been applied successfully"
                                    });
                                });
                            } else {
                                fulfill({
                                    status: "OK",
                                    msg: "Job has been applied successfully"
                                });
                            }
                        });
                    });
                }
            });
            
        });
	},
};    