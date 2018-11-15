/**
 * Api/CompanyController
 *
 * @description :: Server-side logic for managing api/auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    company_detail:function(req, res){
        var token = req.headers.token;
        console.log("come 123 authorizeAllowOrDeny");
        ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                CompanyService.company_detail(req,user_id).then(function(service_data){
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
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",token);
                return res.json(ApiService.returnRes());
            }
        });       
    },
	
	ChangeCompanyStatus: function(req,res){
		var token = req.headers.token;
		ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                CompanyService.ChangeCompanyStatus(req,user_id).then(function(service_data){
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
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",token);
                return res.json(ApiService.returnRes());
            }
        });       
	},
	getFollowesList: function(req,res){
		var token = req.headers.token;
		ApiService.getUserId(req).then(function(user_id) {
            if(user_id) {
                CompanyService.getFollowesList(req,user_id).then(function(service_data){
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
                ApiService.setApiRes("data",{});
                ApiService.setApiRes("token",token);
                return res.json(ApiService.returnRes());
            }
        });       
	}
}