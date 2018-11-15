/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const passport	= require('passport'),
		bcrypt	= require('bcrypt-nodejs');
var validator	= require('sails-custom-validation-messages');
var path		= require("path");
var moment		= require('moment');

module.exports = {
	
    /**
     * `UsersController.create()`
     */
    create: function (req, res) {
        //console.log("Inside create New User..............req.params = " + JSON.stringify(req.params.all()));
        
        if(typeof req.param("name")=='undefined' || req.param("name").trim()==''){
            return res.json({
                status: 'Error',
                msg: 'Name is required'
            });
        }

        var ref_unq = 0;
		do {
			referral = RefferalCode.generateReferral({ digit: 11 });
			Users.find({ select: ['referral'], where: { referral: referral } }).exec(function(err,referrals) {
				if(referrals.length==0) {
					ref_unq = 1;
				} else {
					ref_unq = 0; //try gen new code
				}
			});
        } while (ref_unq > 1);
        
        Users.find({slug:req.param("slug")}).exec(function(err,found){
			if (err) {
				//console.log("first err :",err);
				return res.json({
					status: 'Error',
					msg: 'Server not respond!'
				});
			}
            var slug_slug = "";
            if(found.length > 0){
                slug_slug =  req.param("slug") + Math.floor(Math.random()*(1-10000+1)+1);
            }else{
                slug_slug =  req.param("slug");
            }
            
			var Web3 = require('web3')
			var fs = require('fs');
			var ethURL = sails.config.appEtherUrl + ":" + sails.config.portEtherIo;
			var web3 = new Web3(new Web3.providers.HttpProvider(ethURL));
            const password = req.param("password");
			web3.personal.newAccount(password,function(err,address){
				if (err) {
					return res.json({
						users: address,
						status: 'Error',
						statusDescription: err,
						msg: 'Your Address(Eth Address) not created. Server not respond!'
					});
				} else {

                    if(slug_slug==''){
                        return res.json({
                            status: 'Error',
                            msg: 'Slug can not blank,Please try again'
                        });
                    }
                    
                    var loginid  = req.param("loginid").trim();
                    var userName = req.param("name").trim();
                    userName     = userName.charAt(0).toUpperCase() + userName.slice(1);
                    
                    var _newUser = {
                        name: userName,
						loginid: loginid.toLowerCase(),
						password: req.param("password"),
						referral: referral,
						slug: slug_slug,
						ethaddress:address
                    };
                    
					Users.create(_newUser).then(function (_users) {
						if(typeof _users.id != 'undefined') {
							/* Earn on account creation */
							var _newEarnReward = {
								user_id: _users.id,
								amount: 5,
								type: 'account_create'
							};
							EarnRewards.create(_newEarnReward).exec(function(err,resultEarnReward){
								//console.log("EarnReward created: " + JSON.stringify(resultEarnReward));
                            });

                            //referral Earning
                            var referral_status='';
                            var referral_exist = 0;
                            if(typeof req.param("referral")!='undefined' && req.param("referral")!=''){
                                var referral = req.param("referral");
                                referral_exist=1;
                                ReferralEarnService.referralEarning(_users.id,referral).then(function(data){
                                    if(data=="COMPLETE"){
                                        referral_status=1;
                                    }
                                });
                            }
                        }

                       /* Login after registration */
						//console.log("Login attempt");
						passport.authenticate('local', function(err, _users, info){
                            //console.log("Login attempt -->> ", _users);
							if((err) || (!_users)) {
								return res.json({ status:'Error', message: err, _users });
							}
							req.logIn(_users, function(err) {
								if(err) res.json(err);
                                var msg='';
                                msg=info.message;
                                if(referral_status=='' && referral_exist==1){
                                    msg=msg+' , Referral code is invalid';
                                }

                                console.log('login message',JSON.stringify(info.message));
								return res.json({
									status: "OK",
									message: msg,
									users: _users,
								});
							});
						})(req, res);
		
					}).catch(function (error) {
                        error = validator(Users, error);
                        console.log(error);
						return res.json({
							errors: error.invalidAttributes,
							status: 'Error',
							statusDescription: error,
							message: 'Login ID already exists, Try another one',
							title: 'Add a new User'
						});
					});
				}
			});
		});
    },

    profile: function (req, res) {
        if(req.user.company_id==undefined || req.user.company_id==''){
            var statusArr = [0,1];
            
            Users.findOne({id: req.user.id})
            .populate('usereducations',{sort:{from_year:-1,createdAt:-1}})
            .populate('usereducations.educationdocs',{select:['createdAt'],sort:{createdAt:1}})
            .populate('usereducations.educationdocs.verify_request_id',{where:{status:{'$in': statusArr}},select:['tab_type'],sort:{createdAt:1},limit:2})
            .populate('usereducations.educationdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
            .populate('userprojects',{sort:{from_year:-1,createdAt:-1}})
            .populate('userprojects.company_id',{select:['company_name'],sort:{from_year:-1,createdAt:-1}})
            .populate('userprojects.projectdocs',{select:['createdAt'],sort:{from_year:-1,createdAt:-1}})
            .populate('userprojects.projectdocs.verify_request_id',{where:{status:{'$in': statusArr}},select:['tab_type'],sort:{from_year:-1,createdAt:-1},limit:2})
            .populate('userprojects.projectdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{from_year:-1,createdAt:-1},limit:2})
            .populate('userexperiences',{sort:{from_year:-1,current_work:-1}})
            .populate('userexperiences.company_id',{select:['company_name'],sort:{from_year:-1,current_work:-1}})
            .populate('userexperiences.experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
            .populate('userexperiences.experiencedocs.verify_request_id',{where:{status:{'$in': statusArr}},select:['tab_type'],sort:{createdAt:1},limit:2})
            .populate('userexperiences.experiencedocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
            .populate('feeduser',{select:['id','type'],where:{type:"B"}})
            .populate('usersociallinks').exec(function(err, user){

                Socials.find().exec(function(err,socials) {
                    UserRecommendations.find({recommended_id:req.user.id,status:1,is_delete:0})
                    .populate('user_id',{select:['name','profile_image','location','slug']})
                    .populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
                    .populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
                    .exec(function(err,addRecommendation){
                         UserRecommendations.find({user_id:req.user.id,is_delete:0})
                         .populate('recommended_id',{select:['name','profile_image','location','slug']})
                         .populate('recommended_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
                         .populate('recommended_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
                         .exec(function(err,giveRecommendation){
                        UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
                            UserConnection.find({to_user_id: req.user.id,status:'1' }).exec(function(err, connection){
                                UserConnection.find({user_id: req.user.id,status:'1' }).exec(function(err, connection1){
                                    connarray = [];
                                    connarray1 = [];
                                    connection1.forEach(function(factor, index){
                                        connarray1.push(factor.to_user_id);
                                    });
                                    connection.forEach(function(factor, index){
                                        connarray.push(factor.user_id);
                                    });
                                    user_ids = connarray1.concat(connarray);
									Users.find({id: {"$in" : user_ids}}).exec(function(err, connections){
										Companies.find({select:['company_name']}).exec(function(err, company){
											Degreetype.find({status:1}).exec(function (err, degreetype) {

                                                var profile_title = 'View Profile | Lynked.World';

                                                if(typeof user.name!='undefined' && user.name!=''){
                                                    profile_title = user.name+' | Lynked.World';
                                                }

												return res.view("user/viewprofile", {
													user:user,
													social:socials,
													recommend:connections,
													degreetypes:degreetype,
													status: 'OK',
													isPublic:1,
													title: profile_title,
													userData:userInfo,
													companylist:company,
													recivedRecommends:addRecommendation,
													giveRecommends:giveRecommendation,
                                                    moment:moment
												});
											});
										});
									});
								});
							});
						});
						});
					});
				});
			});
        }else{
            Companies.findOne({id: req.user.company_id})
                .populate('companydata')
                .exec(function(err,_company){
                Companies.find({id : { "!" : _company.id }}).populate('companydata').populate('followers').paginate({page: 1, limit: 5}).sort('createdAt DESC').exec(function(err,morecompanies){
                    var exist_ids = [];
                    exist_ids.push(req.user.id);
			        Users.find({where:{company_id:null,id: {"$nin" : exist_ids}},select:['name']}).exec(function(err,meet_team){
                    	////console.log("--> ",morecompanies[0].companydata[0].createdAt);
                        CompanyTeamMembers.find({company_id:req.user.company_id,display_status:1,select:['id']})
                        .populate('user_id',{select:['name','slug','profile_image','headline','address']})
                        .populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
                        .populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
                        .exec(function(err,list_members){    
                            UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
                                Follow.count({company_id:_company.id}).exec(function countCB(error, follows) {
                                    if(error){
                                        console.log(error);
                                    }
                                    
                                    var profile_title = 'Company Profile | Lynked.World';
                                    if(typeof _company.company_name!='undefined' && _company.company_name!=''){
                                        profile_title = _company.company_name+' | Lynked.World';
                                    }

                                    return res.view('company/profile',{
                                        company: _company,
                                        morecompanies: morecompanies,
                                        userData:userInfo,
                                        teams:meet_team,
                                        followers:follows,
                                        is_login:1,
                                        action_flag:1,
                                        my_team:list_members,
                                        status: 'OK',
                                        title: profile_title
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    },

    edit: function (req,res){
        if(typeof req.user.company_id=='undefined' || req.user.company_id==''){
            //console.log("User Profile.............");
            Users.findOne().where({id: req.user.id}).populate('usereducations').populate('userexperiences',{sort:'current_work DESC'}).populate('userexperiences.company_id',{select:['company_name'],sort:'current_work DESC'}).then(function (user) {
                if (user) {
                    //languages
                    Languages.find().exec(function(err, languages) {
                         //Industries
                        Industries.find().exec(function(err, industries) {
                            //Countries
                            Countries.find().exec(function(err, countries) {
                                //States
                                States.find({country_id:user.country_id}).exec(function(err,statelist) {
                                    //Cities
                                    Cities.find({state_id:user.state_id}).exec(function(err,citylist) {
                                         UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
                                            Companies.find({select:['company_name']}).exec(function(err, company){
                                                return res.view("user/profile", {
                                                    user: user,
                                                    status: 'OK',
                                                    title: 'Edit User Profile | Lynked.World',
                                                    activepage: 'edit',
                                                    language:languages,
                                                    industry:industries,
                                                    country:countries,
                                                    statelist:statelist,
                                                    citylist:citylist,
                                                    companylist:company,
                                                    userData:userInfo
                                                });
                                             });
                                        });
                                    });
                                });
                            });
                        });
                    });
                } else {
                    return res.view('500', {message: "Sorry, no user found with id"});
                }
            }).catch(function (err) {
                return res.view('500', {message: "Sorry, no user found with id - "});
            });
        }else{
            Companies.findOne({id:req.user.company_id})
            .populate('companydata')
            .populate('companydata.parent_id')
            .exec(function(err,_company){
                Languages.find().exec(function(err, languages) {
                    Industries.find().exec(function(err, industries) {
                        UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
                            UserContactVerifyData.findOne({user_id: req.user.id}).exec(function (err, verifyData) {
                                 Country_Dial_Code.find({select:['dial_code','name']}).exec(function (err, dial_code) {
                                    // return res.json(_company);
                                    return res.view('company/edit',{
                                        userdata: _company,
                                        user: (_company.companydata.length) ? _company.companydata[0] : {},
                                        language:languages,
                                        industry:industries,
                                        userData:userInfo,
                                        userverify: verifyData,
                                        dial_code:dial_code,
                                        title: 'Edit Company Profile',
                                        activepage: 'edit',
                                        status: 'OK'
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    },

    editprofile: function (req, res) {
        if(typeof req.param("name")=='undefined' || req.param("name")==''){
            console.log('name is require');
            return res.redirect('/profile/edit');
        }

        var userName = req.param("name").trim();
            userName = userName.charAt(0).toUpperCase() + userName.slice(1);

        var userinfo = {
            name: userName,
            headline: req.param("headline"),
            about_me: req.param("about_me"),
            location: req.param("location"),
            country: req.param("country"),
            state: req.param("state"),
            city: req.param("city"),
            industry_id: req.param("industry_id"),
            language_id: req.param("language_id")
        };


        Users.update(req.user.id,userinfo).then(function (_users) {
			//console.log("User profile update");
			if(typeof _users[0].id != 'undefined') {
				/* Activity Log Insert */
				ActivityLogsService.addActivityLog({
					owner_id: req.user.id,
					module: 'user',
					action: 'update',
					object_id: _users[0].id,
					type: 'web'
				});
			}

			var experience_id = req.param("current_position");
			var education_id  = req.param('current_education');
            
			if(typeof experience_id!='undefined' && experience_id!=''){
                UserExperiences.update({user_id:req.user.id},{display_status:0}).exec(function afterwards(err, updated){
                    if (err) {
                        //console.log('error in experience flag');
                    }
                    UserExperiences.update(experience_id,{display_status:1}).exec(function afterwards(err, updated){
                        if (err) {
                            //console.log('error in experience flag');
                        }
                    });
                });
                
            }

            if(typeof education_id!='undefined' && education_id!=''){
                UserEducations.update({user_id:req.user.id},{display_status:0}).exec(function afterwards(err, updated){
                     if (err) {
                        //console.log('error in education flag');
                    }
                    UserEducations.update(education_id,{display_status:1}).exec(function afterwards(err, updated){
                        if (err) {
                            //console.log('error in education flag');
                        }
                    });
                });
            }
            return res.redirect('/');
        
        }).catch(function (error) {
            //console.log("Validation MESSAGE .............." + JSON.stringify(error.Errors));
             return res.redirect('/profile/edit');
        });
    },

    getstates: function (req, res) {
        var cid = req.param("id");
        States.find({country_id:cid}).exec(function(err, statelist) {
            return res.json({
                data: statelist,
                status: 'OK',
                title: 'Get State list'
            });
        })
    },

    getcities: function (req, res) {
        var sid = req.param("id");
        Cities.find({state_id:sid}).exec(function(err, citylist) {
            return res.json({
                data: citylist,
                status: 'OK',
                title: 'Get City list'
            });
        })
    },

    updateProfileCover_old: function (req, res) {
        req.file('cover_image').upload({
		    dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/users/'),
            maxBytes: 7000000,  //7mb
	    },function (err, uploadedFiles) {
            if (err) return res.negotiate(err);
            if (uploadedFiles.length === 0){
                return res.badRequest('No file was uploaded');
            }
            var allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
            var extension = uploadedFiles[0].type;

            if(allowedTypes.indexOf(extension)=== -1){
                return res.json({
                    filename: path.basename(uploadedFiles[0].fd),
                    status:'Error',
                    datatype:1,
                    msg: 'File type is not valid'
                });
            }
            Users.update(req.user.id, {
                cover_image:path.basename(uploadedFiles[0].fd),
            })
            .exec(function (err){
                if (err) return res.negotiate(err);
				/* Activity Log Insert */
				ActivityLogsService.addActivityLog({
					owner_id: req.user.id,
					module: 'user',
					action: 'cover_update',
					object_id: req.user.id,
					type: 'web'
				});
                return res.json({
                    filename: path.basename(uploadedFiles[0].fd),
                    status:'OK',
                    datatype:1,
                    msg: 'Cover image uploaded successfully!'
                });
            });
    	});
    },
    updateProfileCover: function (req, res) {
        if(req.param("image") != undefined && req.param("image") != ''){
            if(typeof req.param("is_upload_cover")!='undefined' && req.param("is_upload_cover")==0){
                return res.json({
                    status:'OK',
                    datatype:2,
                    msg: 'Profile image uploaded successfully!'
                });
            }
            else if(typeof req.param("is_upload_cover")!='undefined' && req.param("is_upload_cover")==1){

                var base64Data = req.param("image").replace(/^data:image\/png;base64,/, "");
                path_profile_image = 'assets/uploads/users/';
                profile_image_name =  moment().format('MMDDYYYYHS')+".png";

                tmp_path_profile_image = '.tmp/public/uploads/users/';
                require("fs").writeFile(tmp_path_profile_image +profile_image_name, base64Data, 'base64', function(err) {
                  console.log(err);
                });

                require("fs").writeFile(path_profile_image +profile_image_name, base64Data, 'base64', function(err) {
                    console.log(err);
                });

                Users.update(req.user.id, {
                    cover_image:profile_image_name,
                })
                .exec(function (err){
                    if (err) return res.negotiate(err);
    				/* Activity Log Insert */
    				ActivityLogsService.addActivityLog({
    					owner_id: req.user.id,
    					module: 'user',
    					action: 'cover_update',
    					object_id: req.user.id,
    					type: 'web'
    				});
                    return res.json({
                        filename:profile_image_name,
                        status:'OK',
                        datatype:1,
                        msg: 'Cover image uploaded successfully!'
                    });
                });
            }
        }
    },

    updateProfileImage_old: function (req, res) {
        req.file('profile_image').upload({
		    dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/users/'),
            maxBytes: 7000000,
	    },function (err, uploadedFiles) {
            if (err) return res.negotiate(err);
            if (uploadedFiles.length === 0){
                return res.badRequest('No file was uploaded');
            }
            var allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
            var extension = uploadedFiles[0].type;

            if(allowedTypes.indexOf(extension)=== -1){
                return res.json({
                    filename: path.basename(uploadedFiles[0].fd),
                    status:'Error',
                    datatype:1,
                    msg: 'File type is not valid'
                });
            }

            Users.update(req.user.id, {
                profile_image:path.basename(uploadedFiles[0].fd),
            })
            .exec(function (err){
                if (err) return res.negotiate(err);
				/* Activity Log Insert */
				ActivityLogsService.addActivityLog({
					owner_id: req.user.id,
					module: 'user',
					action: 'profile_pic_update',
					object_id: req.user.id,
					type: 'web'
				});
                return res.json({
                    filename: path.basename(uploadedFiles[0].fd),
                    status:'OK',
                    datatype:2,
                    msg: 'Profile image uploaded successfully!'
                });
            });
    	});
    },
    updateProfileImage: function (req, res) {
       if(typeof req.param("image") != undefined && req.param("image") != ''){

            if(typeof req.param("is_upload_profile")!='undefined' && req.param("is_upload_profile")==0){
                return res.json({
                    status:'OK',
                    datatype:2,
                    msg: 'Profile image uploaded successfully!'
                });
            }else if(typeof req.param("is_upload_profile")!='undefined' && req.param("is_upload_profile")==1){

                var base64Data = req.param("image").replace(/^data:image\/png;base64,/, "");
                path_profile_image = 'assets/uploads/users/';
                profile_image_name =  moment().format('MMDDYYYYHS')+".png";
                
                tmp_path_profile_image = '.tmp/public/uploads/users/';
    			
                require("fs").writeFile(tmp_path_profile_image +profile_image_name, base64Data, 'base64', function(err) {
                  console.log(err);
                }); 
                require("fs").writeFile(path_profile_image +profile_image_name, base64Data, 'base64', function(err) {
    			  console.log(err);
    			});                      

                Users.update(req.user.id, {
                    profile_image:profile_image_name,
                })
                .exec(function (err){
                    if (err) return res.negotiate(err);
    				/* Activity Log Insert */
    				ActivityLogsService.addActivityLog({
    					owner_id: req.user.id,
    					module: 'user',
    					action: 'profile_pic_update',
    					object_id: req.user.id,
    					type: 'web'
    				});
                    return res.json({
                        filename:profile_image_name,
                        status:'OK',
                        datatype:2,
                        msg: 'Profile image uploaded successfully!'
                    });
                });
            }
        }
    },

	scantoforgotPassword: function (req, res) {
        //console.log("Forgot Password");
		return res.view("Auth/scan-to-forgot-password", {
			status: 'OK', 
			title: 'Scan to get Forgot Password | Lynked.World', 
			layout: 'layouts/loginLayout'
		});
    },
	
	forgotPassword: function (req, res) {
        //console.log("Forgot Password");
		return res.view("Auth/forgot-password", {
			status: 'OK', 
			title: 'Forgot Password | Lynked.World', 
			layout: 'layouts/loginLayout'
		});
    },
	
	postForgotPassword: function (req, res) {
        UserDataService.ForgotPasswordSendOtp(req,'web').then(function(ForgotPasswordSendOtpResponce){
            return res.json(ForgotPasswordSendOtpResponce);
        });
    },
	
	changePassword: function (req, res) {
        //console.log("Change Password");

        var user_id = (typeof req.user!='undefined' && req.user!='') ? req.user.id : 0;
        UserDataService.UserDetails(req,user_id).then(function(userInfo){
            if(user_id==0){
        		return res.view("Auth/change-password", {
        			status: 'OK', 
        			title: 'Change Password | Lynked.World',
        			layout: 'layouts/loginLayout'
        		});
            }else{
                // return res.json(req.user.password);
                return res.view("Auth/after-login-change-password", {
                    status: 'OK', 
                    title: 'Change Password | Lynked.World',
                    userData:userInfo,
                    activepage:'changePassword'
                });
            }
        });
    },

    ChangePasswordAfterLogin: function (req, res) {
        
        var current_password = req.param("current_password");
        var password = req.param("password");
        var confirm_password = req.param("confirm_password");

        var countError = 0;

        if(current_password == ""){
            return res.json({
                status: 'Error', 
                message:"All fields are required. Enter current password."
            });
        }else{
            bcrypt.compare(current_password, req.user.password, function(err, result){
                var regex = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,}$/);
                if(!result){
                    return res.json({
                        status: 'Error', 
                        message:"Incorrect Current Password"
                    });
                }
                else if(password == ""){
                    return res.json({
                        status: 'Error', 
                        message:"New Password cannot be blank. Refer to password specifications."
                    });
                }
                else if(!regex.test(password)) {
                    return res.json({
                        status: 'Error', 
                        message:"New Password did not meet password requirement."
                    });
                }
                else if(confirm_password==''){
                    return res.json({
                        status: 'Error', 
                        message:"All fields are required."
                    });
                }
                else if(password!=confirm_password){
                    return res.json({
                        status: 'Error', 
                        message:"Passwords didn’t match."
                    });
                }
                else{
                    var _updPassword = {
                        password : password
                    };
                    Users.update({id:req.user.id},_updPassword).exec(function(err,data){
                        if(err){
                            error = validator(Users, err);
                            return res.json({
                                status: 'Error', 
                                errors:error.invalidAttributes,
                                message:"Something went wrong. Please try again."
                            });
                        }

                        Tokens.find({user_id:req.user.id}).exec(function(err,userTokens){
                            if(err){
                                return res.json({
                                    status: 'Error', 
                                    message:"Something went wrong. Please try again."
                                });
                            }
                            if(userTokens.length > 0){
                                userTokens.forEach(function(userToken, index){
                                    Tokens.destroy({token:userToken.token}).exec(function (err) {

                                    });
                                });
                            }
                        }); 
                        req.logout();
                        return res.json({
                            status: 'OK', 
                            message:"Password successfully changed. Please log out from all your devices and re-login with your new password."
                        });
                    });
                }
            });
        }
    },

	postChangePassword: function (req, res) {
        if(req.param("password") != undefined && req.param("password") != ''){
            UserDataService.changePasswordWithOtp(req,'web').then(function(serviceResponce){
                return res.json(serviceResponce);
            });
        } else {
            user_id = req.param("user_id");
            Users.findOne({'id':user_id}).exec(function(err,user){          
                return res.view("Auth/change-password", {
                    status: 'OK', 
                    data : {user_id:user_id,user:user},
                    title: 'Change Password | Lynked.World',
                    layout: 'layouts/loginLayout'
                });
            });
        }
    },

    findUserBySlug: function (req,res){
        var login_user_id = (typeof req.user != 'undefined' && req.user!='') ? req.user.id : 0;
        var user_slug = req.param('slug');

        if(typeof req.param('type')!='undefined' && req.param('type')=='wall'){
            if(typeof req.user!='undefined' && typeof req.user.id!='undefined'){
                var page = 1;
                var limit = 10;
                if(req.param("page_no") != undefined){
                    page = req.param("page_no");
                }        
                Users.findOne({slug:user_slug})
                    .populate('userprivacysettings')
                    .populate('userprivacysettings.privacy_option_id')
                    .populate('userprivacysettings.privacy_option_id.privacy_id')
                    .exec(function(error,_users){
                    if(error){
                        return res.view('500', {message: "Something went wrong. Please try again."});
                    }
                    var user_id = _users.id;
                    GroupUsers.find({user_id:user_id}).exec(function(err,_groupuser){
                        group_ids = [];
                        _groupuser.forEach(function(_groupusers, index){
                            group_ids.push(_groupusers.group_id);
                        });
                        var filter = {
                            "$or" : [ 
                                { "$and" : [
                                    { "user_id" : { "$in" : [user_id] } }, 
                                    { "group_id" : "" } ] 
                                }, 
                                { "group_id" : { "$in" : group_ids } },
                                { "to_user_id" : { "$in" : [user_id] } }

                            ],
                            is_deleted : { "!" : 1 }
                        };
                    
                        Feeds.count(filter).exec(function countCB(err,count){
                            Feeds.find(filter)
                                .populate('to_user_id', { select: ['name','id','slug','profile_image'] })
                                .populate('user_id', { select: ['name','id','slug','profile_image'] })
                                .populate('group_id')
                                .populate('user_id.company_id',{select:['company_name','slug']})
                                .populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
                                .populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
                                .populate('jobBookmarks',{'where' : {user_id:user_id}})
                                .populate('company_id',{'select':['id','company_name']})
                                .populate('company_id.companydata')
                                .populate('job_type_id',{'select':['id','title']})
                                .populate('experience_id',{'select':['id','title']})
                                .populate('feedcomments', { sort: 'createdAt ASC' })
                                .populate('feedcomments.user_id.company_id')
                                .populate('feedcomments.commentlikes')
                                .populate('feedcomments.commentreply')
                                .populate('feedcomments.commentreply.commentlikes')
                                .populate('feedcomments.commentreply.user_id.company_id')
                                .populate('feedmedias')
                                .populate('feedlikes')
                                .populate("pollanswers")
                                .populate('polloptions')
                                .populate("polloptions.pollanswers")
                                .sort('createdAt DESC')
                                .paginate({page: page, limit: limit})
                                .exec(function(err,_feeds){
                                UserDataService.UserDetails(req,user_id).then(function(userInfo){
                                    UserDataService.UserDetails(req,login_user_id).then(function(loginuserInfo){
                                        UserContactVerifyData.findOne({user_id: user_id}).exec(function (err, verifyData) {
                                            Country_Dial_Code.find({select:['dial_code','name']}).exec(function (err, dial_code) {
                                                UserConnectionService.getUserRelation(login_user_id,user_id).then(function(userrelation){
                                                    var responseArray = {
                                                        status: 'OK',
                                                        title: _users.name+' | Lynked.World',
                                                        feeds: _feeds,
                                                        user: _users,
                                                        totalfeeds: count,
                                                        userInfo:userInfo,
                                                        userrelation:userrelation,
                                                        userData:loginuserInfo,
                                                        moment:moment
                                                    };
                                                    if(req.isAuthenticated()){
                                                        return res.view('user/profilewall', responseArray);
                                                    }else{
                                                        responseArray.layout = 'layouts/profilelayout';
                                                        return res.view('user/profilewall', responseArray);
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }else{
                return res.redirect("/");
            }
        }else{
            Users.findOne({slug:user_slug})
            .populate("BlockTo")
            .populate('usereducations',{sort:{from_year:-1,createdAt:-1}})
            .populate('usereducations.educationdocs',{select:['createdAt'],sort:{createdAt:1}})
            .populate('usereducations.educationdocs.verify_request_id',{select:['tab_type'],sort:{createdAt:1},limit:2})
            .populate('usereducations.educationdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
            .populate('userprojects',{sort:{from_year:-1,createdAt:-1}})
            .populate('userprojects.company_id',{select:['company_name'],sort:{from_year:-1,createdAt:-1}})
            .populate('userexperiences',{sort:{from_year:-1,current_work:-1}})
            .populate('userexperiences.company_id',{select:['company_name'],sort:{from_year:-1,current_work:-1}})
            .populate('userexperiences.experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
            .populate('userexperiences.experiencedocs.verify_request_id',{select:['tab_type'],sort:{createdAt:1},limit:2})
            .populate('userexperiences.experiencedocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
            .populate('usersociallinks')
            .populate('userprivacysettings')
            .populate('userprivacysettings.privacy_option_id')
            .populate('userprivacysettings.privacy_option_id.privacy_id')
            .populate('feeduser',{select:['id','type'],where:{type:"B"}})
            .exec(function(err, user){
                // return res.json(user);
                if(user){
                    if(err){
                        console.log(err);
                    }

                    var rec_criteria = '';

                    if(typeof login_user_id!='undefined' && login_user_id!=0){
                        if(login_user_id==user.id){
                            rec_criteria = {user_id:user.id,is_delete:0};
                        }else{
                            rec_criteria = {user_id:user.id,is_delete:0,status:1};
                        }
                    }else{
                        rec_criteria = {user_id:user.id,is_delete:0,status:1};
                    }
      
                    //5a4128ee4c7fc715a89bfbfe
                    Socials.find().exec(function(err,socials) {
                        UserRecommendations.find({recommended_id:user.id,status:1,is_delete:0})
                            .populate('user_id',{select:['name','profile_image','location','slug']})
                            .populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
                            .populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
                            .exec(function(err,addRecommendation){

                        UserRecommendations.find(rec_criteria)
                            .populate('recommended_id',{select:['name','profile_image','location','slug']})
                            .populate('recommended_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
                            .populate('recommended_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
                            .exec(function(err,giveRecommendation){

                            UserDataService.UserDetails(req,login_user_id).then(function(userInfo){
                                UserConnection.find({to_user_id: user.id,status:'1' }).exec(function(err, connection){
                                    UserConnection.find({user_id:user.id,status:'1' }).exec(function(err, connection1){
                                        connarray = [];
                                        connarray1 = [];
                                        connection1.forEach(function(factor, index){
                                            connarray1.push(factor.to_user_id);
                                        });
                                        connection.forEach(function(factor, index){
                                            connarray.push(factor.user_id);
                                        });

                                        user_ids = connarray1.concat(connarray);
                                        Users.find({id: {"$in" : user_ids}}).exec(function(err, connections){
                                            Companies.find({select:['company_name']}).exec(function(err, company){
                                                UserConnectionService.getUserRelation(login_user_id,user.id).then(function(userrelation){

                                                     var profile_title = 'Public Profile | Lynked.World';
                                                        if(typeof user.name!='undefined' && user.name!=''){
                                                            profile_title = user.name+' | Lynked.World';
                                                        }

                                                    var parameter = {
                                                        user:user,
                                                        social:socials,
                                                        recommend:connections,
                                                        status: 'OK',
                                                        isPublic:0,
                                                        title:profile_title,
                                                        userData:userInfo,
                                                        userrelation:userrelation,
                                                        companylist:company,
                                                        recivedRecommends:addRecommendation,
                                                        giveRecommends:giveRecommendation,
                                                        moment:moment
                                                    }

                                                    if(req.isAuthenticated()){
                                                        Users.find({id:req.user.id}).populate('company_id',{select:['company_name','slug']}).exec(function(err, currentUser){
                                                            UserConnection.find({user_id:req.user.id,to_user_id: user.id}).exec(function(err, sentRequest){
                                                                UserConnection.find({user_id:user.id,to_user_id:req.user.id}).exec(function(err, receiveRequest){
                                                                    parameter['currentUser']=currentUser;
                                                                    parameter['sentRequest']=sentRequest;
                                                                    parameter['receiveRequest']=receiveRequest;
                                                                    parameter['isLogin']=1;
                                                                    parameter['login_id']=login_user_id;
                                                                    // return res.json(parameter);

                                                                    return res.view("user/viewprofile", parameter);
                                                                });
                                                            });
                                                        });
                                                    }else{
                                                        parameter['isLogin']=0;
                                                        parameter['login_id']=login_user_id;
                                                        parameter['layout'] ='layouts/profilelayout';
                                                        return res.view("user/viewprofile", parameter);
                                                    }
                                                    });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                }else {
                     return res.redirect('/');
                }
            });
        }
    },
	
    findUserBySlug_old: function (req,res){
        var user_slug = req.param('slug');
        var login_user_id = 0;

        if(req.isAuthenticated()){
            login_user_id=req.user.id;
        }
        Users.findOne({slug:user_slug})
        .populate("BlockTo")
        .populate('usereducations',{sort:{from_year:-1,createdAt:-1}})
        .populate('usereducations.educationdocs',{select:['createdAt'],sort:{createdAt:1}})
        .populate('usereducations.educationdocs.verify_request_id',{select:['tab_type'],sort:{createdAt:1},limit:2})
        .populate('usereducations.educationdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
        .populate('userprojects',{sort:{from_year:-1,createdAt:-1}})
        .populate('userprojects.company_id',{select:['company_name'],sort:{from_year:-1,createdAt:-1}})
        .populate('userexperiences',{sort:{from_year:-1,current_work:-1}})
        .populate('userexperiences.company_id',{select:['company_name'],sort:{from_year:-1,current_work:-1}})
        .populate('userexperiences.experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
        .populate('userexperiences.experiencedocs.verify_request_id',{select:['tab_type'],sort:{createdAt:1},limit:2})
        .populate('userexperiences.experiencedocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
        .populate('usersociallinks')
        .exec(function(err, user){
            if(user){
                if(err){
                    console.log(err);
                }

                var rec_criteria = '';

                if(typeof login_user_id!='undefined' && login_user_id!=0){
                    if(login_user_id==user.id){
                        rec_criteria = {user_id:user.id,is_delete:0};
                    }else{
                        rec_criteria = {user_id:user.id,is_delete:0,status:1};
                    }
                }else{
                    rec_criteria = {user_id:user.id,is_delete:0,status:1};
                }
  
                //5a4128ee4c7fc715a89bfbfe
                Socials.find().exec(function(err,socials) {
                    UserRecommendations.find({recommended_id:user.id,status:1,is_delete:0})
                        .populate('user_id',{select:['name','profile_image','location','slug']})
                        .populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
                        .populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
                        .exec(function(err,addRecommendation){

                    UserRecommendations.find(rec_criteria)
                        .populate('recommended_id',{select:['name','profile_image','location','slug']})
                        .populate('recommended_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
                        .populate('recommended_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
                        .exec(function(err,giveRecommendation){

                        UserDataService.UserDetails(req,user.id).then(function(userInfo){
                            UserConnection.find({to_user_id: user.id,status:'1' }).exec(function(err, connection){
                                UserConnection.find({user_id:user.id,status:'1' }).exec(function(err, connection1){
                                    connarray = [];
                                    connarray1 = [];
                                    connection1.forEach(function(factor, index){
                                        connarray1.push(factor.to_user_id);
                                    });
                                    connection.forEach(function(factor, index){
                                        connarray.push(factor.user_id);
                                    });

                                    user_ids = connarray1.concat(connarray);
                                    Users.find({id: {"$in" : user_ids}}).exec(function(err, connections){
                                        Companies.find({select:['company_name']}).exec(function(err, company){
                                            var parameter = {
                                                user:user,
                                                social:socials,
                                                recommend:connections,
                                                status: 'OK',
                                                isPublic:0,
                                                title: 'User Public Profile',
                                                userData:userInfo,
                                                companylist:company,
                                                recivedRecommends:addRecommendation,
                                                giveRecommends:giveRecommendation
                                            }

                                            if(req.isAuthenticated()){
                                                Users.find({id:req.user.id}).populate('company_id',{select:['company_name','slug']}).exec(function(err, currentUser){
                                                    UserConnection.find({user_id:req.user.id,to_user_id: user.id}).exec(function(err, sentRequest){
                                                        UserConnection.find({user_id:user.id,to_user_id:req.user.id}).exec(function(err, receiveRequest){
                                                            parameter['currentUser']=currentUser;
                                                            parameter['sentRequest']=sentRequest;
                                                            parameter['receiveRequest']=receiveRequest;
                                                            parameter['isLogin']=1;
                                                            parameter['login_id']=login_user_id;
                                                            // return res.json(parameter);

                                                            return res.view("user/viewprofile", parameter);
                                                        });
                                                    });
                                                });
                                            }else{
                                                parameter['isLogin']=0;
                                                parameter['login_id']=login_user_id;
                                                parameter['layout'] ='layouts/profilelayout';
                                                return res.view("user/viewprofile", parameter);
                                            }
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
            }else {
                 return res.redirect('/');
            }
        });
    },

    mywallet:function(req,res){
        var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
        var limit = (typeof req.param("limit") != 'undefined') ? req.param("limit") : 10;
        var startPoint = 0;
        var endPoint = 0;

        EarnRewards.count({user_id:req.user.id}).exec(function(err,count){
            EarnRewards.find({user_id:req.user.id})
            .populate("used_referral_id")
            .populate("used_referral_id.user_id",{select:['name','slug','profile_image']})
            .populate("used_referral_id.referral_user_id",{select:['name','slug','profile_image']})
            .sort("createdAt DESC")
            .paginate({page: page_no, limit: limit})
            .exec(function(err,earns){
                UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
                    UserContactVerifyData.findOne({user_id: req.user.id}).exec(function (err, verifyData) {
                        UserDataService.walletData(req,req.user.id).then(function(walletDataService){
                            Country_Dial_Code.find({select:['dial_code','name']}).exec(function (err, dial_code) {
                                // return res.json(earns);
                                var numberOfPages = count / limit;
                                if(numberOfPages > 1){
                                    numberOfPages = Math.ceil(numberOfPages);
                                }else{
                                    numberOfPages = 1;
                                }

                                if(page_no > 1){
                                    startPoint = (page_no-1)*limit+1;
                                    endPoint = (startPoint + earns.length) - 1;
                                }else{
                                    if(earns.length > 0){
                                        startPoint = 1;
                                        endPoint = (startPoint + earns.length) - 1;
                                    }
                                }
                                
                                if(endPoint > count){
                                    endPoint =  count;
                                }
                                return res.view("wallet/mywallate",{
                                    title:"My Wallet | Lynked.World",
                                    status:"OK",
                                    earns:earns,
                                    userverify:verifyData,
                                    dial_code:dial_code,
                                    totalRecords:count,
                                    walletData:walletDataService.data.wallet_data,
                                    DisplayedRecords:count,
                                    numberofpages:numberOfPages,
                                    startPoint:startPoint,
                                    endPoint:endPoint,
                                    currentPage:page_no,
                                    userData:userInfo
                                });
                            });
                        });
                    });
                });
            });
        });
    },
    updateSocketId : function(req,res){
        if(req.user != undefined && req.user.id != undefined){
            user_id = req.user.id;
            
            if(user_id != undefined && user_id != ''){
                UserDataService.updateSocketId(req,user_id).then(function(status){
                    return res.json({"status":'OK'});
                });
            }
        }
    },
    message_user : function(req,res){
        var countries   = [];
        var user_id     = req.user.id;
         Users.find({name:{'like':'%'+req.param('user_name')+'%'},is_guest : {'!':[1]},'id':{'!':[user_id]}}).limit(5).sort('name').exec(function(err,_users){
            if(_users.length > 0) {
                _users.forEach(function(_user, index){
                    countries.push({ value: _user.name, data: _user.id });
                });
            }
            return res.json(countries);
         });
    },

    Send_Email_Invitation: function(req,res,next){
       var sender_email = req.param('email');
       sender_email = sender_email.trim();
        var referal_code = (typeof req.user.referral !='undefined') ? req.user.referral : "";
        if(typeof req.param('email')!='undefined' && req.param('email')!=''){
            UserContactVerifyData.findOne({user_id: req.user.id}).exec(function (err, verifyData){
                if(typeof verifyData!='undefined'){
                    if(typeof verifyData.email!='undefined' && verifyData.email!=''){
                        if(verifyData.email==sender_email){
                            return res.json({
                                status:'Error',
                                msg: 'You can not use your own email address'
                            });
                        }
                    }
                }
                
                UserVerifyDataRequest.find({email:sender_email,is_email_verify:1}).exec(function(err,userExist){
                    if(userExist.length>0){
                        return res.json({
                            status:'Error',
                            msg: 'Fail to send invitation, Email already exist'
                        });
                    }

                    var sendTo = req.param('email');
                    
                    EmailSentLogs.count({user_id:req.user.id,to_email:sendTo,"createdAt":{ $lt: new Date(),  $gte: new Date(new Date().setDate(new Date().getDate()-1))}
                    }).exec(function(err,emailCheck){

                        if(emailCheck>0){
                            return res.json({
                                status:'Error',
                                msg: 'Today, You have already sent the invitation'
                            });
                        }

                        sails.hooks.email.send(
                            "referAfriend",
                            {
                                siteURL: sails.config.appUrlwPort,
                                message: "",
                                referral_code: referal_code,
                                recipientEmail: sender_email.trim(),
                            },
                            {
                                to: sender_email.trim(),
                                subject: "Your friend invited you to join Lynked.World."
                            },
                            function(err) {
                                console.log(err || "It worked!");
                            }
                        );

                        // sails.hooks.email.send(
                        // "invitationEmail",
                        // {
                        //     siteURL: sails.config.appUrl,
                        //     recipientName: ' ',
                        //     referenceLink: referal_code,
                        //     recipientEmail: sender_email,
                        // },
                        // {
                        //     to: sender_email,
                        //     subject: "Invitation From "+req.user.name+" to join Lynked.World"
                        // },
                        //     function(err) {
                        //         console.log(err || "It worked!");
                        //     }
                        // );
                           
                        var emailInfo = {
                            owner_id   : req.user.id,
                            to_email   : sender_email,
                            message    : 'Send referral link',
                            email_type : 'referral'
                        }
                        
                        // store message logs
                        MailSentLogsService.EmailLogs(emailInfo);

                        return res.json({
                            status:'OK',
                            msg: 'Invitation send successfully'
                        });
                    });
                });
            });
        }else{
            return res.json({ status:'Error',msg: 'Email address is require'});
        }
    },

    UpdateUserSlug : function(req,res){
        Users.find({
             "$or"     : [
      { slug : null },
      { slug : '' },
    ]}).exec(function (err,udata){
      if (err) {
        return res.serverError(err);
      }
        if(typeof udata!='undefined' && udata.length>0){
            udata.forEach(function(user, index){
                var slug= '';
                var username='';
                    username=user.name.trim();

            if(username!=''){
                slug = username.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLowerCase();

                Users.find({slug:slug}).exec(function (err, userinfo){
                    if (err) {
                        return res.json({
                            status: 'Error',
                            message: 'user cron error'
                        });
                    }

                    var slug_slug = "";
                    if(userinfo){
                        console.log('exist====>',slug);

                        slug_slug =  slug+Math.floor(Math.random()*(1-10000+1)+1);
                    }else{
                        slug_slug =  slug;
                    }

                    var updateData = {slug:slug_slug,status:"1"};

                     Users.update({id:user.id},updateData).exec(function afterwards(err, _update){
                        if (err) {
                            return res.json({
                                error:err,
                                status: 'Error',
                                msg:'Fail to update'
                            });
                        }
                        console.log('Update user slug');

                        });
                    });
                }
            });
        }
          return res.json('Update user data successfully');
        });
    },

    UpdateCompanySlug : function(req,res){
        Companies.find({"$or":[{ slug : null },{ slug : ''}]}).exec(function (err,udata){
            if (err) {
                return res.serverError(err);
            }
        if(typeof udata!='undefined' && udata.length>0){
            udata.forEach(function(user, index){
                var slug= '';
                var username='';
                    username=user.company_name.trim();

            if(username!=''){
                slug = username.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLowerCase();

                Companies.find({slug:slug}).exec(function (err, userinfo){
                    if (err) {
                        return res.json({
                            status: 'Error',
                            message: 'company cron error'
                        });
                    }

                    var slug_slug = "";
                    if(userinfo){
                        console.log('exist====>',slug);

                        slug_slug =  slug+Math.floor(Math.random()*(1-10000+1)+1);
                    }else{
                        slug_slug =  slug;
                    }
                    
                    var updateData = {slug:slug_slug,status:"1"};
                    Companies.update({id:user.id},updateData).exec(function afterwards(err, _update){
                        if (err) {
                            return res.json({
                                error:err,
                                status: 'Error',
                                msg:'Fail to update'
                            });
                        }
                        console.log('Update company slug');

                        });
                    });
                }
            });
        }
          return res.json('Update company data successfully');
        });
    },

    swipeuser:function(req,res){

        var last_login_id = req.user.id;
        if(req.session && req.session.last_login_id){
            last_login_id = req.session.last_login_id;
        }
        // if(typeof req.user.parent_id!='undefined' && req.user.parent_id!=''){
        //     last_login_id = req.user.parent_id;    
        // }

        req.logout();
        passport.authenticate('local', function(err, users, info){
            if((err) || (!users)) {
                return res.json({
                    status:"Error",
                    message:"Something went wrong. Please try again.",
                    errors:err
                });
            }
            req.logIn(users, function(err) {
                if(err){
                    return res.json({
                        status:"Error",
                        message:"Something went wrong. Please try again.",
                        errors:err
                    });
                }

                req.session.last_login_id = last_login_id;
                
                return res.json({
                    status:"OK",
                    message: "User has been swapped successfully."
                });
            });
        })(req, res);
    },

    switchuser:function(req,res){

        var last_login_id = req.user.id;
        if(req.session && req.session.last_login_id){
            last_login_id = req.session.last_login_id;
        }
        // if(typeof req.user.parent_id!='undefined' && req.user.parent_id!=''){
        //     last_login_id = req.user.parent_id;    
        // }

        req.logout();
        passport.authenticate('local', function(err, users, info){
            if((err) || (!users)) {
                return res.json({
                    status:"Error",
                    message:"Something went wrong. Please try again.",
                    errors:err
                });
            }
            req.logIn(users, function(err) {
                if(err){
                    return res.json({
                        status:"Error",
                        message:"Something went wrong. Please try again.",
                        errors:err
                    });
                }
                req.session.last_login_id = last_login_id;
                return res.redirect("/");
            });
        })(req, res);
    },

    closeAccount:function(req,res){
        Reasons.find().sort('createdAt DESC').exec(function (err, result) {
            UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
                return res.view("user/closeAccount",{
                    title:"Close Your Account",
                    userData:userInfo,
                    activepage:"closeAccount",
                    result:result
                });
            });
        });
    },

    closeMyAccount:function(req,res){
        var reason_id =(typeof req.param("reason")!='undefined' && req.param("reason")!='')?req.param("reason"):'';

        var _newdata = {
            user_id:req.user.id,
            reason:reason_id,
            feedback:req.param("feedback")
        };

        if(reason_id==''){
             return res.json({
                    status:"Error",
                    message:"Please select any reason for close account",
                });
        }

        Usercloseaccount.create(_newdata).exec(function(err,response){
            if(err){
                return res.json({
                    status:"Error",
                    message:"Something went wrong. Please try again.",
                });
            }
            Users.update({id:req.user.id},{status:"0"}).exec(function(err,result){
                if(err){
                    return res.json({
                        status:"Error",
                        message:"Something went wrong. Please try again.",
                    });
                }

                Reasons.findOne({id:reason_id}).exec(function (err, result){
                  if (err) {
                        console.log(err);
                  }

                    if (!result) {
                        return res.json({
                            status:"OK",
                            message:"Account close but fail to send mail",
                        });
                    }
                    
                    response.reason = (typeof result.title!='undefined')?result.title:'';
                    sails.hooks.email.send(
                        "closeAccount",
                        {
                            siteURL: sails.config.appUrlwPort,
                            username: req.user.name,
                            data: response,
                            recipientEmail: "jay.arusys@gmail.com",
                            //recipientEmail: "reports@lynked.world",
                        },
                        {
                            to: "jay.arusys@gmail.com",
                            //to: "reports@lynked.world",
                            subject: "Lynked.World account closed by "+req.user.name
                        },
                        function(err) {
                            console.log(err || "It worked!");
                        }
                    );

                    req.logout();
                    return res.json({
                        status:"OK",
                        message:"Your account has been closed successfully.",
                    });
                });
            })
        });
    },

    savepdf:function(req,res){

        Users.findOne({id:req.param("id")}).populate("userexperiences").populate("userexperiences.company_id").populate("usereducations").exec(function(err,data){
            if(!data){
                return res.view("404",{layout: 'layouts/loginLayout'});
            }
            // return res.json(data);

            var pdfFilename = data.id+moment(new Date()).format('DD-MM-YYYY-h-m-s')+".pdf";
            sails.hooks.pdf.make(
                "savePdf",
                {
                    users: data,
                    moment: moment,
                },
                {
                    orientation: "landscape",
                    header:{ height:"30px" },
                    footer:{ height:"50px" },
                    output: 'assets/pdfs/'+pdfFilename
                },
                function(err, result) {
                    res.download(result.filename, function (err) {
                        if (err) {
                          return res.serverError(err)
                        } else {
                          return res.ok()
                        }
                    })
                }
            );
        });
    },

    searchUsers:function(req,res){
        var exist_ids = [];
        exist_ids.push(req.user.id);

        var is_check_connection = 0;
        if(req.param("filter") && req.param("filter")=="C"){
            is_check_connection = 1;
        }
        console.log("is_check_connection :"+ is_check_connection);
        if(is_check_connection==1){ // Get Only Connections users

            UserConnectionService.getUserConnection(user_id).then(function(user_ids){
                var filter = {
                    name: { 'like': '%'+req.param("searchword")+'%' },
                    company_id:null,
                    id: {"$in" : user_ids},
                    // id: {"$nin" : exist_ids}
                };

                Users.find({where:filter,select:['id','name','profile_image','location']}).limit(5).sort("name ASC").exec(function(err,_users){
                    if(err){
                        return res.json({status:"OK",data:"No record found"});
                    }
                    var html = "";
                    _users.forEach(function(user, index){
                        var user_id = user.id;
                        var user_name = user.name;
                        var address = (user.location)?user.location:"&nbsp;";
                        var profile_image = "/themes/frontend/images/default-user.png";
                        if(user.profile_image){
                            profile_image = "/uploads/users/"+user.profile_image;
                        }

                        html += '<div class="display_box" data-name="'+user_name+'" data-id="'+user_id+'" align="left">';
                        html += '<img src="'+profile_image+'" /><span class="displayname">'+user_name+'</span>';
                        html += '<span class="address">'+address+'</span></div>';
                    });

                    return res.json({status:"OK",data:html});
                });
            });
        }else{ // Get All Users
            BlockUserService.getBlockUsers(req.user.id).then(function(blockusers){
                var block_user_ids = exist_ids.concat(blockusers);
                var filter = {
                    name: { 'like': '%'+req.param("searchword")+'%' },
                    company_id:null,
                    id: {"$nin" : block_user_ids}
                };
                Users.find({where:filter,select:['id','name','profile_image','location']}).limit(5).sort("name ASC").exec(function(err,_users){
                    if(err){
                        return res.json({status:"OK",data:"No record found"});
                    }
                    var html = "";

                    _users.forEach(function(user, index){
                        var user_id = user.id;
                        var user_name = user.name;
                        var address = (user.location)?user.location:"&nbsp;";
                        var profile_image = "/themes/frontend/images/default-user.png";
                        if(user.profile_image){
                            profile_image = "/uploads/users/"+user.profile_image;
                        }

                        html += '<div class="display_box" data-name="'+user_name+'" data-id="'+user_id+'" align="left">';
                        html += '<img src="'+profile_image+'" /><span class="displayname">'+user_name+'</span>';
                        html += '<span class="address">'+address+'</span></div>';
                    });

                    return res.json({status:"OK",data:html});
                });
            });
        }
    }
};

