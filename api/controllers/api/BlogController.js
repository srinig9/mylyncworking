/**
 * Api/BlogController
 *
 * @description :: Server-side logic for managing api/auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    _config: {
        model: ['Tokens','Users']
    },
    create_blog :function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                BlogService.store(req,user_id).then(function(BlogStatus) {
                    if(BlogStatus) { 
                        ActivityLogsService.addActivityLog({
							owner_id: user_id,
							module: 'Blog',
							action: 'create_blog',
							object_id: BlogStatus,
							type: 'api'
						});
                        ApiService.setApiRes("msg",'Blog add successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",BlogStatus);
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
    getBlogCatagory :function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                BlogService.getBlogCatagory(req,user_id).then(function(BlogCatagory) {
                    if(BlogCatagory) { 
                        ApiService.setApiRes("msg",'Blog catagory list!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",BlogCatagory);
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
    blogList :function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                BlogService.index(req,user_id).then(function(BlogList) {
                    if(BlogList) { 
                        ApiService.setApiRes("msg",'Blog list!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",BlogList);
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
    myBlogList :function(req, res) {
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
                BlogService.myblogs(req,user_id).then(function(_myBlogList) {
                    if(_myBlogList) { 
                        ApiService.setApiRes("msg",'Blog list!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",_myBlogList);
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
}