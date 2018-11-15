/**
 * Api/VerifyController
 *
 * @description :: Server-side logic for managing api/Verify
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
	notificationCount: function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id != false) {
                NotificationService.unreadNotificationCount(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",service_data.data);
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
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
	
    notificationList: function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                NotificationService.list(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{'NotificationList':service_data.data,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url});
                        ApiService.setApiRes("token",token);
                        return res.json(ApiService.returnRes());
                    } else {
                        ApiService.setApiRes("msg",service_data.msg);
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
	
    // notificationList:function(req, res){
    //     var token = req.headers.token;
    //     ApiService.getUserId(req).then(function(user_id){ 
    //         if(user_id) {
    //             messageService.list(req,user_id).then(function(service_data){
    //                 if(service_data.status == 'OK') { 
    //                     ApiService.setApiRes("msg",service_data.msg);
    //                     ApiService.setApiRes("status",true);
    //                     ApiService.setApiRes("data",{'NotificationList':service_data.data,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url});
    //                     ApiService.setApiRes("token",token);
    //                     return res.json(ApiService.returnRes());
    //                 } else {
    //                     ApiService.setApiRes("msg",service_data.msg);
    //                     ApiService.setApiRes("status",false);
    //                     ApiService.setApiRes("data",{});
    //                     ApiService.setApiRes("token",token);
    //                     return res.json(ApiService.returnRes());
    //                 }
    //             });
    //         } else {
    //             ApiService.setApiRes("msg",'Invalid user, please login first!');
    //             ApiService.setApiRes("status",false);
    //             ApiService.setApiRes("data",{});
    //             return res.json(ApiService.returnRes());
    //         }
    //     });       
    // },
}