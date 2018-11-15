/**
 * Api/UsersController
 *
 * @description :: Server-side logic for managing api/users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    _config: {
        model: []
    },
    getUserPrivacy:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            
            if(user_id) {
                UserPrivacyService.getUserPrivacyOption(req,user_id).then(function(user_privacy_option){
                    UserPrivacyService.getUserPrivacy(req,user_id).then(function(user_privacy){
                    console.log(user_privacy);
                    if(user_privacy_option) { 
                        ApiService.setApiRes("msg",'Your profile update successfully!');
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{'user_privacy_option':user_privacy_option ,'user_privacy' : user_privacy });
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
            });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",users);
                return res.json(ApiService.returnRes());
            }
        });       
    },
    StorePrivacySetting:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){
            
            if(user_id) {
                UserPrivacyService.StorePrivacySetting(req,user_id).then(function(user_privacy_option){
                    if(user_privacy_option.status == 'OK') { 
                        ApiService.setApiRes("msg",user_privacy_option.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",user_privacy_option.msg);
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    }
                });
            } else {
                ApiService.setApiRes("msg",'Invalid user, please login first!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",users);
                return res.json(ApiService.returnRes());
            }
        });       
    },
}