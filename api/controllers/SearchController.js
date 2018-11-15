/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var page = 1;
var limit = 10;

module.exports = {

	searchBlogs: function(req, res) {
		var user_id = (req.user != undefined && req.user.id != undefined) ?  req.user.id : 0;
		page = (req.param("page_no") != undefined && req.param("page_no") != '') ?  req.param("page_no") : 1;
		return new Promise(function (fulfill, reject){
			var condition = { 
				'user_id':{
					status:{"$ne":"0"}
				},
				type: "B", 
				or : [
					{ feed_details: { 'like': '%'+req.param("keyword")+'%' } },
					{ title: { 'like': '%'+req.param("keyword")+'%' } },
					{
						'user_id':{
							name: { 'like': '%'+req.param("keyword")+'%' }
						}
					}
				] 
			};

			Feeds.count().where(condition).populate("user_id").exec(function(err,count){
				Feeds.find().where(condition).populate("user_id").paginate({page: page, limit: limit}).exec(function(err,blogs){
					if (err){
						fulfill(err);
					} else {
						fulfill({data:blogs,count:count});
					}
				});
			});
		});
	},

	searchJob: function(req, res) {
        var filter = {
        	'type':'J',
        	'user_id':{
        		status:{"$ne":"0"}
        	}
        };
        if(req.param("keyword") != undefined && req.param("keyword") != ''){
            filter = {
            	'type':'J',
            	'title': { 'like': '%'+req.param("keyword")+'%' },
	        	'user_id':{
	        		status:{"$ne":"0"}
	        	}
            };
        }

        var page = (req.param("page_no") != undefined && req.param("page_no") != '') ?  req.param("page_no") : 1;

		return new Promise(function (fulfill, reject){
			Feeds.find(filter)
                .populate('user_id',{'select':['id','name','profile_image']})
                .populate('company_id',{'select':['id','company_name']})
                .populate('company_id.companydata',{select : ['slug','cover_image','profile_image','email']})
                .populate('job_type_id',{'select':['id','title']})
                .populate('experience_id',{'select':['id','title']})
                .paginate({page: page, limit: limit})
                .sort('createdAt DESC')
				.exec(function(err,jobs){
					Feeds.count().where(filter)
						.exec(function(err,count){
				            fulfill({data:jobs,count:count});
			        });
			});
		});
	},

	searchUsers: function(req, res) {
		var user_id = (req.user != undefined && req.user.id != undefined) ?  req.user.id : 0;
		page = (req.param("page_no") != undefined && req.param("page_no") != '') ?  req.param("page_no") : 1;

		return new Promise(function (fulfill, reject){
	        BlockUserService.getBlockUsers(user_id).then(function(blockusers){
	            user_ids = blockusers.concat([user_id]);
	            var condition = {
	            	id: {
	            		"$nin" : user_ids,
	            	},
	            	status:{
	            		"$ne" : "0",
	            	},
	            	company_id: null,
	            	// '$or' : [
	            	// 	{company_id: null},
	            	// 	{company_id: ""}
	            	// ],
					'$or' : [
						{ name: { 'like': '%'+req.param("keyword")+'%' } },
						{ email: { 'like': '%'+req.param("keyword")+'%' } },
						{ loginid: { 'like': '%'+req.param("keyword")+'%' } }
					]
				};

				Users.count().where(condition).exec(function(err,count){
					Users.find(condition).populate('userexperiences',{limit:1,select:['title'],sort:{display_status:-1,current_work:-1}}).populate('userexperiences.company_id',{limit:1,select:['company_name','slug'],sort:{display_status:-1,current_work:-1}}).paginate({page: page, limit: limit}).exec(function(err,users){
						if (err){
							fulfill(err);
						} else {
							fulfill({data:users,count:count});
						}
					});
				});
			});
		});
	},

	searchCompanies: function(req, res) {
		var user_id = (req.user != undefined && req.user.id != undefined) ?  req.user.id : 0;
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
					status:{
						"$ne" : "0"
					}
				}
			};
			Companies.count().where(condition).populate("companydata").populate("followers").exec(function(err,count){
				Companies.find(condition).populate("companydata").populate("followers").paginate({page: page, limit: limit}).exec(function(err,companies){
					if (err){
						fulfill(err);
					} else {
						fulfill({data:companies,count:count});
					}
				});
			});
		});
	},

	index: function(req,res){
		var self = this;
		var all_search_result_count = 0;
		var user_id = (req.user != undefined && req.user.id != undefined) ?  req.user.id : 0;
		UserConnection.find().where({ or : [
							{ user_id: user_id },
							{ to_user_id: user_id },
						]
					}).exec(function(err,connections){
			self.searchUsers(req).then(function(users){
				self.searchCompanies(req).then(function(companies){
					self.searchBlogs(req).then(function(blogs){
						self.searchJob(req).then(function(jobs){
							UserDataService.UserInfoForJobs(user_id).then(function(userInfo){
								all_search_result_count = users.count + companies.count + blogs.count + jobs.count;  
								// return res.json(users);
								return_arr ={
									status:"OK",
									title: "Search | Lynked.World",
									jobs:jobs.data,
									jobscount:jobs.count,
									blogs:blogs.data,
									blogCount:blogs.count,
									all_search_result_count : all_search_result_count,
									searchusers: users.data,
									searchuserscount: users.count,
									connections: connections,
									searchcompanies: companies.data,
									searchcompaniescount: companies.count,
									userData:userInfo,
									limit:limit,
								}

								if(req.isAuthenticated()){
									return_arr['is_login'] = 1;
									return res.view('search/search',return_arr);
								} else {
									return_arr['is_login'] = 0;
									return_arr['layout'] = 'layouts/loginLayout';
									return res.view('search/search',return_arr);
								}
							});
						});
					});
				});
			});
		});
	},

	load_more_searchusers:function(req,res){
		var self = this;
		var user_id = (req.user != undefined && req.user.id != undefined) ?  req.user.id : 0;

		UserConnection.find().where({ or : [ { user_id: user_id }, { to_user_id: user_id }]}).exec(function(err,connections){		
			self.searchUsers(req).then(function(results){
				if(results.data.length == 0){
					return res.json({searchusers:false});
				}
				return res.render('ajax/load_more_searchusers',{
					searchusers:results.data,
					connections: connections
				});
			});
		});
	},

	load_more_searchcompanies:function(req,res){
		var self = this;
		var user_id = (req.user != undefined && req.user.id != undefined) ?  req.user.id : 0;

		UserConnection.find().where({ or : [ { user_id: user_id }, { to_user_id: user_id }]}).exec(function(err,connections){
			self.searchCompanies(req).then(function(results){
				if(results.data.length == 0){
					return res.json({searchcompanies:false});
				}
				return res.render('ajax/load_more_searchcompanies',{
					searchcompanies:results.data,
					connections: connections
				});
			});
		});
	},

	load_more_searchblogs:function(req,res){
		var self = this;
		var user_id = (req.user != undefined && req.user.id != undefined) ?  req.user.id : 0;

		self.searchBlogs(req).then(function(results){
			if(results.data.length == 0){
				return res.json({blogs:false});
			}
			return res.render('ajax/load_more_searchblogs',{
				blogs:results.data
			});
		});
	},

	load_more_jobs:function(req,res){
		var self = this;
		var user_id = (req.user != undefined && req.user.id != undefined) ?  req.user.id : 0;

		self.searchJob(req).then(function(results){
			if(results.data.length == 0){
				return res.json({jobs:false});
			}
			return res.render('ajax/load_more_searchjobs',{
				jobs:results.data
			});
		});
	},
};

