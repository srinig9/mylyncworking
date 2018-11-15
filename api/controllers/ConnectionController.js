/**
 * ConnectionController
 *
 * @description :: Server-side logic for managing connections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	load_more_invitation: function(req,res){
		var user_id = req.user.id;
		UserConnectionService.getPeopleYouKnow(req.user.id,req.param("page_no")).then(function(peopleyouknow){
			if(peopleyouknow.peopleyouknow.length == 0){
				return res.json({peopleyouknow:false});
			}
			return res.render('ajax/load_more_invitation',{
				peopleyouknow:peopleyouknow.peopleyouknow
			});
		});
	},

	load_more_request: function(req,res){
		var user_id = req.user.id;
		var self = this;
		if(req.method=='POST'){
			no_of_record = req.param("no_of_record");
			UserConnectionService.getRequestReceived(req.user.id,1,no_of_record).then(function(requestreceived){
				if(requestreceived.requestreceived.length == 0){
					return res.json({pendingrecives:false});
				}
				return res.render('ajax/pending_received_invitations',{
					pendingrecives:requestreceived.requestreceived
				});
			});
		}else{
			UserConnectionService.getRequestReceived(req.user.id,req.param("page_no"),3).then(function(requestreceived){
				if(requestreceived.requestreceived.length == 0){
					return res.json({pendingrecives:false});
				}
				return res.render('ajax/pending_received_invitations',{
					pendingrecives:requestreceived.requestreceived
				});
			});
		}
	},

	load_more_sent: function(req,res){
		var user_id = req.user.id;
		var self = this;
		if(req.method=='POST'){
			no_of_record = req.param("no_of_record"); 
			UserConnectionService.getSentRequest(req.user.id,1,no_of_record).then(function(sentrequest){
				if(sentrequest.sentrequest.length == 0){
					return res.json({pendingsent:false});
				}
				return res.render('ajax/pending_sent_invitations',{
					pendingsent:sentrequest.sentrequest
				});
			});
		} else {
			UserConnectionService.getSentRequest(req.user.id,req.param("page_no"),3).then(function(sentrequest){
				if(sentrequest.sentrequest.length == 0){
					return res.json({pendingsent:false});
				}
				return res.render('ajax/pending_sent_invitations',{
					pendingsent:sentrequest.sentrequest
				});
			});
		}
	},

	default: function(req,res){
		var user_id = req.user.id;
		var self = this;
		var follows = [];
		if(req.user.company_id){
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				Follow.find({company_id: req.user.company_id})
				.populate("user_id")
				.populate('user_id.company_id',{select:['company_name','slug']})
				.populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
				.populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
				.sort('createdAt DESC')
				.exec(function(err,followers){
					// return res.json(followers);
					return res.view('connection/followers',{
						status: 'OK', 
						title: 'My Networks | Lynked.World',
						followers:followers,
						userData:userInfo,
						total_connection: 0,
					});
				});
			});
		}else{
			UserConnectionService.getUserConnection(req.user.id).then(function(myconnection){
				UserConnectionService.getRequestReceived(req.user.id,1,3).then(function(requestreceived){
					UserConnectionService.getSentRequest(req.user.id,1,3).then(function(sentrequest){
						UserConnectionService.getPeopleYouKnow(req.user.id,1).then(function(peopleyouknow){
							UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
								// return res.json(sentrequest);
								return res.view('connection/list', { 
									status: 'OK', 
									title: 'My Networks | Lynked.World',
									pendingsent: sentrequest.sentrequest,
									totalsentrequest: sentrequest.totalsentrequest,
									pendingrecives: requestreceived.requestreceived,
									totalrequestreceived: requestreceived.totalrequestreceived,
									peopleyouknow: peopleyouknow.peopleyouknow,
									totalpeople: peopleyouknow.totalpeople,
									total_connection: myconnection.length,
									userData:userInfo,
								});
							});
						});
					});
				});
			});
		}
	},

	list: function(req,res){
		UserConnectionService.getUserConnection(req.user.id).then(function(user_ids){
			total_connections = user_ids.length;
			var condition = {id: {"$in" : user_ids}};
			var followCondition = {
				user_id:req.user.id,
				'company_id':{
					slug : {
						"$exists" : true,
						"$ne" : ""
					}
				},
			};

			if(typeof req.param("search")!="undefined" && req.param("search")!=""){
				condition = {
					'$or' : [
						{ name: { 'like': '%'+req.param("search")+'%' } },
						{ loginid: { 'like': '%'+req.param("search")+'%' } }
					],
					id: {"$in" : user_ids}
				};

				followCondition = {
					user_id:req.user.id,
					'company_id':{ 
						slug : {
							"$exists" : true,
							"$ne" : ""
						},
						company_name : {'like': '%'+req.param("search")+'%' }
					},
				};
			}
			
			Users.find()
			.where(condition)
			.populate('company_id',{select:['company_name','slug']})
			.populate('receiverequest',{select:['createdAt','updatedAt'],where:{'to_user_id':user_id,status:'1'}})
			.populate('sendrequest',{select:['createdAt','updatedAt'],where:{'user_id':user_id,status:'1'}})
			.populate('usereducations',{select: ['school'],limit:1,sort:{display_status:-1,createdAt:-1}})
			.populate('company_id',{select:['company_name','slug']})
			.populate('userexperiences',{select: ['title','location','current_work'],sort:{display_status:-1,current_work:-1},limit:1})
			.populate('userexperiences.company_id',{select: ['company_name'],sort:{display_status:-1,current_work:-1},limit:1})
			.sort('name')
			.exec(function(err, connections){
				Follow.find(followCondition).populate("company_id").populate("company_id.companydata").sort('createdAt DESC').exec(function(err, follow_count){
					Follow.find(followCondition).populate("company_id").populate("company_id.companydata").sort('createdAt DESC').paginate({page:1, limit:3}).exec(function(err, follows){
						UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
							return res.view('connection/myconnection', { 
								status: 'OK', 
								title: 'Connection List | Lynked.World',
								total_connection : total_connections,
								connections:connections,
								follows:follows,
								total_follow:follow_count.length,
								userData:userInfo,
							});
						});
					});
				});
			});
		});
	},
	
	importFromMail: function(req, res) {
        return res.view("connection/import/fromMail", {
			title: 'Import from email'
		});
    },
	
	importFromMailFound: function(req, res) {
		var request = req.params.all();
		var requestData = [];
		var result = [];
		if(typeof request.data!='undefined'){
			requestData = request.data;
			UserConnectionService.getImportData(requestData,req.user.id).then(function(resultData){
				//return res.json(resultData);
				return res.view("connection/import/connectionFound", {
					title: 'Import from email',
					members: resultData.members,
					invites: resultData.invites
				});
			});
	    }else{
			return res.view("connection/import/connectionFound", {
				title: 'Import from email',
				connections: resultData
			});
	    }
    },

	importFromMailNotFound: function(req, res) {
        console.log("Import from email");
		var request = req.params.all();
		return res.view("connection/import/connectionNotFound", {
			contacts: request.data,
			title: 'Import from email'
		});
    },

	importThankYou: function(req, res) {
        console.log("Import from email");
		return res.view("connection/import/thankYou", {
			title: 'Import from email'
		});
    },

    sendinvitation:function(req,res){
    	var request = req.param("connection");
    	array = [];

        request.forEach(function(factor,index){
            if(typeof factor.email!='undefined'){
            	var email = factor.email;
            	var name = (typeof factor.name !='undefined' ? factor.name : "");
	            array.push({email:email,name:name});
            }
        });
        var referral = (typeof req.user.referral !='undefined') ? req.user.referral : "";
        
        array.forEach(function(value,index){
        	var _newInvite = {
        		user_id:req.user.id,
        		email:value.email,
        		name:value.name,
        		status:"0",
        	};
        	InviteContact.create(_newInvite).exec(function(err,response){
				sails.hooks.email.send(
					"invitationEmail",
					{
						siteURL: sails.config.appUrl,
						recipientName: value.name,
						referenceLink: referral,
						recipientEmail: value.email,
					},
					{
						to: value.email,
						subject: "Invitation From "+req.user.name+" to join Lynked.World"
					},
					function(err) {console.log(err || "It worked!");}
				);
        	})
        });
        return res.redirect("/thank-you");
    },

    bulkSendRequest: function(req,res){
    	var request = req.param("to_user_id[]");
		var requestData = [];    	

    	if(Array.isArray(request)){
    		requestData = request;
    	}else{
    		requestData = [request];
    	}
    	
        requestData.forEach(function(value,index){
        	if(value!=''){
				var _newConnection = {
		            user_id: req.user.id,
		            to_user_id: value,
		            status: 0
		        };
		        UserConnection.create(_newConnection).exec(function (err,_userconnection) {
		        	if(err){
			            return res.json({
			                status: 'Error',
			                message: "Something went wrong. Please try again."
			            });
		        	}
					/* Activity Log Insert */
					ActivityLogsService.addActivityLog({
						owner_id: req.user.id,
						module: 'connection',
						action: 'request_send',
						object_id: _userconnection.id,
						type: 'web'
					});
		            return res.json({
		                status: 'OK',
		                message: "Request has been sent successfully."
		            });
				});
        	}
    	});
    },

	searchmyconnection:function(req,res){
		UserConnectionService.getUserConnection(req.user.id).then(function(user_ids){
			total_connections = user_ids.length;
			var condition = {id: {"$in" : user_ids}};
			var followCondition = {user_id:req.user.id};

			if(typeof req.param("search")!="undefined" && req.param("search")!=""){
				condition = {
					'$or' : [
						{ name: { 'like': '%'+req.param("query")+'%' } },
						{ loginid: { 'like': '%'+req.param("query")+'%' } }
					],
					id: {"$in" : user_ids}
				};

				followCondition = {
					user_id:req.user.id,
					'company_id':{ 
						company_name : {'like': '%'+req.param("query")+'%' }
					}
				};
			}

			Users.find().where(condition).exec(function(err, connections){
				Follow.find(followCondition).populate('company_id').sort('createdAt DESC').exec(function(err, follows){
                    array = [];
                    array2 = [];

                    connections.forEach(function(users, index){
                        array.push(users.name);
                    });
                    follows.forEach(function(companies, index){
                    	array2.push(companies.company_id.company_name);
                    });					
					var finalArray = array2.concat(array);
					console.log(finalArray);
					return res.json(finalArray);
				});
			});
		});
	},

	findConnectionbySlug: function(req,res){
	    var login_user_id = (typeof req.user != 'undefined' && req.user!='') ? req.user.id : 0;

	    Companies.find({slug:req.param("slug")}).populate("companydata").exec(function(err,_companies){
	    	if(err){
	    		return res.redirect("/");
	    	}

	    	if(_companies.length!=0){
				UserDataService.UserDetails(req,login_user_id).then(function(loginUserInfo){
					UserDataService.UserDetails(req,_companies[0].companydata[0].id).then(function(userInfo){
						Follow.find({company_id: _companies[0].id}).populate("user_id").populate('user_id.company_id',{select:['company_name','slug']}).populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}}).populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}}).sort('createdAt DESC').exec(function(err,found){
							return res.view('connection/companyfollowers', { 
								status: 'OK', 
								title: 'Company Follow List | Lynked.World',
								total_connection:found.length,
								userData:loginUserInfo,
								userInfo:userInfo,
								followdata:found,
							});
						});
					});
				});
	    	}else{
				Users.find({slug:req.param("slug")})
		        .populate('userprivacysettings')
		        .populate('userprivacysettings.privacy_option_id')
		        .populate('userprivacysettings.privacy_option_id.privacy_id')
				.exec(function(err,data){
					if(err){
						return res.redirect("/");
					}
					if(data.length == 0){
						return res.redirect("/");
					}
					var user_id = data[0].id;
		            UserConnectionService.getUserConnection(data[0].id).then(function(user_ids){
						total_connections = user_ids.length;
						var condition = {id: {"$in" : user_ids}};
						var followCondition = {
							user_id:user_id,
							'company_id':{
								slug : {
									"$exists" : true,
									"$ne" : ""
								}
							},
						};

						if(typeof req.param("search")!="undefined" && req.param("search")!=""){
							condition = {
								'$or' : [
									{ name: { 'like': '%'+req.param("search")+'%' } },
									{ loginid: { 'like': '%'+req.param("search")+'%' } }
								],
								id: {"$in" : user_ids}
							};

							followCondition = {
								user_id:user_id,
								'company_id':{ 
									slug : {
										"$exists" : true,
										"$ne" : ""
									},
									company_name : {'like': '%'+req.param("search")+'%' }
								},
							};
						}

						Users.find()
						.where(condition)
						.populate('company_id',{select:['company_name','slug']})
						.populate("receiverequest",{to_user_id:login_user_id})
						.populate("sendrequest",{user_id:login_user_id})
						.populate('userexperiences.company_id')
						.exec(function(err, connections){
							// return res.json(connections);
							Follow.find(followCondition).populate("company_id").populate("company_id.companydata").sort('createdAt DESC').exec(function(err, follows){
								UserDataService.UserDetails(req,req.user.id).then(function(loginUserInfo){
									UserDataService.UserDetails(req,user_id).then(function(userInfo){
										return res.view('connection/userconnection', { 
											status: 'OK', 
											title: 'Connection List | Lynked.World',
											total_connection : total_connections,
											connections:connections,
											follows:follows,
											total_follow:follows.length,
											userData:loginUserInfo,
											userInfo:userInfo,
											user:data[0],
										});
									});
								});
							});
						});
					});
				});
	    	}
		})
	}
};