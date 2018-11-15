/**
 * Api/AuthController
 *
 * @description :: Server-side logic for managing api/auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    _config: {
        model: ['Tokens','Users']
    },
    // not requried yet
    token:function(req, res) {
        
        var datetime    = require('node-datetime');
        var dt          = datetime.create();
	    var token       = dt.format('mdYHMS');
        var token_arr   = {'token':token};

        ApiService.setApiRes('token',token);
        
        Tokens.create(token_arr).exec(function (err, finn){
            if (err) {
                ApiService.setApiRes("msg",'Token create fails!');
                ApiService.setApiRes("status",false);
                 return res.json(ApiService.returnRes());
            } else {
                ApiService.setApiRes("msg",'Token create successfully!');
                ApiService.setApiRes("status",true);
                return res.json(ApiService.returnRes());
            }
        });
    },
    loginUser:function(req, res) {
        var loginid  =  req.param("loginid"),
            password =  req.param("password"),
            device_id =  '',
            self_res = res;
            if(req.param("device_id") != undefined && req.param("device_id") != ''){
                device_id = req.param("device_id");
            }
            
            Users.findOne({loginid: loginid}).exec(function(err,users){
               if(err){
                        console.log(err);
                    }
                    if(!users) {
                        ApiService.setApiRes("msg",'Invalid username or password!');
                        ApiService.setApiRes("status",false);
                        ApiService.setApiRes("data",{});
                        return self_res.json(ApiService.returnRes());
                    } else {
                        bcrypt = require('bcrypt-nodejs');
                        bcrypt.compare(password, users.password, function(err, res){
                            if(!res) { 
                                ApiService.setApiRes("msg",'Invalid Password!');
                                ApiService.setApiRes("status",false);
                                ApiService.setApiRes("data",{});
                                return self_res.json(ApiService.returnRes());
                            } else {
								if(typeof users.status!='undefined' && users.status=="0"){
									ApiService.setApiRes("msg",'Your account is closed. Please contact to administrator for reopen your account.');
									ApiService.setApiRes("status",false);
									ApiService.setApiRes("data",{});
									return self_res.json(ApiService.returnRes());
								}else{
									ApiService.getUserDetail(users.id).then(function(user_data){
										if(user_data) {
											var datetime    = require('node-datetime');
											var dt          = datetime.create();
											var token       = dt.format('mdYHMS');

											token_arr = {'user_id':users.id,'token':token}
											Tokens.create(token_arr).exec(function (err, finn){});
									
											ApiService.setApiRes("msg",'Successfully logged-in!');
											ApiService.setApiRes("status",true);
											if(typeof users.status!='undefined' && users.status=="0"){
												
											}else{
												ApiService.setApiRes("token",token);
											}
											ApiService.setApiRes("data",user_data);
											return self_res.json(ApiService.returnRes());
										} else {
											ApiService.setApiRes("msg",'User not found!');
											ApiService.setApiRes("status",false);
											ApiService.setApiRes("data",{});
											return self_res.json(ApiService.returnRes());
										}
									});
								}
                            }
                        });
                    }
                });
       
    },
    createGuestUser:function(req, res){
        device_id = req.param("device_id");
        Users.findOne({'device_id':device_id}).exec(function(err,users){
            console.log('come');
            if(err) {
                ApiService.setApiRes("msg",'Database connection issue!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
            } else if(users) {
                var datetime    = require('node-datetime');
                var dt          = datetime.create();
                var token       = dt.format('mdYHMS');

                ApiService.setApiRes("msg",'Guest user registered successfully!');
                ApiService.setApiRes("status",true);
                ApiService.setApiRes("data",users);
                ApiService.setApiRes("token",token);
                token_arr = {'user_id':users.id,'token':token};
                Tokens.create(token_arr).exec(function (err, finn){});
                return res.json(ApiService.returnRes());
            } else {
                console.log('come 2');
                var datetime = require('node-datetime');
                var crypto   = require('crypto');

                let uID      = crypto.randomBytes(2).toString('hex'); //eg.uID = 3d4f
                var dt       = datetime.create();
                    uID      = uID + dt.format('mdYHMS');
                
                var _newUser = {
                    name: 'guest user',
                    loginid: uID,
                    password: dt.format('mdYHMS')+'a',
                    device_id:device_id ,
                    is_guest: 1
                };
                console.log(_newUser);
                Users.create(_newUser).then(function (_users) {
                    
                    var datetime    = require('node-datetime');
                    var dt          = datetime.create();
                    var token       = dt.format('mdYHMS');

                    token_arr = {'user_id':_users.id,'token':token}
                    Tokens.create(token_arr).exec(function (err, finn){});
                    ApiService.setApiRes("msg",'Guest user registered successfully!');
                    ApiService.setApiRes("status",true);
                    ApiService.setApiRes("token",token);
                    ApiService.setApiRes("data",_users);
                    return res.json(ApiService.returnRes());
                }).catch(function (error) {
                    console.log('come 3 err');
                    ApiService.setApiRes("msg",error); 
                    ApiService.setApiRes("status",false);
                    ApiService.setApiRes("data",{});
                    return res.json(ApiService.returnRes());
                });
            }
        });
    },
    createUser:function(req, res){
        var device_id = req.param("device_id");
        var name = req.param("name").trim();
            name = name.charAt(0).toUpperCase() + name.slice(1);

        Users.findOne({'device_id':device_id}).exec(function(err,users){
            if(err) {
                ApiService.setApiRes("msg",'Database connection issue!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
            } else if(users) {
                var datetime    = require('node-datetime');
                var dt          = datetime.create();
                var token       = dt.format('mdYHMS');

                ApiService.setApiRes("msg",'Guest user registered successfully!');
                ApiService.setApiRes("status",true);
                ApiService.setApiRes("data",users);
                ApiService.setApiRes("token",token);
                token_arr = {'user_id':users.id,'token':token};
                Tokens.create(token_arr).exec(function (err, finn){});
                return res.json(ApiService.returnRes());
            } else {
                var datetime = require('node-datetime');
                var crypto   = require('crypto');

                let uID      = crypto.randomBytes(2).toString('hex'); //eg.uID = 3d4f
                var dt       = datetime.create();
                    uID      = uID + dt.format('mdYHMS');
                
                var user_slug = name.split(' ').join('-');
                var ref_unq = 0;
                var referral_code = '';
                do {
                    referral_code = RefferalCode.generateReferral({ digit: 11 });
                    Users.find({ select: ['referral'], where: { referral: referral_code } }).exec(function(err,referrals) {
                        if(referrals.length==0) {
                            ref_unq = 1;
                        } else {
                            ref_unq = 0; //try gen new code
                        }
                    });
                } while (ref_unq > 1);

                Users.find({slug:user_slug}).exec(function(err,found){
                    if (err) {
                        //console.log("first err :",err);
                        return res.json({
                            status: 'Error',
                            message: 'Server not respond!'
                        });
                    }
                    var slug_slug = "";
                    if(found.length > 0){
                        slug_slug =  user_slug + Math.floor(Math.random()*(1-10000+1)+1);
                    }else{
                        slug_slug =  user_slug;
                    }
                    var Web3 = require('web3')
                    var fs = require('fs');
                    var ethURL = sails.config.appEtherUrl + ":" + sails.config.portEtherIo;
                    var web3 = new Web3(new Web3.providers.HttpProvider(ethURL));                          
                    const password = dt.format('mdYHMS')+'a';
                    web3.personal.newAccount(password,function(err,address){
                        var _newUser = {
                            name: name,
                            loginid: uID,
                            slug : slug_slug,
                            password: password,
                            referral :referral_code,
                            device_id:device_id,
                            ethaddress:address
                        };
                    
                        if(req.param("referral") != undefined && req.param("referral") != ''){
                                        
                            var referral = req.param("referral");
                                referral = referral.trim();
                                referral = referral.replace(/\-/g,'');
                                referral = referral.replace(/ /g, '');
                            
                            Users.find({referral: referral}).exec(function(err, referral_user) {
                                
                                if(referral_user != undefined && referral_user.length > 0) {
                                    Users.create(_newUser).then(function (_users) {

                                        //reward for account creation
                                        var _newEarnReward = {
                                            user_id: _users.id,
                                            amount: 5,
                                            type: 'account_create'
                                        };

                                        EarnRewards.create(_newEarnReward).exec(function(err,resultEarnReward){
                                            console.log("EarnReward created: " + JSON.stringify(resultEarnReward));
                                        });
                                        
                                        var datetime    = require('node-datetime');
                                        var dt          = datetime.create();
                                        var token       = dt.format('mdYHMS');

                                        token_arr = {'user_id':_users.id,'token':token};

                                        UserDataService.useReferral(req,_users.id,'api').then(function(){
                                            Tokens.create(token_arr).exec(function (err, finn){});
                                            ApiService.setApiRes("msg",'User registered successfully!');
                                            ApiService.setApiRes("status",true);
                                            ApiService.setApiRes("token",token);
                                            ApiService.setApiRes("data",{"user":_users});
                                            return res.json(ApiService.returnRes());
                                        });
                                    }).catch(function (error) {
                                        ApiService.setApiRes("msg",error); 
                                        ApiService.setApiRes("status",false);
                                        ApiService.setApiRes("data",{});
                                        return res.json(ApiService.returnRes());
                                    });
                                } else {
                                    ApiService.setApiRes("msg",'Invalid referral code'); 
                                    ApiService.setApiRes("status",false);
                                    ApiService.setApiRes("data",{});
                                    return res.json(ApiService.returnRes());
                                }
                            });
                        } else {
                            Users.create(_newUser).then(function (_users) {
                                        
                                var datetime    = require('node-datetime');
                                var dt          = datetime.create();
                                var token       = dt.format('mdYHMS');

                                //reward for account creation
                                var _newEarnReward = {
                                    user_id: _users.id,
                                    amount: 5,
                                    type: 'account_create'
                                };

                                EarnRewards.create(_newEarnReward).exec(function(err,resultEarnReward){
                                    console.log("EarnReward created: " + JSON.stringify(resultEarnReward));
                                });

                                token_arr = {'user_id':_users.id,'token':token};

                                Tokens.create(token_arr).exec(function (err, finn){});
                                ApiService.setApiRes("msg",'User registered successfully!');
                                ApiService.setApiRes("status",true);
                                ApiService.setApiRes("token",token);
                                ApiService.setApiRes("data",{user:_users});
                                return res.json(ApiService.returnRes());
                            }).catch(function (error) {
                                ApiService.setApiRes("msg",error); 
                                ApiService.setApiRes("status",false);
                                ApiService.setApiRes("data",{});
                                return res.json(ApiService.returnRes());
                            });
                        }
                    });
                });
            }
        });
    },
    logout:function(req, res){
        var token = req.headers.token;
        token_arr = {'token':token};
        Tokens.destroy(token_arr).exec(function (err) {
            if(err){
                ApiService.setApiRes("msg",'Logout fail!');
                ApiService.setApiRes("status",false);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            } else {
                ApiService.setApiRes("msg",'Successfully logout!');
                ApiService.setApiRes("status",true);
                ApiService.setApiRes("data",{});
                return res.json(ApiService.returnRes());
            }
        });
    }
};

