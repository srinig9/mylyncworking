/**
 * Api/AuthController
 *
 * @description :: Server-side logic for managing api/auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    _config: {
        model: ['Feeds']
    },
	
    feedList: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.getFeeds(req,user_id).then(function(Feed_data){
                    if(Feed_data) { 
                        ApiService.setApiRes("msg",'Feed list!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",Feed_data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
	
    feedAdd: function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.addFeeds(req,user_id).then(function(Feed_data) {
                    if(Feed_data) { 
                        ApiService.setApiRes("msg",'Feed add successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",Feed_data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });       
    },
	
    addComment: function(req,res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.feedComment(req,user_id).then(function(feedComment) {
                    if(feedComment) { 
                        ApiService.setApiRes("msg",'Feed comment add successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",feedComment);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
	
    addfeedLike: function(req,res) {
        var token = req.headers.token; 
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.feedLike(req,user_id).then(function(feedLike) {
                    if(feedLike) { 
                        ApiService.setApiRes("msg",'Feed comment add successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",feedLike);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
	
    addLikeOnComment: function(req,res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.likecomment(req,user_id).then(function(feedLike) {
                    if(feedLike !== false) { 
                        ApiService.setApiRes("msg",'Feed like add successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",feedLike);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
	
    feedCommentList: function(req,res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.feedCommentList(req,user_id).then(function(feedCommentList) {
                    if(feedCommentList !== false) { 
                        ApiService.setApiRes("msg",'Feed comment list!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",feedCommentList);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
	
    feedDetails: function(req,res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.feedDetails(req,user_id).then(function(feedData) {
                    if(feedData !== false) { 
                        ApiService.setApiRes("msg",'Feed detail list!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",feedData);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
	
    pollAnswer: function(req,res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.pollAnswer(req,user_id).then(function(feedANSData) {
                    if(feedANSData.status == 'OK') { 
                        ApiService.setApiRes("msg",feedANSData.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",feedANSData.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
	
    createfeedspams: function(req,res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.createfeedspams(req,user_id).then(function(serviceResponce) {
                    if(serviceResponce.status == 'OK') { 
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    feedDelete: function(req,res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.feedDelete(req,user_id).then(function(serviceResponce) {
                    if(serviceResponce.status == 'OK') { 
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    getfeeddata: function(req,res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.getfeeddata(req,user_id).then(function(serviceResponce) {
                    if(serviceResponce.status == 'OK') { 
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",serviceResponce.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    updateFeeds: function(req,res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.updateFeeds(req,user_id).then(function(serviceResponce) {
                    if(serviceResponce.status == 'OK') { 
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",serviceResponce.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    deleteFeedmedia: function(req,res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.deleteFeedmedia(req,user_id).then(function(serviceResponce) {
                    if(serviceResponce.status == 'OK') { 
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    deleteComment: function(req,res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.deleteComment(req,user_id).then(function(serviceResponce) {
                    if(serviceResponce.status == 'OK') { 
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
    updateComment: function(req,res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                FeedService.updateComment(req,user_id).then(function(serviceResponce) {
                    if(serviceResponce.status == 'OK') { 
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",serviceResponce.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",serviceResponce.message);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    },
}