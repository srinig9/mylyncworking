// api/services/SearchService.js
var Promise = require('promise');

var page = 1;
var limit = 5;

module.exports = {
	_config: {
		model: ['Companies']
	},

	/**
	* Send a customized welcome email to the specified email address.
	*
	* @required {String} emailAddress
	*   The email address of the recipient.
	* @required {String} firstName
	*   The first name of the recipient.
	*/
	searchBlogs: function(req, user_id) {
		
		page = (req.param("page_no") != undefined && req.param("page_no") != '') ?  req.param("page_no") : 1;
		return new Promise(function (fulfill, reject){
			var condition = { type: "B", 
								or : [
									{ feed_details: { 'like': '%'+req.param("keyword")+'%' } },
									{ title: { 'like': '%'+req.param("keyword")+'%' } },
									{
										'user_id':{
											name: { 'like': '%'+req.param("keyword")+'%' },
										}
									}
								] 
							};

			Feeds.count().where(condition).populate("user_id",{'select':['id','name','slug','profile_image']}).exec(function(err,count){
				Feeds.find()
				.where(condition)
				.populate("user_id",{'select':['id','name','slug','profile_image']})
				.paginate({page: page, limit: limit}).exec(function(err,blogs){
					if (err){
						fulfill(err);
					} else {
						fulfill({data:{"feeds": blogs, 
									"profile_image_url": sails.config.appUrlwPort + sails.config.profile_image_url},count:count});
					}
				});
			});
		});
	},

	searchJob: function(req, user_id) {
        var filter = {'type':'J'};
        if(req.param("keyword") != undefined && req.param("keyword") != ''){
            filter = {'type':'J','title': { 'like': '%'+req.param("keyword")+'%' } };
        }

        var page = (req.param("page_no") != undefined && req.param("page_no") != '') ?  req.param("page_no") : 1;

		return new Promise(function (fulfill, reject){
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
			.paginate({page:page, limit: 10})
			.sort('createdAt DESC')
				.exec(function(err,jobs){
					Feeds.count().where(filter)
						.exec(function(err,count){
				            fulfill({data:{"jobs": jobs, 
									"profile_image_url": sails.config.appUrlwPort + sails.config.profile_image_url},count:count});
			        });
			});
		});
	},

	searchUsers: function(req, user_id) {
		page = (req.param("page_no") != undefined && req.param("page_no") != '') ?  req.param("page_no") : 1;

		return new Promise(function (fulfill, reject){
	        BlockUserService.getBlockUsers(user_id).then(function(blockusers){
	            user_ids = blockusers.concat([user_id]);
	            var condition = {
	            	id: {
	            		"$nin" : user_ids
	            	},
	            	company_id: null,
					'$or' : [
								{ name: { 'like': '%'+req.param("keyword")+'%' } },
								{ email: { 'like': '%'+req.param("keyword")+'%' } },
								{ loginid: { 'like': '%'+req.param("keyword")+'%' } }
							] 
	            };

				Users.count().where(condition).exec(function(err,count){
					Users.find().where(condition)
				    .populate('receiverequest',{limit:1,select:['createdAt','updatedAt','status'],where:{'to_user_id':user_id}})
				    .populate('sendrequest',{limit:1,select:['createdAt','updatedAt','status'],where:{'user_id':user_id}})
					.populate('userexperiences',{limit:1,select:['title'],sort:{display_status:-1,current_work:-1}})
					.populate('userexperiences.company_id',{limit:1,select:['company_name','slug'],sort:{display_status:-1,current_work:-1}})
					.paginate({page: page, limit: limit}).exec(function(err,connections){
						if (err){
							fulfill(err);
						} else {
							connections.forEach(function (connection, index) {
								if(typeof connections[index]['userexperiences'] != 'undefined' && connections[index]['userexperiences'].length > 0){
									if(typeof connections[index]['userexperiences'][0]['user_id'] != 'undefined'){
										delete connections[index]['userexperiences'][0]['user_id'];
									}
									if(typeof connections[index]['userexperiences'][0]['company_name'] != 'undefined'){
										delete connections[index]['userexperiences'][0]['company_name'];
									}
									if(typeof connections[index]['userexperiences'][0]['description'] != 'undefined'){
										delete connections[index]['userexperiences'][0]['description'];
									}
									if(typeof connections[index]['userexperiences'][0]['from_month'] != 'undefined'){
										delete connections[index]['userexperiences'][0]['from_month'];
									}
									if(typeof connections[index]['userexperiences'][0]['from_year'] != 'undefined'){
										delete connections[index]['userexperiences'][0]['from_year'];
									}
									if(typeof connections[index]['userexperiences'][0]['to_year'] != 'undefined'){
										delete connections[index]['userexperiences'][0]['to_year'];
									}
									if(typeof connections[index]['userexperiences'][0]['to_month'] != 'undefined'){
										delete connections[index]['userexperiences'][0]['to_month'];
									}
									if(typeof connections[index]['userexperiences'][0]['createdAt'] != 'undefined'){
										delete connections[index]['userexperiences'][0]['createdAt'];
									}
									if(typeof connections[index]['userexperiences'][0]['updatedAt'] != 'undefined'){
										delete connections[index]['userexperiences'][0]['updatedAt'];
									}
									if(typeof connections[index]['userexperiences'][0]['display_status'] != 'undefined'){
										delete connections[index]['userexperiences'][0]['display_status'];
									}
								}
								if(typeof connections[index]['loginid'] != 'undefined'){
									delete connections[index]['loginid'];
								}
								if(typeof connections[index]['email'] != 'undefined'){
									delete connections[index]['email'];
								}
								if(typeof connections[index]['password'] != 'undefined'){
									delete connections[index]['password'];
								}
								if(typeof connections[index]['referral'] != 'undefined'){
									delete connections[index]['referral'];
								}
								/* if(typeof connections[index]['createdAt'] != 'undefined'){
									delete connections[index]['createdAt'];
								} */
								if(typeof connections[index]['updatedAt'] != 'undefined'){
									//delete connections[index]['updatedAt'];
								}
								if(typeof connections[index]['cover_image'] != 'undefined'){
									delete connections[index]['cover_image'];
								}
								if(typeof connections[index]['headline'] != 'undefined'){
									delete connections[index]['headline'];
								}
								if(typeof connections[index]['about_me'] != 'undefined'){
									delete connections[index]['about_me'];
								}
								if(typeof connections[index]['location'] != 'undefined'){
									delete connections[index]['location'];
								}
								if(typeof connections[index]['country'] != 'undefined'){
									delete connections[index]['country'];
								}
								if(typeof connections[index]['state'] != 'undefined'){
									delete connections[index]['state'];
								}
								if(typeof connections[index]['city'] != 'undefined'){
									delete connections[index]['city'];
								}
								if(typeof connections[index]['industry_id'] != 'undefined'){
									delete connections[index]['industry_id'];
								}
								if(typeof connections[index]['language_id'] != 'undefined'){
									delete connections[index]['language_id'];
								}
								if(typeof connections[index]['socket_id'] != 'undefined'){
									delete connections[index]['socket_id'];
								}
								if(typeof connections[index]['is_verify_phone'] != 'undefined'){
									delete connections[index]['is_verify_phone'];
								}
								if(typeof connections[index]['ethaddress'] != 'undefined'){
									delete connections[index]['ethaddress'];
								}
							});
							fulfill({ data:{"records": connections, 
									"profile_image_url": sails.config.appUrlwPort + sails.config.profile_image_url},
									count:count });
						}
					});
				});
			});
		});
	},

	searchCompanies: function(req, user_id) {
		page = (req.param("page_no") != undefined && req.param("page_no") != '') ?  req.param("page_no") : 1;

		return new Promise(function (fulfill, reject){

			var condition = {
				company_name: { 
					'like': '%'+req.param("keyword")+'%' 
				},
				'companydata':{
					id : {
						"$exists" : true,
						"$ne" : ""
					},
				}
			};
			
			Companies.count().where(condition).populate("companydata").exec(function(err,count){
				Companies.find(condition)
				.populate("companydata")
				.populate("followers",{where:{user_id:user_id}})
				.paginate({page: page, limit: limit})
				.exec(function(err,companies){
					if (err){
						fulfill(err);
					} else {
						fulfill({data:{"records": companies, 
									"profile_image_url": sails.config.appUrlwPort + sails.config.profile_image_url},count:count});
					}
				});
			});
		});
	},

	searchRecords: function(req,user_id){
		return new Promise(function (resolve, reject){
			var all_search_result_count = 0;
			var companycondition = {
				company_name: { 
					'like': '%'+req.param("keyword")+'%' 
				},
				'companydata':{
					id : {
						"$exists" : true,
						"$ne" : ""
					},
				}
			};
			SearchService.searchUsers(req,user_id).then(function(users){
				
				Companies.count().where(companycondition).populate("companydata").populate("followers").exec(function(err,companies_count){
					if (err){
						reject(err);
					} else {
						var blogscondition = { type: "B", 
								or : [
									{ feed_details: { 'like': '%'+req.param("keyword")+'%' } },
									{ title: { 'like': '%'+req.param("keyword")+'%' } },
									{
										'user_id':{
											name: { 'like': '%'+req.param("keyword")+'%' },
										}
									}
								] 
							};
						Feeds.count().where(blogscondition).populate("user_id",{'select':['id','name','slug','profile_image']}).exec(function(err,blogs_count){
							if (err){
								reject(err);
							} else {
								var jobscondition = {'type':'J','title': { 'like': '%'+req.param("keyword")+'%' } };
								Feeds.count().where(jobscondition).populate("user_id",{'select':['id','name','slug','profile_image']}).exec(function(err,jobs_count){
									all_search_result_count = users.count + companies_count + blogs_count + jobs_count;  
										
									return_arr ={
										status:"OK",
										msg: "Search records found",
										jobscount:jobs_count,
										blogCount:blogs_count,
										all_search_result_count : all_search_result_count,
										searchusers: users.data,
										searchuserscount: users.count,
										searchcompaniescount: companies_count,
										limit:limit,
									}
									
									resolve(return_arr);
								});
							}
						});
					}
				});
			});
		});
	},
};