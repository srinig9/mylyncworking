/**
 * FeedsController
 *
 * @description :: Server-side logic for managing feeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var path = require("path");

module.exports = {
	
    /**
     * `FeedsController.create()`
     */
    create: function (req, res) {
		if(req.param("feed_details")=='' && req.param("avatar")==''){
			req.addFlash('danger', 'Something went wrong. Please try again!');
			return res.redirect('/');
		}else{
	    	var feedDetails = (req.param("feed_details")=='') ? "&nbsp;&nbsp;" : req.param("feed_details");
			//var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

			 var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

	        // www. sans http:// or https://
	        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

	        // Email addresses
	        var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

			feedDetails= feedDetails.replace(urlPattern, '<a target="_blank" href="$&">$&</a>').replace(pseudoUrlPattern, '$1<a target="_blank" href="http://$2">$2</a>').replace(emailAddressPattern, '<a target="_blank" href="mailto:$&">$&</a>');
			
			//feedDetails = feedDetails.replace(exp,"<a href='$1' target='_blank'>$1</a>");

			var _newFeed = {
				status: 1,
				user_id: req.user.id,
				group_id: req.param("group_id"),
				feed_details: feedDetails,
				privacy: req.param("privacy")
			};

			if(typeof req.param("to_user_id")!='undefined' && req.param("to_user_id")!=''){
				_newFeed.to_user_id = req.param("to_user_id");
			}

			var _redirect = req.param("redirect");

			Feeds.create(_newFeed).then(function (_feed) {
				if(typeof _feed.id != 'undefined') {
					/* Activity Log Insert */
					ActivityLogsService.addActivityLog({
						owner_id: req.user.id,
						module: 'feed',
						action: 'create',
						object_id: _feed.id,
						type: 'web'
					});

					if(typeof _feed.to_user_id != 'undefined' && _feed.to_user_id != ''){
		                NotificationService.addNotification({
		                    from_user_id: _feed.user_id,
		                    user_id: _feed.to_user_id,
		                    feed_id: _feed.id,
		                    notification_text: "post on your wall",
		                    type: 'web'
		                });			
					}

				}
	        	/* Upload Files*/
	        	var feed_id = _feed.id;
	        	var uploadFiles = [];
	        	if(Array.isArray(req.param("files"))){
	        		uploadFiles = req.param("files");
	        	}else{
	        		uploadFiles = [req.param("files")];
	        	}

				uploadFiles.forEach(function(filename, index){
					var _newMedia = {
						feed_id:feed_id,
						image:filename
					};
					console.log(_newMedia);
					FeedMedia.create(_newMedia).exec(function(err,_medias){

					});
				});
				return res.redirect(_redirect);
	        }).catch(function (err) {
				req.addFlash('danger', 'Something went wrong. Please try again!');
				return res.redirect('/');
	        });
		}
    },

    update:function(req,res){

		var feedDetails = (req.param("feed_details")=='') ? "&nbsp;&nbsp;" : req.param("feed_details");
		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		feedDetails = feedDetails.replace(exp,"<a href='$1' target='_blank'>$1</a>");

		var _updateFeed = {
			status: 1,
			user_id: req.user.id,
			group_id: req.param("group_id"),
			feed_details: feedDetails,
			privacy: req.param("privacy")
    	};
    	var condition = {id:req.param("id")};
		var _redirect = req.param("redirect");

    	Feeds.update(condition,_updateFeed).exec(function(err,_data){
    		/* Insert New Images */
        	var feed_id = _data[0].id;
        	var uploadFiles = [];
        	if(Array.isArray(req.param("files"))){
        		uploadFiles = req.param("files");
        	}else{
        		uploadFiles = [req.param("files")];
        	}
			uploadFiles.forEach(function(filename, index){
				var _newMedia = {
					feed_id:feed_id,
					image:filename
				};
				FeedMedia.create(_newMedia).exec(function(err,_medias){

				});
			});
			return res.redirect(_redirect);
    	});
    },

    getjjobcompanyname: function(req,res){
    	Feeds.findOne({id: req.param("id")}).populate("company_id").exec(function(err,_feed){
    		if(err){
    			return res.json({
    				status: "Error",
    				response:err
    			});
    		}
			return res.json({
				status: "OK",
				response:_feed
			});
    	});
    },

    uploadFiles:function(req,res){
		req.file('avatar').upload({
			maxBytes: 4000000,
			dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/feeds')
		},function (err, uploadedFiles) {
			if(err){
				return res.json({
					status:"Error",
					message:"File uploaded successfully.",
					errors:err
				});
			}
			var array = [];
			var insertData = [];
			if(uploadedFiles.length > 0){
				uploadedFiles.forEach(function(factor, index){
					array.push(factor.fd);
				});
				array.forEach(function(imagepath, index){
					var myarr = imagepath.split("\\");
					var filename = path.basename(myarr[myarr.length-1]);
					var _newMedia = { image: filename };
					insertData.push(_newMedia);
				});
			}
			return res.json({
				status:"OK",
				data:insertData,
				message:"Error in upload file. Please try again.",
			});
		});

    },

    getfeeddata:function(req,res){
    	Feeds.findOne({id:req.param("id")})
			.populate("feedmedias")
			.exec(function(err,_feed){
            if(err){
                return res.json({
                    status:"Error",
                    message:"Something went wrong. Please try again."
                });
            }
            return res.json({
                status:"OK",
                data:_feed
            });
        });
    },

	delete: function(req,res){
		Feeds.findOne({id:req.param('id')}).exec(function(err,_blog){
			if(req.user.id!=_blog.user_id){
				return res.view('500', {message: "Internal server error."});
			}

			Feeds.update(req.param('id'),{is_deleted:1,status:0}).exec(function(){
				return res.redirect("/");
			});

		});
	},

	feedDetails:function(req,res){
		UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
			Feeds.findOne({id:req.param("id")})
				.populate('user_id', { select: ['name','id'] })
				.populate('user_id.company_id',{select:['company_name','slug']})
				.populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
				.populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
				.populate('feedcomments', { sort: 'createdAt ASC' })
				.populate('feedcomments.user_id.company_id')
				.populate('feedcomments.commentlikes')
				.populate('feedcomments.commentreply')
				.populate('feedcomments.commentreply.commentlikes')
				.populate('feedcomments.commentreply.user_id.company_id')
				.populate('feedmedias')
				.populate('feedlikes',{select:['user_id','status']})
                .populate("pollanswers")
                .populate('polloptions')
                .populate("polloptions.pollanswers")
				.exec(function(err,resultData){
				return res.view('post/post_details',{
					status:"OK",
					title:"Feed Details",
					_feed:resultData,
					userData:userInfo
				});
			});
		});
	},

	createfeedspams: function(req,res){
		var user_id = req.user.id;

		var _newFeedSpam = {
			user_id:user_id,
			feed_id:req.param("feed_id"),
			spamtext:req.param("spamtext")
		};

		FeedSpams.find({ user_id:user_id,feed_id:req.param("feed_id")}).exec(function(err,resultData){
			if(err){
				return res.json({
					status:"Error",
					message:"Something went wrong. Please try again."
				});
			}
			if(resultData.length==0){
				FeedSpams.create(_newFeedSpam).exec(function(err,data){
					if(err){
						return res.json({
							status:"Error",
							message:"Something went wrong. Please try again."
						});
					}

					if(typeof req.param("sendEmail")!='undefined' && req.param("sendEmail")!=''){ // Send Spam EMail
						FeedSpams.findOne({id:data.id}).populate("user_id").populate("feed_id").populate("feed_id.user_id").populate("feed_id.user_id.company_id").exec(function(err,spamFeed){
							sails.hooks.email.send(
	                            "FeedSpams",
	                            {
	                                siteURL: sails.config.appUrlwPort,
	                                spamFeed: spamFeed,
	                                BodyReport_Flag:req.param("spamtext"),
	                                recipientEmail: "reports@lynked.world",
	                            },
	                            {
	                                to: "reports@lynked.world",
	                                subject: req.param("spamtext")
	                            },
	                            function(err) {
	                                console.log(err || "It worked!");
	                            }
	                        );
	                        return res.json({
								status:"OK",
								message:"Feed has been successfully added in " + req.param("spamtext")
							});
						})
					}else{
						return res.json({
							status:"OK",
							message:"Feed has been successfully added in " + req.param("spamtext")
						});
					}
				});
			}else{
				return res.json({
					status:"OK",
					message:"Feed already added in "+req.param("spamtext")
				});
			}
		});
	},

	deleteFeedmedia:function(req,res){
		FeedMedia.find({id:req.param("id")}).exec(function(err,_delete){
			if (_delete && _delete.length > 0) {
				_delete[0].destroy().then(function (_delete) {
					return res.json({ status:"OK", message:"Media file has been deleted successfully." });
				}).catch(function (err) {
					return res.json({ status:"Error", message:"Something went wrong. Please try again." });
				});
			} else {
				return res.json({ status:"Error", message:"Something went wrong. Please try again." });
			}
		});
	}
};

