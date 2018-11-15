/**
 * PollController
 *
 * @description :: Server-side logic for managing polls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


	load_more_poll: function(req,res){
		var self = this;
		self.polllist(req,res).then(function(data){
			if(data.pollList.length == 0){
				return res.json({
					polls:false
				});
			}
			return res.render('ajax/load_more_poll',{
				polls: data.pollList,
				totalpoll: data.totalpolls,
				userData:data.userInfo
			});
		});
	},

	polllist:function(req,res){
		var user_id = req.user.id;
		var page = 1;
		var limit = 10;
		if(req.param("page_no") != undefined){
			page = req.param("page_no");
		}

		var filter = {type:"P",user_id:user_id, is_deleted : { "!" : 1 }};

		return new Promise(function (fulfill, reject){
			Feeds.count(filter).exec(function countCB(err,count){
				Feeds.find(filter).sort('createdAt DESC')
					.populate('user_id', { select: ['name','id'] })
					.populate('user_id.company_id',{select:['company_name','slug']})
					.populate('feedcomments', { sort: 'createdAt ASC' })
					.populate('feedcomments.user_id.company_id')
					.populate('feedcomments.commentlikes')
					.populate('feedcomments.commentreply')
					.populate('feedcomments.commentreply.commentlikes')
					.populate('feedcomments.commentreply.user_id.company_id')
					.populate('feedmedias')
					.populate('feedlikes')
					.populate("polloptions")
					.populate("polloptions.pollanswers")
					.populate("pollanswers")
					.paginate({page: page, limit: limit})
					.exec(function(err,response){
					UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
						fulfill({pollList: response, totalpolls: count, userInfo: userInfo})
					});
				});
			});
		});
	},

	index: function(req,res){
		var self = this;
		self.polllist(req,res).then(function(data){
			return res.view('poll/list',{
				polls: data.pollList,
				totalpoll: data.totalpolls,
				userData:data.userInfo
			});
		});
	},

	create: function(req,res){
		UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
			return res.view('poll/create',{
				status:"OK",
				userData:userInfo
			});
		});
	},

	store: function(req,res){
		var pollotions = req.param("poll_option");
		var empties = pollotions.length - pollotions.filter(String).length;
		if(empties==2 || empties==0){
			//console.log(req.param("feed_details"));
			var _newpoll = {
				status:"1",
				group_id:"",
				user_id:req.user.id,
				feed_details:req.param("feed_details"),
				max_lynk_boosts:req.param("max_lynk_boosts"),
				min_lynk_boosts:req.param("min_lynk_boosts"),
				type:"P",
				privacy:1,
			};
			Feeds.create(_newpoll).exec(function (err,_poll) {
				if(err){
						return res.view('poll/create',{
						status: "Error",
						message: "Please enter required fields"
					});
				}
				if(typeof _poll.id != 'undefined') {
					/* Activity Log Insert */
					ActivityLogsService.addActivityLog({
						owner_id: req.user.id,
						module: 'poll',
						action: 'create',
						object_id: _poll.id,
						type: 'web'
					});
				}
				pollotions.forEach(function(option, index){
					if(option!=''){
						var _newotion = {
							feed_id: _poll.id,
							poll_option:option
						};
						PollOption.create(_newotion).exec(function(err,_polloption){

						});
					}
				});
				return res.redirect("/polls");
			});
		}else{
			return res.view('poll/create',{
				status:"Error",
				message:"Options must be Either 2 or 4"
			});
		}
	},

	pollanswer: function(req,res){
		PollAnswer.find({user_id:req.user.id, feed_id: req.param('feed_id')}).exec(function(err,_answer){
			var _newanswer = {
				user_id:req.user.id,
				feed_id:req.param('feed_id'),
				option_id:req.param('option_id')
			};

			if(err){
				return res.json({
					status: "Error",
					message:"Something went wrong. Please try again."
				});
			}
			if(_answer.length > 0){
				PollAnswer.update(_answer[0].id,_newanswer).exec(function(err,_response){
					if(err){
						return res.json({
							status: "Error",
							message:"Something went wrong. Please try again."
						});
					}
					if(typeof _response[0].id != 'undefined') {
						/* Activity Log Insert */
						ActivityLogsService.addActivityLog({
							owner_id: req.user.id,
							module: 'poll',
							action: 'answer',
							object_id: _response[0].id,
							type: 'web'
						});
					}
					Feeds.findOne({id: _response[0].feed_id}).populate("polloptions").populate("polloptions.pollanswers").populate("pollanswers").exec(function(err,_polls){

						var total_ans =  _polls.pollanswers.length;
						var options = _polls.polloptions;
						array = [];

						options.forEach(function(optionAns, index){
							var total_option_ans = 0;
	            			var avg = 0;
							temp = [];
							temp = optionAns;
							if(optionAns.pollanswers.length > 0){
								total_option_ans = optionAns.pollanswers.length;
								avg = (total_option_ans * 100)/total_ans;
							}
							temp['total_option_ans'] = total_option_ans;
							temp['avg'] = avg;
							array.push(temp);
						});

						if(err){
							return res.json({
								status: "Error",
								message:"Something went wrong. Please try again."
							});
						}
						return res.json({
							status: "OK",
							message:"Record update successfully",
							response:array
						});
					});
				});
			}else{
				PollAnswer.create(_newanswer).exec(function(err,_response){
					if(err){
						return res.json({
							status: "Error",
							message:"Something went wrong. Please try again."
						});
					}
					if(typeof _response.id != 'undefined') {
						/* Activity Log Insert */
						ActivityLogsService.addActivityLog({
							owner_id: req.user.id,
							module: 'poll',
							action: 'answer',
							object_id: _response.id,
							type: 'web'
						});
					}
					Feeds.findOne({id: _response.feed_id}).populate("polloptions").populate("polloptions.pollanswers").populate("pollanswers").exec(function(err,_polls){

						var total_ans =  _polls.pollanswers.length;
						var options = _polls.polloptions;
						array = [];

						options.forEach(function(optionAns, index){
							var total_option_ans = 0;
	            			var avg = 0;
							temp = [];
							temp = optionAns;
							if(optionAns.pollanswers.length > 0){
								total_option_ans = optionAns.pollanswers.length;
								avg = (total_option_ans * 100)/total_ans;
							}
							temp['total_option_ans'] = total_option_ans;
							temp['avg'] = avg;
							array.push(temp);
						});

						if(err){
							return res.json({
								status: "Error",
								message:"Something went wrong. Please try again."
							});
						}
						return res.json({
							status: "OK",
							message:"Thanks for your opininon",
							response:array
						});
					});
				});
			}
		});
	},

	delete: function(req,res){
		Feeds.findOne({id:req.param('id')}).exec(function(err,_event){
			if(req.user.id!=_event.user_id){
				return res.view('500', { message: "Internal server error." });
			}

			Feeds.update(req.param('id'),{is_deleted:1}).exec(function(err,_delete){
				//console.log(_delete);
				return res.redirect("/polls");
			});
		});
	},

	edit: function(req,res){
		Feeds.findOne({id:req.param("id")}).populate("polloptions").exec(function(err,_polls){
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				// return res.json(_polls);
				return res.view('poll/edit',{
					status:"OK",
					userData:userInfo,
					polls:_polls
				});
			});
		});
	},

	update: function(req,res){

		var polloptions = req.param("poll_option");
		var polloption_array = Object.keys(polloptions).map(function(k) { return polloptions[k] });

		var empties = 0;
		polloption_array.forEach(function(polloption, index){
			if(polloption.poll_option==''){
				empties = empties + 1;
			}
		});

		if(empties==2 || empties==0){
			
			var _updFeeds = {
				feed_details:req.param("feed_details"),
				max_lynk_boosts:req.param("max_lynk_boosts"),
				min_lynk_boosts:req.param("min_lynk_boosts"),
			};


			Feeds.update(req.param("id"),_updFeeds).exec(function(err,_feeds){
				if(err){
					return res.view('poll/edit',{
						status:"Error",
						message:"Something Went wrong. Please try again latter."
					});
				}

				polloption_array.forEach(function(polloption, index){

					if(polloption.poll_option==''){
						// Delete Option
						PollOption.find().where({ id: polloption.id }).then(function (_delete) {
							if (_delete && _delete.length > 0) {
								_delete[0].destroy().then(function (_delete) {

								}).catch(function (err) {
									return res.view('poll/edit',{
										status:"Error",
										message:"Something Went wrong. Please try again latter."
									});
								});
							} else {
								return res.view('poll/edit',{
									status:"Error",
									message:"Something Went wrong. Please try again latter."
								});
							}
						}).catch(function (err) {
							return res.view('poll/edit',{
								status:"Error",
								message:"Something Went wrong. Please try again latter."
							});
						});
					}else{
						_updOption = {
							poll_option : polloption.poll_option,
						};
						// Update Option
						PollOption.update(polloption.id,_updOption).exec(function(err,_option){
							if(err){
								return res.view('poll/edit',{
									status:"Error",
									message:"Something Went wrong. Please try again latter."
								});
							}
						});
					}
				});
				return res.redirect("polls");
			});
		}else{
			return res.redirect('poll/edit/'+req.param("id"));
		}
	},
};