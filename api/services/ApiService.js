var api_res = {};
var Promise = require('promise');

module.exports = {
    _config: {
        model: ['Tokens','Users']
    },
	
    setApiRes: function (key,val) {
        api_res[key] = val;
        return 1;
    },
	
    returnRes: function() {
        return api_res;
    },
	
    setUser: function(token,users_id) {
        
    },
	
    getUserId: function(res) {
        var token = res.headers.token;
        
        var promise = new Promise(function (resolve, reject) {
            Tokens.findOne({token:token}).exec(function (err, _token){
                if(err){
                    resolve(false);
                } else if(typeof _token == 'undefined' || typeof _token.user_id == 'undefined') {                
                    resolve(false);
                } else {
                    resolve(_token.user_id);
                }
            });
        });
        return promise;
    },
	
    getCheckToken: function(res,user_id) {
        var token = res.headers.token;
        
        var promise = new Promise(function (resolve, reject) {
            Tokens.findOne({token:token}).exec(function (err, _token){
                if(err){
                    resolve(false);
                } else if(typeof _token != 'undefined' && (typeof _token.user_id == 'undefined' || _token.user_id == user_id)) {                
                    Tokens.update({token : token},{user_id:user_id}).exec(function afterwards(err, updated){
                        if (err) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }            
                    });
                } else {
                    resolve(false);
                }
            });
        });
        return promise;
    },
	
    getUserDetail: function(user_id) {
        
        var promise = new Promise(function (resolve, reject) {
            Users.findOne()
                .populate('usereducations')
                .populate('usereducations.educationdocs',{select:['createdAt'],sort:{createdAt:1}})
                .populate('usereducations.educationdocs.verify_request_id',{select:['tab_type'],sort:{createdAt:1},limit:2})
                .populate('usereducations.educationdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
                .populate('userOrganizations')
                .populate('userprojects')
                .populate('userprojects.company_id',{select:['company_name'],sort:{from_year:-1,createdAt:-1}})
                .populate('userprojects.projectdocs',{select:['createdAt'],sort:{from_year:-1,createdAt:-1}})
                .populate('userprojects.projectdocs.verify_request_id',{select:['tab_type'],sort:{from_year:-1,createdAt:-1},limit:2})
                .populate('userprojects.projectdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{from_year:-1,createdAt:-1},limit:2})
                .populate('userexperiences')
                .populate('userexperiences.company_id',{select:['company_name'],sort:{from_year:-1,current_work:-1}})
                .populate('userexperiences.experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
                .populate('userexperiences.experiencedocs.verify_request_id',{select:['tab_type'],sort:{createdAt:1},limit:2})
                .populate('userexperiences.experiencedocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
                .populate('usersociallinks')
                .populate('usersociallinks.social_id',{select:['name']})
                .populate('user_contact_verify')
                .populate('UserVerifyData',{where:{'or':[{'tab_type':'other_docs'},{'tab_type':'identity'}]}})
                .populate('UserVerifyData.verify_request_id',{select:['tab_type'],sort:{createdAt:1},limit:2})
                .populate('UserVerifyData.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
                .where({id: user_id}).then(function (user) {
                    UserDataService.walletData('',user_id).then(function(ServiceData){
                        if (user != undefined && user != null) {
                            fullurl = sails.config.appUrlwPort+sails.config.profile_image_url;
                            if(typeof user.cover_image != 'undefined') {
                                user.cover_image = fullurl+user.cover_image;
                            } else {
                                user.cover_image = fullurl+'default-bg.jpg';
                            }
                            if(typeof user.profile_image != 'undefined') {
                                user.profile_image = fullurl+user.profile_image;
                            } else {
                                user.profile_image = fullurl+'default.png';
                            }
                            
                            user.UserVerifyData['verify_request_data'] = user.UserVerifyData['verify_request_id'];
                            
                            delete user.UserVerifyData['verify_request_id'];
                            user['userverifydata'] = user.UserVerifyData;
                            user['totalLBD'] = ServiceData['data']['wallet_data']['totalLBD'];
                            
                            delete user['UserVerifyData'];
                            resolve({
                                user: user
                            });
                        } else {
                            resolve(false); 
                        }
                    });
            }).catch(function (err) {
                console.log(err);
                resolve(false); 
            });
        });
        return promise;
    },
	
    getUserEditMaster: function() {
        var promise = new Promise(function (resolve, reject) {
            Languages.find().exec(function(err, languages) {
                if(err) {
                    resolve(false);
                } else {
                    Industries.find().exec(function(err, industries) {                
                        if(err) {
                            resolve(false)
                        } else {
                            resolve({
                                language:languages,
                                industry:industries
                            });
                        }
                    });
                }
            });
        });
        return promise;
    }
};    