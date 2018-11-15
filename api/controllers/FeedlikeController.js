/**
 * FeedlikeController
 *
 * @description :: Server-side logic for managing feedlikes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	totallikes : function(req, res) {
		var user_id = req.user.id;
		console.log(req.param("feed_id"));
		return new Promise(function (fulfill, reject){
			Feedlike.find({feed_id: req.param("feed_id"), status : 1}).exec(function(err,found){
				if (err){
					fulfill(err);
				} else {
					fulfill(found);
				}
			});
		});
	},

	totaldislikes : function(req, res) {
		var user_id = req.user.id;
		console.log(req.param("feed_id"));
		return new Promise(function (fulfill, reject){
			Feedlike.find({feed_id: req.param("feed_id"), status : 2}).exec(function(err,found){
				if (err){
					fulfill(err);
				} else {
					fulfill(found);
				}
			});
		});
	},

	like: function(req,res){
		var _newlike = {
			user_id: req.user.id,
			feed_id: req.param("feed_id"),
			status: req.param("status")
		};
		var self = this;
		Feedlike.find({user_id: req.user.id, feed_id: req.param("feed_id"), status : [1, 2]}).exec(function(err,result){
			if(err) return res.json(err);
			if(result.length > 0){
				/* Delete alredy stored data */
				if (result && result.length > 0) {
				    result[0].destroy().then(function (deleted) {
				        /* If different action the need to insert data */
						if(result[0].status!=req.param("status")){
							Feedlike.create(_newlike).then(function (_newlike) {
								if(typeof _newlike.id != 'undefined') {
									/* Activity Log Insert */
									ActivityLogsService.addActivityLog({
										owner_id: req.user.id,
										module: 'feedlike',
										action: 'like_dislike',
										object_id: _newlike.id,
										type: 'web'
									});
								}
								self.totallikes(req).then(function(totallikes){
									self.totaldislikes(req).then(function(totaldislikes){
									    return res.json({
									        totalLikes: totallikes.length,
									        totalDislikes: totaldislikes.length,
									        status: 'OK',
									        statusDescription: err,
									        message: "Like / Dislike count"
									    });
									});
								});
							}).catch(function (err) {
							    return res.json({
							        data: _newlike,
							        status: 'Error',
							        statusDescription: err,
							        message: "Error in add Comment"
							    });
							});
						}
						else
						{
							self.totallikes(req).then(function(totallikes){
								self.totaldislikes(req).then(function(totaldislikes){
								    return res.json({
								        totalLikes: totallikes.length,
								        totalDislikes: totaldislikes.length,
								        status: 'OK',
								        statusDescription: err,
								        message: "Like / Dislike count"
								    });
								});
							});
						}
				    }).catch(function (err) {
				        console.error(err);
				    });
				}
			}else{
				Feedlike.create(_newlike).then(function (_newlike) {
					self.totallikes(req).then(function(totallikes){
						self.totaldislikes(req).then(function(totaldislikes){
							Feedlike.findOne({id:_newlike.id}).populateAll().exec(function(err,data){
				                /* Add Send Request Notification */
				                var textdata = "";
				                if(data.status == 1){
				                	textdata = "liked";
				                }else if(data.status == 2){
				                	textdata = "disliked";
				                }
				                if(data.feed_id.user_id != req.user.id){
					                NotificationService.addNotification({
					                    user_id: data.feed_id.user_id,
					                    from_user_id: data.user_id.id,
					                    feed_id: data.feed_id.id,
					                    notification_text: textdata,
					                    type: 'web'
					                });
					            }
								/* Activity Log Insert */
								ActivityLogsService.addActivityLog({
									owner_id: req.user.id,
									module: 'feedlike',
									action: 'like_dislike',
									object_id: _newlike.id,
									type: 'web'
								});
							    return res.json({
									owner_id:req.param("owner_id"),
							        totalLikes: totallikes.length,
							        totalDislikes: totaldislikes.length,
							        status: 'OK',
							        statusDescription: err,
							        message: "Like / Dislike count"
							    });
							});
						});
					});
				}).catch(function (err) {
				    return res.json({
				        data: _newlike,
				        status: 'Error',
				        statusDescription: err,
				        message: "Error in add Comment"
				    });
				});
			}
		});
	},

	likecomment: function(req,res){
		var _newlike = {
			user_id: req.user.id,
			feed_id: null,
			comment_id: req.param("comment_id"),
			status: req.param("status")
		};
		var self = this;
		Feedlike.find({user_id: req.user.id, comment_id: req.param("comment_id"), status: 1 }).exec(function(err,result){
			if(err){ return res.json({status:'Error', message: "Something went wrong. Please try again.", err}); }
			if(result.length > 0)
			{
				result[0].destroy().then(function (deleted) {
					Feedlike.find({comment_id: req.param("comment_id") }).exec(function(error,likes){
					    return res.json({
					        totallikes: likes.length,
					        status: 'OK',
					        message: "Comment unliked"
					    });
					});
				}).catch(function (err) {
				    return res.json({
				        status: 'Error',
				        statusDescription: err,
				        message: "Something problem in delete"
				    });
			    });
			}
			else
			{
				Feedlike.create(_newlike).then(function (_newlike) {
					Feedlike.find({comment_id: req.param("comment_id") }).exec(function(error,likes){
						if(typeof _newlike.id != 'undefined') {
							/* Activity Log Insert */
							ActivityLogsService.addActivityLog({
								owner_id: req.user.id,
								module: 'feedcommentlike',
								action: 'like_dislike',
								object_id: _newlike.id,
								type: 'web'
							});
						}
					    return res.json({
					        totallikes: likes.length,
					        status: 'OK',
					        message: "Comment liked"
					    });
					});
				}).catch(function (err) {
				    return res.json({
				        data: _newlike,
				        status: 'Error',
				        statusDescription: err,
				        message: "Something went wrong. Please try again"
				    });
				});
			}
		});
	},

};