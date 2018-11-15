var Promise = require('promise');
var path    = require("path");
var fs		= require('fs');
var moment	= require('moment')

module.exports = {
    _config: {
        model: ['Feeds','Feedlike','FeedComment','Follow']
    },
	
    getFeeds: function(req,user_id) {
        var page = 1;
        var limit = 4;
        if(req.param("page_no") != undefined){
            page = req.param("page_no");
        }
        return new Promise(function (resolve, reject){ 
            // Follow Companies List
            Follow.find({user_id:user_id}).exec(function(err,_companies){
                if(err){ reject(err); }
                company_ids = [];
                _companies.forEach(function(_company, index){
                    company_ids.push(_company.company_id);
                });

                // Get Companies as user
                Users.find().where({"company_id" : { id: {"$in" : company_ids }}}).populate("company_id").exec(function(err,_users){
                    _followCompanies = [];
                    if(_users != undefined){
                        _users.forEach(function(user, index){
                            _followCompanies.push(user.id);
                        });
                    }

                    // Joined Group List
                    GroupUsers.find({user_id:user_id}).exec(function(err,_groupuser){
                        if(err){ reject(err); }
                        group_ids = [];
                        _groupuser.forEach(function(_groupusers, index){
                            group_ids.push(_groupusers.group_id);
                        });

                        // Get User Connection list
                        UserConnectionService.getUserConnection(user_id).then(function(user_ids){
                            var own = [user_id];
                            connection_user_ids = user_ids.concat(_followCompanies);
                            connections = connection_user_ids.concat(_followCompanies);
                            connection_ids = connections.concat(own);

                            var start = moment().subtract(24, 'hours').toDate();

                            var likeCondition = { 
                                    "$and" : [
                                        { "user_id" : { "$in" : connections } }, 
                                        { "status" : 1 },
                                        { "createdAt" : { ">": start } }
                                    ] 
                                };

                            Feedlike.find().where(likeCondition).paginate({page: page, limit: limit}).exec(function (err, posts) {
                                if(err){ reject(err); }

                                var feed_ids = [];
                                posts.forEach(function(post, index){
                                    feed_ids.push(post.feed_id);
                                });
                                FeedSpams.find({user_id:user_id}).exec(function(err,FeedSpams){
                                    var SpamsFeeds = [];
                                    FeedSpams.forEach(function(FeedSpam, index){
                                        SpamsFeeds.push(FeedSpam.feed_id);
                                    });
                                    var filter = {
                                        "$or" : [ 
                                            { "$and" : [
                                                { "user_id" : { "$in" : connection_ids } }, 
                                                { "group_id" : "" }, 
                                                ] 
                                            }, 
                                            { "id" : { "$in" : feed_ids } },
                                            { "group_id" : { "$in" : group_ids } },
                                            { "to_user_id" : { "$in" : [user_id] } }
                                        ],
                                        is_deleted : { "!" : 1 },
                                        id : { "$nin" : SpamsFeeds },
                                    };
                                    Feeds.find(filter)
                                        .populate('group_id')
                                        .populate('user_id')
                                        .populate('user_id.userexperiences',{where:{"display_status":1}})
                                        .populate('user_id.userexperiences.company_id',{select:['company_name','slug']})
                                        .populate('user_id.company_id',{select:['company_name','slug']})
                                        .populate('jobBookmarks',{'where' : {user_id:user_id}})
                                        .populate('company_id',{'select':['id','company_name']})
                                        .populate('job_type_id',{'select':['id','title']})
                                        .populate('experience_id',{'select':['id','title']})
                                        .populate('feedcomments', {sort: 'createdAt ASC'})
                                        .populate('feedcomments.user_id',{select:['name','company_id','slug','profile_image']})
                                        .populate('feedcomments.commentlikes')
                                        .populate('feedcomments.commentreply')
                                        .populate('feedcomments.commentreply.commentlikes')
                                        .populate('feedcomments.commentreply.user_id.company_id')
                                        .populate('feedmedias')
                                        .populate('feedlikes',{select:['user_id','status']})
                                        .populate("pollanswers")
                                        .populate('polloptions')
                                        .populate("polloptions.pollanswers")
                                        .sort('createdAt DESC')
                                        .paginate({page: page, limit: limit})
                                        .exec(function(err,feeds){
                                            if (err){
                                                resolve(false);
                                            } else {
                                                for (var index = 0, len = feeds.length; index < len; index++) {
                                                    _feed = feeds[index]; 
                                                    var totalLikes = 0;
                                                    var totaldislikes = 0;
                                                    var isliked = 0;
                                                    var isdisliked = 0;
                                                    feedlikes = _feed.feedlikes;

                                                    for (var index1 = 0, len1 = feedlikes.length; index1 < len1; index1++) {
                                                        temp2 = [];
                                                        temp2 = feedlike;
                                                        var feedlike = feedlikes[index1];
                                                        if(feedlike.status==1){
                                                            totalLikes = totalLikes+1;
                                                        }
                                                        if(feedlike.status==2){
                                                            totaldislikes = totaldislikes+1;
                                                        }
                                                        if(feedlike.status==2 && feedlike.user_id==user_id){
                                                            isdisliked = 1;
                                                        }
                                                        if(feedlike.status==1 && feedlike.user_id==user_id){
                                                            isliked = 1;
                                                        }
                                                    }
                                                    feeds[index]['totalLynked'] = 0;
                                                    feeds[index]['totalShaer'] = 0;
                                                    feeds[index]['totalComment'] = feeds[index]['feedcomments'].length;
                                                    feeds[index]['feedcomments'] = feeds[index]['feedcomments'].slice(0, 3);
                                                    feeds[index]['totalLikes'] = totalLikes;
                                                    feeds[index]['totaldislikes'] = totaldislikes;
                                                    feeds[index]['isliked'] = isliked;
                                                    feeds[index]['isdisliked'] = isdisliked;
                                                    delete feeds[index]['feedlikes'];
                                                    var user_data_tmp = feeds[index]['user_id'];
													var userexperiences_headline = '';
													if(feeds[index]['user_id']['userexperiences'].length > 0 && typeof feeds[index]['user_id']['userexperiences'][0]['title'] != 'undefined') {
														userexperiences_headline = feeds[index]['user_id']['userexperiences'][0]['title'];
														if(typeof feeds[index]['user_id']['userexperiences'][0]['company_id'] != 'undefined' && typeof feeds[index]['user_id']['userexperiences'][0]['company_id']['company_name'] != 'undefined'){
															userexperiences_headline += ' at ' + feeds[index]['user_id']['userexperiences'][0]['company_id']['company_name'];
														}
													}
                                                    if(user_data_tmp['company_id'] != undefined){
                                                        feeds[index]['user_id'] = {id: user_data_tmp['id'],'name': user_data_tmp['name'],slug :user_data_tmp['slug'],company_id:user_data_tmp['company_id'],headline:userexperiences_headline};
                                                    } else {
                                                        feeds[index]['user_id'] = {id: user_data_tmp['id'],'name': user_data_tmp['name'],slug :user_data_tmp['slug'],headline:userexperiences_headline};
                                                    }
													if(typeof user_data_tmp['profile_image']!='undefined' && user_data_tmp['profile_image']!=''){
														feeds[index]['user_id'].profile_image = user_data_tmp['profile_image'];
													}
                                                    if(feeds[index]['jobBookmarks'].length > 0){
                                                        feeds[index]['jobBookmarks'] = true;
                                                    } else {
                                                        feeds[index]['jobBookmarks'] = false;
                                                    }
													var share_url = '';
                                                    if(typeof feeds[index]['type'] != 'undefined' && feeds[index]['type'] != ''){
														if(feeds[index]['type'] == 'J' && typeof feeds[index]['slug'] != 'undefined' && feeds[index]['slug'] != ''){
															share_url = sails.config.appUrlwPort + '/jobs/' + feeds[index]['slug'];
														} else if(feeds[index]['type'] == 'B' && typeof feeds[index]['slug'] != 'undefined' && feeds[index]['slug'] != ''){
															share_url = sails.config.appUrlwPort + '/blogs/' + feeds[index]['slug'];
														} else if(feeds[index]['type'] == 'P'){
															share_url = sails.config.appUrlwPort + '/post/' + feeds[index]['id'];
														} else if(feeds[index]['type'] == 'E' && typeof feeds[index]['slug'] != 'undefined' && feeds[index]['slug'] != ''){
															share_url = sails.config.appUrlwPort + '/event/' + feeds[index]['slug'];
														}
                                                    } else {
														share_url = sails.config.appUrlwPort + '/post/' + feeds[index]['id'];
													}
													feeds[index]['share_url'] = share_url;
                                                }
                                                resolve({feeds:feeds,
                                                    'feedmedia_url':sails.config.appUrlwPort + sails.config.feedmedia_url,
                                                    'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url});
                                            }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },
	
    feedCommentList : function(res,user_id){
        feed_id = res.param("feed_id");
        return new Promise(function (fulfill, reject) { 
            Feeds.findOne({id:feed_id})
                .populate('feedcomments', { sort: 'createdAt ASC' })
                .populate('feedcomments.user_id.company_id',{slect:['company_name']})
                .populate('feedcomments.user_id',{'select':['id','name','profile_image','cover_image']})
                .populate('feedcomments.commentlikes')
                .populate('feedcomments.commentreply')
                .populate('feedcomments.commentreply.commentlikes')
                .populate('feedcomments.commentreply.user_id',{'select':['id','name','profile_image','cover_image']})
                .populate('feedcomments.commentreply.user_id.company_id',{slect:['company_name']})
                .exec(function(err,FeedcommentsList){
                    if(err)  fulfill(false);  
                    console.log(FeedcommentsList['feedcomments'].length);
                    var feedcomments;

                    for(var i=0;i<FeedcommentsList['feedcomments'].length;i++){
                        feedcomments = FeedcommentsList['feedcomments'][i];
                        var feedcomment_user_data = {};
                        feedcomment_user_data['name']           = feedcomments['user_id']['name'];
                        feedcomment_user_data['id']             = feedcomments['user_id']['id'];
                        if(feedcomments['user_id']['profile_image'] != undefined){
                            feedcomment_user_data['profile_image']  = feedcomments['user_id']['profile_image'];
                        }
                        if(feedcomments['user_id']['company_id'] != undefined){
                            feedcomment_user_data['company_id'] = feedcomments['user_id']['company_id'];
                        }
                        feedcomment_user_data['slug']       = feedcomments['user_id']['slug'];

                        FeedcommentsList['feedcomments'][i]['user_id'] = feedcomment_user_data;
                        var commentreply = [];
                        if(feedcomments['commentreply'].length > 0){
                            for(var j=0;j<feedcomments['commentreply'].length;j++){
                                commentreply = feedcomments['commentreply'][j];

                                var feedcommentreply_user_data = {};
                                feedcommentreply_user_data['name']           = commentreply['user_id']['name'];
                                feedcommentreply_user_data['id']             = commentreply['user_id']['id'];
                                if(commentreply['user_id']['profile_image'] != undefined){
                                    feedcommentreply_user_data['profile_image']  = commentreply['user_id']['profile_image'];
                                }
                                if(commentreply['user_id']['company_id'] != undefined){
                                    feedcommentreply_user_data['company_id'] = commentreply['user_id']['company_id'];
                                }
                                feedcommentreply_user_data['slug']       = commentreply['user_id']['slug'];
                                commentreply['user_id'] = feedcommentreply_user_data
                            }
                            feedcomments['commentreply'] = commentreply;
                        }

                        FeedcommentsList['feedcomments'][i]['comment_like_count'] = FeedcommentsList['feedcomments'][i]['commentlikes'].length;
                        delete FeedcommentsList['feedcomments'][i]['commentlikes'];
                    }
                    //FeedcommentsList['feedcomments'] = feedcomments;
                    
                    fulfill({"feedcomments":FeedcommentsList['feedcomments'],'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url});
            });
        });
    },
	
    addFeeds: function(req,user_id) {
        var _newFeed = {
			status: 1,
			user_id: user_id,
			feed_details: '',
			privacy: req.param("privacy")
        };
		
		if(typeof req.param("group_id")!='undefined' && req.param("group_id")!='') {
			_newFeed.group_id = req.param("group_id");
		}else{
			_newFeed.group_id = "";
		}
		
		var valid_details = 0;
		if(typeof req.param("feed_details")!='undefined' && req.param("feed_details")!='') {

            var feed_data = '';
                feed_data = req.param("feed_details");

            var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

            // www. sans http:// or https://
            var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim; 
            
            // Email addresses
            var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;
            
            feed_data= feed_data.replace(urlPattern, '<a target="_blank" href="$&">$&</a>').replace(pseudoUrlPattern, '$1<a target="_blank" href="http://$2">$2</a>').replace(emailAddressPattern, '<a target="_blank" href="mailto:$&">$&</a>');
            
            _newFeed.feed_details = feed_data;
			valid_details = 1;
		}

        console.log('create feed');

        return new Promise(function (fulfill, reject) { 
            Feeds.create(_newFeed).then(function (_feed) {
                if(typeof _feed.id != 'undefined') {
                    /* Activity Log Insert */
                    // ActivityLogsService.addActivityLog({
                    //     owner_id: user_id,
                    //     module: 'feed',
					
                    //     action: 'addFeeds',
                    //     object_id: _feed.id,
                    //     type: 'api'
                    // });
                }
                var feed_id = _feed.id;
                /* Upload Image */
                try{
					
					var uploadPath = "./.tmp/public/uploads/feeds";
					req.file('avatar').upload({
						dirname: path.resolve(sails.config.appPath, uploadPath)
					},function (err, uploadedFiles) {
						if(err){
                            fulfill(_feed.id);
                        } else {
                            array = [];
							if(uploadedFiles.length > 0){
								uploadedFiles.forEach(function(factor, index){
									array.push(factor.fd);
								});
								array.forEach(function(factor, index){
									var myarr = factor.split("\\");
									var filename = path.basename(myarr[myarr.length-1]);
									/* Copy .tmp to upload folder*/
									fs.readFile(factor, function (err, data) {
										fs.writeFile(sails.config.appPath+'/assets/uploads/feeds/'+filename, data, function (err) {
											FeedMedia.create({ feed_id: feed_id, image: filename }).exec(function (err, image) {
											
											});
										});
									});
								});
							} else if(valid_details==0 && uploadedFiles.length==0) {
								fulfill(false);
							}
						}
						fulfill(_feed.id);
					});
							
                    /* req.file('avatar').upload({
                        dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/feeds')
                    },function (err, uploadedFiles) {
                        if(err){
                            fulfill(_feed.id);
                        } else {
                            array = [];
                            if(uploadedFiles.length > 0) {                        
                                uploadedFiles.forEach(function(factor, index){
                                    array.push(factor.fd);
                                });
                                array.forEach(function(factor, index){
                                    var myarr = factor.split("\\");
                                    var filename = path.basename(myarr[myarr.length-1]);
                                    FeedMedia.create({ feed_id: feed_id, image: filename }).exec(function (err, image) {
                                        
                                    });
                                });
                            } else if(valid_details==0 && uploadedFiles.length==0) {
								fulfill(false);
							}
                        }
                        fulfill(_feed.id);
                    }); */
                }catch(e){
                    fulfill(_feed.id);
                }
            }).catch(function (err) {
				console.log("err--->>", JSON.stringify(err));
                fulfill(false);
            });
        });
    },
	
    feedComment: function(req, user_id){
		var _newComment = {
			user_id: user_id,
			feed_id: req.param("feed_id"),
			comments: req.param("comments"),
			parent_id: req.param("parent_id")
		};
		return new Promise(function (resolve, reject) { 
            FeedComment.create(_newComment).then(function (_comment) {
                FeedComment.findById(_comment.id).populate('user_id').exec(function(error,newcomment){
                    if(typeof _comment.id != 'undefined') {
                        /* Activity Log Insert */
                        ActivityLogsService.addActivityLog({
                            owner_id: user_id,
                            module: 'feedcomment',
                            action: 'comment',
                            object_id: _comment.id,
                            type: 'api'
                        });
                        resolve(_comment.id);
                    } else {
                        resolve(false);	
                    }
                });
            }).catch(function (err) {
                resolve(false);	
            });
        });
    },
	
    feedLike: function(req,user_id){
		var _newlike = {
			user_id: user_id,
			feed_id: req.param("feed_id"),
			status: req.param("status")
		};
        var self = this;
        return new Promise(function (resolve, reject) { 
		    Feedlike.find({user_id: user_id, feed_id: req.param("feed_id"), status : [1, 2]}).exec(function(err,result){
			    if(err) resolve(false);
                if(result.length > 0){
                    /* Delete alredy stored data */
                    if (result && result.length > 0) {
                        result[0].destroy().then(function (deleted) {
                            if(result[0].status!=req.param("status")){
                                //console.log("INSIDE Inserted");
                                Feedlike.create(_newlike).then(function (like_data) {
                                    //console.log("Inserted successfully!!! result = " + _newlike);
                                    if(typeof like_data.id != 'undefined') {
                                        /* Activity Log Insert */
                                        ActivityLogsService.addActivityLog({
                                            owner_id: user_id,
                                            module: 'feedlike',
                                            action: 'like_dislike',
                                            object_id: like_data.id,
                                            type: 'api'
                                        });
                                    }
                                    FeedService.totallikes(req).then(function(totallikes){
                                        FeedService.totaldislikes(req).then(function(totaldislikes){
                                            FeedService.checkIsLike(req,user_id).then(function(is_like){
                                                FeedService.checkIsDislike(req,user_id).then(function(is_dislike){
                                                    resolve({
                                                        totalLikes: totallikes.length,
                                                        totalDislikes: totaldislikes.length,
                                                        is_like :is_like,
                                                        is_dislike : is_dislike
                                                    });
                                                });
                                            });
                                        });
                                    });
                                }).catch(function (err) {
                                    resolve(false);
                                });
                            }
                            else
                            {
                                FeedService.totallikes(req).then(function(totallikes){
                                    FeedService.totaldislikes(req).then(function(totaldislikes){
                                        FeedService.checkIsLike(req,user_id).then(function(is_like){
                                             FeedService.checkIsDislike(req,user_id).then(function(is_dislike){
                                                resolve({
                                                    totalLikes: totallikes.length,
                                                    totalDislikes: totaldislikes.length,
                                                    is_like :is_like,
                                                    is_dislike : is_dislike
                                                });
                                            });
                                        }); 
                                    });
                                });
                            }
                        }).catch(function (err) {
                            resolve(false);
                        });
                    }
                } else {
                    //console.log("INSIDE FIRST LIKE");
                    Feedlike.create(_newlike).then(function (like_data) {
                        FeedService.totallikes(req).then(function(totallikes){
                            FeedService.totaldislikes(req).then(function(totaldislikes){
                                FeedService.checkIsLike(req,user_id).then(function(is_like){
                                    FeedService.checkIsDislike(req,user_id).then(function(is_dislike){
                                        if(typeof like_data.id != 'undefined') {
                                            /* Activity Log Insert */
                                            ActivityLogsService.addActivityLog({
                                                owner_id: user_id,
                                                module: 'feedlike',
                                                action: 'like_dislike',
                                                object_id: like_data.id,
                                                type: 'web'
                                            });
                                        }
                                        resolve({ 
                                            totalLikes: totallikes.length,
                                            totalDislikes: totaldislikes.length,
                                            is_like :is_like,
                                            is_dislike : is_dislike
                                        });
                                    });
                                });
                            });
                        });
                    }).catch(function (err) {
                        resolve(false);
                    });
                }
            });
		});
    },
	
    totallikes : function(req) {
		//console.log(req.param("feed_id"));
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
	
	totaldislikes : function(req) {
		//console.log(req.param("feed_id"));
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
	
    checkIsLike : function(req,user_id){
        var feed_id = req.param("feed_id");
        return new Promise(function (fulfill, reject){
			Feedlike.count({user_id:user_id,feed_id: feed_id,status:1}).exec(function(err,found){
                
				if (err){
					fulfill(err);
				} else {
                    if(found > 0){
                        fulfill(1);
                    } else {
                        fulfill(0);
                    }
				}
			});
		});
    },
    checkIsDislike : function(req,user_id){
        var feed_id = req.param("feed_id");
        return new Promise(function (fulfill, reject){
			Feedlike.count({user_id:user_id,feed_id: feed_id,status:2}).exec(function(err,found){
				if (err){
					fulfill(err);
				} else {
                    if(found > 0){
                        fulfill(1);
                    } else {
                        fulfill(0);
                    }
				}
			});
		});
    },
	totaldFeedComment : function(req,feed_id) {
		//console.log(req.param("feed_id"));
		return new Promise(function (fulfill, reject){
			FeedComment.count({feed_id: feed_id}).exec(function(err,found){
				if (err){
					fulfill(err);
				} else {
                    /* console.log(found) */
					fulfill(found);
				}
			});
		});
    },
	
    likecomment: function(req,user_id){
		var _newlike = {
			user_id: user_id,
			feed_id: null,
			comment_id: req.param("comment_id"),
			status: req.param("status")
		};
        var self = this;
        return new Promise(function (resolve, reject){
            Feedlike.find({user_id: user_id, comment_id: req.param("comment_id"), status: 1 }).exec(function(err,result){
                if(err){ resolve(false);}
                if(result.length > 0)
                {
                    result[0].destroy().then(function (deleted) {
                        Feedlike.find({comment_id: req.param("comment_id") }).exec(function(error,likes){
                            resolve(likes.length);
                        });
                    }).catch(function (err) {
                        resolve(false);
                    });
                }
                else
                {
                    Feedlike.create(_newlike).then(function (_newlike) {
                        Feedlike.find({comment_id: req.param("comment_id") }).exec(function(error,likes){
                            if(typeof _newlike.id != 'undefined') {
                                /* Activity Log Insert */
                                ActivityLogsService.addActivityLog({
                                    owner_id: user_id,
                                    module: 'feedcommentlike',
                                    action: 'like_dislike',
                                    object_id: _newlike.id,
                                    type: 'api'
                                });
                            }
                            resolve(likes.length);
                            });
                        }).catch(function (err) {
                        resolve(false);
                    });
                }
            });
        });
    },
	
    feedDetails: function(req,user_id){
        /* console.log(req.param("id")); */
        return new Promise(function (resolve, reject){
            Feeds.findOne({id:req.param("id")})
                .populate('jobBookmarks',{'where' : {user_id:user_id}})
                .populate('industrie_id',{'select':['id','name']})
                .populate('company_id')
                .populate('company_id.companydata',{select : ['slug','cover_image','profile_image','email']})
                .populate('job_type_id',{'select':['id','title']})
                .populate('experience_id',{'select':['id','title']})
                .populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
				.populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
				.populate('user_id',{'select':['id','name','profile_image','cover_image']})
                .populate('user_id.company_id',{select:['company_name','slug']})
                .populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
                .populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
                .populate('feedcomments', { sort: 'createdAt ASC' })
                .populate('feedcomments.user_id.company_id',{slect:['company_name']})
                .populate('feedcomments.user_id',{'select':['id','name','profile_image','cover_image']})
                .populate('feedcomments.commentlikes')
                .populate('feedcomments.commentreply')
                .populate('feedcomments.commentreply.commentlikes')
                .populate('feedcomments.commentreply.user_id',{'select':['id','name','profile_image','cover_image']})
                .populate('feedcomments.commentreply.user_id.company_id',{slect:['company_name']})
                .populate('feedmedias')
                .populate('feedlikes')
                .populate("polloptions")
                .populate("polloptions.pollanswers")
                .populate("pollanswers")
                .exec(function(err,resultData){
                    if(err) resolve(false);
                    var totalLikes = 0;
                    var totaldislikes = 0;
                    var isliked = 0;
                    var isdisliked = 0;
                    feedlikes = resultData.feedlikes;

                    for (var index1 = 0, len1 = feedlikes.length; index1 < len1; index1++) {
                        temp2 = [];
                        temp2 = feedlike;
                        var feedlike = feedlikes[index1];
                        if(feedlike.status==1){
                            totalLikes = totalLikes+1;
                        }
                        if(feedlike.status==2){
                            totaldislikes = totaldislikes+1;
                        }
                        if(feedlike.status==2 && feedlike.user_id==user_id){
                            isdisliked = 1;
                        }
                        if(feedlike.status==1 && feedlike.user_id==user_id){
                            isliked = 1;
                        }
                    }
					var share_url = '';
					if(typeof resultData['type'] != 'undefined' && resultData['type'] != ''){
						if(resultData['type'] == 'J' && typeof resultData['slug'] != 'undefined' && resultData['slug'] != ''){
							share_url = sails.config.appUrlwPort + '/jobs/' + resultData['slug'];
						} else if(resultData['type'] == 'B' && typeof resultData['slug'] != 'undefined' && resultData['slug'] != ''){
							share_url = sails.config.appUrlwPort + '/blogs/' + resultData['slug'];
						} else if(resultData['type'] == 'P'){
							share_url = sails.config.appUrlwPort + '/post/' + resultData['id'];
						} else if(resultData['type'] == 'E' && typeof resultData['slug'] != 'undefined' && resultData['slug'] != ''){
							share_url = sails.config.appUrlwPort + '/event/' + resultData['slug'];
						}
					} else {
						share_url = sails.config.appUrlwPort + '/post/' + resultData['id'];
                    }
                    var feedcomments = [];
                    for(var i=0;i<resultData['feedcomments'].length;i++){
                        feedcomments = resultData['feedcomments'][i];
                        var feedcomment_user_data = {};
                        feedcomment_user_data['name']           = feedcomments['user_id']['name'];
                        feedcomment_user_data['id']             = feedcomments['user_id']['id'];
                        if(feedcomments['user_id']['profile_image'] != undefined){
                            feedcomment_user_data['profile_image']  = feedcomments['user_id']['profile_image'];
                        }
                        if(feedcomments['user_id']['company_id'] != undefined){
                            feedcomment_user_data['company_id'] = feedcomments['user_id']['company_id'];
                        }
                        feedcomment_user_data['slug']       = feedcomments['user_id']['slug'];

                        resultData['feedcomments'][i]['user_id'] = feedcomment_user_data;
                        var commentreply = [];
                        if(feedcomments['commentreply'].length > 0){
                            for(var j=0;j<feedcomments['commentreply'].length;j++){
                                commentreply = feedcomments['commentreply'][j];

                                var feedcommentreply_user_data = {};
                                feedcommentreply_user_data['name']           = commentreply['user_id']['name'];
                                feedcommentreply_user_data['id']             = commentreply['user_id']['id'];
                                if(commentreply['user_id']['profile_image'] != undefined){
                                    feedcommentreply_user_data['profile_image']  = commentreply['user_id']['profile_image'];
                                }
                                if(commentreply['user_id']['company_id'] != undefined){
                                    feedcommentreply_user_data['company_id'] = commentreply['user_id']['company_id'];
                                }
                                feedcommentreply_user_data['slug']       = commentreply['user_id']['slug'];
                                commentreply['user_id'] = feedcommentreply_user_data
                            }
                            feedcomments['commentreply'] = commentreply;
                        }
                    }
					resultData['feedcomments'] = feedcomments;
					resultData['share_url'] = share_url;
                    resultData['totalLikes'] = totalLikes;
                    resultData['totaldislikes'] = totaldislikes;
                    resultData['isliked'] = isliked;
                    resultData['isdisliked'] = isdisliked;
                    resolve({'feed':resultData,'feedmedia_url':sails.config.appUrlwPort + sails.config.feedmedia_url,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url});
                });
        });
    },
    pollAnswer: function(req,user_id){
        return new Promise(function (resolve, reject){
            PollAnswer.find({user_id:user_id, feed_id: req.param('feed_id')}).exec(function(err,_answer){
                var _newanswer = {
                    user_id:user_id,
                    feed_id:req.param('feed_id'),
                    option_id:req.param('option_id')
                };

                if(err){
                    resolve({
                        status: "Error",
                        msg:"Something went wrong. Please try again.",
                        data : {}
                    });
                }
                if(_answer.length > 0){
                    PollAnswer.update(_answer[0].id,_newanswer).exec(function(err,_response){
                        if(err){
                            resolve({
                                status: "Error",
                                msg:"Something went wrong. Please try again.",
                                data : {}
                            });
                        }
                        if(typeof _response[0].id != 'undefined') {
                            /* Activity Log Insert */
                            ActivityLogsService.addActivityLog({
                                owner_id: user_id,
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
                                resolve({
                                    status: "Error",
                                    msg:"Something went wrong. Please try again.",
                                    data : {}
                                });
                            }
                            resolve({
                                status: "OK",
                                msg:"Record update successfully",
                                data:array
                            });
                        });
                    });
                }else{
                    PollAnswer.create(_newanswer).exec(function(err,_response){
                        if(err){
                            resolve({
                                status: "Error",
                                msg:"Something went wrong. Please try again."
                            });
                        }
                        if(typeof _response.id != 'undefined') {
                            /* Activity Log Insert */
                            ActivityLogsService.addActivityLog({
                                owner_id:user_id,
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
                                resolve({
                                    status: "Error",
                                    msg:"Something went wrong. Please try again.",
                                    data : {}
                                });
                            }
                            resolve({
                                status: "OK",
                                msg:"Thanks for your opininon",
                                data:array
                            });
                        });
                    });
                }
            });
        });
	},

    /* 
    Feed List Service
    Include all connection feeds
    Users like and comment feed too
    */
    allfeedlist : function(req) {
        var user_id = req.user.id;
        var page = 1;
        var limit = 10;
        if(req.param("page_no") != undefined){
            page = req.param("page_no");
        }

        return new Promise(function (resolve, reject){
            BlockUserService.getBlockUsers(user_id).then(function(blockusers){
                 UserConnectionService.getUserConnection(user_id).then(function(user_ids){
                    Follow.find({ user_id:user_id, 'company_id':{ slug : { "$exists" : true, "$ne" : "" } } }).populate("company_id").populate("company_id.companydata").exec(function(err,_companies){
                        GroupUsers.find({user_id:user_id}).exec(function(err,_groupuser){
                        
                            group_ids = [];
                            company_ids = [];
                            feed_ids = [];
                            
                            _groupuser.forEach(function(_groupusers, index){
                                group_ids.push(_groupusers.group_id);
                            });
                            
                            _companies.forEach(function(_company, index){
                                if(_company.company_id.companydata.length>0){
                                    company_ids.push(_company.company_id.companydata[0].id);
                                }
                            });
                            
                            var own = [user_id];
                            var connections = user_ids.concat(company_ids);
                            connection_ids = own.concat(connections);

                            var start = moment().subtract(24, 'hours').toDate();
                            var likeCondition = { 
                                "$and" : [
                                    { "user_id" : { "$in" : connections } }, 
                                    { "status" : 1 },
                                    { "createdAt" : { ">": start } }
                                ] 
                            };
                            Feedlike.find({'feed_id':{ user_id : { "$exists" : true, "!" : blockusers }, }}).where(likeCondition).populate("feed_id").paginate({page: page, limit: limit}).exec(function (err, posts) {
                                if(err){ reject(err); }

                                var feed_ids = [];
                                posts.forEach(function(post, index){
                                    feed_ids.push(post.feed_id.id);
                                });
                                FeedSpams.find({user_id:req.user.id}).exec(function(err,FeedSpams){
                                    var SpamsFeeds = [];
                                    FeedSpams.forEach(function(FeedSpam, index){
                                        SpamsFeeds.push(FeedSpam.feed_id);
                                    });

                                    var filter = {
                                        is_deleted : { "!" : 1 },
                                        id : { "$nin" : SpamsFeeds },
                                        // 'SpamsFeed':{
                                        //  "$elemMatch":{
                                        //      "$exists" : false,
                                                
                                        //  }
                                        // },
                                        // "SpamsFeed" : { "$eq": "$empty" },
                                        "$or" : 
                                        [
                                            {
                                                "$and" : [
                                                    { "user_id" : { "$in" : connection_ids } }, 
                                                    { "group_id" : "" },
                                                ]
                                            },
                                            { "id" : { "$in" : feed_ids } },
                                            { "group_id" : { "$in" : group_ids } },
                                            { "to_user_id" : { "$in" : [user_id] } }
                                        ],
                                    };

                                    Feeds.count(filter).exec(function countCB(err,count){
                                        Feeds.find(filter)
                                        .populate('SpamsFeed',{where:{user_id:user_id}})
                                        .populate('user_id')
                                        .populate('user_id.company_id',{select:['company_name','slug']})
                                        .populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
                                        .populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
                                        .populate('to_user_id', { select: ['name','id','slug','profile_image'] })
                                        .populate('group_id')
                                        .populate('jobBookmarks',{'where' : {user_id:req.user.id}})
                                        .populate('company_id',{'select':['id','company_name']})
                                        .populate('company_id.companydata')
                                        .populate('job_type_id',{'select':['id','title']})
                                        .populate('experience_id',{'select':['id','title']})
                                        .populate('feedcomments', { where:{'user_id':{id: {"!":blockusers},status: {"!":"0"}}}, sort: 'createdAt ASC' })
                                        .populate('feedcomments.user_id.company_id')
                                        .populate('feedcomments.commentlikes')
                                        .populate('feedcomments.commentreply')
                                        .populate('feedcomments.commentreply.commentlikes')
                                        .populate('feedcomments.commentreply.user_id.company_id')
                                        .populate('feedmedias')
                                        .populate('feedlikes', { where:{'user_id':{id: {"!":blockusers},status: {"!":"0"}}}, sort: 'createdAt ASC' })
                                        .populate('feedlikes.user_id',{select:['name','slug']})
                                        .populate("pollanswers")
                                        .populate('polloptions')
                                        .populate("polloptions.pollanswers")

                                        .sort('createdAt DESC')
                                        .paginate({page: page, limit: limit})
                                        .exec(function(err,_feeds){
                                            if(err){ reject(err); }
                                            resolve({feeds:_feeds,totalfeeds:count,likedFeed:feed_ids});
                                        });
                                    }); 
                                });
                            });
                        })
                    })
                });

            });


            /*BlockUserService.getBlockUsers(user_id).then(function(blockusers){
                // Follow Companies List
                Follow.find({user_id:user_id}).exec(function(err,_companies){
                    if(err){ reject(err); }
                    company_ids = [];
                    _companies.forEach(function(_company, index){
                        company_ids.push(_company.company_id);
                    });

                    // Get Companies as user
                    Users.find().where({"company_id" : { id: {"$in" : company_ids }}}).populate("company_id").exec(function(err,_users){
                        _followCompanies = [];
                        if(_users != undefined){
                            _users.forEach(function(user, index){
                                _followCompanies.push(user.id);
                            });
                        }

                        // Joined Group List
                        GroupUsers.find({user_id:user_id}).exec(function(err,_groupuser){
                            if(err){ reject(err); }
                            group_ids = [];
                            _groupuser.forEach(function(_groupusers, index){
                                group_ids.push(_groupusers.group_id);
                            });

                            // Get User Connection list
                            UserConnectionService.getUserConnection(user_id).then(function(user_ids){
                                var own = [user_id];
                                connection_user_ids = user_ids.concat(_followCompanies);
                                connections = connection_user_ids.concat(_followCompanies);
                                connection_ids = connections.concat(own);

                                var start = moment().subtract(24, 'hours').toDate();

                                var likeCondition = { 
                                        "$and" : [
                                            { "user_id" : { "$in" : connections } }, 
                                            { "status" : 1 },
                                            { "createdAt" : { ">": start } }
                                        ] 
                                    };
                                Feedlike.find({'feed_id':{ user_id : { "$exists" : true, "!" : blockusers }, }}).where(likeCondition).populate("feed_id").paginate({page: page, limit: limit}).exec(function (err, posts) {
                                    if(err){ reject(err); }

                                    var feed_ids = [];
                                    posts.forEach(function(post, index){
                                        feed_ids.push(post.feed_id.id);
                                    });
                                    FeedSpams.find({user_id:req.user.id}).exec(function(err,FeedSpams){
                                        var SpamsFeeds = [];
                                        FeedSpams.forEach(function(FeedSpam, index){
                                            SpamsFeeds.push(FeedSpam.feed_id);
                                        });
                                        var filter = {
                                            "$or" : [ 
                                                { "$and" : [
                                                    { "user_id" : { "$in" : connection_ids } }, 
                                                    { "group_id" : "" }, 
                                                    ] 
                                                }, 
                                                { "id" : { "$in" : feed_ids } },
                                                { "group_id" : { "$in" : group_ids } },
                                                { "to_user_id" : { "$in" : [user_id] } }
                                            ],
                                            //is_deleted : { "!" : 1 },
                                            id : { "$nin" : SpamsFeeds },
                                        };

                                        Feeds.count(filter).where({"user_id":{status:{"$ne":"0"}},"is_deleted":{ "!" : 1 }}).exec(function countCB(err,count){
                                            if(err){ reject(err); }
                                            Feeds.find(filter)
                                            .where({"user_id":{status:{"$ne":"0"}},"is_deleted":{ "!" : 1 }})
                                            .populate('to_user_id', { select: ['name','id','slug','profile_image'] })
                                            .populate('user_id', { select: ['name','id','slug','profile_image'] })
                                            .populate('SpamsFeed')
                                            .populate('SpamsFeed.user_id')
                                            .populate('group_id')
                                            .populate('user_id.company_id',{select:['company_name','slug']})
                                            .populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
                                            .populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
                                            .populate('jobBookmarks',{'where' : {user_id:req.user.id}})
                                            .populate('company_id',{'select':['id','company_name']})
                                            .populate('company_id.companydata')
                                            .populate('job_type_id',{'select':['id','title']})
                                            .populate('experience_id',{'select':['id','title']})
                                            .populate('feedcomments', { where:{'user_id':{id: {"!":blockusers},status: {"!":"0"}}}, sort: 'createdAt ASC' })
                                            .populate('feedcomments.user_id.company_id')
                                            .populate('feedcomments.commentlikes')
                                            .populate('feedcomments.commentreply')
                                            .populate('feedcomments.commentreply.commentlikes')
                                            .populate('feedcomments.commentreply.user_id.company_id')
                                            .populate('feedmedias')
                                            .populate('feedlikes', { where:{'user_id':{id: {"!":blockusers},status: {"!":"0"}}}, sort: 'createdAt ASC' })
                                            .populate('feedlikes.user_id',{select:['name','slug']})
                                            .populate("pollanswers")
                                            .populate('polloptions')
                                            .populate("polloptions.pollanswers")
                                            .sort('createdAt DESC')
                                            .paginate({page: page, limit: limit})
                                            .exec(function(err,found){
                                                if(err){ reject(err); }
                                                resolve({feeds:found,totalfeeds:count,likedFeed:feed_ids});
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });*/
        });
    },
    createfeedspams: function(req,user_id){
        return new Promise(function (resolve, reject){
            var spamtext = ["Hide this post",
                            "It's spam", 
                            "It's fake or scam", 
                            "It's abusive or harmful",
                            "Block this user"];
            var eulaid = parseInt(req.param("eulaid")); 

            if(spamtext[eulaid] == undefined){
                resolve({
                    status:"Error",
                    message:"Invalid spam argument!"
                });
            }
            var _newFeedSpam = {
                user_id:user_id,
                feed_id:req.param("feed_id"),
                spamtext: spamtext[eulaid] 
            };

            FeedSpams.find({ user_id:user_id,feed_id:req.param("feed_id")}).exec(function(err,resultData){
                if(err){
                    resolve({
                        status:"Error",
                        message:"Something went wrong. Please try again."
                    });
                }
                if(resultData.length==0){
                    FeedSpams.create(_newFeedSpam).exec(function(err,data){
                        if(err){
                            resolve({
                                status:"Error",
                                message:"Something went wrong. Please try again."
                            });
                        }

                        if(eulaid == 1 || eulaid == 2 || eulaid == 3){ // Send Spam EMail
                            FeedSpams.findOne({id:data.id})
                                    .populate("user_id")
                                    .populate("feed_id")
                                    .populate("feed_id.user_id")
                                    .populate("feed_id.user_id.company_id")
                                    .exec(function(err,spamFeed){
                                sails.hooks.email.send(
                                    "FeedSpams",
                                    {
                                        siteURL: sails.config.appUrlwPort,
                                        spamFeed: spamFeed,
                                        BodyReport_Flag:_newFeedSpam.spamtext,
                                        recipientEmail: "bhavesh.arusys@gmail.com",
                                    },
                                    {
                                        to: "bhavesh.arusys@gmail.com",
                                        subject: _newFeedSpam.spamtext
                                    },
                                    function(err) {
                                        console.log(err || "It worked!");
                                    }
                                );
                                resolve({
                                    status:"OK",
                                    message:"Feed has been successfully added in " + _newFeedSpam.spamtext
                                });
                            })
                        }else if(eulaid == 4){
                            console.log("come 789")
                            FeedSpams.findOne({id:data.id})
                            .populate("feed_id")
                            .exec(function(err,spamFeed){
                                if(spamFeed != undefined){
                                    var _new = {
                                        user_id : user_id,
                                        to_user_id : spamFeed['feed_id']["user_id"]
                                    };
                                    BlockUser.create(_new).exec(function(err,_user){
                                        resolve({
                                            status:"OK",
                                            message:"Feed has been successfully added in " + _newFeedSpam.spamtext
                                        });
                                    });
                                }
                            });
                        }else{
                            resolve({
                                status:"OK",
                                message:"Feed has been successfully added in " + _newFeedSpam.spamtext
                            });
                        }
                    });
                }else{
                    resolve({
                        status:"OK",
                        message:"Feed already added in "+_newFeedSpam.spamtext
                    });
                }
            });
        });
    },
    feedDelete : function(req,user_id){
        return new Promise(function (resolve, reject){
            Feeds.findOne({id:req.param('id')}).exec(function(err,_blog){
                if(user_id!=_blog.user_id){
                    resolve({status:'Error',message: "Internal server error."});
                }

                Feeds.update(req.param('id'),{is_deleted:1}).exec(function(){
                    resolve({status:'OK',message: "Record deleted successfully."});
                });

            });
        });
    },
    getfeeddata:function(req,res){
        return new Promise(function (resolve, reject){
            Feeds.findOne({id:req.param("id")})
                .populate("feedmedias",{select:['image']})
                .exec(function(err,_feed){
                if(err){
                    resolve({
                        status:"Error",
                        message:"Something went wrong. Please try again."
                    });
                }
                resolve({
                    status:"OK",
                    data:{feed_data:_feed,'feedmedia_url':sails.config.appUrlwPort + sails.config.feedmedia_url}
                });
            });
        });
    },

    updateFeeds: function(req,user_id) {
        var _newFeed = {
			status: 1,
			user_id: user_id,
			feed_details: '',
			privacy: req.param("privacy")
        };
		
		if(typeof req.param("group_id")!='undefined' && req.param("group_id")!='') {
			_newFeed.group_id = req.param("group_id");
		}else{
			_newFeed.group_id = "";
		}
		
		var valid_details = 0;
		if(typeof req.param("feed_details")!='undefined' && req.param("feed_details")!='') {
			_newFeed.feed_details = req.param("feed_details");
			valid_details = 1;
		}
        return new Promise(function (fulfill, reject) { 
            Feeds.update({id:req.param('id')},_newFeed).then(function (_feed) {
                if(typeof _feed.id != 'undefined') {
                    fulfill({status:'Error',message:'No record found',data:{}});
                                                   
                } else {
                    var feed_id =req.param("id");
                    /* Upload Image */
                    try{
                        var uploadPath = "./.tmp/public/uploads/feeds";
                        req.file('avatar').upload({
                            dirname: path.resolve(sails.config.appPath, uploadPath)
                        },function (err, uploadedFiles) {
                            if(err){
                                fulfill({status:'Error',message:'Invalid argument'});
                            } else {
                                array = [];
                                if(uploadedFiles.length > 0) {
                                    uploadedFiles.forEach(function(factor, index){
                                        array.push(factor.fd);
                                    });
                                    array.forEach(function(factor, index){
                                        var myarr = factor.split("\\");
                                        var filename = path.basename(myarr[myarr.length-1]);
                                        /* Copy .tmp to upload folder*/
                                        fs.readFile(factor, function (err, data) {
                                            fs.writeFile(sails.config.appPath+'/assets/uploads/feeds/'+filename, data, function (err) {
                                                FeedMedia.create({ feed_id: feed_id, image: filename }).exec(function (err, image) {
                                                    FeedService.getfeeddata(req,user_id).then(function(Fedd_data){
                                                        if(Fedd_data.status == 'OK'){
                                                            fulfill({status:'OK',message:'Feed data updated',data:Fedd_data.data});
                                                        } else {
                                                            fulfill({status:'OK',message:'Feed data updated',data:{}});
                                                        }
                                                    });
                                                });
                                            });
                                        });
                                    });
                                } else if(valid_details==0 && uploadedFiles.length==0) {
                                    fulfill({status:'Error',message:'Invalid argument'});
                                } else {
                                    fulfill({status:'OK',message:'Feed data updated',data:{}});
                                }
                            }
                            
                        });
                                
                        
                    }catch(e){
                        fulfill(_feed.id);
                    }
                }
            }).catch(function (err) {
                fulfill(false);
            });
        });
    },

    deleteFeedmedia:function(req,res){
        return new Promise(function (resolve, reject){
            FeedMedia.find({id:req.param("id")}).exec(function(err,_delete){
                if (_delete && _delete.length > 0) {
                    _delete[0].destroy().then(function (_delete) {
                        resolve({ status:"OK", message:"Media file has been deleted successfully." });
                    }).catch(function (err) {
                        resolve({ status:"Error", message:"Something went wrong. Please try again." });
                    });
                } else {
                    resolve({ status:"Error", message:"Something went wrong. Please try again." });
                }
            });
        });
    },
    deleteComment:function(req,user_id){
        return new Promise(function (resolve, reject){
            FeedComment.find({"$or" : [{id:req.param("id"),'user_id':user_id}, {parent_id:req.param("id")}] }).exec(function(err,_comments){
                if(err){
                    resolve({
                        status:"Error",
                        message: "Something went wrong. Please try again."
                    });
                } else if(_comments.length > 0 ){
                    _comments.forEach(function(_delete, index){
                        _delete.destroy().then(function (_delete) {
                            
                        }).catch(function (err) {
                            resolve({ status:"Error", message:"Something went wrong. Please try again." });
                        });
                    });
                    resolve({
                        status:"OK",
                        message: "Comment has been deleted."
                    });
                } else {
                    resolve({ status:"Error", message:"No comment found!" });
                }
            });
        });
    },
    updateComment:function(req,user_id){
        console.log(user_id);
        return new Promise(function (resolve, reject){
            FeedComment.find({id:req.param("id"),user_id:user_id}).exec(function(err,_comment){
                if(err){
                    resolve({
                        status:"Error",
                        message:"Something went wrong. Please try again."
                    });
                } else {
                    if(_comment.length > 0){
                        var _updComment = {
                            comments: req.param("comments"),
                        };
                        FeedComment.update({id:req.param("id")},_updComment).exec(function(err,_editcomment){
                            console.log(_editcomment);
                            if(err){
                                resolve({
                                    status:"Error",
                                    message:"Something went wrong. Please try again."
                                });
                            }
                            resolve({
                                status:"OK",
                                data:_editcomment[0],
                                message:"Comment has been updated successfully."
                            });
                        });
                    }else{
                        resolve({
                            status:"Error",
                            message:"Sorry your requested comment not found."
                        });
                    }
                }
            });
        });
	},
}