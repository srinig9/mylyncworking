// api/services/UserDataService.js
var Promise = require('promise');
var path = require("path");
var fs = require('fs');
var moment = require("moment");
module.exports = {
	_config: {
		model: ['Users','Follow','UserConnection','Feeds','UserEducations','UserExperiences','UserProjects','UserSocials','BlockUser','Usercloseaccount','Reasons']
    },

    /**
     * Send a customized welcome email to the specified email address.
     *
     * @required {String} emailAddress
     *   The email address of the recipient.
     * @required {String} firstName
     *   The first name of the recipient.
     */

  UserDetails: function (req,user_id) {
    var promise = new Promise(function (resolve, reject) {
      Users.findOne({select:['id','name','email','headline','location','cover_image','profile_image'],where:{id:user_id}})
      .populate('company_id')
      .populate('userOrganizations',{where:{"is_organized":1},sort:"company_name ASC"})
      .populate('usereducations',{select: ['school'],limit:1,sort:{display_status:-1,createdAt:-1}})
      .populate('userexperiences',{select: ['title','location','current_work'],sort:{display_status:-1,current_work:-1},limit:1})
      .populate('userexperiences.company_id',{select: ['company_name'],sort:{display_status:-1,current_work:-1},limit:1})
      .populate('userprojects',{select: ['title'],limit:1,sort:'from_year DESC'})
      .populate('VerifyRequestReceiver',{where:{status:0}})
      .populate('DataRequestReceiver',{where:{ "$or" : [{ 'identification':1 },{ 'educational':1 },{ 'projects':1 },{ 'employment':1 }]}})
      .exec(function (err, userData){

        if(err){
          //console.log(err);
        }
        var last_login_id = user_id;
        if(req.session && req.session.last_login_id){
          last_login_id = req.session.last_login_id;
        }

        CompanyTeamMembers.find({user_id:last_login_id})
        .populate("company_id")
        .populate("company_id.companydata")
        .exec(function(err,_companies){
          Users.findOne({id:last_login_id}).exec(function(err,mainUser){
            var user_ids = [];
            _companies.forEach(function(factor, index){
              if(factor.company_id && factor.company_id.companydata && factor.company_id.companydata.length>0){
                user_ids.push(factor.company_id.companydata[0].id);
              }
            });
            Users.find({id:{"$in":user_ids},status:{"!":"0"}}).populate("company_id").exec(function(err,parentData){
              UserConnection.count({
                "$or" : [
                  {
                    "user_id" : user_id
                  }, 
                  {
                    "to_user_id" : user_id
                  }
                ],
                status:"1"
              })
              .exec(function countCB(error,myConnection) {
                if(typeof userData !='undefined'){
                  Feeds.count({user_id:user_id,type:'B',is_deleted:{ "!" : 1 }}).exec(function countCB(error,myblog) {
                    if(error){
                      //console.log(error);
                    }
                    EarnRewards.find({user_id:user_id,select:['amount']}).exec(function countCB(error,earning) {
                      var my_income =0;
                      if(earning.length>0){
                        earning.forEach(function(factor, index){
                        my_income = my_income+ parseInt(factor.amount);
                      });
                    }
                    if(typeof userData.company_id!='undefined' && typeof userData.company_id.company_name!='undefined'){
                      userData.name = userData.company_id.company_name;
                    }

                    if(typeof userData.company_id!='undefined' && typeof userData.company_id.slug!='undefined'){
                      userData.slug = '/company/'+userData.company_id.slug;
                    }else{
                      if(typeof userData.slug!='undefined' && userData.slug!=''){
                        userData.slug = '/profile/'+userData.slug;
                      }
                    }
                    var userInfo = _.merge(userData, {'connectionCount':myConnection,'blogCount':myblog,"wallet":my_income,"parentUsers":parentData,"mainUser":mainUser,"is_superadmin":_companies});
                      resolve(userInfo);
                    });
                  });
                }else{
                  var userInfo = [];
                  resolve(userInfo);
                }
              });
            });
          });
        });
      });
    });
    return promise;
  },

  UserBasicInfo: function (req,user_id) {
    var promise = new Promise(function (resolve, reject) {
      Users.findOne({select:['id','name','slug','profile_image'],where:{id:user_id}})
      .populate('company_id',{select:['company_name','slug']})
      .populate('userOrganizations',{where:{"is_organized":1},sort:"company_name ASC"})
      .exec(function (err, userData){
        if(err){
        //console.log(err);
        }

        var last_login_id = user_id;
        if(req.session && req.session.last_login_id){
          last_login_id = req.session.last_login_id;
        }

        CompanyTeamMembers.find({user_id:last_login_id})
        .populate("company_id")
        .populate("company_id.companydata")
        .exec(function(err,_companies){
          Users.findOne({id:last_login_id}).exec(function(err,mainUser){
            var user_ids = [];
            _companies.forEach(function(factor, index){
              if(factor.company_id && factor.company_id.companydata && factor.company_id.companydata.length>0){
                user_ids.push(factor.company_id.companydata[0].id);
              }
            });
            Users.find({id:{"$in":user_ids},status:{"!":"0"}}).populate("company_id").exec(function(err,parentData){
              var userInfo = _.merge(userData, {"parentUsers":parentData,"mainUser":mainUser});
              resolve(userInfo);
            });
          });
        });
      });
    });
    return promise;
  },
	
  UserInfoForJobs: function (req,user_id) {
    var promise = new Promise(function (resolve, reject) {
      Users.findOne({select:['id','name','slug','profile_image'],where:{id:user_id}})
      .populate('company_id',{select:['company_name','slug']})
      .populate('userexperiences',{select: ['title','location','current_work'],sort:{display_status:-1,current_work:-1},limit:1})
      .populate('userexperiences.company_id',{select: ['company_name'],sort:{display_status:-1,current_work:-1},limit:1})
      .populate('userOrganizations',{where:{"is_organized":1}})
      .exec(function (err, userData){
        if(err) {
          return resolve({
            status: 'Error',
            message: 'No such user find with this keyword'
          });
        }
        if(typeof userData != 'undefined') {
          var last_login_id = user_id;
          if(req.session && req.session.last_login_id){
            last_login_id = req.session.last_login_id;
          }

          CompanyTeamMembers.find({user_id:last_login_id})
          .populate("company_id")
          .populate("company_id.companydata")
          .exec(function(err,_companies){
            Users.findOne({id:last_login_id}).exec(function(err,mainUser){
              var user_ids = [];
              _companies.forEach(function(factor, index){
                if(factor.company_id && factor.company_id.companydata && factor.company_id.companydata.length>0){
                  user_ids.push(factor.company_id.companydata[0].id);
                }
              });
              Users.find({id:{"$in":user_ids},status:{"!":"0"}}).populate("company_id").exec(function(err,parentData){
                userData.parentUsers = parentData;
                userData.mainUser = mainUser;
                resolve(userData);
              });
            });
          });
        } else {
          return resolve({
            status: 'Error',
            message: 'No such user find with this keyword'
          });
        }
      });
    });
    return promise;
  },

  ForgotPasswordSendOtp: function (req,request_type) {
    return new Promise(function (resolve, reject) {
      var id = req.param("loginid").trim();

      Users.findOne({loginid: id}).exec(function(err, user) {
        if (err) { return resolve({status:'Error','msg':'No such user find with this login ID.'}); }
        if(typeof user != 'undefined' && typeof user.id != 'undefined') {
          UserContactVerifyData.findOne({user_id: user.id}).exec(function (err, verifyData) {
          if (err) { return res.negotiate(err); }
          var now = new Date(),
          start = new Date(now.getTime() - (24 * 60 * 60 * 1000));
          
          UserForgotCode.destroy({ "createdAt" : { "<=": start } }).exec(function (err){
            if (err) { return res.negotiate(err); }
            /* sails.log('Deleted book with `id: 4`, if it existed.');
            return res.ok(); */
          });
          
          var code = '';
          UserForgotCode.findOne({user_id: user.id}).exec(function(err, userCodeFound) {
            ////console.log('userCodeFound -->> ' + userCodeFound.length);
            if(typeof userCodeFound != 'undefined' && typeof userCodeFound.code != 'undefined') {
              code = userCodeFound.code;
            } else {
              var pass_unq = 0;
              do {
                code = RefferalCode.randomStringGen({ length: 6 });
                UserForgotCode.find({code: code}).exec(function(err, foundCode) {
                  if(foundCode.length == 0) {
                    pass_unq = 1;
                  } else {
                    pass_unq = 0; //try gen new code
                  }
                });
              } while (pass_unq > 1);
          
              var _newForgotCode = {
                user_id: user.id,
                code: code
              };
              UserForgotCode.create(_newForgotCode).then(function (_userCode) {
                if(typeof _userCode.id != 'undefined') {
                  /* Activity Log Insert */
                  ActivityLogsService.addActivityLog({
                    owner_id: user.id,
                    module: 'user',
                    action: 'forgot_password_reqest',
                    object_id: _userCode.id,
                    type: request_type
                  });
                }
              });
            }
          
            if(typeof verifyData != 'undefined' && typeof verifyData.email != 'undefined' && verifyData.email != '') {
              /* Send mail function */
              sails.hooks.email.send(
                "testEmail",
                {
                  siteURL: sails.config.appUrl,
                  recipientName: user.name,
                  otpcode: code,
                  recipientEmail: verifyData.email,
                },
                {
                  to: verifyData.email,
                  subject: "Reset your Lynked.World account password"
                },
                function(err) {console.log(err || "It worked!");}
              );

            } else if(typeof verifyData != 'undefined' && typeof verifyData.phone != 'undefined' && verifyData.phone != '') {
              var msg = 'Your OTP for password change to Lynked.World account is : ' + code
              var phone_no = verifyData.dial_code + verifyData.phone
              var messageInfo = '';
              var verify_type = 'forgot_password';

              SmsLogsService.checkSmsLog(user.id,verify_type).then(function(smslimit){
                if(smslimit>=2){
                    return resolve({status: 'OK',OTP: code,message: 'OTP send to change password' })
                }

                twilioSms.sendSMS(verifyData.dial_code,phone_no,msg).then(function(_sentdata){
                  if(_sentdata.status){            
                    messageInfo = {
                      owner_id   : req.user.id,
                      message_id : _sentdata.data.sid,
                      message    : _sentdata.data.body,
                      sendto     : _sentdata.data.to,
                      status     : _sentdata.data.status,
                      sms_type    :'forgot_password'
                    }
                    SmsLogsService.StoreSmsLogs(messageInfo);
                      return resolve({
                        status: 'OK',
                        OTP: code,
                        data:{OTP: code},
                        message: 'OTP send to change password'
                      });
                    }
                  });
                });
              }else{
                //mobile and email not exist
                 return resolve({
                  status: 'Error',
                  message: 'Sorry,You have not contain email and mobile for send OTP<br/>Please contact administrator for change password..!'
                });
              }

              return resolve({
                status: 'OK',
                OTP: code,
                data:{OTP: code},
                message: 'OTP send to change password'
              });
            }); //Code check
          }); //Verify contact find
        } else {
          return resolve({
            status: 'Error',
            message: 'No such user find with this login ID'
          });
        }
      }); //User find
    });
  },
  
  changePasswordWithOtp: function(req,request_type){
    return new Promise(function (resolve, reject) {
      if(req.param("otp-code") != undefined && req.param("otp-code") != ''){
        var code = req.param("otp-code");
		var validator	= require('sails-custom-validation-messages');
        UserForgotCode.findOne({code: code}).exec(function(err, userCode) {
            if(typeof userCode != 'undefined' && typeof userCode.code != 'undefined') {
                if(req.param("password") == req.param("password_confirmation")) {
                    Users.update(userCode.user_id, {
                        password: req.param("password")
                    }).then(function (user) {
                        
                      UserForgotCode.destroy({ code: code }).exec(function (err){
                          if (err) { return resolve({
										status:'Error',
										msg: 'Password not changed'
									  });
						  } 
                      });
                      /* Activity Log Insert */
                      ActivityLogsService.addActivityLog({
                        owner_id: userCode.user_id,
                        module: 'user',
                        action: 'password_change',
                        object_id: userCode.user_id,
                        type: request_type
                      });
                      return resolve({
                        status:'OK',
                        msg: 'Password change successfully!',
                        data : {}
                      });
                    }).catch(function (err) {
						error = validator(Users, err);
                        console.log("456 err -->>> ", error);
                        console.log("456 Line -->> ", error.invalidAttributes);
						return resolve({
							status:'Error',
							msg: error.invalidAttributes
						});
                    });
                } else {
                  return resolve({
                    status:'Error',
                    msg: 'Password not match confirm password'
                  });
                }
            } else {
              return resolve({
                status:'Error',
                msg: 'OTP is not valid'
              });
            }
            /* return resolve({
              status: 'OK',
              OTP: code,
              data: {OTP: code},
              msg:'Your password changed successfully'
            }); */
        });
      } else {
        if(req.param("password") == req.param("password_confirmation")) {                    
          Users.update({id:req.param("user_id")}, {password: req.param("password")}).exec(function (err,user) { 
            if(err){
              return resolve({
                status:'Error',
                msg: 'No user found contact admin'
              });
            } else {
              ActivityLogsService.addActivityLog({
                owner_id: req.param("user_id"),
                module: 'user',
                action: 'password_change',
                object_id: req.param("user_id"),
                type: request_type
              });
              return resolve({
                status:'OK',
                msg: 'Password change successfully!'
              });
            }
          })
        } else {
          return resolve({
            status:'Error',
            msg: 'Password not match confirm password'
          });
        }
      }
    });
  },
  
  UserDetailsForGetVerify: function (req,user_id) {
    var promise = new Promise(function (resolve, reject) {
      Users.findOne({where:{id:user_id}})
      .populate('company_id',{select:['company_name','slug']})
      .populate('VerifyRequestReceiver',{where:{status:0}})
      .populate('userOrganizations',{where:{"is_organized":1},sort:"company_name ASC"})
      .populate('DataRequestReceiver',{where:{ "$or" : [{ 'identification':1 },{ 'educational':1 },{ 'projects':1 },{ 'employment':1 }]}})
      .exec(function (err, userData){

        var last_login_id = user_id;
        if(req.session && req.session.last_login_id){
          last_login_id = req.session.last_login_id;
        }

        CompanyTeamMembers.find({user_id:last_login_id})
        .populate("company_id")
        .populate("company_id.companydata")
        .exec(function(err,_companies){
          Users.findOne({id:last_login_id}).exec(function(err,mainUser){
            var user_ids = [];
            _companies.forEach(function(factor, index){
              if(factor.company_id && factor.company_id.companydata && factor.company_id.companydata.length>0){
                user_ids.push(factor.company_id.companydata[0].id);
              }
            });
            Users.find({id:{"$in":user_ids},status:{"!":"0"}}).populate("company_id").exec(function(err,parentData){

              if(typeof userData.company_id!='undefined' && typeof userData.company_id.company_name!='undefined'){
                userData.name = userData.company_id.company_name;
              }

              if(typeof userData.company_id!='undefined' && typeof userData.company_id.slug!='undefined'){
                userData.slug = '/company/'+userData.company_id.slug;
              }else{
                if(typeof userData.slug!='undefined' && userData.slug!=''){
                  userData.slug = '/profile/'+userData.slug;
                }
              }
              userData.parentUsers = parentData;
              userData.mainUser = mainUser;
              if(err){
                //console.log(err);
              }
              resolve(userData);
            });
          });
        });
      });
    });
    return promise;
  },

  CreateEducation:function(req,user_id,request_type){
    return new Promise(function (resolve, reject) {
      var to_year     = (typeof req.param("to_year")!='undefined') ? req.param("to_year").trim() : "";
      var school      = (typeof req.param("school")!='undefined') ? req.param("school").trim() : "";
      var degree      = (typeof req.param("degree")!='undefined') ? req.param("degree").trim() : "";
      var study_field = (typeof req.param("study_field")!='undefined') ? req.param("study_field").trim() : "";
      var degree_type = (typeof req.param("degree_type")!='undefined') ? req.param("degree_type").trim() : "";
      var from_year   = (typeof req.param("from_year")!='undefined') ? req.param("from_year").trim() : "";
      var description = (typeof req.param("description")!='undefined') ? req.param("description").trim() : "";

      var eduinfo = {
        user_id: user_id,
        school: school,
        degree: degree,
        study_field: study_field,
        degree_type: degree_type,
        description: description,
        from_year: from_year,
        to_year: to_year
      };

      if(school==''){
          resolve({
              status: 'Error',
              msg : 'School name is require'
          });
      }
      if(degree==''){
          resolve({
              status: 'Error',
              msg : 'Degree name is require'
            });
      }
      if(from_year==''){
          resolve({
              status: 'Error',
              msg : 'Starting Year is require'
            });
      }

      var validator = require('sails-custom-validation-messages');
      UserEducations.count({user_id:user_id}).exec(function countCB(error, found) {
        if(found==0){
          eduinfo.display_status=1
        }
        UserEducations.create(eduinfo).exec(function (err, _education){            
          if(!err) {
            if(typeof _education.id != 'undefined') {
              /* Activity Log Insert */
              ActivityLogsService.addActivityLog({
                  owner_id: user_id,
                  module: 'profile_education',
                  action: 'create',
                  object_id: _education.id,
                  type: request_type
                });
                Doctype.findOne({title: 'Others', type: 'education'}).exec(function (err, doc_type) {
                  if(err) {
                    resolve({
                      users: eduinfo,
                      status: 'Error',
                      msg : 'No education added! Please try again.'
                    });
                  }
                  var _newVerifyData = {
                    user_id: user_id,
                    doc_type_id: doc_type.id,
                    doc_id: '',
                    edu_id: _education.id,
                    comment: '',
                    tab_type: 'education',
                    doc_hash: ''
                  }
                  
                  var uploadPath = process.cwd() + "/.tmp/public/uploads/docs/education/" + user_id;
                  var real_uploadPath = process.cwd() + "/assets/uploads/docs/education/" + user_id;
                  if (!fs.existsSync(uploadPath)) {
                    fs.mkdir(uploadPath, function (err) {
                      if (err) { console.log('failed to create directory', err);
                      } else { }
                    });
                  }
                  if (!fs.existsSync(real_uploadPath)) {
                    fs.mkdir(real_uploadPath, function (err) {
                      if (err) { console.log('failed to create directory', err);
                      } else { }
                    });
                  } 
                  req.file('doc_file').upload({
                    dirname: path.resolve(sails.config.appPath, uploadPath)
                  },function (err, uploadedFiles) {
                    if(err){
                      console.log(err)
                    }else if(uploadedFiles.length==0){
                      UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
                        UserEducations.findOne({id:_education.id})
                        .populate('educationdocs',{select:['createdAt'],sort:{createdAt:1}})
                        .populate('educationdocs.verify_request_id',{select:['tab_type'],sort:{createdAt:1},limit:2})
                        .populate('educationdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2}).exec(function(err,educations_data){
                          resolve({
                            education: _education,
                            status: 'OK',
                            data : educations_data,
                            msg:'Education add successfully' 
                          });
                        });
                      });
                    }else{
                      var fd = uploadedFiles[0].fd;
                      var myarr = fd.split("\\");
                      var filename = path.basename(myarr[myarr.length-1]);
                      /* Copy .tmp to upload folder*/
                      fs.readFile(fd, function (err, data) {
                        fs.writeFile(sails.config.appPath + '/assets/uploads/docs/education/'+ user_id + '/' + filename, data, function (err) {

                        });
                      });
                      _newVerifyData.doc_url = filename;
                      _newVerifyData.doc_id = 'DOC1201';
                      
                      UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
                        console.log('_education.id');
                        console.log({id:_education.id});
                        UserEducations.findOne({id:_education.id})
                          .populate('educationdocs',{select:['createdAt'],sort:{createdAt:1}})
                          .populate('educationdocs.verify_request_id',{select:['tab_type'],sort:{createdAt:1},limit:2})
                          .populate('educationdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2}).exec(function(err,educations_data){
                            console.log('educations_data');
                            console.log(educations_data);
                            resolve({
                              education: _education,
                              status: 'OK',
                              data : educations_data,
                              msg:'Education add successfully' 
                            });
                        });
                      });
                    }
                  });
                });
              } else {
                resolve({
                  users: eduinfo,
                  status: 'Error',
                  msg : 'No education added! Please try again.' });
              }
            } else {
              err = validator(UserEducations, err);
              resolve({
                users: eduinfo,
                status: 'Error',
                statusDescription: err,
                error:err,
                msg : 'Invalid argument!' });
            }
        });
      });
    });
  },

  UpdateEducation: function(req, user_id,request_type) {
    return new Promise(function (resolve, reject) {
      var school_name = (typeof req.param("school")!='undefined') ? req.param("school").trim() : "";
      var to_year     = (typeof req.param("to_year")!='undefined') ? req.param("to_year").trim() : "";
      var degree      = (typeof req.param("degree")!='undefined') ? req.param("degree").trim() : "";
      var study_field = (typeof req.param("study_field")!='undefined') ? req.param("study_field").trim() : "";
      var degree_type = (typeof req.param("degree_type")!='undefined') ? req.param("degree_type").trim() : "";
      var from_year   = (typeof req.param("from_year")!='undefined') ? req.param("from_year").trim() : "";
      var description = (typeof req.param("description")!='undefined') ? req.param("description").trim() : "";
      var old_string  = (typeof req.param("old_edu_string")!='undefined') ? req.param("old_edu_string") : "";

      var eduinfo = {
          school  : school_name,
          degree  : degree,
          study_field: study_field,
          degree_type: degree_type,
          description:description,
          from_year: from_year,
          to_year: to_year
      };


      if(school_name==''){
          resolve({
              status: 'Error',
              msg : 'School name is require'
          });
      }
      if(degree==''){
          resolve({
              status: 'Error',
              msg : 'Degree name is require'
            });
      }
      if(from_year==''){
          resolve({
              status: 'Error',
              msg : 'Starting Year is require'
            });
      }
      
      var new_string = '';
          new_string=school_name+'-'+degree+'-'+study_field+'-'+degree_type+'-'+from_year+'-'+to_year+'-'+description;
      
      //console.log('OLD====',old_string);
      //console.log('NEW====',new_string);

      UserEducations.findOne({id:req.param("id"), user_id:user_id}).exec(function countCB(error, edu_exist) {
        if(typeof edu_exist == 'undefined') {
          resolve({
              status: 'Error',
              title: 'Record not exist',
              msg:'Record not exist'
          });
        } else {
			if(old_string!=''){
			  if(new_string!=old_string){
				//verification Request data has been lost
				var statusArr = [1,2];
				UserVerifyData.find({select:['id']}).where({edu_id: edu_exist.id}).then(function (userverifydatas) {
				  var userverifydata_ids = [];
				  _.each(userverifydatas, function (userverifydata) {
					userverifydata_ids.push(userverifydata.id);
				  });
				  
				  UserVerifyDataRequest.destroy({verify_id:userverifydata_ids,status:{'$in': statusArr}}).exec(function (err){
					if (err) {
					  resolve({
						status: 'Error',
						msg:'Education not delete. Please try again'
					  });
					}
				  });
				}); 
			  }
			}

			UserEducations.update({'id':req.param("id"), user_id: user_id},eduinfo).then(function (_education) {
				//console.log("Education update");
				if(typeof req.param("id") != 'undefined') {
				  /* Activity Log Insert */
				  ActivityLogsService.addActivityLog({
					  owner_id: user_id,
					  module: 'profile_education',
					  action: 'update',
					  object_id: req.param("id"),
					  type: request_type
				  });
		  
				  var uploadPath = process.cwd() + "/.tmp/public/uploads/docs/education/" + user_id;
				  var real_uploadPath = process.cwd() + "/assets/uploads/docs/education/" + user_id;
				  if (!fs.existsSync(uploadPath)) {
					fs.mkdir(uploadPath, function (err) {
					  if (err) { console.log('failed to create directory', err);
					  } else { }
					});
				  }
				  if (!fs.existsSync(real_uploadPath)) {
					fs.mkdir(real_uploadPath, function (err) {
					  if (err) { console.log('failed to create directory', err);
					  } else { }
					});
				  }
				  req.file('doc_file').upload({
					dirname: path.resolve(sails.config.appPath, uploadPath)
				  },function (err, uploadedFiles) {
					if(err){
					  console.log(err);
					}
					else if(uploadedFiles.length==0){
					  if(req.param("del_doc") == '1') {
						var _newVerifyData = { doc_url : '' };

						UserVerifyData.update({edu_id:req.param("id")}, _newVerifyData).exec(function(err, _verifyData) {
						});
					  }
					}else{

					  var fd = uploadedFiles[0].fd;
					  var myarr = fd.split("\\");
					  var filename = path.basename(myarr[myarr.length-1]);
					  /* Copy .tmp to upload folder*/
					  fs.readFile(fd, function (err, data) {
						fs.writeFile(sails.config.appPath + '/assets/uploads/docs/education/'+ user_id + '/' + filename, data, function (err) {

						});
					  });
					  var _newVerifyData = { doc_url : filename }
					  UserVerifyData.update({edu_id:req.param("id")}, _newVerifyData).exec(function(err, _verifyData) {
					  });
					}
				  });
				}

				UserEducations.findOne({id:req.param("id")})
					.populate('educationdocs',{select:['createdAt'],sort:{createdAt:1}})
					.populate('educationdocs.verify_request_id',{select:['tab_type'],sort:{createdAt:1},limit:2})
					.populate('educationdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2}).exec(function(err,educations_data){
							 
				resolve({
					education: _education,
					status: 'OK',
					data : educations_data,
					msg:'Education update successfully' });
				  });
			}).catch(function (error) { 
			  resolve({
				users: eduinfo,
				status: 'Error',
				statusDescription: error,
				title: 'Add a new User',
				msg: 'Invalid argument!' });
			});
		}
      });
    });
  },
  
  deleteEducation: function(req, user_id,request_type) {
    return new Promise(function (resolve, reject) {
      var id = req.param("id");
      UserEducations.destroy({id:id, user_id:user_id}).exec(function (err){
        if (err) {
          resolve({
            status: 'Error',
            msg:'Education not delete. Please try again'
          });
        }
        UserVerifyData.find({select:['id']}).where({edu_id: id, user_id:user_id}).then(function (userverifydatas) {
          var userverifydata_ids = [];
          _.each(userverifydatas, function (userverifydata) {
            userverifydata_ids.push(userverifydata.id);
          });
          UserVerifyData.destroy({edu_id:id, user_id:user_id}).exec(function (err){
            if (err) {
              resolve({
                status: 'Error',
                msg:'Education not delete. Please try again'
              });
            }
            UserVerifyDataRequest.destroy({verify_id:userverifydata_ids}).exec(function (err){
              if (err) {
                resolve({
                  status: 'Error',
                  msg:'Education not delete. Please try again'
                });
              }
              resolve({
                status: 'OK',
                msg:'Education delete successfully'
              });
            });
          });
        });
      });
    });
	},
    
	//Manage Experience data 
  CreateExperience: function(req, user_id,request_type) {
    return new Promise(function (resolve, reject) {
      var tab_type = 'experience';
      var work_status = 0;
      if(req.param("current_work")){
          work_status = req.param("current_work");
      }
		  var company_id = req.param("company_id");

      CompanyService.addCompany(company_id).then(function(companyID){
            //console.log("company-------------------ID================"+companyID);
        if(companyID) {
          var to_year = (typeof req.param("to_year")!='undefined') ? req.param("to_year") : "";
          var to_month = (typeof req.param("to_month")!='undefined') ? req.param("to_month") : "";
          var _newExperience = {
            user_id     : user_id,
            title       : req.param("title"),
            location    : req.param("location"),
            description : req.param("description"),
            current_work: work_status,
            from_month  : req.param("from_month"),
            from_year   : req.param("from_year"),
            to_year     : to_year,
            to_month    : to_month,
          };
          if(companyID && companyID!='') {
            _newExperience.company_id = companyID;
          }

          UserExperiences.count({user_id:user_id}).exec(function countCB(error, found) {
            if(found==0){
              _newExperience.display_status=1
            }
            
            UserExperiences.create(_newExperience).exec(function (err, _exp) {
              if(err){
                resolve({
                  status: 'Error',statusDescription: error,title: 'Add a new Experience Error',msg : 'Add a new Experience Error'
                });
              }

              if(typeof _exp != 'undefined' && typeof _exp.id != 'undefined') {
                /* Activity Log Insert */
                ActivityLogsService.addActivityLog({
                  owner_id: user_id,
                  module: 'profile_experience',
                  action: 'create',
                  object_id: _exp.id,
                  type: request_type
                });
                
                Doctype.findOne({title: 'Others', type: tab_type}).exec(function (err, doc_type) {
                  if(err) {
                    resolve({
                      status: 'Error',
                      error: 'experience add fail! Please try again.',
                      msg: 'experience added fail! Please try again.'
                    });
                  }
                  var _newVerifyData = {
                    user_id: user_id,
                    doc_type_id: doc_type.id,
                    doc_id: '',
                    exp_id: _exp.id,
                    comment: '',
                    tab_type: tab_type,
                    doc_hash: ''
                  }
                  UserVerifyData.find({"doc_id":{"$exists" : true, "$ne" : ""},select: ['doc_id']}).sort('createdAt DESC').limit(1).exec(function (err, forDocIds) {
                  if (err) {
                    console.log('error in save verification')
                  }

                  var uploadPath = process.cwd() + "/.tmp/public/uploads/docs/" + tab_type + "/" + user_id;
                  var real_uploadPath = process.cwd() + "/assets/uploads/docs/" + tab_type + "/" + user_id;
                  if (!fs.existsSync(uploadPath)) {
                    fs.mkdir(uploadPath, function (err) {
                      if (err) { console.log('failed to create directory', err);
                      } else { }
                    });
                  }
                  if (!fs.existsSync(real_uploadPath)) {
                    fs.mkdir(real_uploadPath, function (err) {
                      if (err) { console.log('failed to create directory', err);
                      } else { }
                    });
                  }
                  /* console.log("uploadPath -->> ", uploadPath);
                  console.log("real_uploadPath -->> ", real_uploadPath); */
                  req.file('doc_file').upload({
                    dirname: path.resolve(sails.config.appPath, uploadPath)
                  },function (err, uploadedFiles) {

                    if(err){
                      console.log(err);
                    }
                    else if(uploadedFiles.length==0){
                      UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
                        if(companyID && companyID!='') {
                          //add follow data
                          FollowService.Follow({user_id: user_id,company_id:companyID});
                        }
                        UserExperiences.findOne({id: _exp.id})
                          .populate('company_id',{select:['company_name'],sort:{from_year:-1,current_work:-1}})
                          .populate('experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
                          .populate('experiencedocs.verify_request_id',{select:['tab_type'],sort:{createdAt:1},limit:2})
                          .populate('experiencedocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
                          .exec(function(err,UserExperiencesData){

                            resolve({
                              experience: _exp,
                              status: 'OK',
                              data : UserExperiencesData,
                              msg:'Experience add successfully'
                            });
                          });
                        })
                    } else {
                      var fd = uploadedFiles[0].fd;
                      var myarr = fd.split("\\");
                      var filename = path.basename(myarr[myarr.length-1]);
                      /* Copy .tmp to upload folder*/
                      fs.readFile(fd, function (err, data) {
                        fs.writeFile(sails.config.appPath + '/assets/uploads/docs/' + tab_type + '/'+ user_id + '/' + filename, data, function (err) {

                        });
                      });
                      
                      var doc_id='';
                      if (forDocIds.length > 0 && forDocIds[0].doc_id != '') {
                        doc_id = forDocIds[0].doc_id
                        upload_doc_id = doc_id.slice(3, doc_id.length);
                        upload_doc_id = parseInt(upload_doc_id)+parseInt(1);
                        doc_id = 'DOC' + parseInt(upload_doc_id);
                      } else {
                        doc_id = 'DOC1201';
                      }
                      _newVerifyData.doc_url = filename;
                      _newVerifyData.doc_id = doc_id;

                      UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
                        if(companyID && companyID!='') {
                          //add follow data
                          FollowService.Follow({user_id: user_id,company_id:companyID});
                        }
                        UserExperiences.findOne({id: _exp.id})
                          .populate('company_id',{select:['company_name'],sort:{from_year:-1,current_work:-1}})
                          .populate('experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
                          .populate('experiencedocs.verify_request_id',{select:['tab_type'],sort:{createdAt:1},limit:2})
                          .populate('experiencedocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
                          .exec(function(err,UserExperiencesData){
                            resolve({
                              experience: _exp,
                              status: 'OK',
                              data : UserExperiencesData,
                              msg:'Experience add successfully'
                            });
                        });
                      });
                    }
                  });
                });
              });
            } else {
              resolve({
                status: 'Error', error: 'Add a new Experience Error',msg : 'Add a new Experience Error'
              });
            }
          });
        });
      } else {
        resolve({
            status: 'Error',
            title: 'Add a new Company Error',
            msg :  'Add a new Company Error'
          });
        }
      });
    });
  },
  
  updateExperience: function(req, user_id,request_type) {
    return new Promise(function (resolve, reject) {
      //console.log("Update Experience..............req.params = " + JSON.stringify(req.params.all()));
      var tab_type = "experience";
      var work_status     = 0;
      if(req.param("current_work")){
          work_status=req.param("current_work");
      }
      
      var company_id=req.param("company_id");
      CompanyService.addCompany(company_id).then(function(companyID){
          if(companyID){
            var to_year = (typeof req.param("to_year")!='undefined') ? req.param("to_year") : "";
            var to_month = (typeof req.param("to_month")!='undefined') ? req.param("to_month") : "";

            var title       = (typeof req.param("title")!='undefined') ? req.param("title").trim() : "";
            var location    = (typeof req.param("location")!='undefined') ? req.param("location").trim() : "";
            var from_month  = (typeof req.param("from_month")!='undefined') ? req.param("from_month").trim() : "";
            var from_year   = (typeof req.param("from_year")!='undefined') ? req.param("from_year").trim() : "";
            var description = (typeof req.param("description")!='undefined') ? req.param("description").trim() : "";
            
            var old_string  = (typeof req.param("old_exp_string")!='undefined') ? req.param("old_exp_string") : "";


            var new_string = '';
            new_string = title+'-'+companyID+'-'+location+'-'+from_month+'-'+from_year+'-'+to_month+'-'+to_year+'-'+work_status+'-'+description;

              //console.log('OLD====',old_string);
              //console.log('NEW====',new_string);

            var _newExperience = {
              title       : title,
              location    : location,
              description : description,
              current_work: work_status,
              from_month  : from_month,
              from_year   : from_year,
              to_year     : to_year,
              to_month    : to_month,
            };

            if(companyID && companyID!='') {
              _newExperience.company_id = companyID;
            }
          
              
          UserExperiences.findOne({id:req.param("id"),user_id:user_id}).exec(function countCB(error, found) {
            if(typeof found == 'undefined'){
				resolve({
                    status: 'Error',
                    title: 'Record not exist',
                    msg: 'Record not exist'
                });
            } else {
				console.log('1 error --->> ', JSON.stringify(error));
				console.log('1 found --->> ', JSON.stringify(found));

				if(old_string!=''){
				  if(new_string!=old_string){
					//verification Request data has been lost

					var statusArr = [1,2];
					UserVerifyData.find({select:['id']}).where({exp_id:req.param("id")}).then(function (userverifydatas) {
					  var userverifydata_ids = [];
					  _.each(userverifydatas, function (userverifydata) {
						userverifydata_ids.push(userverifydata.id);
					  });
					  
					  UserVerifyDataRequest.destroy({verify_id:userverifydata_ids,status:{'$in': statusArr}}).exec(function (err){
						if (err) {
						  resolve({
							status: 'Error',
							msg:'Experience not delete. Please try again'
						  });
						}
					  });
					}); 
				  }
				}

				UserExperiences.update({'id':req.param("id"), user_id: user_id},_newExperience).then(function (_exp) {
				  if(typeof req.param("id") != 'undefined') {
					  /* Activity Log Insert */
					ActivityLogsService.addActivityLog({
					  owner_id: user_id,
					  module: 'profile_experience',
					  action: 'update',
					  object_id: req.param("id"),
					  type: request_type
					});
		  
					UserVerifyData.findOne({"exp_id":req.param("id"), select: ['doc_id']}).exec(function (err, eduDocId) {
					  if (err) {
						console.log('error in save docids')
					  }
					  UserVerifyData.find({"doc_id":{"$exists" : true, "$ne" : ""},select: ['doc_id']}).sort('createdAt DESC').limit(1).exec(function (err, forDocIds) {
						if (err) {
						  console.log('error in save docids')
						}

						var uploadPath = process.cwd() + "/.tmp/public/uploads/docs/" + tab_type + "/" + user_id;
						var real_uploadPath = process.cwd() + "/assets/uploads/docs/" + tab_type + "/" + user_id;
						if (!fs.existsSync(uploadPath)) {
						  fs.mkdir(uploadPath, function (err) {
							if (err) { console.log('failed to create directory', err);
							} else { }
						  });
						}
						if (!fs.existsSync(real_uploadPath)) {
						  fs.mkdir(real_uploadPath, function (err) {
							if (err) { console.log('failed to create directory', err);
							} else { }
						  });
						}

						req.file('doc_file').upload({
						  dirname: path.resolve(sails.config.appPath, uploadPath)
						},function (err, uploadedFiles) {

						  if(err){
							console.log(err);
						  }else if(uploadedFiles.length==0){
							if(req.param("del_doc") == '1') {
							  var _newVerifyData = { doc_url : '', doc_id: '' }
							  UserVerifyData.update({exp_id:req.param("id")}, _newVerifyData).exec(function(err, _verifyData) {
							  });
							}
						  }else{
							var fd = uploadedFiles[0].fd;
							var myarr = fd.split("\\");
							var filename = path.basename(myarr[myarr.length-1]);
							/* Copy .tmp to upload folder*/
							fs.readFile(fd, function (err, data) {
							  fs.writeFile(sails.config.appPath + '/assets/uploads/docs/' + tab_type + '/'+ user_id + '/' + filename, data, function (err) {

							  });
							});
							
							var doc_id='';
							if (typeof eduDocId != 'undefined' && typeof eduDocId.doc_id != 'undefined' && eduDocId.doc_id != '') {
							  doc_id = eduDocId.doc_id;
							} else if (forDocIds.length > 0 && forDocIds[0].doc_id != '') {
							  doc_id = forDocIds[0].doc_id
							  upload_doc_id = doc_id.slice(3, doc_id.length);
							  upload_doc_id = parseInt(upload_doc_id)+parseInt(1);
							  doc_id = 'DOC' + parseInt(upload_doc_id);
							} else {
							  doc_id = 'DOC1201';
							}
							  var _newVerifyData = {
								  doc_url : filename,
								  doc_id: doc_id
							  }
							  UserVerifyData.update({exp_id:req.param("id")}, _newVerifyData).exec(function(err, _verifyData) {
							});
						  }
						});
					  });
					});
				  }
				  
				  if(companyID && companyID!='') {
					//add follow data
					FollowService.Follow({
						user_id: user_id,
						company_id:companyID
					});
				  }
				  UserExperiences.findOne({id: req.param("id")})
				  .populate('company_id',{select:['company_name'],sort:{from_year:-1,current_work:-1}})
				  .populate('experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
				  .populate('experiencedocs.verify_request_id',{select:['tab_type'],sort:{createdAt:1},limit:2})
				  .populate('experiencedocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
				  .exec(function(err,UserExperiencesData){
					resolve({
					  project: _exp,
					  status: 'OK',
					  data : UserExperiencesData,
					  msg:'Experience update successfully'
					});
				  });
				}).catch(function (error) {
					//console.log("Validation MESSAGE .............." + JSON.stringify(error.Errors));
				  resolve({
					project: _newExperience,
					status: 'Error',
					statusDescription: error,
					title: 'Update Experience Error',
					msg: 'Update Experience Error'
				  });
				});
			}
          });
        }else{
          resolve({
            status: 'Error',
            title: 'Update ID Company Error',
            msg: 'Update ID Company Error'
          });
        }
      });
    });
  },
  
  deleteExperience: function(req, user_id,request_type) {
    return new Promise(function (resolve, reject) {
      var id = req.param("id");
      UserExperiences.destroy({id:id, user_id:user_id}).exec(function (err){
        if (err) {
          return resolve({
            status: 'Error',
            msg:'Experience not delete. Please try again'
          });
        }
        UserVerifyData.find({select:['id']}).where({exp_id: id}).then(function (userverifydatas) {
          var userverifydata_ids = [];
          _.each(userverifydatas, function (userverifydata) {
            userverifydata_ids.push(userverifydata.id);
          });
          UserVerifyData.destroy({exp_id:id}).exec(function (err){
            if (err) {
              return resolve({
                status: 'Error',
                msg:'Experience not delete. Please try again'
              });
            }
            UserVerifyDataRequest.destroy({verify_id:userverifydata_ids}).exec(function (err){
              if (err) {
                return resolve({
                  status: 'Error',
                  msg:'Experience not delete. Please try again'
                });
              }
              return resolve({
                status: 'OK',
                msg:'Experience delete successfully'
              });
            });
          });
        });
      });
    });
	},
  
  CreateProject: function(req, user_id,request_type) {
    var promise		= new Promise(function (resolve, reject) {
    var tab_type	= 'project';
    var company_id	= req.param("company_id");
	console.log("company ID out -->>  "+company_id);
    CompanyService.addCompany(company_id).then(function(companyID){
        console.log("company ID -->>  "+companyID);
		var to_year = (typeof req.param("to_year")!='undefined') ? req.param("to_year") : "";
		var to_month = (typeof req.param("to_month")!='undefined') ? req.param("to_month") : "";

		var _newProject = {
			user_id     : user_id,
			title       : req.param("title"),
			project_url : req.param("project_url"),
			location    : req.param("location"),
			description : req.param("description"),
			from_month  : req.param("from_month"),
			from_year   : req.param("from_year"),
			to_year     : to_year,
			to_month    : to_month,
		};

		if (companyID && companyID!='') {
			_newProject.company_id = companyID;
		}

		UserProjects.create(_newProject).then(function (_project) {
            console.log("Project created: " + JSON.stringify(_project));
            if(typeof _project.id != 'undefined') {
              /* Activity Log Insert */
              ActivityLogsService.addActivityLog({
                owner_id: user_id,
                module: 'profile_project',
                action: 'create',
                object_id: _project.id,
                type: request_type
              });
            }
            Doctype.findOne({title: 'Others', type: tab_type}).exec(function (err, doc_type) {
                if(err) {
                  resolve({
                    users: _project,
                    status: 'Error',
                    error: 'No project added! Please try again.'
                  });
                }
                var _newVerifyData = {
                    user_id: user_id,
                    doc_type_id: doc_type.id,
                    doc_id: '',
                    project_id: _project.id,
                    comment: '',
                    tab_type: tab_type,
                    doc_hash: ''
                }
                UserVerifyData.find({"doc_id":{"$exists" : true, "$ne" : ""},select: ['doc_id']}).sort('createdAt DESC').limit(1).exec(function (err, forDocIds) {
                  if (err) {
                    console.log('error in save verification')
                  }

                  var uploadPath = process.cwd() + "/.tmp/public/uploads/docs/" + tab_type + "/" + user_id;
                  var real_uploadPath = process.cwd() + "/assets/uploads/docs/" + tab_type + "/" + user_id;
                  if (!fs.existsSync(uploadPath)) {
                    fs.mkdir(uploadPath, function (err) {
                      if (err) { console.log('failed to create directory', err);
                      } else { }
                    });
                  }
                  if (!fs.existsSync(real_uploadPath)) {
                    fs.mkdir(real_uploadPath, function (err) {
                      if (err) { console.log('failed to create directory', err);
                      } else { }
                    });
                  }
                  /* console.log("uploadPath -->> ", uploadPath);
                  console.log("real_uploadPath -->> ", real_uploadPath); */
                  req.file('doc_file').upload({
                    dirname: path.resolve(sails.config.appPath, uploadPath)
                  },function (err, uploadedFiles) {

                    if(err){
                      console.log(JSON.stringify(err));
                    }else if(uploadedFiles.length==0){
                      UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
                        UserProjects.findOne({id:_project.id})
                        .populate('company_id',{select:['company_name'],sort:{from_year:-1,createdAt:-1}})
                        .populate('projectdocs',{select:['createdAt'],sort:{from_year:-1,createdAt:-1}})
                        .populate('projectdocs.verify_request_id',{select:['tab_type'],sort:{from_year:-1,createdAt:-1},limit:2})
                        .populate('projectdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{from_year:-1,createdAt:-1},limit:2})
                        .exec(function(err,Project_data){ 
                          resolve({
                            project: _project,
                            status: 'OK',
                            data : Project_data,
                            msg:'Project has been added successfully'
                          });
                        });
                      });
                    }else{
                      var fd = uploadedFiles[0].fd;
                      var myarr = fd.split("\\");
                      var filename = path.basename(myarr[myarr.length-1]);
                      /* Copy .tmp to upload folder*/
                      fs.readFile(fd, function (err, data) {
                        fs.writeFile(sails.config.appPath + '/assets/uploads/docs/' + tab_type + '/'+ user_id + '/' + filename, data, function (err) {

                        });
                      });
                      
                      var doc_id='';
                      if (forDocIds.length > 0 && forDocIds[0].doc_id != '') {
                        doc_id = forDocIds[0].doc_id
                        upload_doc_id = doc_id.slice(3, doc_id.length);
                        upload_doc_id = parseInt(upload_doc_id)+parseInt(1);
                        doc_id = 'DOC' + parseInt(upload_doc_id);
                      } else {
                        doc_id = 'DOC1201';
                      }
                      _newVerifyData.doc_url = filename;
                      _newVerifyData.doc_id = doc_id;

                      UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
                        UserProjects.findOne({id:_project.id})
                        .populate('company_id',{select:['company_name'],sort:{from_year:-1,createdAt:-1}})
                        .populate('projectdocs',{select:['createdAt'],sort:{from_year:-1,createdAt:-1}})
                        .populate('projectdocs.verify_request_id',{select:['tab_type'],sort:{from_year:-1,createdAt:-1},limit:2})
                        .populate('projectdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{from_year:-1,createdAt:-1},limit:2})
                        .exec(function(err,Project_data){ 
                          resolve({
                            project: _project,
                            status: 'OK',
                            data : Project_data,
                            msg:'Project has been added successfully'
                          });
                        });
                      });
                    }
                  });
                });
              });
		}).catch(function (error) {
			resolve({
				project: _project,
				status: 'Error',
				statusDescription: error,
				title: 'Add a new Project'
			});
		});
      });
    });
    return promise;
  },

  updateProject: function(req, user_id,request_type) {
    var promise = new Promise(function (resolve, reject) {

      var tab_type = "project";
      var company_id= req.param("company_id") != undefined ? req.param("company_id")  : '';

      CompanyService.addCompany(company_id).then(function(companyID){
          //if(companyID){
          var to_year     = (typeof req.param("to_year")!='undefined') ? req.param("to_year") : "";
          var to_month    = (typeof req.param("to_month")!='undefined') ? req.param("to_month") : "";
          var title       = (typeof req.param("title")!='undefined') ? req.param("title").trim() : "";
          var project_url = (typeof req.param("project_url")!='undefined') ? req.param("project_url").trim() : "";
          var location    = (typeof req.param("location")!='undefined') ? req.param("location").trim() : "";
          var from_month  = (typeof req.param("from_month")!='undefined') ? req.param("from_month").trim() : "";
          var from_year   = (typeof req.param("from_year")!='undefined') ? req.param("from_year").trim() : "";
          var description = (typeof req.param("description")!='undefined') ? req.param("description").trim() : "";
          
          var old_string  = (typeof req.param("old_project_string")!='undefined') ? req.param("old_project_string") : "";

          var projectinfo = {
            title       : title,
            location    : location,
            project_url : project_url,
            description : description,
            from_month  : from_month,
            from_year   : from_year,
            to_year     : to_year,
            to_month    : to_month,
          };
                
          if (companyID) {
                projectinfo.company_id = companyID;
          }

          UserProjects.count({id:req.param("id"), user_id:user_id}).exec(function countCB(error, found) {
            if(typeof found == 'undefined') {
              resolve({
                status: 'Error',
                title: 'Record not exist',
                msg:'Record not exist',
              });
            } else {

				var new_string = '';
					new_string = title+'-'+project_url+'-'+companyID+'-'+location+'-'+from_month+'-'+from_year+'-'+to_month+'-'+to_year+'-'+description;

				//console.log('OLD====',old_string);
				//console.log('NEW====',new_string);

				if(old_string!=''){
				  if(new_string!=old_string){
					//verification Request data has been lost

					var statusArr = [1,2];
					UserVerifyData.find({select:['id']}).where({project_id:req.param("id")}).then(function (userverifydatas) {
					  var userverifydata_ids = [];
					  _.each(userverifydatas, function (userverifydata) {
						userverifydata_ids.push(userverifydata.id);
					  });
					  
					  UserVerifyDataRequest.destroy({verify_id:userverifydata_ids,status:{'$in': statusArr}}).exec(function (err){
						if (err) {
						  resolve({
							status: 'Error',
							msg:'Project not delete. Please try again'
						  });
						}
					  });
					}); 
				  }
				}

				UserProjects.update({'id':req.param("id"), user_id: user_id},projectinfo).then(function (_project) {
				  if(typeof req.param("id") != 'undefined') {
					/* Activity Log Insert */
					ActivityLogsService.addActivityLog({
					  owner_id: user_id,
					  module: 'profile_project',
					  action: 'update',
					  object_id: req.param("id"),
					  type: request_type
					});
		  
					UserVerifyData.findOne({"project_id":req.param("id"), select: ['doc_id']}).exec(function (err, eduDocId) {
					  if (err) {
						console.log('error in save docids')
					  }
					  UserVerifyData.find({"doc_id":{"$exists" : true, "$ne" : ""},select: ['doc_id']}).sort('createdAt DESC').limit(1).exec(function (err, forDocIds) {
						if (err) {
						  console.log('error in save docids')
						}

						var uploadPath = process.cwd() + "/.tmp/public/uploads/docs/" + tab_type + "/" + user_id;
						var real_uploadPath = process.cwd() + "/assets/uploads/docs/" + tab_type + "/" + user_id;
						if (!fs.existsSync(uploadPath)) {
						  fs.mkdir(uploadPath, function (err) {
							if (err) { console.log('failed to create directory', err);
							} else { }
						  });
						}
						if (!fs.existsSync(real_uploadPath)) {
						  fs.mkdir(real_uploadPath, function (err) {
							if (err) { console.log('failed to create directory', err);
							} else { }
						  });
						}

						req.file('doc_file').upload({
						  dirname: path.resolve(sails.config.appPath, uploadPath)
						},function (err, uploadedFiles) {
						  if(err){
							console.log(JSON.stringify(err));
						  }
						  else if(uploadedFiles.length==0){
							if(req.param("del_doc") == '1') {
							  var _newVerifyData = {
								  doc_url : '',
								  doc_id: ''
							  }
							  UserVerifyData.update({project_id:req.param("id")}, _newVerifyData).exec(function(err, _verifyData) {
							  });
							}
						  }else{
							var fd = uploadedFiles[0].fd;
							var myarr = fd.split("\\");
							var filename = path.basename(myarr[myarr.length-1]);
							/* Copy .tmp to upload folder*/
							fs.readFile(fd, function (err, data) {
							  fs.writeFile(sails.config.appPath + '/assets/uploads/docs/' + tab_type + '/'+ user_id + '/' + filename, data, function (err) {

							  });
							});
							
							var doc_id='';
							if (typeof eduDocId != 'undefined' && typeof eduDocId.doc_id != 'undefined' && eduDocId.doc_id != '') {
							  doc_id = eduDocId.doc_id;
							} else if (forDocIds.length > 0 && forDocIds[0].doc_id != '') {
							  doc_id = forDocIds[0].doc_id
							  upload_doc_id = doc_id.slice(3, doc_id.length);
							  upload_doc_id = parseInt(upload_doc_id)+parseInt(1);
							  doc_id = 'DOC' + parseInt(upload_doc_id);
							} else {
							  doc_id = 'DOC1201';
							}
							var _newVerifyData = {
								doc_url : filename,
								doc_id: doc_id
							}
							UserVerifyData.update({project_id:req.param("id")}, _newVerifyData).exec(function(err, _verifyData) {
							});
						  }
						});
					  });
					});
				  }

				  if(request_type!='web')
				  {
				  UserProjects.findOne({id:req.param("id")})
					.populate('company_id',{select:['company_name'],sort:{from_year:-1,createdAt:-1}})
					.populate('projectdocs',{select:['createdAt'],sort:{from_year:-1,createdAt:-1}})
					.populate('projectdocs.verify_request_id',{select:['tab_type'],sort:{from_year:-1,createdAt:-1},limit:2})
					.populate('projectdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{from_year:-1,createdAt:-1},limit:2})
					.exec(function(err,Project_data){
					  resolve({
						project: _project,
						status: 'OK',
						data : Project_data,
						msg:'Project update successfully'
					  });
					});
				  }else{
					   resolve({
						status: 'OK',
						msg:'Project update successfully'
					  });
				  }

				}).catch(function (error) {
					  //console.log("Validation MESSAGE .............." + JSON.stringify(error.Errors));
				  resolve({
					project: projectinfo,
					status: 'Error',
					statusDescription: error,
					title: 'Update Project Error'
				  });
				});
			}
          });
        //}
      });
    });
        
    return promise;
  },

  deleteProject: function(req, user_id,request_type) {
    return new Promise(function (resolve, reject) {
      var id = req.param("id");
      UserProjects.destroy({id:id, user_id:user_id}).exec(function (err){
        if (err) {
          resolve({
            status: 'Error',
            msg:'Project not delete. Please try again'
          });
        }
        UserVerifyData.find({select:['id']}).where({project_id: id}).then(function (userverifydatas) {
          var userverifydata_ids = [];
          _.each(userverifydatas, function (userverifydata) {
            userverifydata_ids.push(userverifydata.id);
          });
          UserVerifyData.destroy({project_id:id}).exec(function (err){
            if (err) {
              resolve({
                status: 'Error',
                msg:'Project not delete. Please try again'
              });
            }
            UserVerifyDataRequest.destroy({verify_id:userverifydata_ids}).exec(function (err){
              if (err) {
                resolve({
                  status: 'Error',
                  msg:'Project not delete. Please try again'
                });
              }
              ActivityLogsService.addActivityLog({
                owner_id: user_id,
                module: 'profile_project',
                action: 'delete',
                object_id: req.param("id"),
                type: request_type
              });
              resolve({
                status: 'OK',
                msg:'Project delete successfully'
              });
            });
          });
        });
      });
    });
  },
  
  CreateSocial: function(req, user_id) {
    var promise = new Promise(function (resolve, reject) {
      UserSocials.destroy({user_id:user_id}).exec(function (err){
        if (err) {
          resolve(false);
        }      
        Socials.find({ select: ['id'] }).exec(function(err,socials) {
          var _newSocials = [];
		 if(typeof req.param("social") != 'undefined') {
			  console.log("Social --> ", req.param("social"));
			  var _passSocials = JSON.parse(req.param("social"));
			  socials.forEach(function(social, index){
				if(_passSocials[social.id] != undefined) {
					var _newSocial = {
					  user_id     : user_id,
					  social_id   : social.id,
					  link   : _passSocials[social.id]
					};
					_newSocials.push(_newSocial);
				}
			  });
			  UserSocials.create(_newSocials).then(function (_socials) {
			  _socials.forEach(function(social, index){
				if(typeof social.id != 'undefined') {
				  ActivityLogsService.addActivityLog({
					owner_id: user_id,
					module: 'profile_social',
					action: 'create',
					object_id: social.id,
					type: 'api'
				  });
				}
			  });
			  resolve(true);
			}).catch(function (error) {
			  resolve(false);
			});
		 }
      });
    });
  });
  return promise;
  },
  
  updateUserProfile : function(req,user_id){
    var userName = req.param("name");
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
    var promise = new Promise(function (resolve, reject) {
    Users.update(user_id,userinfo).then(function (_users) {
      
    if(typeof _users[0].id != 'undefined') {
      /* Activity Log Insert */
      ActivityLogsService.addActivityLog({
        owner_id: user_id,
        module: 'user',
        action: 'update',
        object_id: _users[0].id,
        type: 'api'
      });
    }

    var experience_id = req.param("current_position");
    var education_id  = req.param('current_education');
       if(typeof experience_id != 'undefined' && experience_id!=''){
         UserExperiences.update( {user_id : user_id },{display_status:0}).exec(function afterwards(err, updated){
           if (err) {
             resolve(false);
            } else {
               UserExperiences.update({'id':experience_id},{display_status:1}).exec(function afterwards(err, updated){
                if (err) {
                  resolve(false);
                } else if(typeof education_id!='undefined' && education_id!=''){
                    UserEducations.update({user_id : user_id },{display_status:0}).exec(function afterwards(err, updated){
                      if (err) {
                        resolve(false);
                      }else {
                        UserEducations.update({id:education_id},{display_status:1}).exec(function afterwards(err, updated){
                          if (err) {
                            resolve(false);
                          } else {
                            ApiService.getUserDetail(user_id).then(function(user_data){//get updated data from profile       
                              resolve(user_data);
                            });
                          }
                        });
                      }            
                    });
                } else {
                  ApiService.getUserDetail(user_id).then(function(user_data){//get updated data from profile       
                    resolve(user_data);
                  });
                }
              });
            }
          });
        } else if(typeof education_id!='undefined' && education_id!=''){
          UserEducations.update({user_id : user_id },{display_status:0}).exec(function afterwards(err, updated){
            
            if (err) {
              resolve(false);
            } else {
              UserEducations.update({id:education_id},{display_status:1}).exec(function afterwards(err, updated){
                if (err) {
                  resolve(false);
                } else { //get profile update data
                  ApiService.getUserDetail(user_id).then(function(user_data){          
                    resolve(user_data);
                  });
                }
              });
            }            
          });
        }
        
        
      }).catch(function (error) {
        resolve(false);
      });
    });
    return promise;
  },
  
  peopleYouKnow : function(req,user_id){
    var page = 1;
    if(req.param('page') != undefined){
      page = req.param('page');
    }
    return new Promise(function (resolve, reject){
      UserConnection.find({user_id : user_id}).exec(function(err, result){
        UserConnection.find({to_user_id : user_id}).exec(function(err, result2){
          array = [];
					array1 = [];
					result.forEach(function(factor, index){
            array.push(factor.to_user_id);
					});
					result2.forEach(function(factor, index){
            array1.push(factor.user_id);
					});
          
					var connections = array.concat(array1);
					var own = [user_id];
					connection_ids = connections.concat(own);
					
					var follows = [];
					Follow.find({user_id:user_id,select:['status']}).populate('company_id.companydata',{select:['company_id']}).exec(function(err, res_follow){
            res_follow.forEach(function(factor, index){
              if(typeof factor.company_id!='undefined' && typeof factor.company_id.companydata != 'undefined' && factor.company_id.companydata.length > 0){
                follows.push(factor.company_id.companydata[0]['id']);
							}
						});
            
						connection_ids = connection_ids.concat(follows);
            Users.find({id: {"$nin" : connection_ids}})
            .populate('company_id',{select:['company_name','slug']})
            .populate('userexperiences',{limit:1,select:['title','company_name'],sort:'current_work DESC'})
            .sort('createdAt DESC')
            .paginate({page: page, limit: 6})
            .exec(function(err, peopleyouknow){
              if (err){
                resolve(false);
							} else {
                resolve(peopleyouknow);
							}
						});
					});
				});
			});
		});
  },
  
  sendConnectionRequest : function(req, user_id){
		var _newConnection = {
        user_id: user_id,
        to_user_id: req.param("to_user_id"),
        status: 0
      };
    return new Promise(function (resolve, reject){
      UserConnection.count({user_id: user_id,to_user_id: req.param("to_user_id")}).exec(function(err,user_connection_count){
        if(user_connection_count == 0){
          UserConnection.create(_newConnection).then(function (_userconnection) {
            if(typeof _userconnection.id != 'undefined') {
                /* Activity Log Insert */
                ActivityLogsService.addActivityLog({
                  owner_id: user_id,
                  module: 'connection',
                  action: 'sendConnectionRequest', 
                  object_id: _userconnection.id,
                  type: 'api'
                });
              }
              Users.findOne({id:req.param("to_user_id")}).exec(function(err,user_data){
                UserFcmkey.find({user_id:req.param("to_user_id")}).exec(function(err,user_FCM_key){
                  if(user_FCM_key != undefined && user_FCM_key.length > 0){
                    for(i=0;i<user_FCM_key.length ;i++){
                      FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],{},user_data['name']+' sent you a connection request',14);
                    }
                  }
                  resolve({status:'OK',msg:'Connection requst send scssesfully!',data:{}});
                });
              });
            }).catch(function (error) {
            resolve({status:"Error",msg:'Connection requst fail!',data:{}});
          });
      } else {
        resolve({status:"Error",msg:'Request already sent!',data:{}});
      }
    });
  });
  },
  
  cancelConnectionRequest: function(req,user_id){
    var to_user_id = req.param("to_user_id");
    return new Promise(function (resolve, reject){
      UserConnection.find().where({user_id: user_id, to_user_id: to_user_id}).then(function (_connection) {
        if (_connection && _connection.length > 0) {
          if(typeof _connection[0].id != 'undefined') {
          /* Activity Log Insert */
            ActivityLogsService.addActivityLog({
              owner_id: user_id,
              module: 'connection',
              action: 'cancelConnectionRequest',
              object_id: _connection[0].id,
              type: 'api'
            });
          }
          _connection[0].destroy().then(function (_connection) {
              resolve(true);
          }).catch(function (err) {
            resolve(false);
          });
        } else {
          resolve(false);
        }
      });
    });
  },
  
  rejectConnectionRequest : function(req,user_id){
    var from_user_id = req.param("from_user_id");
    return new Promise(function (resolve, reject){
      UserConnection.find().where({user_id: from_user_id, to_user_id: user_id}).then(function (_connection) {
        if (_connection && _connection.length > 0) {
          if(typeof _connection[0].id != 'undefined') {
            /* Activity Log Insert */
            ActivityLogsService.addActivityLog({
              owner_id: user_id,
              module: 'connection',
              action: 'rejectConnectionRequest',
              object_id: _connection[0].id,
              type: 'api'
            });
          }
          _connection[0].destroy().then(function (_connection) {
            resolve(true);
          }).catch(function (err) {
            resolve(false);
          });
        }else{
          resolve(false);
        }
      });
    });
  },
  
  getPendingReceivedInvitationList : function(req,user_id){
	return new Promise(function (resolve, reject){
		UserConnection.find({to_user_id: user_id,status:'0' }).exec(function(err, pendingrecusers){
			pending_rec_ids = [];
			pendingrecusers.forEach(function(factor, index){
				pending_rec_ids.push(factor.user_id);
			});

			Users.find({id: {"$in" : pending_rec_ids}})
			.populate('receiverequest',{select:['createdAt','updatedAt'],where:{'to_user_id':user_id,status:'0'}})
			.populate('company_id',{select:['company_name','slug']})
			.populate('userexperiences',{select: ['title','location','current_work'],sort:{display_status:-1,current_work:-1},limit:1})
			.populate('userexperiences.company_id',{select: ['company_name'],sort:{display_status:-1,current_work:-1},limit:1})
			.sort('createdAt DESC').exec(function(err,connections){
				if(err){
					resolve(false);
				} else {
					connections.forEach(function (connection, index) {
						if(typeof connections[index]['userexperiences'] != 'undefined' && connections[index]['userexperiences'].length > 0){
							if(typeof connections[index]['userexperiences'][0]['user_id'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['user_id'];
							}
							if(typeof connections[index]['userexperiences'][0]['company_name'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['company_name'];
							}
							if(typeof connections[index]['userexperiences'][0]['description'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['description'];
							}
							if(typeof connections[index]['userexperiences'][0]['from_month'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['from_month'];
							}
							if(typeof connections[index]['userexperiences'][0]['from_year'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['from_year'];
							}
							if(typeof connections[index]['userexperiences'][0]['to_year'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['to_year'];
							}
							if(typeof connections[index]['userexperiences'][0]['to_month'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['to_month'];
							}
							if(typeof connections[index]['userexperiences'][0]['createdAt'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['createdAt'];
							}
							if(typeof connections[index]['userexperiences'][0]['updatedAt'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['updatedAt'];
							}
							if(typeof connections[index]['userexperiences'][0]['display_status'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['display_status'];
							}
						}
						if(typeof connections[index]['loginid'] != 'undefined'){
							delete connections[index]['loginid'];
						}
						if(typeof connections[index]['email'] != 'undefined'){
							delete connections[index]['email'];
						}
						if(typeof connections[index]['password'] != 'undefined'){
							delete connections[index]['password'];
						}
						if(typeof connections[index]['referral'] != 'undefined'){
							delete connections[index]['referral'];
						}
						/* if(typeof connections[index]['createdAt'] != 'undefined'){
							delete connections[index]['createdAt'];
						} */
						if(typeof connections[index]['updatedAt'] != 'undefined'){
							var time_ago = '1 sec';
							if(typeof connections[index]['receiverequest']!='undefined' && connections[index]['receiverequest'].length>0) {
								if(typeof connections[index]['receiverequest'][0]['updatedAt']!='undefined' && connections[index]['receiverequest'][0]['updatedAt']!='') {
									time_ago = DateDifferentService.time_ago_full(connections[index]['receiverequest'][0]['updatedAt']);
								}
							} else if(typeof connections[index]['sendrequest']!='undefined' && connections[index]['sendrequest'].length>0) {
								if(typeof connections[index]['sendrequest'][0]['updatedAt']!='undefined' && connections[index]['sendrequest'][0]['updatedAt']!='') {
									time_ago = DateDifferentService.time_ago_full(connections[index]['sendrequest'][0]['updatedAt']);
								}
							}		
							connections[index]['time_ago'] = time_ago;
							//delete connections[index]['updatedAt'];
						}
						/* if(typeof connections[index]['receiverequest'] != 'undefined'){
							delete connections[index]['receiverequest'];
						}
						if(typeof connections[index]['sendrequest'] != 'undefined'){
							delete connections[index]['sendrequest'];
						} */
						if(typeof connections[index]['cover_image'] != 'undefined'){
							delete connections[index]['cover_image'];
						}
						if(typeof connections[index]['headline'] != 'undefined'){
							delete connections[index]['headline'];
						}
						if(typeof connections[index]['about_me'] != 'undefined'){
							delete connections[index]['about_me'];
						}
						if(typeof connections[index]['location'] != 'undefined'){
							delete connections[index]['location'];
						}
						if(typeof connections[index]['country'] != 'undefined'){
							delete connections[index]['country'];
						}
						if(typeof connections[index]['state'] != 'undefined'){
							delete connections[index]['state'];
						}
						if(typeof connections[index]['city'] != 'undefined'){
							delete connections[index]['city'];
						}
						if(typeof connections[index]['industry_id'] != 'undefined'){
							delete connections[index]['industry_id'];
						}
						if(typeof connections[index]['language_id'] != 'undefined'){
							delete connections[index]['language_id'];
						}
						if(typeof connections[index]['socket_id'] != 'undefined'){
							delete connections[index]['socket_id'];
						}
						if(typeof connections[index]['is_verify_phone'] != 'undefined'){
							delete connections[index]['is_verify_phone'];
						}
						if(typeof connections[index]['ethaddress'] != 'undefined'){
							delete connections[index]['ethaddress'];
						}
					});
					
					resolve({requestreceived:connections,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url});
				  }
			});
		});
	});
  },
  
  getPendingSentInvitationList : function(req,user_id){
	return new Promise(function (resolve, reject){
		var createdAt = [];
		UserConnection.find({user_id: user_id,status:'0' }).exec(function(err, pendingusers){
			pending_ids = [];
			pendingusers.forEach(function(factor, index){
				pending_ids.push(factor.to_user_id);
			});
			Users.find({id: {"$in" : pending_ids}})
			.populate('sendrequest',{select:['createdAt','updatedAt'],where:{'user_id':user_id,status:'0'}})
			.populate('company_id',{select:['company_name','slug']})
			.populate('userexperiences',{select: ['title','location','current_work'],sort:{display_status:-1,current_work:-1},limit:1})
			.populate('userexperiences.company_id',{select: ['company_name'],sort:{display_status:-1,current_work:-1},limit:1})
			.exec(function(err,connections){
				if(err){
					resolve(false);
				} else {
					connections.forEach(function (connection, index) {
						if(typeof connections[index]['userexperiences'] != 'undefined' && connections[index]['userexperiences'].length > 0){
							if(typeof connections[index]['userexperiences'][0]['user_id'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['user_id'];
							}
							if(typeof connections[index]['userexperiences'][0]['company_name'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['company_name'];
							}
							if(typeof connections[index]['userexperiences'][0]['description'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['description'];
							}
							if(typeof connections[index]['userexperiences'][0]['from_month'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['from_month'];
							}
							if(typeof connections[index]['userexperiences'][0]['from_year'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['from_year'];
							}
							if(typeof connections[index]['userexperiences'][0]['to_year'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['to_year'];
							}
							if(typeof connections[index]['userexperiences'][0]['to_month'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['to_month'];
							}
							if(typeof connections[index]['userexperiences'][0]['createdAt'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['createdAt'];
							}
							if(typeof connections[index]['userexperiences'][0]['updatedAt'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['updatedAt'];
							}
							if(typeof connections[index]['userexperiences'][0]['display_status'] != 'undefined'){
								delete connections[index]['userexperiences'][0]['display_status'];
							}
						}
						if(typeof connections[index]['loginid'] != 'undefined'){
							delete connections[index]['loginid'];
						}
						if(typeof connections[index]['email'] != 'undefined'){
							delete connections[index]['email'];
						}
						if(typeof connections[index]['password'] != 'undefined'){
							delete connections[index]['password'];
						}
						if(typeof connections[index]['referral'] != 'undefined'){
							delete connections[index]['referral'];
						}
						/* if(typeof connections[index]['createdAt'] != 'undefined'){
							delete connections[index]['createdAt'];
						} */
						if(typeof connections[index]['updatedAt'] != 'undefined'){
							var time_ago = '1 sec';
							if(typeof connections[index]['receiverequest']!='undefined' && connections[index]['receiverequest'].length>0) {
								if(typeof connections[index]['receiverequest'][0]['updatedAt']!='undefined' && connections[index]['receiverequest'][0]['updatedAt']!='') {
									time_ago = DateDifferentService.time_ago_full(connections[index]['receiverequest'][0]['updatedAt']);
								}
							} else if(typeof connections[index]['sendrequest']!='undefined' && connections[index]['sendrequest'].length>0) {
								if(typeof connections[index]['sendrequest'][0]['updatedAt']!='undefined' && connections[index]['sendrequest'][0]['updatedAt']!='') {
									time_ago = DateDifferentService.time_ago_full(connections[index]['sendrequest'][0]['updatedAt']);
								}
							}		
							connections[index]['time_ago'] = time_ago;
							//delete connections[index]['updatedAt'];
						}
						/* if(typeof connections[index]['receiverequest'] != 'undefined'){
							delete connections[index]['receiverequest'];
						}
						if(typeof connections[index]['sendrequest'] != 'undefined'){
							delete connections[index]['sendrequest'];
						} */
						if(typeof connections[index]['cover_image'] != 'undefined'){
							delete connections[index]['cover_image'];
						}
						if(typeof connections[index]['headline'] != 'undefined'){
							delete connections[index]['headline'];
						}
						if(typeof connections[index]['about_me'] != 'undefined'){
							delete connections[index]['about_me'];
						}
						if(typeof connections[index]['location'] != 'undefined'){
							delete connections[index]['location'];
						}
						if(typeof connections[index]['country'] != 'undefined'){
							delete connections[index]['country'];
						}
						if(typeof connections[index]['state'] != 'undefined'){
							delete connections[index]['state'];
						}
						if(typeof connections[index]['city'] != 'undefined'){
							delete connections[index]['city'];
						}
						if(typeof connections[index]['industry_id'] != 'undefined'){
							delete connections[index]['industry_id'];
						}
						if(typeof connections[index]['language_id'] != 'undefined'){
							delete connections[index]['language_id'];
						}
						if(typeof connections[index]['socket_id'] != 'undefined'){
							delete connections[index]['socket_id'];
						}
						if(typeof connections[index]['is_verify_phone'] != 'undefined'){
							delete connections[index]['is_verify_phone'];
						}
						if(typeof connections[index]['ethaddress'] != 'undefined'){
							delete connections[index]['ethaddress'];
						}
					});
					resolve({sentrequest:connections, 'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url});
				}
			});
		});
	});
  },
  
  getFollowList : function(req,user_id){
		return new Promise(function (resolve, reject){
			var page = 1;
			if(req.param("page_no") != undefined){
				page = req.param("page_no");
      }
      if(req.param("user_id") != undefined && req.param("user_id") != '') {
        user_id = req.param("user_id");
      } 
			var createdAt = [];
      Follow.find({user_id:user_id})
        .populate('company_id')
        .sort('createdAt DESC')
        .paginate({page:page, limit:3})
        .exec(function(err, follows){
          resolve({sentrequest:follows,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url});
        });
		});
  },
  
  acceptConnectionRequest: function(req,user_id){
    var request_user_id = req.param("request_user_id");
    return new Promise(function (resolve, reject){
      console.log({user_id: request_user_id, to_user_id: user_id});
      UserConnection.update({user_id: request_user_id, to_user_id: user_id}, {
          status : "1"
      }).then(function (_connection) {
          console.log(_connection);

        if(typeof _connection[0].id != 'undefined') {
          /* Activity Log Insert */
          Users.findOne({id:user_id}).exec(function(err,user_data){
            UserFcmkey.find({user_id:request_user_id}).exec(function(err,user_FCM_key){
              if(user_FCM_key != undefined && user_FCM_key.length > 0) {
                for(i=0;i<user_FCM_key.length ;i++){
                  FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],{},user_data.name+' is accepted your connection request',13);
                }
              }
              ActivityLogsService.addActivityLog({
                owner_id: user_id,
                module: 'connection',
                action: 'acceptConnectionRequest',
                object_id: _connection[0].id,
                type: 'api'
              });
            });
          });
        }
        resolve(true);
      }).catch(function (err) {
        resolve(false);
      });
    });
  },
  
  myConnectionList: function(req,user_id) {
    var page = 1;
    if(req.param("page_no") != undefined) {
      page = req.param("page_no");
    }
    return new Promise(function (resolve, reject) {
      UserConnection.find({to_user_id: user_id,status:'1' }).exec(function(err, connection){
        UserConnection.find({user_id: user_id,status:'1' }).exec(function(err, connection1){
          connarray = [];
          connarray1 = [];
          connection1.forEach(function(factor, index){
            connarray1.push(factor.to_user_id);
          });
          connection.forEach(function(factor, index){
            connarray.push(factor.user_id);
          });
          var user_ids = connarray1.concat(connarray);
          Users.count({id: {"$in" : user_ids}}).exec(function countCB(error, found) {
            Users.find({id: {"$in" : user_ids}})
              .populate('company_id',{select:['company_name','slug']})
              .populate('receiverequest',{select:['createdAt','updatedAt'],where:{'to_user_id':user_id,status:'1'}})
              .populate('sendrequest',{select:['createdAt','updatedAt'],where:{'user_id':user_id,status:'1'}})
              .populate('userexperiences',{select: ['title','location','current_work'],sort:{display_status:-1,current_work:-1},limit:1})
              .populate('userexperiences.company_id',{select: ['company_name','slug'],sort:{display_status:-1,current_work:-1},limit:1})
			  .sort('name')
              .paginate({page: page, limit: 6})
			  .exec(function(err, connections){
              if(err){
                resolve(false);
              } else {
				
				connections.forEach(function (connection, index) {
					if(typeof connections[index]['userexperiences'] != 'undefined' && connections[index]['userexperiences'].length > 0){
						if(typeof connections[index]['userexperiences'][0]['user_id'] != 'undefined'){
							delete connections[index]['userexperiences'][0]['user_id'];
						}
						if(typeof connections[index]['userexperiences'][0]['company_name'] != 'undefined'){
							delete connections[index]['userexperiences'][0]['company_name'];
						}
						if(typeof connections[index]['userexperiences'][0]['description'] != 'undefined'){
							delete connections[index]['userexperiences'][0]['description'];
						}
						if(typeof connections[index]['userexperiences'][0]['from_month'] != 'undefined'){
							delete connections[index]['userexperiences'][0]['from_month'];
						}
						if(typeof connections[index]['userexperiences'][0]['from_year'] != 'undefined'){
							delete connections[index]['userexperiences'][0]['from_year'];
						}
						if(typeof connections[index]['userexperiences'][0]['to_year'] != 'undefined'){
							delete connections[index]['userexperiences'][0]['to_year'];
						}
						if(typeof connections[index]['userexperiences'][0]['to_month'] != 'undefined'){
							delete connections[index]['userexperiences'][0]['to_month'];
						}
						if(typeof connections[index]['userexperiences'][0]['createdAt'] != 'undefined'){
							delete connections[index]['userexperiences'][0]['createdAt'];
						}
						if(typeof connections[index]['userexperiences'][0]['updatedAt'] != 'undefined'){
							delete connections[index]['userexperiences'][0]['updatedAt'];
						}
						if(typeof connections[index]['userexperiences'][0]['display_status'] != 'undefined'){
							delete connections[index]['userexperiences'][0]['display_status'];
						}
					}
					if(typeof connections[index]['loginid'] != 'undefined'){
						delete connections[index]['loginid'];
					}
					if(typeof connections[index]['email'] != 'undefined'){
						delete connections[index]['email'];
					}
					if(typeof connections[index]['password'] != 'undefined'){
						delete connections[index]['password'];
					}
					if(typeof connections[index]['referral'] != 'undefined'){
						delete connections[index]['referral'];
					}
					/* if(typeof connections[index]['createdAt'] != 'undefined'){
						delete connections[index]['createdAt'];
					} */
					if(typeof connections[index]['updatedAt'] != 'undefined'){
						var time_ago = '1 sec';
						if(typeof connections[index]['receiverequest']!='undefined' && connections[index]['receiverequest'].length>0) {
							if(typeof connections[index]['receiverequest'][0]['updatedAt']!='undefined' && connections[index]['receiverequest'][0]['updatedAt']!='') {
								time_ago = DateDifferentService.time_ago_full(connections[index]['receiverequest'][0]['updatedAt']);
							}
						} else if(typeof connections[index]['sendrequest']!='undefined' && connections[index]['sendrequest'].length>0) {
							if(typeof connections[index]['sendrequest'][0]['updatedAt']!='undefined' && connections[index]['sendrequest'][0]['updatedAt']!='') {
								time_ago = DateDifferentService.time_ago_full(connections[index]['sendrequest'][0]['updatedAt']);
							}
						}		
						connections[index]['time_ago'] = time_ago;
						//delete connections[index]['updatedAt'];
					}
					/* if(typeof connections[index]['receiverequest'] != 'undefined'){
						delete connections[index]['receiverequest'];
					}
					if(typeof connections[index]['sendrequest'] != 'undefined'){
						delete connections[index]['sendrequest'];
					} */
					if(typeof connections[index]['cover_image'] != 'undefined'){
						delete connections[index]['cover_image'];
					}
					if(typeof connections[index]['headline'] != 'undefined'){
						delete connections[index]['headline'];
					}
					if(typeof connections[index]['about_me'] != 'undefined'){
						delete connections[index]['about_me'];
					}
					if(typeof connections[index]['location'] != 'undefined'){
						delete connections[index]['location'];
					}
					if(typeof connections[index]['country'] != 'undefined'){
						delete connections[index]['country'];
					}
					if(typeof connections[index]['state'] != 'undefined'){
						delete connections[index]['state'];
					}
					if(typeof connections[index]['city'] != 'undefined'){
						delete connections[index]['city'];
					}
					if(typeof connections[index]['industry_id'] != 'undefined'){
						delete connections[index]['industry_id'];
					}
					if(typeof connections[index]['language_id'] != 'undefined'){
						delete connections[index]['language_id'];
					}
					if(typeof connections[index]['socket_id'] != 'undefined'){
						delete connections[index]['socket_id'];
					}
					if(typeof connections[index]['is_verify_phone'] != 'undefined'){
						delete connections[index]['is_verify_phone'];
					}
					if(typeof connections[index]['ethaddress'] != 'undefined'){
						delete connections[index]['ethaddress'];
					}
				});
				
				resolve({'list':connections,'connection_count':found,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url});
              }
            });
          });
        });
      });
    });
  },
  
  followUnfollow: function(req,user_id){
    
    var _newfollow = {
        company_id: req.param("company_id"),
        user_id: user_id,
        status: '0',
        is_authorized: '0',
        is_member: '0'
    };
    return new Promise(function (resolve, reject){
      Follow.find({company_id: req.param("company_id"), user_id: user_id}).exec(function(err,found){
      if(found.length > 0) {
        if(typeof found[0].id != 'undefined') {
          /* Activity Log Insert */
          ActivityLogsService.addActivityLog({
            owner_id: user_id,
            module: 'company',
            action: 'unfollow',
            object_id: found[0].id,
            type: 'api'
          });
        }
          found[0].destroy().then(function (_delete) {
            resolve(true);
          }).catch(function (err) {
            resolve(false);
          });
        } else {
          Follow.create(_newfollow).exec(function(err,_follow){
            if(err){
              resolve(false);
            }
            if(typeof _follow.id != 'undefined') {
              /* Activity Log Insert */
              Follow.findOne({id:_follow.id})
                .populate("user_id",{select:["name"]})
                .populate("company_id.companydata",{select:["name"]})
                .exec(function(err,_follow_data) {
                  if(_follow_data['company_id']['companydata'].length > 0 && _follow_data['company_id']['companydata'][0]['id']) {
                    UserFcmkey.find({user_id:_follow_data['company_id']['companydata'][0]['id']}).exec(function(err,user_FCM_key) {
                      if(user_FCM_key != undefined && user_FCM_key.length > 0){
                        for(i=0;i<user_FCM_key.length ;i++){
                          FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],data_UserVerifyDataRequest,_follow_data['company_id']['companydata'][0]['name']+' is start followed',12);
                        }
                      }
                      ActivityLogsService.addActivityLog({
                        owner_id: user_id,
                        module: 'company',
                        action: 'follow',
                        object_id: _follow.id,
                        type: 'api'
                      });
                      resolve(true);
                    });
                  } else {
                    resolve(true);
                  }
              });
            }
          });
        }
      });
    });
  },
  
  updateProfileCover: function (req, user_id) {
    return new Promise(function (resolve, reject){
      req.file('cover_image').upload({
        dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/users/'),
        maxBytes: 7000000,  //7mb
      },function (err, uploadedFiles) {
        if (err) resolve({status:'Error','msg':'Update profile cover not successfully!'});
        if (uploadedFiles.length === 0) {
          resolve({status:'Error','msg':'Update profile cover not successfully!'});
        }
        var allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
        var extension = uploadedFiles[0].type;

        if(allowedTypes.indexOf(extension)=== -1){
          resolve({status:'Error','msg':'Update profile cover not successfully!'});
        }
        Users.update(user_id, {
          cover_image:path.basename(uploadedFiles[0].fd),
        })
        .exec(function (err){
          if (err) resolve({status:'Error','msg':'Update profile cover not successfully!'});
          /* Activity Log Insert */
          ActivityLogsService.addActivityLog({
            owner_id: user_id,
            module: 'user',
            action: 'cover_update',
            object_id: user_id,
            type: 'api'
          });
          resolve({status:'OK','msg':'Update profile pic successfully!', 'data': sails.config.appUrlwPort + sails.config.profile_image_url + path.basename(uploadedFiles[0].fd)});
        });
      });
    });
  },

  updateProfileImage: function (req, user_id) {
    return new Promise(function (resolve, reject){
      req.file('profile_image').upload({
        dirname: require('path').resolve(sails.config.appPath, './.tmp/public/uploads/users/'),
          maxBytes: 4000000,
        },function (err, uploadedFiles) {
          if (err) resolve({status:'Error','msg':'Update profile pic not successfully!'});
          if (uploadedFiles.length > 0) {
			  var allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
			  var extension = uploadedFiles[0].type;

			  if(allowedTypes.indexOf(extension)=== -1){
				resolve({status:'Error','msg':'Update profile pic not successfully!'});
			  }
				var fd = uploadedFiles[0].fd;
				var myarr = fd.split("\\");
				var filename = path.basename(myarr[myarr.length-1]);
				/* Copy .tmp to upload folder*/
				fs.readFile(fd, function (err, data) {
					fs.writeFile(sails.config.appPath+'/assets/uploads/users/'+filename, data, function (err) {

					});
				});
				
			  Users.update(user_id, {
				  profile_image:path.basename(uploadedFiles[0].fd),
			  })
			  .exec(function (err){
				  if (err) resolve({status:'Error','msg':'Update profile pic not successfully!'});
				  /* Activity Log Insert */
				  ActivityLogsService.addActivityLog({
					owner_id: user_id,
					module: 'user',
					action: 'profile_pic_update',
					object_id: user_id,
					type: 'api'
				  });
				  resolve({status:'OK','msg':'Update profile pic successfully!', 'data': sails.config.appUrlwPort + sails.config.profile_image_url + filename});
			  });
		  } else {
			  resolve({status:'Error','msg':'Update profile pic not successfully!'});
          }
      });
    });
  },
  
  updateSocketId : function(req,user_id){
    var socket_id = req.param('socket_id'); 
    return new Promise(function (resolve, reject){
      Users.update(user_id,{socket_id:socket_id}).exec(function(err,Users_updated){ 
        if (err){ resolve(false);
        } else {
          resolve(Users_updated.id);
        }
      });
    });
  },
  
  masterTables : function(req,user_id) {
    return new Promise(function (resolve, reject){
      var date = new Date(req.param('date') != undefined ? req.param('date') : '08/12/1991 11:12:00');
      Doctype.find({'$or':[{type:'other_docs'},{type:'identity'}],updatedAt : { '>' : date }}).exec(function (err, doc_type) {
        if (err) {
          return res.json({ status: 'Error', message: err,  _data: ''})
        }
        Countries.find({updatedAt : { '>': date}}).exec(function(err,CountriesData) {
          Industries.find({updatedAt : { '>': date}}).exec(function(err,IndustriesData) {
            Languages.find({updatedAt : { '>': date}}).exec(function(err,LanguagesData) {
              doc_type_id = [],
              doc_type_other = []
              Degreetype.find({updatedAt : { '>': date}}).exec(function(err,DegreetypeData){          
                _.each(doc_type, function (val) {
                  if (val.type == 'identity') {
                    if(typeof val.title!='undefined' && val.title!='Others'){
                      doc_type_id.push(val)
                    }
                  }
                  if (val.type == 'other_docs') {
                    doc_type_other.push(val)
                  }
                });
                var varify_arr = {
                            doc_type_other:doc_type_other,
                            doc_type:doc_type_id,
                            countries_data:CountriesData,
                            degree_type : DegreetypeData
                          };
                var user_master = {
                            industries_data : IndustriesData,
                            languages_data : LanguagesData
                          }
                resolve({varify_arr:varify_arr,user_master:user_master,current_date_time : moment().format("MM-DD-YYYY HH:mm:ss")});
              });
            });
          });
        });
      });
    });
  },
  
  userListForVerifyRequest : function(req,user_id) {    
    return new Promise(function (resolve, reject) {
      UserConnection.find({to_user_id: user_id,status:'1' }).exec(function(err, connection){
        UserConnection.find({user_id: user_id,status:'1' }).exec(function(err, connection1){
          connarray = [];
          connarray1 = [];
          connection1.forEach(function(factor, index){
            connarray1.push(factor.to_user_id);
          });
          connection.forEach(function(factor, index){
            connarray.push(factor.user_id);
          });
          var user_ids = connarray1.concat(connarray);
          Users.find({id: {"$in" : user_ids}})
            .populate('company_id',{select:['company_name']})
            .exec(function(err, connections){
            if(err){
              resolve({status:'Error',data:{},msg:"Error while get connection list"});
            } else {
              Follow.find({user_id:user_id,'company_id.companydata': {'!' :[]}} )
                .populate('company_id',{select:['company_name']})
                .populate('company_id.companydata',{select:['name']})
                .exec(function(err, follows){
                  var user_arr = [];
                  for(i=0;i<connections.length;i++){
                    user_arr.push({'id':connections[i]['id'],'name':connections[i]['name']});
                  }
                  if(follows.length>0){
                    for(i=0;i<follows.length;i++){
                      if(typeof follows[i]['company_id']!='undefined' && typeof follows[i]['company_id']['companydata']!='undefined' && follows[i]['company_id']['companydata'].length > 0){
                        var user_data = follows[i]['company_id']['companydata'][0];
                        user_arr.push({'id':user_data['id'],'name':follows[i]['company_id']['company_name']});
                      }                    
                    }
                  }
				      user_arr = UserDataService.sort_by_key_value(user_arr, 'name');
                  resolve({status:'OK',data:user_arr});
              });
            }
          });
        });
      });
    });
  },
  
  useReferral: function (req,user_id ,request_type) {
    return new Promise(function (resolve, reject) {
      var referral = req.param("referral");
          referral = referral.trim();
          referral = referral.replace(/\-/g,'');
          referral = referral.replace(/ /g, '');
      
        Users.find({referral: referral}).exec(function(err, _user) {
          if(_user.length > 0){
            var user = _user[0];
            if(typeof user.id == 'undefined'){
              return resolve({
                status: 'Error',
                message: 'Referral code not found'
              });
            } else if(user.id == user_id) {
              resolve({
                status: 'Error',
                message: 'You have used your own referral code'
              });
            } else {
              
              UserReferralUsed.find({user_id: user_id}).exec(function(err,UserReferralUsedRecode){
                var _newReferral = {
                  user_id: user_id,
                  referral_user_id: user.id
                };
              if(UserReferralUsedRecode.length == 0){
                UserReferralUsed.create(_newReferral).then(function (_userReferral) {
                  if(typeof _userReferral.id != 'undefined') {
                    var referral_id = _userReferral.id;
                    /* Activity Log Insert */
                    ActivityLogsService.addActivityLog({
                      owner_id: user_id,
                      module: 'referral',
                      action: 'used',
                      object_id: _userReferral.id,
                      type: request_type
                    }).then();

                    /* Earn from Referral */
                    var userIds = [user_id,user.id];
                      userIds.forEach(function(value, index){
                        var _newEarnReward = {
                          used_referral_id:_userReferral.id,
                          user_id:value,
                          amount: "5",
                          type: 'referral'
                        };
                        EarnRewards.create(_newEarnReward).exec(function(err,result){
                                      /* Add Notification */
                        EarnRewards.findOne({id:result.id})
                          .populate("used_referral_id")
                          .populate("used_referral_id.user_id",{select:['name','slug','profile_image']})
                          .populate("used_referral_id.referral_user_id",{select:['name','slug','profile_image']})
                          .exec(function(err,data){
                            var textdata = "You have earned LBD("+data.amount+") From "+data.used_referral_id.user_id.name+" to "+data.used_referral_id.referral_user_id.name;

                            NotificationService.addNotification({
                              user_id: data.user_id,
                              feed_id: "",
                              from_user_id: data.used_referral_id.referral_user_id.id,
                              notification_text: textdata,
                              type: request_type
                            });

                            if(user_id!=value){
                              ReferralEarnService.recursiveEarn(referral_id,user.id,2).then(function(data){
                              });
                            }
                            });
                            if(!err){
                              if(req.param("from_data")=='newuser') {
                                //return_location = '/import-from-mail';
                                return_location = '/';
                              } else {
                                return_location = '/referral/used';
                              }
                              return resolve({
                                status: 'OK',
                                referral: referral,
                                return_location: return_location,
                                message:'Referral code applayed successfully'
                              });
                            }
                          });
                        });
                      }
                    });
                  } else {
                    resolve({
                      status: 'Error',
                      message:'You have already used referral code.'
                    });
                  }
                });
                }
              } else {
              return resolve({
                status: 'Error',
                message: 'Referral code not found'
              });
            }
        });
      });
    },
	
    referAfriend: function(req,user_id){
      return new Promise(function (resolve, reject) {
        var friend_email = req.param("friend_email");
        var array = friend_email.split(",");
        var message = req.param("message") != undefined ? req.param("message") : '';
        if(array.length > 0) {
          array.forEach(function(email, index){
            if(email!= '') {
              sails.hooks.email.send(
                "referAfriend",
                {
                  siteURL: sails.config.appUrlwPort,
                  message: message,
                  referral_code: req.param("referral_code"),
                  recipientEmail: email.trim(),
                },
                {
                  to: email.trim(),
                  subject: "Your friend invited you to join Lynked.World."
                },
                function(err) {
                  console.log(err || "It worked!");
                }
              );
            }
          });
          resolve({
            status: 'OK',
            message:'Refer a friend request send successfully.'
          });
        } else {
          resolve({
            status: 'Error',
            message:'Please enter email address for send refral code.'
          });
        }
      });
    },
    
	mywallet: function(req,user_id){
      return new Promise(function (resolve, reject) {
        var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
        var limit = (typeof req.param("limit") != 'undefined') ? req.param("limit") : 10;
        var startPoint = 0;
        var endPoint = 0;
        
        EarnRewards.find({user_id:user_id})
        .populate("used_referral_id")
        .populate("used_referral_id.user_id",{select:['name','slug','profile_image']})
        .populate("used_referral_id.referral_user_id",{select:['name','slug','profile_image']})
        .sort("createdAt DESC")
        .paginate({page: page_no, limit: limit})
        .exec(function(err,earns){
          return resolve({
            msg:"My Wallet list",
            status:"OK",
            data:{wallet : earns}
          });
      });
    });    
  },

  walletData: function(req,user_id){
    return new Promise(function (resolve, reject) {      
      UserContactVerifyData.findOne({user_id: user_id}).exec(function (err, verifyData) {
        
        EarnRewards.find({user_id:user_id},{select:['amount']})
        .exec(function(err,earns){
          var totalLBD = 0;
          _.each(earns,function(earn){
            totalLBD = totalLBD + parseInt(earn.amount);
          });
          
          var verifyPhoneStatus = false;
          
          if(verifyData != undefined && typeof verifyData.is_phone_verify == '1' ){
            verifyPhoneStatus = true;
          }
          return resolve({
            msg:"My Wallet data",
            status:"OK",
            data:{wallet_data : {totalLBD : totalLBD,LBDTotalValue:totalLBD,transferredLBD:0},verifyPhoneStatus : verifyPhoneStatus}
          });
        });
      });
    });
  },
  
	sort_by_key_value: function(arr,key){
		var to_s = Object.prototype.toString;
		var valid_arr = to_s.call(arr) === '[object Array]';
		var valid_key = typeof key === 'string';

		if (!valid_arr || !valid_key) {
		return;
		}

		arr = arr.slice();

		return arr.sort(function(a, b) {
		var a_key = String(a[key]);
		var b_key = String(b[key]);
		var n = a_key - b_key;
		return !isNaN(n) ? n : a_key.localeCompare(b_key);
		});
	},

  closeMyAccount: function(req,user_id,user_name){
    return new Promise(function (resolve, reject) {
      var reason_id =(typeof req.param("reason")!='undefined' && req.param("reason")!='')?req.param("reason"):'';

      var _newdata = {
          user_id:user_id,
          reason:reason_id,
          feedback:(typeof req.param("feedback")!='undefined')?req.param("feedback"):''
      };

      Usercloseaccount.count({user_id:user_id}).exec(function countCB(error, found) {
        if(error){
            resolve(false);
          }

        if(found>0){
          //account already close
           resolve(true);
        }else{
            Usercloseaccount.create(_newdata).exec(function(err,response){
              if(err){
                resolve(false);
              }
              Users.update({id:user_id},{status:"0"}).exec(function(err,result){
                if(err){
                  resolve(false);
                }
                Reasons.findOne({id:reason_id}).exec(function (err, reason_data){
                  if (err) {
                        console.log(err);
                  }
                  if (!reason_data) {
                      return res.json({
                          status:"OK",
                          message:"Account close but fail to send mail",
                      });
                  }
                  response.reason = (typeof reason_data.title!='undefined')?reason_data.title:'';
                  sails.hooks.email.send(
                        "closeAccount",
                        {
                            siteURL: sails.config.appUrlwPort,
                            username: user_name,
                            data: response,
                            recipientEmail: "jay.arusys@gmail.com",
                            //recipientEmail: "reports@lynked.world",
                        },
                        {
                            to: "jay.arusys@gmail.com",
                            //to: "reports@lynked.world",
                            subject: "Lynked.World account closed by "+user_name
                        },
                        function(err) {
                            console.log(err || "It worked!");
                        }
                    );
                  resolve(true);
                });
              });
            });
          }
        });
      });
  },

  closeAccountReasons : function(req,user_id){
    return new Promise(function (resolve, reject) {
      Reasons.find({select:['title']}).sort('createdAt DESC').exec(function (err, result) {
        if(err){
          resolve(false)
        }
        resolve(result);
      });
    });
  },

  getMySocialLinks:function(req,user_id){
     return new Promise(function (resolve, reject) {
        UserSocials.find({user_id:user_id}).populate('social_id').exec(function (err,result){
          if (err) {
            resolve(false);
          }

          if(result.length>0){
             result.forEach(function(social, index){
              if(typeof social.user_id!='undefined'){
                delete result[index].user_id;
              }
              if(typeof social.social_id.name!='undefined'){
                //social.social_id = social.social_id.name;
                result[index].social_id = social.social_id.name;
              }
            });
         }

          resolve(result);
        });
     });
  }
}