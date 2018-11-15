/**
 * Api/SearchController
 *
 * @description :: Server-side logic for managing api/users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    _config: {
        model: []
    },
	
    searchBlogs: function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
				SearchService.searchBlogs(req, user_id).then(function(search_records){
                    if(search_records) { 
                        ApiService.setApiRes("msg",'Blogs search records successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",search_records.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                })
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",[]);
                return res.json(ApiService.returnRes());
            }
        });       
    },
	
    searchRecords: function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
				SearchService.searchRecords(req, user_id).then(function(search_records){
                    if(search_records) { 
                        ApiService.setApiRes("msg",'Search records successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",search_records);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                })
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",[]);
                return res.json(ApiService.returnRes());
            }
        });       
    },
	
    searchJob: function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
				SearchService.searchJob(req, user_id).then(function(search_records){
                    if(search_records) { 
                        ApiService.setApiRes("msg",'Job search records successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",search_records.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                })
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",[]);
                return res.json(ApiService.returnRes());
            }
        });       
    },
	
    searchUsers: function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
				SearchService.searchUsers(req, user_id).then(function(search_records){
                    if(search_records) { 
                        ApiService.setApiRes("msg",'Users search records successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",search_records.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                })
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",[]);
                return res.json(ApiService.returnRes());
            }
        });       
    },
	
    searchCompanies: function(req, res){    
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            if(user_id) {
				SearchService.searchCompanies(req, user_id).then(function(search_records){
                    if(search_records) { 
                        ApiService.setApiRes("msg",'Companies search records successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",search_records.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",'Invalid argument!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                })
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",[]);
                return res.json(ApiService.returnRes());
            }
        });       
    },
}