/**
 * GroupsController
 *
 * @description :: Server-side logic for managing groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	myconnections: function(req, res) {
		var user_id = req.user.id;
		return new Promise(function (fulfill, reject){
			UserConnection.find({user_id : req.user.id, status:'1'}).exec(function(err, result){
				UserConnection.find({to_user_id : req.user.id, status:'1'}).exec(function(err, result2){
					array = [];
					array1 = [];
					result.forEach(function(factor, index){
						array.push(factor.to_user_id);
					});
					result2.forEach(function(factor, index){
						array1.push(factor.user_id);
					});

					var connection_ids = array.concat(array1);

					Users.find({id: connection_ids}).exec(function(error,user){
						fulfill(user);
					});
				});
			});
		});
	},

	groupfeeds: function(req, res) {
		var user_id = req.user.id;
		return new Promise(function (fulfill, reject){
			Groups.findOne({slug:req.param("slug")})
				.populate('groupusers')
				.populate('groupusers.user_id', { select: ['name','slug','id','profile_image'] })
				.populate('groupfeeds', { sort: 'createdAt DESC'})
				.populate('groupfeeds.user_id', { select: ['name','slug','id','profile_image'] })
				.populate('groupfeeds.feedcomments.commentlikes')
				.populate('groupfeeds.feedcomments.commentreply')
				.populate('groupfeeds.feedcomments.commentreply.commentlikes')
				.populate('groupfeeds.feedcomments.commentreply.user_id')
				.populate('groupfeeds.feedmedias')
				.populate('groupfeeds.feedlikes')
				.exec(function(err,_group){
					feeds = _group.groupfeeds;
					array = [];
					feeds.forEach(function(factor, index){
						temp = [];
						temp = factor;
						totalLikes = 0;
						totaldislikes = 0;
						isliked = 0;
						isdisliked = 0;
						feedlikes = factor.feedlikes;
						
						feedlikes.forEach(function(factor1, index){
							temp2 = [];
							temp2 = factor1;
							if(factor1.status==1){
								totalLikes = totalLikes+1;
							}
							if(factor1.status==2){
								totaldislikes = totaldislikes+1;
							}
							if(factor1.status==2 && factor1.user_id==user_id){
								isdisliked = 1;
							}
							if(factor1.status==1 && factor1.user_id==user_id){
								isliked = 1;
							}
						});
						temp['totalLikes'] = totalLikes; 
						temp['totaldislikes'] = totaldislikes; 
						temp['isliked'] = isliked; 
						temp['isdisliked'] = isdisliked; 
						array.push(temp);
					});
					delete feeds;
					array.push(_group);
					fulfill(_group);
			});
		});
	},

	mycreatedgroups: function(req,res){
		return new Promise(function (fulfill, reject){
			GroupUsers.find({is_owner:1,user_id:req.user.id}).exec(function(err,_groupuser){
				array = [];
				_groupuser.forEach(function(factor, index){
					array.push(factor.group_id);
				});

				Groups.find({id: array}).populate('groupusers').sort("createdAt DESC").exec(function(err,mygroups){
					fulfill(mygroups);
				});
			});
		});
	},

	myjoinedgroups: function(req,res){
		return new Promise(function (fulfill, reject){
			GroupUsers.find({is_owner:0,user_id:req.user.id}).exec(function(err,_groupuser){
				array = [];
				_groupuser.forEach(function(factor, index){
					array.push(factor.group_id);
				});

				Groups.find({id: array}).populate('groupusers').sort("createdAt DESC").exec(function(err,mygroups){
					fulfill(mygroups);
				});
			});
		});
	},

	getLocalGroups: function(req,res){
		return new Promise(function (fulfill, reject){
			var user_id = req.user.id;
			UserConnection.find({user_id : req.user.id, status:'1'}).exec(function(err, result){
				UserConnection.find({to_user_id : req.user.id, status:'1'}).exec(function(err, result2){
					array = [];
					array1 = [];
					result.forEach(function(factor, index){
						array.push(factor.to_user_id);
					});
					result2.forEach(function(factor, index){
						array1.push(factor.user_id);
					});

					var connections = array.concat(array1);
					var own = [user_id];
					connection_ids = connections.concat(own);
					
					GroupUsers.find({ user_id : connection_ids }).exec(function(err,_groupuser){
						if(err){
							fulfill(err);
						}
						group_ids = [];
						_groupuser.forEach(function(factor2, index){
							group_ids.push(factor2.group_id);
						});

						Groups.find({id: { "$nin" : group_ids}, privacy: "1"}).populate("groupusers").exec(function(err,groupdata){
							fulfill(groupdata);
						});
					});
				});
			});
		});
	},

	getConnectionGroups: function(req,res){
		return new Promise(function (fulfill, reject){
			var user_id = req.user.id;
			UserConnection.find({user_id : req.user.id, status:'1'}).exec(function(err, result){
				UserConnection.find({to_user_id : req.user.id, status:'1'}).exec(function(err, result2){
					array = [];
					array1 = [];
					result.forEach(function(factor, index){
						array.push(factor.to_user_id);
					});
					result2.forEach(function(factor, index){
						array1.push(factor.user_id);
					});

					var connections = array.concat(array1);
					var own = [user_id];
					// connection_ids = connections.concat(own);
					
					GroupUsers.find({user_id: connections}).exec(function(err,_users){
						groups = [];
						_users.forEach(function(factor2, index){
							groups.push(factor2.group_id);
						});
						GroupUsers.find({ group_id : groups, user_id : {'!': user_id} }).exec(function(err,_group){
							groupIds = [];
							_users.forEach(function(factor3, index){
								groupIds.push(factor3.group_id);
							});
							Groups.find({ id: { "$in": groupIds }, privacy:"1" }).populate("groupusers").exec(function(err,groupdata){
								fulfill(groupdata);
							})
						});
					});
				});
			});
		});
	},

	index: function(req,res){
		var self = this;
		self.mycreatedgroups(req).then(function(mygroups){
			self.myjoinedgroups(req).then(function(myjoins){
				 UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
					// return res.json(myjoins);
					return res.view('group/list',{
						mygroups:mygroups,
						myjoins:myjoins,
						userData:userInfo,
						title:"Group List",
						status: "OK"
					});
				});
			});
		});
	},

	create: function(req,res){
		var self = this;
		self.myconnections(req).then(function(data){
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				return res.view('group/create',{
					title:"Create Group ",
					status: "OK",
					connections:data,
					userData:userInfo
				});
			});
		});
	},

	store: function(req,res){
		// check for Unique slug
		Groups.find({slug:req.param("slug")}).exec(function(err,found){
			var group_slug = req.param("slug");
			if(found.length > 0){
				group_slug =  req.param("slug") + Math.floor(Math.random()*(1-10000+1)+1);
			}
			var _newGroup = {
				group_name:req.param("group_name"),
				slug:group_slug,
				privacy:req.param("privacy"),
				group_icon:'',
				group_description:req.param("group_description")
			};
			// Insert data into group table
			Groups.create(_newGroup).exec(function(error,_group){
				if(error){
					return res.view('500', {message: "Something went wrong. Please try again"});
				}
				if(typeof _group.id != 'undefined') {
					/* Activity Log Insert */
					ActivityLogsService.addActivityLog({
						owner_id: req.user.id,
						module: 'group',
						action: 'create',
						object_id: _group.id,
						type: 'web'
					});
				}
				/* Upload Image */
				req.file('group_icon').upload({
					dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/groups')
				},function (err, uploadedFiles) {
					//console.log(uploadedFiles);
					if(uploadedFiles.length > 0){
						//console.log(uploadedFiles[0].fd);
						var fd = uploadedFiles[0].fd;
						var myarr = fd.split("\\");
						var filename = myarr[myarr.length-1];
						Groups.update({ id: _group.id}, { group_icon: filename }).exec(function (err, image) {

						});
					}
				});

				// Insert data into GroupUsers Table
				var owner = [];
				owner['group_id'] = _group.id;
				owner['user_id'] = req.user.id;
				owner['is_admin'] = 1;
				owner['is_owner'] = 1;

				user_id = req.param("user_id");

				var array = [];
				
				if(user_id != undefined){

					if(Array.isArray(user_id)){
						user_ids = user_id;
					}else{
						user_ids = user_id.split(" ");
					}

					if(user_ids.length > 0){
						user_ids.forEach(function(factor, index){
							temp = [];
							temp['group_id'] = _group.id;
							temp['user_id'] = factor;
							temp['is_admin'] = 0;
							temp['is_owner'] = 0;
							array.push(temp);
						});
					}
				}
				array.push(owner);
				
				array.forEach(function(groupuser, index){
					var _newGroupUser = {
						is_owner:groupuser.is_owner,
						is_admin:groupuser.is_admin,
						group_id:groupuser.group_id,
						user_id:groupuser.user_id
					};

					GroupUsers.create(_newGroupUser).exec(function(error,_group){
						if(error){
							return res.view('500', {message: "Something went wrong. Please try again"});
						}
					})
				});
				return res.redirect("/group");
			});
		});
	},

	details: function(req,res){
		var self = this;
		self.groupfeeds(req).then(function(data){
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				return res.view('group/details',{
					title: data.group_name+ " details",
					status: 'OK',
					userData:userInfo,
					group:data
				});
			});
		});
	},

	discover: function(req,res){
		//console.log("User ID" + req.user.id);
		var self = this;
		self.getLocalGroups(req).then(function(localgroups){
			self.getConnectionGroups(req).then(function(connectiongroups){
				 UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
					return res.view('group/discover',{
						localgroups:localgroups,
						connectiongroups:connectiongroups,
						userData:userInfo,
						title:"Discover Group",
						status: "OK"
					});
				});
			});
		});
	},

	leftgroup: function(req,res){
		GroupUsers.find({group_id: req.param("group_id"), user_id:req.user.id}).exec(function(err,_users){
			if(err){
				return res.json({
					status:"Error",
					message:"Something went wrong. Please try again."
				});
			}
			if (_users && _users.length > 0) {
				if(typeof _users[0].id != 'undefined') {
					/* Activity Log Insert */
					ActivityLogsService.addActivityLog({
						owner_id: req.user.id,
						module: 'group',
						action: 'left',
						object_id: _users[0].id,
						type: 'web'
					});
				}
				_users[0].destroy().then(function (_delete) {
					return res.json({
						status:"OK",
						message:"You have left groups."
					});
				}).catch(function (err) {
					return res.json({ status:"Error", message:"Something went wrong. Please try again." });
				});
			} else {
				return res.json({ status:"Error", message:"Something went wrong. Please try again." });
			}
		});
	},

	joingroup: function(req,res){
		GroupUsers.find({group_id: req.param("group_id"), user_id:req.user.id}).exec(function(err,_users){
			if(err){
				return res.json({
					status:"Error",
					message:"Something went wrong. Please try again."
				});
			}
			if(_users.length > 0){
				return res.json({
					status:"Error",
					message:"You have already added in the group"
				});
			}else{
				var _newGroupUser = {
					group_id: req.param("group_id"),
					user_id: req.user.id,
					is_admin: 0,
					is_owner: 0
				};

				GroupUsers.create(_newGroupUser).exec(function(error,_groupuser){
					if(error){
						return res.json({
							status:"Error",
							message:"Something went wrong. Please try again."
						});
					}
					if(typeof _groupuser.id != 'undefined') {
						/* Activity Log Insert */
						ActivityLogsService.addActivityLog({
							owner_id: req.user.id,
							module: 'group',
							action: 'join',
							object_id: _groupuser.id,
							type: 'web'
						});
					}
					return res.json({
						status:"OK",
						message:"You have already added in the group"
					});

				});
			}
		});
	},
};

