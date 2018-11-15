// api/services/CompanyService.js
var Promise = require('promise');
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
	addCompany: function (companyID) {
		var promise = new Promise(function (resolve, reject) {
			companyID = companyID.trim();
			if(companyID!=''){
				Companies.findOne().where({ or : [ {id:companyID}, {company_name:companyID} ] }).exec(function(err,companyData) {
					if(!companyData){
						var new_company={
						company_name:companyID,
						status:1
						}
						Companies.create(new_company).then(function (_com) {
							//console.log("come 2");
							resolve(_com.id);
						}).catch(function (error) { 
							//console.log("come 3");
							resolve(false);
						});
					} else {
						//console.log("come 1");
						resolve(companyData.id);
					}
				});
			}else{
				console.log("come");
				resolve(false);
			}
		});
		return promise;
	},
	company_detail: function (req,user_id) {
		return new Promise(function (resolve, reject) {
			Users.findOne({company_id: req.param('company_id')})
				.populate('company_id')
                .exec(function(err,_company) {
				Follow.count({user_id:user_id,company_id:req.param('company_id')}).exec(function countCB(error, follow_count) {
						
					CompanyTeamMembers.find({company_id:req.param('company_id'),select:['id']})
						.populate('user_id',{select:['name','slug','profile_image','headline','address']})
						.populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
						.populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
						.exec(function(err,list_members){    
						Follow.count({company_id:req.param('company_id')}).exec(function countCB(error, follows) {
							if(error){
								console.log(error);
							} else {
								for(i=0;i<list_members.length;i++) {
									
									var user_detail = {};
									if(list_members[i]['user_id']['name'] != undefined){
										user_detail['name'] = list_members[i]['user_id']['name'];
									}
									if(list_members[i]['user_id']['id'] != undefined){
										user_detail['id'] = list_members[i]['user_id']['id'];
									}
									if(list_members[i]['user_id']['slug'] != undefined){
										user_detail['slug'] = list_members[i]['user_id']['slug'];
									}
									if(list_members[i]['user_id']['profile_image'] != undefined){
										user_detail['profile_image'] = list_members[i]['user_id']['profile_image'];
									}
									if(list_members[i]['user_id']['headline'] != undefined){
										user_detail['headline'] = list_members[i]['user_id']['headline'];
									}
									if(list_members[i]['user_id']['address'] != undefined){
										user_detail['address'] = list_members[i]['user_id']['address'];
									}
									if(list_members[i]['user_id']['userexperiences'] != undefined){
										if(list_members[i]['user_id']['userexperiences'].length > 0){
											user_detail['userexperiences'] = {};
											user_detail['userexperiences']['title'] = list_members[i]['user_id']['userexperiences'][0]['title'];
											user_detail['userexperiences']['id'] = list_members[i]['user_id']['userexperiences'][0]['id'];
											user_detail['userexperiences']['company_id'] = list_members[i]['user_id']['userexperiences'][0]['company_id'];
										}
									}
									list_members[i]['user_id'] = {};
									list_members[i]['user_id'] = user_detail;
									if(list_members[i]['allow_verify'] != undefined){
										delete list_members[i]['allow_verify'];
									}
									if(list_members[i]['allow_job_post'] != undefined){
										delete list_members[i]['allow_job_post'];
									}
									if(list_members[i]['user_admin'] != undefined){
										delete list_members[i]['user_admin'];
									}
									if(list_members[i]['super_user'] != undefined){
										delete list_members[i]['super_user'];
									}
									if(list_members[i]['createdAt'] != undefined){
										delete list_members[i]['createdAt'];
									}
									if(list_members[i]['updatedAt'] != undefined){
										delete list_members[i]['updatedAt'];
									}
									if(list_members[i]['status'] != undefined){
										delete list_members[i]['status'];
									}
								}
								
								if(_company['createdAt'] != undefined){
									delete _company['createdAt'];
								}
								if(_company['updatedAt'] != undefined){
									delete _company['updatedAt'];
								}
								if(_company['company_id']['company_name'] != undefined){
									_company['name'] = _company['company_id']['company_name'];
								}
								if(_company['company_id']['slug'] != undefined){
									_company['slug'] = _company['company_id']['slug'];
								}
								if(_company['address']  != undefined){
									_company['headquarters'] = _company['address'];
									delete _company['address'];
								}
								if(_company['company_id']['about_me'] != undefined){
									_company['about_me'] = _company['company_id']['about_me'];
								}
								if(_company['company_id']['company_size'] != undefined){
									_company['company_size'] = _company['company_id']['company_size'];
								}
								if(_company['company_id']['skype'] != undefined){
									_company['skype'] = _company['company_id']['skype'];
								}
								if(_company['company_id']['specialties'] != undefined){
									_company['specialties'] = _company['company_id']['specialties'];
								}
								if(_company['company_id']['website'] != undefined){
									_company['website'] = _company['company_id']['website'];
								}
								if(_company['company_id']['year_founded'] != undefined){
									_company['year_founded'] = _company['company_id']['year_founded'];
								}
								if(_company['company_id']['id'] != undefined){
									_company['id'] = _company['company_id']['id'];
								}
								delete _company['company_id'];
								
								if(_company['loginid'] != undefined){
									delete _company['loginid'];
								}
								if(_company['password'] != undefined){
									delete _company['password'];
								}
								if(_company['is_verify_phone'] != undefined){
									delete _company['is_verify_phone'];
								}
								if(_company['is_verify_email'] != undefined){
									delete _company['is_verify_email'];
								}
								if(_company['language_id'] != undefined){
									delete _company['language_id'];
								}
								
								if(_company['status'] != undefined){
									delete _company['status'];
								}
								if(_company['loginid'] != undefined){
									delete _company['loginid'];
								}
								_company['is_my_company'] = 0;
								if(_company['parent_id'] != undefined) {
									if(_company['parent_id'] == user_id){
										_company['is_my_company'] = 1;
									}
									delete _company['parent_id'];
								}
								_company['is_follow'] = follow_count;
								_company['followers'] = follows;
								_company['my_team'] = list_members;
								resolve({
									data:{company: _company,
									'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url
								},
									status: 'OK',
									msg: 'Company Profile'
								});
							}
						});
					});
				});
			});
		});
	},
	
	ChangeCompanyStatus:function (req,user_id) {
		var company_id = (typeof req.param('company_id')!='undefined' && req.param('company_id')!='')?req.param('company_id').trim():'';
		var status	   = (typeof req.param('status')!='undefined' && req.param('status')!='')?req.param('status').trim():'';
		
		return new Promise(function (resolve, reject) {
			if(company_id==''){
				resolve({
					status: "Error",
					msg:"Company id is require",
					data : {}
				});
			}
			else if(status==''){
				resolve({
					status: "Error",
					msg:"Status field is require",
					data : {}
				});
			}else if(parseInt(status)>1 || isNaN(status)==true){
				resolve({
					status: "Error",
					msg:"Status field contain only 0 or 1 number for change status",
					data : {}
				});
			}else{
				Companies.findOne({id:company_id}).exec(function(err,_company){
					if(err){
						resolve({
							status: "Error",
							msg:"Something went wrong. Please try again.",
							data : {}
						});
					}else{
						if(!_company){
							resolve({
								status: "Error",
								msg:"Record not exist,Please try again",
								data : {}
							});
						}else{
							var _newUpdate = {status:status};
							Companies.update(_company.id,_newUpdate).exec(function(err,_response){
								if(err){
									resolve({
										status: "Error",
										msg:"Fail to change company status",
										data : {}
									});
								}else{
									var flag = "In-Active";
									if(status==1 || status=="1"){
										flag = 'Active';
									}
									
									var success_msg = "Company status "+flag+" successfully";
									if(typeof user_id!='undefined'){
										ActivityLogsService.addActivityLog({
			                            	owner_id: user_id,
			                            	module: 'change_company_status',
			                            	action: flag,
			                            	object_id: company_id,
			                            	type: 'api'
			                        	});
									}

									resolve({
										status: "OK",
										msg:success_msg,
										data : {_response}
									});
								}
							});
						}
					}
				});
			}
		});
	},

	getFollowesList : function(req,user_id){
		return new Promise(function (resolve, reject){
			var page = 1;
			if(req.param("page_no") != undefined){
				page = req.param("page_no");
      		}
			if(req.param("company_id") != undefined && req.param("company_id") != '') {
				company_id = req.param("company_id");
			
				var createdAt = [];
				Follow.find({company_id:company_id})
					.populate('user_id',{select:['name','slug','profile_image']})
					.sort('createdAt DESC')
					.paginate({page:page, limit:3})
					.exec(function(err, follows){
					resolve({
						status:'OK',
						data : {sentrequest:follows,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url},
						msg:'Your followes list'
					});
				});
			}  else {
				resolve({
					status:'Error',
					data : {},
					msg:'Invalid argument!'
				});
			}
		});
  	},
};