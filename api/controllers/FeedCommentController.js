/**
 * FeedCommentController
 *
 * @description :: Server-side logic for managing feedcomments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create: function(req, res){
		var _newComment = {
			user_id: req.user.id,
			feed_id: req.param("feed_id"),
			comments: req.param("comments"),
			parent_id: req.param("parent_id")
		};
		
		FeedComment.create(_newComment).then(function (_comment) {
			FeedComment.find({id:_comment.id}).populate("parent_id").populate("feed_id").populate("user_id").exec(function(error,newcomment){
				/* Add Send Request Notification */
				/* Add Send Request Notification */
    			var user_id = "";
    			var c_feed_id = "";
            	var textdata = "commented";
                if(typeof newcomment[0].feed_id!='undefined'){
	                c_feed_id = newcomment[0].feed_id.id;
	                user_id = newcomment[0].feed_id.user_id;
            		textdata = "commented";
                }else if(typeof newcomment[0].parent_id!='undefined'){
	                c_feed_id = newcomment[0].parent_id.feed_id;
	                user_id = newcomment[0].parent_id.user_id;
            		textdata = "replied on comment";
                }

                if(user_id!=req.user.id){
	                NotificationService.addNotification({
	                    from_user_id: newcomment[0].user_id.id,
	                    user_id: user_id,
	                    feed_id: c_feed_id,
	                    notification_text: textdata,
	                    type: 'web'
	                });
                }

				/* Activity Log Insert */
				ActivityLogsService.addActivityLog({
					owner_id: req.user.id,
					module: 'feedcomment',
					action: 'comment',
					object_id: _comment.id,
					type: 'web'
				});
				return res.render('ajax/feedcomment',{comments:newcomment,owner_id : req.param("owner_id")});
			});
		}).catch(function (err) {
            return res.json({
                contact: _newComment,
                status: 'Error',
                statusDescription: err,
                message: "Error in add Comment"
            });			
		});
	},

	deleteComment:function(req,res){
		FeedComment.find({"$or" : [{id:req.param("id")}, {parent_id:req.param("id")}] }).exec(function(err,_comments){
			if(err){
				return res.json({
					status:"Error",
					message: "Something went wrong. Please try again."
				});
			}
			_comments.forEach(function(_delete, index){
				_delete.destroy().then(function (_delete) {
					console.log("Delete User Data --------");
				}).catch(function (err) {
					return res.json({ status:"Error", message:"Something went wrong. Please try again." });
				});
			});
			return res.json({
				status:"OK",
				message: "Comment has been deleted."
			});
		});
	},

	updateComment:function(req,res){
		FeedComment.find({id:req.param("id")}).exec(function(err,_comment){
			if(err){
				return res.json({
					status:"Error",
					message:"Something went wrong. Please try again."
				});
			}
			if(_comment.length > 0){
				var _updComment = {
					comments: req.param("comments"),
				};
				FeedComment.update({id:req.param("id")},_updComment).exec(function(err,_editcomment){
					console.log(_editcomment);
					if(err){
						return res.json({
							status:"Error",
							message:"Something went wrong. Please try again."
						});
					}
					return res.json({
						status:"OK",
						data:_editcomment[0],
						message:"Comment has been updated successfully"
					});
				});
			}else{
				return res.json({
					status:"Error",
					message:"Sorry your requested comment not found."
				});
			}
		});
	},
};

