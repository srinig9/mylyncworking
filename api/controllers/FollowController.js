/**
 * FollowController
 *
 * @description :: Server-side logic for managing follows
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	myfollowers: function(req,res){
		UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
			Follow.find({company_id: req.user.company_id}).populate("user_id").populate('user_id.company_id',{select:['company_name','slug']}).populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}}).populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}}).sort('createdAt DESC').exec(function(err,found){
				return res.view('company/myfollowers',{
					status:"OK",
					followdata:found,
					userData:userInfo
				});
			});
		});
	},

	authorizedFollower: function(req,res){
		var page = 1;
		Follow.find({company_id: req.user.company_id, status: '0', is_authorized:'0' }).paginate({page:page,limit:2}).populate("user_id").exec(function(err,followdata){
			Follow.find({company_id: req.user.company_id, is_authorized:'1' }).paginate({page:page,limit:2}).populate("user_id").exec(function(err,authorized){
				Follow.count({company_id: req.user.company_id, is_authorized:'1' }).exec(function(err,count_authorized){
					Follow.count({company_id: req.user.company_id, status: '0', is_authorized:'0' }).exec(function(err,count_followdata){
						return res.view('company/authorized',{
							status:"OK",
							followdata:followdata,
							authorized:authorized,
							count_authorized:count_authorized,
							count_followdata : count_followdata
						});
					});
				});
			});
		});
	},

	lordMoreFollowList : function(req,res) {
		var page = 0;
		if(req.param('page') != undefined){
			page = req.param('page');
		}
		Follow.find({company_id: req.user.company_id, status: '0', is_authorized:'0' }).paginate({page:page,limit:2}).populate("user_id").exec(function(err,followdata){
			return res.render("company/ajax/follow",{followdata:followdata});
		});
	},
	lordMoreAuthorizedList : function(req,res) {
		var page = 0;
		if(req.param('page') != undefined){
			page = req.param('page');
		}
		Follow.find({company_id: req.user.company_id, is_authorized:'1' }).paginate({page:page,limit:2}).populate("user_id").exec(function(err,authorized){
			return res.render("company/ajax/authorized",{authorized:authorized});
		});
	},
	acceptauthorized: function(req,res){
		Follow.update({id: req.param("id")}, {
			status: '1',
			is_authorized: '1'
		}).then(function (user) {
			if(typeof user[0].id != 'undefined') {
				/* Activity Log Insert */
				ActivityLogsService.addActivityLog({
					owner_id: req.user.id,
					module: 'company_authorized',
					action: 'accept',
					object_id: user[0].id,
					type: 'web'
				});
			}
			return res.json({
				status: "OK",
				message: "Authorized Success"
			});
		}).catch(function (err) {
			return res.json({
				status: "Error",
				message: "Something went wrong. Please try again."
			});
		});
	},

	rejectauthorized: function(req,res){
		Follow.update({id: req.param("id")}, {
			status: '0',
			is_authorized: '0'
		}).then(function (user) {
			if(typeof user[0].id != 'undefined') {
				/* Activity Log Insert */
				ActivityLogsService.addActivityLog({
					owner_id: req.user.id,
					module: 'company_authorized',
					action: 'reject',
					object_id: user[0].id,
					type: 'web'
				});
			}
			return res.json({
				status: "OK",
				message: "Authorized Success"
			});
		}).catch(function (err) {
			return res.json({
				status: "Error",
				message: "Something went wrong. Please try again."
			});
		});
	},

	followUnfollow: function(req,res){
        //console.log("Inside create Follow ..............req.params = " + JSON.stringify(req.params.all()));

		var _newfollow = {
		    company_id: req.param("company_id"),
		    user_id: req.user.id,
		    status: '0',
		    is_authorized: '0',
		    is_member: '0'
		};

        Follow.find({company_id: req.param("company_id"), user_id: req.user.id}).exec(function(err,found){
			if(found.length > 0) {
				if(typeof found[0].id != 'undefined') {
					/* Activity Log Insert */
					ActivityLogsService.addActivityLog({
						owner_id: req.user.id,
						module: 'company',
						action: 'unfollow',
						object_id: found[0].id,
						type: 'web'
					});
				}
				found[0].destroy().then(function (_delete) {
		    		return res.json({
						status:"OK",
						message: "Company has been Unfollow successfully."
					});
				}).catch(function (err) {
					return res.json({ status:"Error", message:"Something went wrong. Please try again." });
				});
        	}
        	else
        	{
		        Follow.create(_newfollow).exec(function(err,_follow){
		        	if(err){
		        		return res.json({
							status:"Error",
							description: err,
							message: "Something went wrong. Please try again."
						});
		        	}
					if(typeof _follow.id != 'undefined') {
						/* Activity Log Insert */
						ActivityLogsService.addActivityLog({
							owner_id: req.user.id,
							module: 'company',
							action: 'follow',
							object_id: _follow.id,
							type: 'web'
						});
					}
		    		return res.json({
						status:"OK",
						description: _follow,
						message: "Company has been followed successfully."
					});
		        });
        	}
        });
	},

	load_more_follows: function (req,res){
		// return res.json(req.params.all());
		var page = 1;
		if(req.param("page_no") != undefined){
			page = req.param("page_no");
		}
		var followCondition = {
			user_id:req.user.id,
			'company_id':{
				slug : {
					"$exists" : true,
					"$ne" : ""
				},
				company_name : {'like': '%'+req.param("search")+'%' }
			},
		};
		if(typeof req.param("search")!="undefined" && req.param("search")!=""){
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

		Follow.find(followCondition).populate('company_id').populate("company_id.companydata").sort('createdAt DESC').paginate({page:page,limit:3}).exec(function(err, follows){
			if(follows.length == 0){
				return res.json({follows:false});
			}
			return res.render('connection/ajax/follow-load-more',{
				follows:follows
			});
		});
	},
};