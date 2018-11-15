/**
 * Api/VerifyController
 *
 * @description :: Server-side logic for managing api/Verify
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    messageHistory:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                MessageService.messageHistory(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{'message_list':service_data.data,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url});
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
    messageConversation:function(req, res){
        var token = req.headers.token;
        ApiService.getUserId(req).then(function(user_id){ 
            if(user_id) {
                MessageService.messageConversation(req,user_id).then(function(service_data){
                    if(service_data.status == 'OK') { 
                        ApiService.setApiRes("msg",service_data.msg);
                        ApiService.setApiRes("status",true);
                        ApiService.setApiRes("data",{'conversation_list':service_data.data,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url});
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
}