/**
 * CompaniesController
 *
 * @description :: Server-side logic for managing companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var validator = require('sails-custom-validation-messages');
var path = require("path");
const passport = require('passport');
	  bcrypt		= require('bcrypt-nodejs');

module.exports = {

	/* register: function(req,res){
		return res.view('company/register',{
			title: 'Welcome',
			layout: 'layouts/loginLayout'
		});
	}, */

	register: function(req,res){
		return res.view('company/register',{
			title: 'Register Comapny | Lynked.World',
			layout: 'layouts/loginLayout'
		});
	},

    create: function (req, res) {

		var Web3 = require('web3')
		var fs = require('fs');
		var ethURL = sails.config.appEtherUrl + ":" + sails.config.portEtherIo;
		var web3 = new Web3(new Web3.providers.HttpProvider(ethURL));                          
		const password = req.param("password");
		web3.personal.newAccount(password,function(err,address){
			if (err) {
				console.log("eth_address err :",err);
				return res.json({
					users: address,
					status: 'Error',
					statusDescription: err,
					message: 'Your Address(Eth Address) not created. Server not respond!'
				});
			}
			else {
				
				var ref_unq = 0;
				do {
					referral = RefferalCode.generateReferral({ digit: 11 });
					Users.find({ select: ['referral'], where: { referral: referral } }).exec(function(err,referrals) {
						if(referrals.length==0) {
							ref_unq = 1;
						} else {
							ref_unq = 0; //try gen new code
						}
					});
				} while (ref_unq > 1);
				
				var userName = req.param("name").trim();
					userName = userName.charAt(0).toUpperCase() + userName.slice(1);

				var _newUser = {
					name: userName,
					loginid: req.param("loginid"),
					password: req.param("password"),
					referral: referral,
					status: '1',
					ethaddress:address
				};

				if(typeof req.param("slug")=='undefined' || req.param("slug")==''){
                    return res.json({
                        status: 'Error',
                        message: 'Slug can not blank,Please try again'
                    });
                }

				// Insert User Data
				Users.create(_newUser).exec(function (error, _users){
					if(error) {
						error = validator(Users, error);
						return res.json({
							status: "Errors",
							errors: error,
							message: "Login ID already exists, Try another one"
						});
					}
					console.log("User Data Inserted --------");
					// Insert Comapny Data
					
					var user_id = _users.id;
					Companies.find({slug:req.param("slug")}).exec(function(err,found){
						var company_slug = "";
						if(found.length > 0){
							company_slug =  req.param("slug") + Math.floor(Math.random()*(1-10000+1)+1);;
						}else{
							company_slug =  req.param("slug");
						}

						var company_name = req.param("company_name").trim();
							company_name = company_name.charAt(0).toUpperCase() + company_name.slice(1);

						var _newCompany = {
							company_name: company_name,
							slug: company_slug,
							status: '1'
						};

						Companies.create(_newCompany).exec(function (error, _companies){
							if(error){
								// Delete User Data
								Users.find().where({ id: user_id }).then(function (_delete) {
									if (_delete && _delete.length > 0) {
										_delete[0].destroy().then(function (_delete) {
											console.log("Delete User Data --------");

										}).catch(function (err) {
											console.log("1 --------");
											return res.json({ status:"Error", message:"Something went wrong. Please try again." });
										});
									} else {
										console.log("2 --------");
										return res.json({ status:"Error", message:"Something went wrong. Please try again." });
									}
								}).catch(function (err) {
									console.log("3 --------");
									return res.json({ status:"Error", message:"Something went wrong. Please try again." });
								});					
							}
							if(typeof _companies.id != 'undefined') {
								/* Activity Log Insert */
								ActivityLogsService.addActivityLog({
									owner_id: user_id,
									module: 'company',
									action: 'create',
									object_id: _companies.id,
									type: 'web'
								});
								/* Earn on account creation */
								var _newEarnReward = {
									user_id: user_id,
									amount: 5,
									type: 'account_create'
								};
								EarnRewards.create(_newEarnReward).exec(function(err,resultEarnReward){
									//console.log("EarnReward created: " + JSON.stringify(resultEarnReward));
								});
							}
							//console.log("Companies Data Inserted --------");
							//console.log(_companies);

							var company_id = _companies.id;
							console.log(company_id);
							// Update User table with company id
							Users.update({ id: user_id }, {
								company_id: company_id,
							}).then(function (_update) {
								passport.authenticate('local', function(err, _users, info){
									if((err) || (!_users)) {
										return res.json({ status:'Error', message: err, _users });
									}
									req.logIn(_users, function(err) {
										if(err) res.json(err);
										//console.log(req.user);
										return res.json({
											status: "OK",
											message: info.message,
											users: _users,
										});
									});
								})(req, res);
								//return res.json({ status:"OK", message:"Comapny data successfully stored." });
							}).catch(function (err) {
								//console.log("4 --------", err);
								return res.json({ status:"Error", message:"Something went wrong. Please try again." });
							});
						});
					});
				});
			}
		});
    },


	details: function(req,res){
		var login_user_id = (req.user != undefined && req.user.id != undefined) ?  req.user.id : 0;

		if(typeof req.param("type")!='undefined' && req.param("type")=='wall'){
			Companies.findOne({slug:req.param('slug')}).populate('companydata').populate('followers').populate('followers.user_id').exec(function(err,_company){
				if(err){
					return res.json(err);
				}

				if(!_company){
					return res.redirect("/");
				}

                var user_id = _company.companydata[0].id;
                var _users = _company.companydata[0];
				// return res.json(user_id);

                GroupUsers.find({user_id:user_id}).exec(function(err,_groupuser){
                    group_ids = [];
                    _groupuser.forEach(function(_groupusers, index){
                        group_ids.push(_groupusers.group_id);
                    });
                    var filter = {
                        "$or" : [ 
                            { "$and" : [
                                { "user_id" : { "$in" : [user_id] } }, 
                                { "group_id" : "" } ] 
                            }, 
                            { "group_id" : { "$in" : group_ids } },
                            { "to_user_id" : { "$in" : [user_id] } }

                        ],
                        is_deleted : { "!" : 1 }
                    };
		            var page = 1;
		            var limit = 10;
		            if(req.param("page_no") != undefined){
		                page = req.param("page_no");
		            }
		            Feeds.count(filter).exec(function countCB(err,count){
	    	            Feeds.find(filter)
	                    .populate('to_user_id', { select: ['name','id','slug','profile_image'] })
	                    .populate('user_id', { select: ['name','id','slug','profile_image'] })
	                    .populate('group_id')
	                    .populate('user_id.company_id',{select:['company_name','slug']})
	                    .populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
	                    .populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
	                    .populate('jobBookmarks',{'where' : {user_id:user_id}})
	                    .populate('company_id',{'select':['id','company_name']})
	                    .populate('company_id.companydata')
	                    .populate('job_type_id',{'select':['id','title']})
	                    .populate('experience_id',{'select':['id','title']})
	                    .populate('feedcomments', { sort: 'createdAt ASC' })
	                    .populate('feedcomments.user_id.company_id')
	                    .populate('feedcomments.commentlikes')
	                    .populate('feedcomments.commentreply')
	                    .populate('feedcomments.commentreply.commentlikes')
	                    .populate('feedcomments.commentreply.user_id.company_id')
	                    .populate('feedmedias')
	                    .populate('feedlikes')
	                    .populate("pollanswers")
	                    .populate('polloptions')
	                    .populate("polloptions.pollanswers")
	                    .sort('createdAt DESC')
	                    .paginate({page: page, limit: limit})
	                    .exec(function(err,_feeds){
							UserDataService.UserDetails(req,user_id).then(function(userInfo){
								UserDataService.UserDetails(req,login_user_id).then(function(loginuserInfo){
									// return res.json(userInfo.company_id);
									if (req.user){
											return res.view('user/profilewall',{
	                                            feeds: _feeds,
	                                        	user: _users,
												userData:loginuserInfo,
	                                            totalfeeds: count,
	                                            userInfo:userInfo,
												status: 'OK',
												title: 'Company Profile'
										});
									}else{
										return res.view('user/profilewall',{
                                            feeds: _feeds,
                                        	user: _users,
											userData:loginuserInfo,
                                            totalfeeds: count,
                                            userInfo:userInfo,
											status: 'OK',
											title: 'Company Profile',
											layout: 'layouts/profilelayout'
										});
									}
								});
							});
	                    });
	                });
                });
			});
		}else{
			Companies.findOne({slug:req.param('slug')})
			.populate('companydata')
			.populate('followers')
			.populate('followers.user_id')
			.exec(function(err,_company){
				if(err){
					return res.json(err);
				}
				if(!_company){
					return res.redirect("/");
				}
		        Companies.find()
		        	.where({
		        		'companydata':{
							id : {
								"$exists" : true,
								"$ne" : ""
							},
						}
					})
		        	.populate('companydata')
		        	.populate('followers')
		        	.sort('createdAt DESC')
		        	.limit(5)
		        	.exec(function(err,morecompanies){

						CompanyTeamMembers.find({company_id:_company.id,select:['user_id']}).exec(function(err,exist_members){
							var exist_ids = [];
							/*if(exist_members.length>0){
								exist_members.forEach(function(factor, index){
									exist_ids.push(factor.user_id);
								});
							}*/
						
							if(req.user) {
								exist_ids.push(_company.companydata[0].id);
							}

						Users.find({where:{company_id:null,id: {"$nin" : exist_ids}},select:['name']}).exec(function(err,meet_team){
							////console.log("--> ",morecompanies[0].companydata[0].createdAt);
							CompanyTeamMembers.find({company_id:_company.id,select:['id']})
								.populate('user_id',{select:['name','slug','profile_image','headline','address']})
								.populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
								.populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
								.exec(function(err,list_members){
									
								var profile_title = 'Company Profile | Lynked.World';
                                if(typeof _company.company_name!='undefined' && _company.company_name!=''){
                                    profile_title = _company.company_name+' | Lynked.World';
                                }
                                    
									var action_flag=0;
								if (req.user) {
									if(typeof _company.companydata!='undefined' && typeof _company.companydata[0].id!='undefined'){
										if(_company.companydata[0].id==req.user.id){
											action_flag=1;
										}
									}

									
									UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
										return res.view('company/profile',{
											company: _company,
											morecompanies: morecompanies,
											userData:userInfo,
											is_login:1,
											teams:meet_team,
											my_team:list_members,
											action_flag:action_flag,
											status: 'OK',
											title: profile_title
										});
									});
								}else{
									return res.view('company/profile',{
										company: _company,
										morecompanies: morecompanies,
										status: 'OK',
										is_login:0,
										teams:meet_team,
										my_team:list_members,
										action_flag:action_flag,
										title: profile_title, 
										layout: 'layouts/profilelayout'
									});
								}
							});
						});
					});
				});
			});
		}
	},

	update: function(req,res){
		//console.log("Inside update User Profile.............");

		// Update User Profile
        Users.update({id: req.user.id}, {
            country_id: req.param("country_id"),
            state_id: req.param("state_id"),
            city_id: req.param("city_id"),
            industry_id: req.param("industry_id"),
            language_id: req.param("language_id"),
            address: req.param("address")
        }).exec(function(err,users){
        	if(err){
        		return res.json({
        			status: "Error",
        			description: err
        		});
        	}
        	// Update Company data
        	var company_name 	= req.param("company_name").trim(); 
        		company_name	= company_name.charAt(0).toUpperCase() + company_name.slice(1);

        	Companies.update({id: req.user.company_id}, {
	            company_name: company_name,
	            year_founded: req.param("year_founded"),
	            company_size: req.param("company_size"),
	            specialties: req.param("specialties"),
	            website: req.param("website"),
				about_me: req.param("about_me"),
				/* email: req.param("email"),
				phone: req.param("phone"), */
	            skype: req.param("skype")
        	}).exec(function(err,company){
	        	if(err){
	        		return res.json({
	        			status: "Error",
	        			description: err
	        		});
	        	}
				if(typeof req.user.company_id != 'undefined') {
					var verifyData = {email: req.param("email"), phone: req.param("phone"), user_id: req.user.id}
					UserContactVerifyData.findOne({user_id: req.user.id}).exec(function (err, userExist) {
						if (!userExist) {
							UserContactVerifyData.create(verifyData).exec(function (err, _verify) {
							});
						}else {
							UserContactVerifyData.update(userExist.id, verifyData).then(function (_verify) {
							});
						}
					});
					
					/* Activity Log Insert */
					ActivityLogsService.addActivityLog({
						owner_id: req.user.id,
						module: 'company',
						action: 'update',
						object_id: req.user.company_id,
						type: 'web'
					});
				}
	        	return res.redirect("/profile");
        	})
        });
	},

	StoreTeamMembers: function(req,res){
		var company_id		='';
		var user_id			= req.param('user_id');
		var display_status  = req.param('display_status');

		if(typeof req.user!='undefined' && typeof req.user.company_id!='undefined'){
			if(req.user.company_id!=''){
				company_id = req.user.company_id;
			}
		}
		if(company_id!='' && user_id!=''){
			var _new ={
				company_id:company_id,
				user_id:user_id,
				display_status:display_status,
				status:1
			};

			if (req.param('allow_verify')) {
	          _new.allow_verify = req.param('allow_verify')
	        }

	        if (req.param('allow_job_post')) {
	          _new.allow_job_post = req.param('allow_job_post')
	        }

	        if (req.param('user_admin')) {
	          _new.user_admin = req.param('user_admin')
	        }

	        if (req.param('super_user')) {
	          _new.super_user = req.param('super_user')
	        }
			
			if (req.param('download')) {
	          _new.download = req.param('download')
	        }

	        CompanyTeamMembers.count({user_id:user_id,company_id:company_id}).exec(function (err,found){
	        	if(found>0){
	        		return res.json({
						status: "Error",
						msg: 'Member already exist',
					});	
	        	}

				CompanyTeamMembers.create(_new).exec(function (err, _team){
					if(err){
						return res.json({
							status: "Error",
							msg: 'Fail to add,Please try again',
						});	
					}
					CompanyTeamMembers.findOne({id:_team.id}).populate("company_id").exec(function(err,_member){

						var textdata = "<a href='/company/"+_member.company_id.slug+"'>"+_member.company_id.company_name+"</a> Organization added you as Team Member.";

		                NotificationService.addNotification({
		                    from_user_id: req.user.id,
		                    user_id: _member.user_id,
		                    notification_text: textdata,
		                    type: 'web'
		                });

		                //add follow data
		                FollowService.Follow({user_id:user_id,company_id:company_id});
		            
						return res.json({
							status: "OK",
							msg: 'Team member added successfully',
						});
					})
				});
			});
		}else{
			return res.json({
				status: "Error",
				msg: 'Fail to add,Please try again',
			});
		}
	},


	RemoveTeamMember: function(req,res){
		var team_id		= (typeof req.param('id')!='undefined')?req.param('id'):'';
		if(team_id==''){
			return res.json({
	            status: 'Error',
	            msg:'Team Member not remove. Please try again'
	        });
		}
		CompanyTeamMembers.destroy({id:team_id}).exec(function (err){
	        if (err) {
	          return res.json({
	            status: 'Error',
	            msg:'Team Member not remove. Please try again'
	          });
	        }
	     return res.json({
			status: "OK",
			msg: 'Team member remove successfully',
		});
      });
	},

	GetOneTeamMember: function(req,res){
		var id = (typeof req.param('id')!='undefined')?req.param('id'):'';
		CompanyTeamMembers.findOne({id:id}).populate('user_id',{select:['name']}).exec(function (err,data){
		  if (err) {
		    	return res.json({
		            status: 'Error',
		            msg:'Error'
	          });
		  }
		  if (!data) {
		    return res.json({
		            status: 'Error',
		            msg:'Record not exist'
	          });
		  }
		  var user_id = '';
		  var user_name = '';
		  if(typeof data.user_id!='undefined'){
			  if( typeof data.user_id.id!='undefined'){
			  	user_id = data.user_id.id;
			  }

			  if(typeof data.user_id.name!='undefined'){
			  	user_name =  data.user_id.name
			  }

			  data.user_id = user_id;
			  data.user_name=user_name;
			}

		  return res.json(data);
		});
	},


	UpdateTeamMembers: function(req,res){
		var company_id	='';
		var primary_id	= (typeof req.param('id')!='undefined')?req.param('id'):'';
		var allow_verify= 0;
		var allow_job_post=0;
		var allow_user_admin=0;
		var allow_super_user=0;
		var allow_download=0;

		if(typeof req.user!='undefined' && typeof req.user.company_id!='undefined'){
			if(req.user.company_id!=''){
				company_id = req.user.company_id;
			}
		}
		
		if(company_id!='' && primary_id!=''){
			var _newVerifyData ={company_id:company_id,status:1};

			if (req.param('allow_verify')) {
	          	allow_verify = 1;
	        }

	        if (req.param('allow_job_post')) {
	          	allow_job_post = 1;
	        }

	        if (req.param('user_admin')) {
	          allow_user_admin = 1;
	        }

	        if(req.param('super_user')){
	          allow_super_user = 1;
	        }
        	
        	if(req.param('download')){
	          allow_download = 1;
	        }
        	
        	_newVerifyData.allow_verify = allow_verify;
	        _newVerifyData.allow_job_post = allow_job_post;
	        _newVerifyData.user_admin = allow_user_admin;
	        _newVerifyData.super_user = allow_super_user;
	        _newVerifyData.download = allow_download;

	        // return res.json(_newVerifyData);

	        CompanyTeamMembers.count({id:primary_id}).exec(function (err,found){
	        	if(found==0){
	        		return res.json({
						status: "Error",
						msg: 'Record not found',
					});	
	        	}

				CompanyTeamMembers.update({id:primary_id}, _newVerifyData).exec(function(err, _team) {
                 	if(err){
						return res.json({
							status: "Error",
							msg: 'Fail to update,Please try again',
						});	
					}

					CompanyTeamMembers.findOne({id:_team[0].id}).populate("company_id").exec(function(err,_member){

						var textdata = "<a href='/company/"+_member.company_id.slug+"'>"+_member.company_id.company_name+"</a> changed your rights.";

		                NotificationService.addNotification({
		                    from_user_id: req.user.id,
		                    user_id: _member.user_id,
		                    notification_text: textdata,
		                    type: 'web'
		                });
						return res.json({
							status: "OK",
							msg: 'Team member update successfully',
						});
					})
                 });
			});
		}else{
			return res.json({
				status: "Error",
				msg: 'Fail to update,Please try again',
			});
		}
	},

	addorganization:function(req,res){
		if(req.param("company_name") && req.param("address")){
			var user_id=req.user.id;

			var condition = {
				company_name:  req.param("company_name"),
				'companydata':{
					id : {
						"$exists" : true,
						"$ne" : ""
					},
					status:{
						"$ne" : "0"
					},
					address:{
						'like': '%'+req.param("address")+'%'
					}
				}
			};

			Companies.find(condition).populate("companydata").exec(function(err,_getCompanies){
				if(err){
					return res.json({
						status:"Error",
						msg: 'Something went wrong. Please try again.',
						data:err
					});
				}
				if(_getCompanies.length > 0){
					return res.json({
						status: "Error",
						msg: 'Company already registered. Please contact company administrator.',
					});
				}else{
					Companies.find({slug:req.param("slug")}).then(function(companySlug){

						if(companySlug.length>0){
							company_slug =  req.param("slug") + Math.floor(Math.random()*(1-10000+1)+1);
						}else{
							company_slug =  req.param("slug");
						}

						var _newCompany = {
							company_name: req.param("company_name"),
							slug:company_slug,
							is_organized: 1,
						};

						Companies.create(_newCompany).exec(function(err,_companies){
							if(err){
								return res.json({
									status: "Error",
									msg: 'Something went wrong. Please try again.',
									data:err
								});
							}
							Users.findOne({id:user_id}).exec(function(err,_user){
								if(err){
									return res.json({
										status: "Error",
										msg: 'Something went wrong. Please try again.',
										data:err
									});
								}

								var nameremovespace = _user.id.replace(/[^A-Z0-9]+/ig, "");
								var companyremovespace = _companies.company_name.replace(/[^A-Z0-9]+/ig, "");
								loginid = nameremovespace+companyremovespace+Math.floor(Math.random()*(1-10000+1)+1)
								loginid = loginid.replace(/[^A-Z0-9]+/ig, "");

								var ref_unq = 0;
								do {
									referral = RefferalCode.generateReferral({ digit: 11 });
									Users.find({ select: ['referral'], where: { referral: referral } }).exec(function(err,referrals) {
										if(referrals.length==0) {
											ref_unq = 1;
										} else {
											ref_unq = 0; //try gen new code
										}
									});
								} while (ref_unq > 1);

								var Web3 = require('web3')
								var fs = require('fs');
								var ethURL = sails.config.appEtherUrl + ":" + sails.config.portEtherIo;
								var web3 = new Web3(new Web3.providers.HttpProvider(ethURL));
								const password = "dummy@123";
								web3.personal.newAccount(password,function(err,digitaladdress){
									if (err) {
										return res.json({
											status: 'Error',
											statusDescription: err,
											msg: 'Your Address(Eth Address) not created. Server not respond!'
										});
									}

									var _parentUser = {
										parent_id:_user.id,
										name:req.param("company_name"),
										company_id:_companies.id,
										referral:referral,
										// ethaddress:digitaladdress,
										loginid:loginid,
										password:"dummy@123",
										address:req.param("address"),
										country_id:req.param("country"),
										state_id:req.param("state"),
										city_id:req.param("city")
									};

									Users.create(_parentUser).exec(function(err,data){
										if(err){
											return res.json({
												status: "Error",
												msg: 'Something went wrong. Please try again.',
												data:err
											});
										}

										Users.findOne({id:data.id}).populate("company_id").exec(function(err,mailtouser){
					                        sails.hooks.email.send(
					                            "addorganization",
					                            {
					                                siteURL: sails.config.appUrlwPort,
					                                users: mailtouser,
					                                recipientEmail: "bhavesh.arusys@gmail.com",
					                            },
					                            {
					                                to: "bhavesh.arusys@gmail.com",
					                                subject: "Register New Organization to Lynked.World."
					                            },
					                            function(err) {
					                                console.log(err || "It worked!");
					                            }
					                        );

											// Add Main Company User
											var _companyMember = {
												company_id:data.company_id,
												user_id:req.user.id,
												allow_verify:1,
												allow_job_post:1,
												user_admin:1,
												super_user:1,
												download:1,
												is_mainuser:1,
												status:1
											};
											CompanyTeamMembers.create(_companyMember).exec(function(err,_mainUser){
												if(err){
													return res.json({
														status: "Error",
														msg: 'Something went wrong. Please try again.',
														data:err
													});
												}
												return res.json({
													status: "OK",
													msg: 'Organization has been added successfully.',
													users:data
												});
											});
										});
									});
								});
							});
						});
					});
				}
			});

			/*Companies.find({company_name:req.param("company_name")}).populate("companydata").then(function(_companyName){
				
				var address = "";
				if(_companyName.length > 0){
					console.log(_companyName[0].companydata[0].address);
					// if(_companyName[0].companydata[0].address){
					// 	address = _companyName.companydata[0].address;
					// }
				}
				console.log(address);

				if(_companyName.length == 0 && address!=req.param("address")){
					Companies.find({slug:req.param("slug")}).then(function(companySlug){

						if(companySlug.length>0){
							company_slug =  req.param("slug") + Math.floor(Math.random()*(1-10000+1)+1);
						}else{
							company_slug =  req.param("slug");
						}

						var _newCompany = {
							company_name: req.param("company_name"),
							slug:company_slug,
							is_organized: 1,
						};

						Companies.create(_newCompany).exec(function(err,_companies){
							if(err){
								return res.json({
									status: "Error",
									msg: 'Something went wrong. Please try again.',
									data:err
								});
							}
							Users.findOne({id:user_id}).exec(function(err,_user){
								if(err){
									return res.json({
										status: "Error",
										msg: 'Something went wrong. Please try again.',
										data:err
									});
								}

								var nameremovespace = _user.id.replace(/[^A-Z0-9]+/ig, "");
								var companyremovespace = _companies.company_name.replace(/[^A-Z0-9]+/ig, "");
								loginid = nameremovespace+companyremovespace+Math.floor(Math.random()*(1-10000+1)+1)
								loginid = loginid.replace(/[^A-Z0-9]+/ig, "");

								var ref_unq = 0;
								do {
									referral = RefferalCode.generateReferral({ digit: 11 });
									Users.find({ select: ['referral'], where: { referral: referral } }).exec(function(err,referrals) {
										if(referrals.length==0) {
											ref_unq = 1;
										} else {
											ref_unq = 0; //try gen new code
										}
									});
								} while (ref_unq > 1);

								var _parentUser = {
									parent_id:_user.id,
									name:_user.name,
									company_id:_companies.id,
									referral:referral,
									loginid:loginid,
									password:"dummy@123",
									address:req.param("address"),
									country_id:req.param("country"),
									state_id:req.param("state"),
									city_id:req.param("city")
								};

								Users.create(_parentUser).exec(function(err,data){
									if(err){
										return res.json({
											status: "Error",
											msg: 'Something went wrong. Please try again.',
											data:err
										});
									}

									Users.findOne({id:data.id}).populate("company_id").exec(function(err,mailtouser){
				                        sails.hooks.email.send(
				                            "addorganization",
				                            {
				                                siteURL: sails.config.appUrlwPort,
				                                users: mailtouser,
				                                recipientEmail: "bhavesh.arusys@gmail.com",
				                            },
				                            {
				                                to: "bhavesh.arusys@gmail.com",
				                                subject: "Register New Organization to Lynked.World."
				                            },
				                            function(err) {
				                                console.log(err || "It worked!");
				                            }
				                        );

										// Add Main Company User
										var _companyMember = {
											company_id:data.company_id,
											user_id:req.user.id,
											allow_verify:1,
											allow_job_post:1,
											user_admin:1,
											super_user:1,
											download:1,
											is_mainuser:1,
											status:1
										};
										CompanyTeamMembers.create(_companyMember).exec(function(err,_mainUser){
											if(err){
												return res.json({
													status: "Error",
													msg: 'Something went wrong. Please try again.',
													data:err
												});
											}
											return res.json({
												status: "OK",
												msg: 'Organization has been added successfully.',
											});
										});
									});
								});
							});
						});
					});
				}else{
					return res.json({
						status: "Error",
						msg: 'Company already registered. Please contact company administrator.',
					});
				}
			});*/

		}else{
			return res.json({
				status: "Error",
				msg: 'Please enter the value.',
			});
		}
	},

	checkCompanySlug:function(req,res,slug=''){
		var self = this;
		return new Promise(function (fulfill, reject){
			if(slug!=''){
				slug = slug;
			}else{
				slug = req.param("slug");
			}
			Companies.find({slug:slug}).exec(function(err,found){
				if(found.length==0){
					fulfill(slug);
				}else{
					fulfill("");
				}
			});
		});
	},

	useradministration:function(req,res){
		var exist_ids = [];
        exist_ids.push(req.user.id);
        //Users.find({where:{company_id:null,id: {"$nin" : exist_ids}},select:['name']}).exec(function(err,meet_team){
        	CompanyTeamMembers.find({company_id:req.user.company_id})
			.populate('user_id',{select:['name','slug','profile_image','headline','address']})
			.exec(function(err,list_members){    
				UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
					// return res.json(list_members);
					return res.view("company/useradministration",{
						title:"User Administration",
						// teams:meet_team,
						userData:userInfo,
						my_team:list_members,
						is_login:1,
                        action_flag:1,
                        activepage: 'administration',
					});
				});
			});
		//});
	},

	linkOrganization:function(req,res){
		if(req.param("company_login_id")=="" && req.param("password")==""){
			return res.json({
				status: "Error",
				msg: 'Please enter value.',
			});
		}else{
			var password = req.param("password");
			Users.findOne({loginid:req.param("company_login_id"),company_id:{"id":{"!":null}}}).populate("company_id").exec(function(err,_users){
				if(err){
					return res.json({
                        status: 'Error', 
                        msg:"Something went wrong. Please try again."
                    });
				}
				if(_users){
					bcrypt.compare(password, _users.password, function(err, result){
						if(!result){
		                    return res.json({
		                        status: 'Error', 
		                        msg:"Incorrect Current Password"
		                    });
		                }else{
							
							if(_users.company_id.is_organized){
								return res.json({
									status: "Error",
									msg: _users.company_id.company_name+' already linked with another user.',
								});
							}else{
								var updUserData = {parent_id:req.user.id};
			                	var updComData = {is_organized:1};
			                	Users.update({id:_users.id},updUserData).exec(function(err,result){
		                			Companies.update({id:_users.company_id.id},updComData).exec(function(err,result2){
										// Add Main Company User
										var _companyMember = {
											company_id:_users.company_id.id,
											user_id:req.user.id,
											allow_verify:1,
											allow_job_post:1,
											user_admin:1,
											super_user:1,
											download:1,
											is_mainuser:1,
											status:1
										};
										CompanyTeamMembers.create(_companyMember).exec(function(err,_mainUser){
											if(err){
												return res.json({
													status: "Error",
													msg: 'Something went wrong. Please try again.',
													data:err
												});
											}
											return res.json({
												status: "OK",
												msg: 'Organization has been linked successfully.',
											});
										});
		                			});
			                	});
							}
		                }
					});
				}else{
					return res.json({
						status: "Error",
						msg: 'Company not found with entered user id.',
					});
				}
			});
		}
	}
};

