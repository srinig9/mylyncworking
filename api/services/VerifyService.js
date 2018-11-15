/**
 * VerifyService
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var path = require("path");
var moment = require("moment");
var Web3 = require('web3')
var fs = require('fs')
var eth_URL = sails.config.appEtherUrl + ':' + sails.config.portEtherIo;
/* global.adminAddress = '0xb45A10f041e2995A919b119aD2F2439aA400A8b3'
var contractFile = 'myContract.json'

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var contract = JSON.parse(fs.readFileSync(contractFile, 'utf8'))
var abiDefinition = contract.abi

global.smartContract = web3.eth.contract(abiDefinition).at(contract.networks['4'].address)

var contractAddress = contract.networks['4'].address */
var Promise = require('promise');
module.exports = {

	/*
	* VerifyController.getVerified
	* retrieve verifications list for sending for verification
  */
  getVerified: function (req, user_id) { //done
    return new Promise(function (resolve, reject) {
      Doctype.find().exec(function(err,doc_type){
        if(err) {
          return resolve({ status:'Error', message: err, _data });
        }
        
        doc_type_id = [],
        doc_type_xp = [],
        doc_type_ed = [];
        _.each(doc_type,function(val) {
          if(val.type == 'identity') {
            doc_type_id.push(val);
          }
          if(val.type == 'education') {
            doc_type_ed.push(val);
          }
          if(val.type == 'experience') {
            doc_type_xp.push(val);
          }
        });
        
       
        UserContactVerifyData.findOne({user_id: user_id}).exec(function (err, verifyData) {
          if(err) {
            resolve({ status:'Error', msg: err, _data });
          }
          Users.findOne({id:user_id}).populate('usereducations').populate('userexperiences.company_id').exec(function(err, userdata){
            resolve({
              data : {
                doc_type_id : doc_type_id,
                doc_type_ed : doc_type_ed,
                doc_type_xp : doc_type_xp,
                userverify  : verifyData,
                userInfo    : userdata.usereducations,
                userexp     : userdata.userexperiences,
              },
              status        : 'OK',
              title         : 'Get Verified | Lynked.World'
            });
          });
        });
      });
    });
  },
  
  getVerifiedListWithFilter: function (req, user_id) { //done

    return new Promise(function (resolve, reject) {
      var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
      var limit = (typeof req.param("limit") != 'undefined') ? req.param("limit") : 10;
      var startPoint = 0;
      var endPoint = 0;

      //UserVerifyData.count({user_id: req.user.id}).exec(function (err, count) {

      UserVerifyDataRequest.find({owner_id:user_id}).exec(function (err, request_data) {
        var verify_data = [];
        var count = 0;
        if(request_data.length>0){
          request_data.forEach(function (factor, index) {
            if(typeof factor.verify_id!='undefined' && factor.verify_id!='' && factor.verify_id!=null){
                  verify_data.push(factor.verify_id);
            }
            });
            verify_data = verify_data.filter((v, i, a) => a.indexOf(v) === i);
            count = verify_data.length;
        }

        UserVerifyData.find({id: {'$in': verify_data}})
         .populate('doc_type_id',{select:['title','type']})
          .populate('verify_request_id')
          .populate('verify_request_id.user_id',{select : ['name','slug']})
          .sort('createdAt DESC')
          .paginate({page: page_no, limit: limit})
          .exec(function (err, resultData) {
            var data = [];
            for(i=0;i<resultData.length ;i++){
              data[i] = {};
              //data[i] = resultData[i];
              
              	data[i]['id'] = resultData[i]['id'];
              	data[i]['tab_type'] = (typeof resultData[i]['tab_type']!='undefined')?resultData[i]['tab_type']:'';
              	
              	if(typeof resultData[i]['doc_type_id']!='undefined' && resultData[i]['doc_type_id']['title']!='undefined'){
              		data[i]['document_type'] = resultData[i]['doc_type_id']['title'];
              	}else{
              		data[i]['document_type'] = "";
              	}

              	data[i]['createdAt'] = moment(resultData[i]['createdAt']).format('DD-MMM-YYYY');
               	data[i]['verified_by'] = [];

              
              if(typeof resultData[i]['verify_request_id']!='undefined' && resultData[i]['verify_request_id'].length>0){
	             	var verify_request_id = resultData[i]['verify_request_id'];

	              	for(j=0;j<verify_request_id.length;j++){
	                
	               		if((verify_request_id[j]['txnno']!='' || verify_request_id[j]['doc_txnno']!='') && verify_request_id[j]['status']==1){
	                		data[i]['verified_by'][j] = {};
	                		data[i]['verified_by'][j] = verify_request_id[j]['user_id'];

					    }else{
			                data[i]['verified_by'] = [];
			            }
	              	}
          		}
            }

            if (err) {
              resolve({ 
                status: 'Error', 
                msg: "error",
              });
            } else {            
              resolve({
                status:"OK",
                data:data,
                msg: "error",
              });
            }
        });
      });
    });
  },
  
  getVerifiedList: function (req, user_id) { //done

    return new Promise(function (resolve, reject) {
      var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
      var limit = (typeof req.param("limit") != 'undefined') ? req.param("limit") : 10;
      var startPoint = 0;
      var endPoint = 0;

      //UserVerifyData.count({user_id: req.user.id}).exec(function (err, count) {

      UserVerifyDataRequest.find({owner_id:user_id}).exec(function (err, request_data) {
        var verify_data = [];
        var count = 0;
        if(request_data.length>0){
          request_data.forEach(function (factor, index) {
            if(typeof factor.verify_id!='undefined' && factor.verify_id!='' && factor.verify_id!=null){
                  verify_data.push(factor.verify_id);
            }
            });
            verify_data = verify_data.filter((v, i, a) => a.indexOf(v) === i);
            count = verify_data.length;
        }

        UserVerifyData.find({id: {'$in': verify_data}})
          .populate('doc_type_id',{select:['title','type']})
          .populate('verify_request_id')
          .populate('doc_country',{select:["sortname","name"]})
          .populate('edu_id',{select:["school","degree","study_field", "degree_type", "description","from_year","to_year"]})
          .populate('exp_id')
          .populate('project_id')
          .populate('exp_id.company_id',{select: ['company_name']})
          .populate('project_id.company_id',{select: ['company_name']})
          .populate('verify_request_id.user_id',{select : ['name','slug']})
          .sort('createdAt DESC')
          .paginate({page: page_no, limit: limit})
          .exec(function (err, resultData) {
            var data = [];
            for(i=0;i<resultData.length ;i++){
				var is_verified = 0;
              data[i] = {};
              data[i] = resultData[i];
              var verify_request_id = resultData[i]['verify_request_id'];
              for(j=0;j<verify_request_id.length;j++){
                data[i]['verify_request_id'] = [];
                data[i]['verify_request_id'][j] = {};
                data[i]['verify_request_id'][j] = verify_request_id[j];
                delete data[i]['verify_request_id'][j]['createdAt'];
                delete data[i]['verify_request_id'][j]['updatedAt'];
                delete data[i]['verify_request_id'][j]['owner_id'];
                if(data[i]['verify_request_id'][j]['status']==1) {
					is_verified = 1;
				}
              }

              if(resultData[i]['exp_id']!= undefined){
                edu_data = resultData[i]['exp_id'];
                data[i]['exp_id'] = {title:(edu_data['title'] != undefined ? edu_data['title'] : ''),
                                                  'location':(edu_data['location'] != undefined ? edu_data['location'] : ''),
                                                  'from_month':(edu_data['from_month'] != undefined ? edu_data['from_month'] : ''),
                                                  'from_year':(edu_data['from_year'] != undefined ? edu_data['from_year'] : ''),
                                                  'to_month':(edu_data['to_month'] != undefined ? edu_data['to_month'] : ''),
                                                  'company_id':(edu_data['company_id'] != undefined ? edu_data['company_id'] : [])};
                
              }
              if(resultData[i]['project_id'] != undefined){
                project_data = resultData[i]['project_id'];
                data[i]['project_id'] = {title: (project_data['title'] != undefined ? project_data['title'] : ''),
                                                  'project_url':(project_data['project_url'] != undefined ? project_data['project_url'] : ''),
                                                  'description':(project_data['description'] != undefined ? project_data['description'] : ''),
                                                  'from_month':(project_data['from_month'] != undefined ? project_data['from_month'] : ''),
                                                  'from_year':(project_data['from_year'] != undefined ? project_data['from_year'] : ''),
                                                  'to_month':(project_data['to_month'] != undefined ? project_data['to_month'] : ''),
                                                  'to_year':(project_data['to_year'] != undefined ? project_data['to_year'] : ''),
                                                  'company_id':(project_data['company_id'] != undefined ? project_data['company_id'] : '')};
                
              }
              delete data[i]["color_scan"];
              delete data[i]["govt_issue_id"];
              delete data[i]["doc_has_dob"];
              delete data[i]["has_expirey_date"];
              /* delete data[i]["createdAt"]; */
              delete data[i]["updatedAt"];
              delete data[i]["user_id"];
              data[i]["is_verified"] = is_verified;
			  
            }
            if (err) {
              resolve({ 
                status: 'Error', 
                msg: "error",
              });
            } else {            
              resolve({
                status:"OK",
                data:data,
                msg: "error",
              });
            }
        });
      });
    });
  },
  
	/*
	* VerifyController.saveVerified
	* retrieve verifications list for sending for verification
	*/
  saveVerified: function (req, user_id) { //done
    return new Promise(function (resolve, reject) {
      var tab_type = req.param('tab_type');
		var doc_id='';
		
		UserVerifyData.find({"doc_id":{"$exists" : true, "$ne" : ""},select: ['doc_id']}).sort('createdAt DESC').limit(1).exec(function (err, forDocIds) {
      Users.findOne({"id":user_id}).exec(function (err, user_data) {
			if (err) {
				console.log('error in save verification')
			}

			var _newVerifyData = {
				user_id: user_data.id,
				tab_type: req.param('tab_type'),
				doc_hash: ''
      }

			if (forDocIds.length > 0 && forDocIds[0].doc_id != '') {
				doc_id = forDocIds[0].doc_id
				upload_doc_id = doc_id.slice(3, doc_id.length);
				upload_doc_id = parseInt(upload_doc_id)+parseInt(1);
				doc_id = 'DOC' + parseInt(upload_doc_id);
			} else {
				doc_id = 'DOC1201';
			}

			if(typeof req.param('tab_type')!='undefined' && req.param('tab_type')=="other_docs")
			{
				if (typeof req.param('doc_type_id') != 'undefined' && req.param('doc_type_id') != '') {
					_newVerifyData.doc_type_id = req.param('doc_type_id')
				}
			}

			if(typeof req.param('other_doc_info')!='undefined' && req.param('other_doc_info') != '') {
				_newVerifyData.other_doc_info = req.param('other_doc_info')
			}
			if(typeof req.param('comment')!='undefined' && req.param('comment') != '') {
				_newVerifyData.comment = req.param('comment')
			}

			if(typeof req.param('gender')!='undefined' && req.param('gender') != '') {
				_newVerifyData.gender = req.param('gender')
			}

			if(typeof req.param('identity_info_val')!='undefined' && req.param('identity_info_val') != '') {
				_newVerifyData.identity_flag = req.param('identity_info_val')

				if(typeof req.param('first_name')!='undefined' && req.param('first_name') != '') {
					_newVerifyData.first_name = req.param('first_name')
				}

				if(typeof req.param('last_name')!='undefined' && req.param('last_name') != '') {
					_newVerifyData.last_name = req.param('last_name')
				}

				if(typeof req.param('issue_place')!='undefined' && req.param('issue_place') != '') {
					_newVerifyData.issue_place = req.param('issue_place')
				}

				if (typeof req.param('issue_country') != 'undefined' && req.param('issue_country') != '') {
					_newVerifyData.issue_country = '';
					_newVerifyData.issue_country = req.param('issue_country')
				}

				if(typeof req.param('legal_name')!='undefined' && req.param('legal_name') != '') {
					_newVerifyData.legal_name = req.param('legal_name')
        }
        
				var bcd_dob = 0;
				if (typeof req.param('identity_dob_date') != 'undefined' && req.param('identity_dob_date') != '') {
					_newVerifyData.dob = req.param('identity_dob_date');
					bcd_dob = bcd_dob + 2;
				}
				if (typeof req.param('identity_dob_month') != 'undefined' && req.param('identity_dob_month') != '') {
					_newVerifyData.dob += '-' + req.param('identity_dob_month');
					bcd_dob = bcd_dob + 4;
				}
				if (typeof req.param('identity_dob_year') != 'undefined' && req.param('identity_dob_year') != '') {
					_newVerifyData.dob += '-' + req.param('identity_dob_year');
					bcd_dob = bcd_dob + 8;
				}
				if(bcd_dob != 14) {
					return resolve({
						status: 'Error',
						msg: 'Date of Birth required'
					})
				}

				if (typeof req.param('identity_country') != 'undefined' && req.param('identity_country') != '') {
					_newVerifyData.issue_country = '';
					_newVerifyData.issue_country = req.param('identity_country');
				}

				if (typeof req.param('state_location') !='undefined' && req.param('state_location')!='') {
          _newVerifyData.state = req.param('state_location');
        }

        if (typeof req.param('doc_country') != 'undefined' && req.param('doc_country') != '') {
					_newVerifyData.doc_country = req.param('doc_country')
				}

				if (typeof req.param('doc_type_id') != 'undefined' && req.param('doc_type_id') != '') {
					_newVerifyData.doc_type_id = req.param('doc_type_id')
				}
				if (typeof req.param('doc_num') != 'undefined' && req.param('doc_num') != '') {
					_newVerifyData.doc_num = req.param('doc_num')
				}
				if (typeof req.param('issue_date') != 'undefined' && req.param('issue_date') != '') {
					_newVerifyData.issue_date = req.param('issue_date')
				}
				if (typeof req.param('expiry_date') != 'undefined' && req.param('expiry_date') != '') {
					_newVerifyData.expiry_date = req.param('expiry_date')
				}
			}

			if(typeof req.param('identity_dob_val') != 'undefined' && req.param('identity_dob_val') != '') {
				_newVerifyData.dob_flag = req.param('identity_dob_val');

				if(typeof req.param('dob_legal_name')!='undefined' && req.param('dob_legal_name') != '') {
					_newVerifyData.legal_name = '';
					_newVerifyData.legal_name = req.param('dob_legal_name')
				}

				if (typeof req.param('issue_country') != 'undefined' && req.param('issue_country') != '') {
					_newVerifyData.issue_country = '';
					_newVerifyData.issue_country = req.param('issue_country')
				}
				if(typeof req.param('birth_doc_country') !='undefined' && req.param('birth_doc_country')!=''){
					_newVerifyData.doc_country = '';
					_newVerifyData.doc_country = req.param('birth_doc_country');
				}

				/* if (typeof req.param('dob') != 'undefined' && req.param('dob') != '') {
					_newVerifyData.dob = req.param('dob')
				} */
				
				var bcd_dob = 0;
				if (typeof req.param('dob_date') != 'undefined' && req.param('dob_date') != '') {
					_newVerifyData.dob = req.param('dob_date');
					bcd_dob = bcd_dob + 2;
				}
				if (typeof req.param('dob_month') != 'undefined' && req.param('dob_month') != '') {
					_newVerifyData.dob += '-' + req.param('dob_month');
					bcd_dob = bcd_dob + 4;
				}
				if (typeof req.param('dob_year') != 'undefined' && req.param('dob_year') != '') {
					_newVerifyData.dob += '-' + req.param('dob_year');
					bcd_dob = bcd_dob + 8;
				}
				if(bcd_dob != 14) {
					return resolve({
						status: 'Error',
						msg: 'Date of Birth required'
					})
				}
				
				if (typeof req.param('birth_place') != 'undefined' && req.param('birth_place') != '') {
					_newVerifyData.birth_place = req.param('birth_place')
				}
			}

			if (typeof req.param('identity_address_val') != 'undefined' && req.param('identity_address_val') != '') {
				_newVerifyData.address_flag = req.param('identity_address_val')

				if(typeof user_data!='undefined' && typeof user_data.name!='undefined' && user_data.name!=''){
					_newVerifyData.legal_name = '';
					_newVerifyData.legal_name = user_data.name;
				}
				if (typeof req.param('state') != 'undefined' && req.param('state') != '') {
					_newVerifyData.state = req.param('state')
				}
				if (typeof req.param('address_line_1') != 'undefined' && req.param('address_line_1') != '') {
					_newVerifyData.address_line_1 = req.param('address_line_1')
				}
				if (typeof req.param('address_line_2') != 'undefined' && req.param('address_line_2') != '') {
					_newVerifyData.address_line_2 = req.param('address_line_2')
				}
				if (typeof req.param('zip') != 'undefined' && req.param('zip') != '') {
					_newVerifyData.zip = req.param('zip')
				}
				if (typeof req.param('city') != 'undefined' && req.param('city') != '') {
					_newVerifyData.city = req.param('city')
				}

				if (typeof req.param('country') != 'undefined' && req.param('country') != '') {
					_newVerifyData.country = req.param('country')
				}
      }
      
	        var uploadPath = process.cwd() + "/.tmp/public/uploads/docs/" + tab_type + "/" + user_data.id;
	        var real_uploadPath = process.cwd() + "/assets/uploads/docs/" + tab_type + "/" + user_data.id;
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
              maxBytes: 10000000,
                dirname: path.resolve(sails.config.appPath, uploadPath)
              },function (err, uploadedFiles) {
                if(err){
                  console.log(err);
              }
              else if(uploadedFiles.length === 0){
                UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
              		resolve({
                    status: 'OK',
                    msg: 'Data save successfully',
                    data : _verifyData
                  })
          		});
              }
              else{
				//console.log("Found file --> ", uploadedFiles.length);
                if(uploadedFiles.length > 0){
                  	var fd = uploadedFiles[0].fd;
                  	var myarr = fd.split("\\");
                  	var filename = path.basename(myarr[myarr.length-1]);

	              	var allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/msword', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
	                var extension = uploadedFiles[0].type;
					//console.log("JSON file --> ", JSON.stringify(uploadedFiles));

	                if (allowedTypes.indexOf(extension) === -1) {
	                  resolve({
	                    filename: path.basename(uploadedFiles[0].fd),
	                    status: 'Error',
	                    datatype: 1,
	                    msg: 'File type is not valid'
	                  })
	                }

                  fs.readFile(fd, function (err, data) {
                    fs.writeFile(sails.config.appPath + '/assets/uploads/docs/' + tab_type + '/'+ user_data.id + '/' + filename, data, function (err) {
                    });
                  });
                  _newVerifyData.doc_url = filename;
                  _newVerifyData.doc_id = doc_id;
                }

                UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
                resolve({
	                status: 'OK',
                  msg: 'Data save successfully',
                  data : _verifyData
		            })
	          });
            }
        }); 
      });
    })
  })
  },

  UpdateVerifyRecord: function(req,user_id){
    return new Promise(function (resolve, reject) {
      var verify_id = req.param('id');
      var identity_info_check=0;
      var identity_dob_check=0;
      var identity_address_check=0;
  
      var tab_type = req.param('tab_type');
      UserVerifyData.findOne({id:verify_id}).exec(function (err,dataExist) {
        Users.findOne({id:user_id}).exec(function (err,user_data) {
			if(!dataExist){
			  resolve({
				status:"Error",
				msg:"Record not found"
			  });
			}
	  
			var _newVerifyData = {
			  user_id: user_data.id,
			  tab_type: req.param('tab_type'),
			  doc_hash: ''
			}
			_newVerifyData.identity_flag  = 0;
			_newVerifyData.dob_flag       = 0;
			_newVerifyData.address_flag   = 0;

			var old_string = (typeof req.param('old_identity_string')!='undefined')?req.param('old_identity_string'):'';
			var new_string = '';

			var upload_file_name = '';
			upload_file_name = (typeof req.param('upload_file_name') != 'undefined')? req.param('upload_file_name').trim():''; 

			//for checking verification 
			var docType =  	(typeof req.param('doc_type_id') != 'undefined')? req.param('doc_type_id').trim():''; 
			var otherDoc=	(typeof req.param('other_doc_info') != 'undefined')? req.param('other_doc_info').trim():''; 
			var comment = 	(typeof req.param('comment') != 'undefined')? req.param('comment').trim():''; 
			var docUrl  = 	(typeof dataExist!='undefined' && typeof dataExist.doc_url!='undefined')?dataExist.doc_url:'';
			
			var name_str='';
			var first_name 	=(typeof req.param('first_name')!='undefined')?req.param('first_name').trim():'';
			var last_name 	=(typeof req.param('last_name')!='undefined')?req.param('last_name').trim():'';
			var legal_name 	=(typeof req.param('legal_name')!='undefined')?req.param('legal_name').trim():'';
			var doc_num 	=(typeof req.param('doc_num')!='undefined')?req.param('doc_num').trim():'';

			var issueCountry = '';
			issueCountry = (typeof req.param('issue_country')!='undefined')?req.param('issue_country').trim():'';

			var issue_place	=(typeof req.param('issue_place')!='undefined')?req.param('issue_place').trim():'';
			var issue_date	=(typeof req.param('issue_date')!='undefined')?req.param('issue_date').trim():'';
			var expiry_date	=(typeof req.param('expiry_date')!='undefined')?req.param('expiry_date').trim():'';

			var dob = '';
			var country='';
			country =(typeof req.param('country')!='undefined')?req.param('country').trim():'';
		
			if(typeof req.param('identity_info_val')!='undefined' && req.param('identity_info_val') != '') {
				country='';
				var bcd_dob = 0;
				if (typeof req.param('identity_dob_date') != 'undefined' && req.param('identity_dob_date') != '') {
					dob= req.param('identity_dob_date');
					bcd_dob = bcd_dob + 2;
				}
				if (typeof req.param('identity_dob_month') != 'undefined' && req.param('identity_dob_month') != '') {
					dob += '-' + req.param('identity_dob_month');
					bcd_dob = bcd_dob + 4;
				}
				if (typeof req.param('identity_dob_year') != 'undefined' && req.param('identity_dob_year') != '') {
					dob += '-' + req.param('identity_dob_year');
					bcd_dob = bcd_dob + 8;
				}
				if(bcd_dob != 14) {
					return resolve({
					  status: 'Error',
					  msg: 'Date of Birth required11'
					})
				}
			}

			if(typeof req.param('identity_dob_val')!='undefined' && req.param('identity_dob_val') != '') {
				country='';
				var bcd_dob = 0;
				if (typeof req.param('dob_date') != 'undefined' && req.param('dob_date') != '') {
					dob = req.param('dob_date');
					bcd_dob = bcd_dob + 2;
				}
				if (typeof req.param('dob_month') != 'undefined' && req.param('dob_month') != '') {
					dob += '-' + req.param('dob_month');
					bcd_dob = bcd_dob + 4;
				}
				if (typeof req.param('dob_year') != 'undefined' && req.param('dob_year') != '') {
					dob += '-' + req.param('dob_year');
					bcd_dob = bcd_dob + 8;
				}
				if(bcd_dob != 14) {
					return resolve({
						status: 'Error',
						msg: 'Date of Birth required222'
					})
				}
			}
		
			var birth_place =(typeof req.param('birth_place')!='undefined')?req.param('birth_place').trim():'';
			var address_1 	=(typeof req.param('address_line_1')!='undefined')?req.param('address_line_1').trim():'';
			var address_2 	=(typeof req.param('address_line_2')!='undefined')?req.param('address_line_2').trim():'';
			var city 		=(typeof req.param('city')!='undefined')?req.param('city').trim():'';
			var zip 		=(typeof req.param('zip')!='undefined')?req.param('zip').trim():'';
			var state 		=(typeof req.param('state')!='undefined')?req.param('state').trim():'';
			var doc_country =(typeof req.param('doc_country')!='undefined')?req.param('doc_country').trim():'';
			var gender 		=(typeof req.param('gender')!='undefined')?req.param('gender'):'';
									
			if(first_name!='' || last_name!='') {
				name_str=first_name+last_name;
			} else {
				name_str=legal_name;
			}
			if(typeof req.param("identity_del_doc")!='undefined') {
				if(req.param("identity_del_doc") == '1') {
					docUrl='';
				} else if(req.param("identity_del_doc") == '0') {
					if(upload_file_name!=''){
						docUrl =upload_file_name;
					}
				}
			}
			if(typeof req.param('tab_type')!='undefined' && req.param('tab_type')=="other_docs"){
				new_string = docType+'-'+otherDoc+'-'+comment+'-'+docUrl;
			} else {
				if (typeof req.param('identity_address_val')!='undefined' && req.param('identity_address_val') != '') {
					docType='';
				}
				new_string = docType+name_str+doc_num+issueCountry+issue_place+issue_date;
				new_string+= expiry_date+dob+birth_place+address_1+address_2+city+state;
				new_string+= country+zip+doc_country+gender+comment+docUrl;
			}
			//console.log('OLD===>',old_string);
			//console.log('NEW===>',new_string);
			if(typeof req.param('comment')!='undefined' && req.param('comment')!='') {
				_newVerifyData.comment = req.param('comment')
			}
			if(typeof req.param('tab_type')!='undefined' && req.param('tab_type')=="other_docs") {
				if (typeof req.param('doc_type_id') != 'undefined' && req.param('doc_type_id') != '') {
					_newVerifyData.doc_type_id = req.param('doc_type_id')
				}  
				if(typeof req.param('other_doc_info')!='undefined' && req.param('other_doc_info')!='') {
					_newVerifyData.other_doc_info = req.param('other_doc_info')
				}
			}
			if(typeof req.param('gender')!='undefined' && req.param('gender') != '') {
				_newVerifyData.gender = req.param('gender')
			}
			if(typeof req.param('identity_info_val')!='undefined' && req.param('identity_info_val') != '') {
				_newVerifyData.identity_flag = req.param('identity_info_val');
				identity_info_check = 1;

				if(typeof req.param('first_name')!='undefined' && req.param('first_name') != '') {
					_newVerifyData.first_name = req.param('first_name')
				}
				if(typeof req.param('last_name')!='undefined' && req.param('last_name') != '') {
					_newVerifyData.last_name = req.param('last_name')
				}
				if(typeof req.param('issue_place')!='undefined' && req.param('issue_place') != '') {
					_newVerifyData.issue_place = req.param('issue_place')
				}
				if (typeof req.param('issue_country') != 'undefined' && req.param('issue_country') != '') {
					_newVerifyData.issue_country = '';
					_newVerifyData.issue_country = req.param('issue_country')
				}
				if(typeof req.param('legal_name')!='undefined' && req.param('legal_name')!='') {
					_newVerifyData.legal_name = req.param('legal_name')
				}
				if(typeof req.param('doc_type_id')!='undefined' && req.param('doc_type_id')!='') {
					_newVerifyData.doc_type_id = req.param('doc_type_id')
				}
				if(typeof req.param('doc_num')!='undefined' && req.param('doc_num')!='') {
					_newVerifyData.doc_num = req.param('doc_num')
				}
				/*if (typeof req.param('issue_country')!='undefined' && req.param('issue_country')!='') {
					_newVerifyData.issue_country = req.param('issue_country')
				}*/
				if (typeof req.param('issue_date')!='undefined' && req.param('issue_date')!='') {
					_newVerifyData.issue_date = req.param('issue_date')
				}
				if (typeof req.param('expiry_date') !='undefined') {
					_newVerifyData.expiry_date = req.param('expiry_date')
				}
				if(typeof req.param('doc_country') != 'undefined' && req.param('doc_country') != '') {
					_newVerifyData.doc_country = req.param('doc_country')
				}
				if (typeof req.param('state_location') !='undefined' && req.param('state_location')!='') {
					_newVerifyData.state = req.param('state_location');
				}
				if (typeof dob!='undefined' && dob!='') {
					_newVerifyData.dob = dob;
				}
			}

			if(typeof req.param('identity_dob_val')!='undefined' && req.param('identity_dob_val') != '') {
				_newVerifyData.dob_flag = req.param('identity_dob_val');
				identity_dob_check=1;
				if(typeof req.param('dob_legal_name')!='undefined' && req.param('dob_legal_name') != '') {
					_newVerifyData.legal_name = '';
					_newVerifyData.legal_name = req.param('dob_legal_name')
				}
				if(typeof req.param('birth_doc_country') !='undefined' && req.param('birth_doc_country')!=''){
					_newVerifyData.doc_country = '';
					_newVerifyData.doc_country = req.param('birth_doc_country');
				}
				if(typeof req.param('issue_country') != 'undefined' && req.param('issue_country') != '') {
					_newVerifyData.issue_country = '';
					_newVerifyData.issue_country = req.param('issue_country')
				}
				if (dob!='') {
					_newVerifyData.dob = dob;
				}
				if (typeof req.param('birth_place')!='undefined' && req.param('birth_place') != '') {
					_newVerifyData.birth_place = req.param('birth_place')
				}
				if (dob=='') {
					return resolve({
						status: 'Error',
						msg: 'Please enter Birthdate'
					})
				}
			}
			if (typeof req.param('identity_address_val')!='undefined' && req.param('identity_address_val') != '') {
				_newVerifyData.address_flag = req.param('identity_address_val');
				identity_address_check = 1;
				if (typeof req.param('address_line_1')!='undefined' && req.param('address_line_1')!='') {
					_newVerifyData.address_line_1 = req.param('address_line_1')
				}
				if (typeof req.param('address_line_2') !='undefined' && req.param('address_line_2')!='') {
					_newVerifyData.address_line_2 = req.param('address_line_2')
				}
				if (typeof req.param('zip') !='undefined' && req.param('zip')!='') {
					_newVerifyData.zip = req.param('zip')
				}
				if (typeof req.param('city') !='undefined' && req.param('city')!='') {
					_newVerifyData.city = req.param('city')
				}
				if (typeof req.param('state') !='undefined' && req.param('state')!='') {
					_newVerifyData.state = req.param('state')
				}
				if (typeof req.param('country') !='undefined' && req.param('country')!='') {
					_newVerifyData.country = req.param('country')
				}
			}
			if(identity_address_check==0){
				if(dataExist.address_flag==1){
					_newVerifyData.address_line_1='';
					_newVerifyData.address_line_2='';
					_newVerifyData.zip='';
					_newVerifyData.city='';
					_newVerifyData.state='';
					_newVerifyData.country='';
				}
			}
			if(identity_dob_check==0){
				if(dataExist.dob_flag==1){
					_newVerifyData.dob='';
					_newVerifyData.birth_place='';
				}
			}
			if(typeof req.param("identity_del_doc")!='undefined' && req.param("identity_del_doc") == '1') {
				_newVerifyData.doc_url='';
			}
			if(old_string!=''){
				if(new_string!=old_string){
					var statusArr = [1,2];
					UserVerifyData.find({select:['id']}).where({id:req.param('id')}).then(function (userverifydatas) {
						var userverifydata_ids = [];
						_.each(userverifydatas, function (userverifydata) {
							userverifydata_ids.push(userverifydata.id);
						});
					
						UserVerifyDataRequest.destroy({verify_id:userverifydata_ids,status:{'$in': statusArr}}).exec(function (err){
							if (err) {
								return resolve({
								  status: 'Error',
								  msg:'Identity verify request not delete. Please try again'
								});
							}
						});
					}); 
				}
			}
			//document related script
			var uploadPath = process.cwd() + "/.tmp/public/uploads/docs/" + tab_type + "/" + user_data.id;
			var real_uploadPath = process.cwd() + "/assets/uploads/docs/" + tab_type + "/" + user_data.id;
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
				maxBytes: 10000000,
				dirname: path.resolve(sails.config.appPath, uploadPath)
			},function (err, uploadedFiles) {
				if(err) {
					console.log(err);
				} else if(uploadedFiles.length === 0) {
					UserVerifyData.update(req.param('id'), _newVerifyData).then(function (_verify) {
						if(_verify.length > 0){
						  _verify =_verify[0];
						}  
						return resolve({
						  status: 'OK',
						  msg: 'Record update successfully',
						  data : _verify
						})
					}).catch(function (error) {
						return resolve({
						  status: 'Error',
						  msg: 'Fail to update record'
						})
					});
				} else {
					var fd = uploadedFiles[0].fd;
					var myarr = fd.split("\\");
					var filename = path.basename(myarr[myarr.length-1]);
					fs.readFile(fd, function (err, data) {
						fs.writeFile(sails.config.appPath + '/assets/uploads/docs/' + tab_type + '/'+ user_data.id + '/' + filename, data, function (err) {
						});
					});
					_newVerifyData.doc_url=filename;
					UserVerifyData.update(req.param('id'), _newVerifyData).then(function (_verify) {
						if(_verify.length > 0){
						  _verify =_verify[0];
						}  
						return resolve({
							status: 'OK',
							msg: 'Record update successfully',
							data : _verify
						})
					}).catch(function (error) {
					  return resolve({
						status: 'Error',
						msg: 'Fail to update record'
					  })
					});
				}
			});
        });
      });
    });
  },
  
	/*
	* VerifyController.verifydata
	*
	*
	*/
	/* verifydata: function (req, res, next) {
		Web3 = require('web3')
		web3 = new Web3(new Web3.providers.HttpProvider(eth_URL))

		var fs = require('fs')
		var contract = JSON.parse(fs.readFileSync(contractFile, 'utf8'))

		var abiDefinition = contract.abi
		var smartContract = web3.eth.contract(abiDefinition).at(contract.networks['4'].address)
		var contractAddress = contract.networks['4'].address

		var user = req.param('user').trim()
		var datatype = req.param('datatype').trim()
		var data = req.param('data').trim()

		var key = require('crypto').createHash('md5').update(user + datatype).digest('hex')
		var dataEnteredHash = require('crypto').createHash('sha256').update(data).digest('hex')
		var dataBlockchainHash = smartContract.verifyData(key)

		console.log(dataEnteredHash)
		console.log(dataBlockchainHash)

		result = []
		result[0] = dataEnteredHash
		result[1] = dataBlockchainHash

		if (dataEnteredHash == dataBlockchainHash) {
			console.log('Success : Data Value Hashes Match...')
			result[2] = 'Success : Data Value Hashes Match...'
		} else {
			console.log('Failed : Data Value Hashes Do not Match...')
			result[2] = 'Failed : Data Value Hashes Do not Match...'
		}
		res.json(result)
	}, */

	/*
	* SendEmailVerifyCode
	* jay vaghela
	*
	*/
	SendEmailVerifyCode: function (req, user_id) { //done
	
		return new Promise(function (resolve, reject) {
			
			var crypto		= require('crypto')
			var email_address = req.param('email');
			email_address     = email_address.trim();

			//check valid email address
			var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

			if(!regex.test(email_address)){
				return resolve({
					status: 'Error',
					msg: 'Please enter valid email address'
				});
			}

			UserContactVerifyData.findOne({email: email_address, user_id: user_id, is_email_verify: 0}).exec(function (err, userEmail) {
				Users.findOne({'id':user_id}).exec(function(err,user_data){
				if (userEmail) {
				  code				= userEmail.email_otp
				  var encrypt_key	= ''
				  var encrypt_code	= code + '_' + user_id
				  var mykey			= crypto.createCipher('aes-128-cbc', 'mypassword')
				  var encrypt_key	= mykey.update(encrypt_code, 'utf8', 'hex')
				  encrypt_key		+= mykey.final('hex')

				  sails.hooks.email.send(
					'verifyEmail', {
					  siteURL: sails.config.appUrlwPort, recipientName: user_data.name, otpcode: encrypt_key, email_otp:code, recipientEmail: email_address
					}, {
					  to: email_address,
					  subject: 'Email verification Lynked.World'
					},
					function (err) {
						console.log(err || 'It worked!');
						if (err) {
							if (typeof err.response != 'undefined' && err.response != '') {
								return resolve({
									status: 'Error',
									msg: err.response
								})
							}
						} else {
							return resolve({ _verify: userEmail,status: 'OK',msg: 'Resend Email Verification link sent successfully' })
						}
					})
				} else {
				  UserContactVerifyData.find({email: email_address, is_email_verify:1}).where({'user_id.id':{'!':user_id},'user_id.company_id': {"$exists" :false}}).exec(function (err, checkEmail) {
					if(typeof user_data.company_id=='undefined' || user_data.company_id==''){
					  if (checkEmail.length > 0) {
						return resolve({
							checkEmail: checkEmail,
							status: 'Error',
							msg: 'Email is associated with other account'
						  })
						}
					  } 

					  var pass_unq = 0
					  do {
						code = RefferalCode.randomStringGen({ length: 6 })
						UserContactVerifyData.find({email_otp: code}).exec(function (err, foundCode) {
						  if (foundCode.length == 0) {
							pass_unq = 1
						  } else {
							pass_unq = 0 // try gen new code
						  }
						})
					  } while (pass_unq > 1)

					  var verifyData = {email: email_address, user_id: user_id, email_otp: code}
					  UserContactVerifyData.findOne({user_id: user_id}).exec(function (err, userExist) {
						  if (!userExist) {
						  UserContactVerifyData.create(verifyData).exec(function (err, _verify) {
							if (err) {
							  resolve({
								verifyData: verifyData,
								status: 'Error',
								msg: 'Fail to send verification link'
							  })
							}
							var encrypt_key = ''
							var encrypt_code = code + '_' + user_id
							var mykey = crypto.createCipher('aes-128-cbc', 'mypassword')
							var encrypt_key = mykey.update(encrypt_code, 'utf8', 'hex')
							encrypt_key += mykey.final('hex')

							sails.hooks.email.send(
							  'verifyEmail', {
								siteURL: sails.config.appUrlwPort,recipientName: user_data.name,otpcode: encrypt_key,email_otp:code,recipientEmail: email_address
							  }, {
								to: email_address,
								subject: 'Email verification Lynked.World'
							  },
							  function (err) {
								  console.log(err || 'It worked!');
								  if (err) {
									if (typeof err.response != 'undefined' && err.response != '') {
										return resolve({
											status: 'Error',
											msg: err.response
										})
									}
								  } else {
									resolve({
										_verify: _verify,
										status: 'OK',
										msg: 'Email Verification OTP sent successfully'
									})
								  }
							  })
						  })
						} else {
						  if (typeof userExist.email == 'undefined' && typeof userExist.email_otp == 'undefined') {
							UserContactVerifyData.update(userExist.id, verifyData).then(function (_verify) {
							  var encrypt_key = ''
							  var encrypt_code = code + '_' + user_id
							  var mykey = crypto.createCipher('aes-128-cbc', 'mypassword')
							  var encrypt_key = mykey.update(encrypt_code, 'utf8', 'hex')
							  encrypt_key += mykey.final('hex')

							  sails.hooks.email.send(
								'verifyEmail', {
								  siteURL: sails.config.appUrlwPort,recipientName: user_data.name,otpcode: encrypt_key,email_otp:code,recipientEmail: email_address
								}, {
								  to: email_address,
								  subject: 'Email verification Lynked.World'
								},
								function (err) {
									console.log(err || 'It worked!');
									if (err) {
										if (typeof err.response != 'undefined' && err.response != '') {
											return resolve({
												status: 'Error',
												msg: err.response
											})
										}
									} else {
									  resolve({
										_verify: _verify,
										status: 'OK',
										msg: 'Email Verification OTP sent successfully'
									  })
									}
								})
							}).catch(function (error) {
							  resolve({
								verifyData: verifyData,
								status: 'Error',
								msg: 'Fail to send verification OTP'
							  })
							})
						  }else{                    
							if(typeof userExist.email!='undefined' && userExist.email!=''){
							  if(userExist.email!=verifyData.email){
								verifyData.is_email_verify=0;

								UpdateVerifyStatusService.VerifyStatus({
								  user_id:user_id,
								  phone:userExist.is_phone_verify,
								  email:0,
								});

							  }else if(userExist.email==verifyData.email){
								if(userExist.is_email_verify==1){
								  resolve({
									status: 'OK',
									msg: 'Email already verify'
								  })
								}
							  }
							}

							UserContactVerifyData.update(userExist.id, verifyData).then(function (_verify) {
							  var encrypt_key = ''
							  var encrypt_code = code + '_' + user_id
							  var mykey = crypto.createCipher('aes-128-cbc', 'mypassword')
							  var encrypt_key = mykey.update(encrypt_code, 'utf8', 'hex')
							  encrypt_key += mykey.final('hex')

							  sails.hooks.email.send(
								'verifyEmail', {
								  siteURL: sails.config.appUrlwPort,recipientName: user_data.name,otpcode: encrypt_key,email_otp:code,recipientEmail: email_address
								}, {
								  to: email_address,
								  subject: 'Email verification Lynked.World'
								},
								function (err) {
									console.log(err || 'It worked!');
									if (err) {
										if (typeof err.response != 'undefined' && err.response != '') {
											return resolve({
												status: 'Error',
												msg: err.response
											})
										}
									} else {
									  resolve({
										_verify: _verify,
										status: 'OK',
										msg: 'Resend Email Verification link sent successfully'
									  })
									}
								})  
							}).catch(function (error) {
							  resolve({
								status: 'Error',
								msg: 'Fail to store information,Please try again'
							  })
							})  
						  }
						}
					  })
				  })
				}
			  })
			});
		})
	},

  SendPhoneVerifyCode: function (req, user_id) { //done
    console.log(req.params.all());
    return new Promise(function (resolve, reject) {
      var phone_no = req.param('phone');
      var dial_code = req.param('dial_code');
      var my_contact= '';
      var otp_text = 'Your Lynked.World confirmation code is : ';
      var verify_type='phone_verify';
      if(dial_code.indexOf("+") == -1){
		  dial_code = '+' + dial_code.trim();
	  }
      if(phone_no=='' || dial_code==''){
        resolve({status: 'Error',msg: 'Phone & Dial code both required' })
      }
  
      SmsLogsService.checkSmsLog(user_id,verify_type).then(function(smslimit){
        if(smslimit>=2){
          resolve({status: 'OK',msg: 'Sent Phone OTP successfully' })
        }
  
      UserContactVerifyData.findOne({user_id: user_id,is_phone_verify:0,phone: phone_no,dial_code:dial_code}).exec(function (err, userEmail) {
        if (userEmail) {
          var msg = otp_text + userEmail.phone_otp
          var messageInfo = ''
          my_contact = dial_code+phone_no;
  
         twilioSms.sendSMS(dial_code, my_contact, msg).then(function(data){
            if(data.status){            
              messageInfo = {
                owner_id   : user_id,
                message_id : data.data.sid,
                message    : data.data.body,
                sendto     : data.data.to,
                  status     : data.data.status,
                  sms_type    :'phone_verify'
              }
              SmsLogsService.StoreSmsLogs(messageInfo);
  
              resolve({ _verify: userEmail,status: 'OK',msg: 'Resend Phone OTP successfully' })
            } else {
              resolve({status: 'Error',msg: 'Fail to send OTP,Please try again' })
            }
          });
  
        }else {
          UserContactVerifyData.find({phone: phone_no,is_phone_verify:1,dial_code:dial_code}).where({'user_id.id':{'!':user_id},'user_id.company_id': {"$exists" :false}}).exec(function (err, checkEmail) {
            Users.findOne({id:user_id}).exec(function(err,User_data){
              if((typeof User_data != 'undefined') && (typeof User_data.company_id=='undefined' || User_data.company_id=='')) {
                if(checkEmail.length > 0) {
                  resolve({
                    checkEmail: checkEmail,
                    status: 'Error',
                    msg: 'Phone Number is associated with other account'
                  })
                }
              }
  
              UserContactVerifyData.findOne({user_id: user_id}).exec(function (err, userExist) {
                var code = ''
                var pass_unq = 0
                do {
                  code = RefferalCode.randomStringGen({ length: 6 })
                  UserContactVerifyData.find({phone_otp: code}).exec(function (err, foundCode) {
                    if (foundCode.length == 0) {
                      pass_unq = 1
                    } else {
                      pass_unq = 0 // try gen new code
                    }
                  })
                } while (pass_unq > 1)
  
                var verifyData = {phone: phone_no,user_id: user_id,phone_otp: code,dial_code:dial_code}
                var msg = otp_text + code;
                var messageInfo = '';
                my_contact = dial_code+phone_no;
  
                twilioSms.sendSMS(dial_code, my_contact, msg).then(function(data){
                  if(data.status){            
                    messageInfo = {
                      owner_id   : user_id,
                      message_id : data.data.sid,
                      message    : data.data.body,
                      sendto     : data.data.to,
                        status     : data.data.status,
                        sms_type    :'phone_verify'
                    }
  
                    // store message logs
                    SmsLogsService.StoreSmsLogs(messageInfo);
  
                    if (!userExist) {
                      UserContactVerifyData.create(verifyData).exec(function (err, _verify) {
                        if (err) {
                          resolve({
                            verifyData: verifyData,
                            status: 'Error',
                            msg: 'Fail to store information,Please try again'
                          })
                        }
                        resolve({
                          _verify: _verify,
                          status: 'OK',
                          msg: 'Sent Phone OTP successfully'
                        })
                      })
                    }else {
                      if (typeof userExist.phone == 'undefined' && typeof userExist.phone_otp == 'undefined') {
                        UserContactVerifyData.update(userExist.id, verifyData).then(function (_verify) {
                          resolve({
                            _verify: _verify,
                            status: 'OK',
                            msg: 'Sent Phone OTP successfully'
                          })
                        }).catch(function (error) {
                          resolve({
                            verifyData: verifyData,
                            status: 'Error',
                            msg: 'Fail to store information,Please try again'
                          })
                        })
                      }else{
  
                        if(typeof userExist.phone!='undefined' && userExist.phone!=''){
                          if(userExist.phone!=verifyData.phone || userExist.dial_code!=verifyData.dial_code){
                            verifyData.is_phone_verify=0;
  
                            UpdateVerifyStatusService.VerifyStatus({
                              user_id:user_id,
                              phone:0,
                              email:userExist.is_email_verify,
                            });
  
                          }else if(userExist.phone==verifyData.phone && userExist.dial_code==verifyData.dial_code){
                            if(userExist.is_phone_verify==1){
                              resolve({
                                status: 'OK',
                                msg: 'Phone already verify'
                              })
                            }
                          }
                        }
  
                        UserContactVerifyData.update(userExist.id, verifyData).then(function (_verify) {
                          resolve({
                            _verify: _verify,
                            status: 'OK',
                            msg: 'Resend Phone OTP successfully'
                          })
                        }).catch(function (error) {
                          resolve({
                            verifyData: verifyData,
                            status: 'Error',
                            msg: 'Fail to store information,Please try again'
                          })
                        })
                      }
                    }
                  } else {
                    resolve({
                      status: 'Error',
                      msg: 'Fail to send OTP,Please try again'
                    })
                  }
                })
              })
            })
          })
        }
      })
      })
    })
  },

  VerifyPhoneOTP: function (req,user_id){ //done
    var phone_otp = req.param('otp');
    return new Promise(function (resolve, reject) {
      UserContactVerifyData.findOne({phone_otp:phone_otp,user_id: user_id}).exec(function (err,userExist) {
        if(!userExist){
          resolve({
              status: 'Error',
              msg: 'Invalid OTP,Please try another'
            });
          }else{
            var verifyData = {is_phone_verify:1};
            UserContactVerifyData.update(userExist.id, verifyData).then(function (_verify) {
              UserFcmkey.find({user_id:user_id}).exec(function(err,user_FCM_key){
                if(user_FCM_key != undefined && user_FCM_key.length > 0){
                  for(i=0;i<user_FCM_key.length ;i++){
                    FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],_verify,'Phone verification has been successfully',1);
                  }
                }
                resolve({
                  _verify: _verify,
                  status: 'OK',
                  msg: 'Phone verification has been successfully'
                })
              })
            }).catch(function (error) {
              resolve({
                status: 'Error',
                msg: 'Invalid OTP,Please try another'
              });
            });
          }
      });
    });
  },

  storeEducationForVerify: function(req,user_id,request_type){ //done
    return new Promise(function (resolve, reject) {
      UserVerifyData.find({"doc_id":{"$exists" : true, "$ne" : ""}},{select: ['doc_id']}).sort('createdAt DESC').limit(1).exec(function(err, forDocIds) {
        if(forDocIds.length > 0 && forDocIds[0].doc_id != '') {
          doc_id = forDocIds[0].doc_id; 
          doc_id = doc_id.slice(3,doc_id.length);
          doc_id++;
          doc_id = 'DOC'+doc_id;
        } else {
          doc_id = "DOC001201"; 
        }
        if (err) {
          resolve({status : 'Error','msg':'Create document id fail !'});
        }
        
        if(req.param("doc_type_id") != '' && req.param("edu_id") != '') {
            var _newVerifyData = {
              user_id: user_id,
              doc_type_id: req.param("doc_type_id"),
              doc_id: doc_id,
              edu_id: req.param("edu_id"),
              comment: req.param("comment"),
              tab_type:req.param("tab_type"),
              doc_hash: ''
            };
            
            _newVerifyData.has_expirey_date = '';

            if(req.param("color_scan") != '') {
              _newVerifyData.color_scan = req.param("color_scan");
            }
            if(req.param("govt_issue_id") != '') {
              _newVerifyData.govt_issue_id = req.param("govt_issue_id");
            }

            if(req.param("has_expirey_date") != '') {
              _newVerifyData.has_expirey_date = req.param("has_expirey_date");
            }

            var doc_file = req.file('doc_url');
            var dir = 'assets/uploads/docs/identity/' + user_id + '/';
            if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
            }
            doc_file.upload({
              dirname: require('path').resolve(sails.config.appPath, dir),
              maxBytes: 7000000,
            },function (err, uploadedFiles) {
            
              if (err) resolve({status : 'Error','msg':'Create document id fail !'});
                  if (uploadedFiles.length === 0){
                    resolve({stauts:'Error',msg : 'No file was uploaded'});
                  }
                  var allowedTypes = ['image/png', 'image/jpg', 'image/jpeg','application/msword','application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                  var extension = uploadedFiles[0].type;

              if(allowedTypes.indexOf(extension)=== -1){
                resolve({
                  filename: path.basename(uploadedFiles[0].fd),
                  status:'Error',
                  datatype:1,
                  msg: 'File type is not valid'
                });
              }
              _newVerifyData.doc_url = path.basename(uploadedFiles[0].fd);
              UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
                resolve({
                  filename: path.basename(uploadedFiles[0].fd),
                  status:'OK',
                  datatype:2,
                  msg: 'Education details save successfully!'
                });
              });
            });
          }else{
            resolve({
              filename: '',
              status:'Error',
              msg: 'Document type or Education field is require'
            });
          }
      });
    });
  },

  storeExperienceForVerify :function(req,user_id,request_type){ //done
    return new Promise(function (resolve, reject) {
      UserVerifyData.find({"doc_id":{"$exists" : true, "$ne" : ""}},{select: ['doc_id']}).sort('createdAt DESC').limit(1).exec(function (err, forDocIds) {
        if (forDocIds.length > 0 && forDocIds[0].doc_id != '') {
          doc_id = forDocIds[0].doc_id
          doc_id = doc_id.slice(3, doc_id.length)
          doc_id++
          doc_id = 'DOC' + doc_id
        } else {
          doc_id = 'DOC1201'
        }
        if (err) {
          console.log('error in experience flag')
        }

        if (req.param('doc_type_id') != '' && req.param('exp_id') != '') {
          var _newVerifyData = {
            user_id: user_id,
            doc_type_id: req.param('doc_type_id'),
            doc_id: doc_id,
            exp_id: req.param('exp_id'),
            comment: req.param('comment'),
            tab_type: req.param('tab_type'),
            designation: req.param('designation'),
            doc_hash: ''
          }

          if (req.param('color_scan') != '') {
            _newVerifyData.color_scan = req.param('color_scan')
          }
          if (req.param('has_expirey_date') != '') {
            _newVerifyData.has_expirey_date = req.param('has_expirey_date')
          }

          var doc_file = req.file('doc_url');
          
          var dir = process.cwd()+'assets/uploads/docs/identity/' + user_id + '/'
          if (!fs.existsSync(dir)) {
        fs.mkdir(dir, function (err) {
          if (err) { console.log('failed to create directory', err);
          } else { }
        });
          }
          doc_file.upload({
            dirname: require('path').resolve(sails.config.appPath, dir),
            maxBytes: 7000000
          }, function (err, uploadedFiles) {
            if (err) resolve({status : 'Error','msg':'Create document id fail !'});
            if (uploadedFiles.length === 0) {
              //return res.badRequest('No file was uploaded')
              _newVerifyData.doc_id = '';
            }

            var allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/msword', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
            var extension = uploadedFiles[0].type

            if (allowedTypes.indexOf(extension) === -1) {
              resolve({
                filename: path.basename(uploadedFiles[0].fd),
                status: 'Error',
                datatype: 1,
                msg: 'File type is not valid'
              })
            }
            _newVerifyData.doc_url = path.basename(uploadedFiles[0].fd)
            UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
              resolve({
                filename: path.basename(uploadedFiles[0].fd),
                status: 'OK',
                datatype: 2,
                msg: 'Data save successfully!'
              })
            })
          })
        }else {
          resolve({
            filename: '',
            status: 'Error',
            msg: 'Document type or Experience field is require'
          })
        }
      })
    });
  },

  getOneVerifyData :function(req,user_id){ //done
	//console.log("Data ..............req.params = " + JSON.stringify(req.params.all()));
	var verify_id = req.param('id');
	var condition= {verify_id: verify_id};
	var verify_status = (typeof req.param('only_verify')!='undefined')?req.param('only_verify'):[0, 1, 2];
	condition.status= verify_status;
	var verify_own = (typeof req.param('own_request')!='undefined' && req.param('own_request')==1)?condition.user_id=user_id:0;
	return new Promise(function (resolve, reject) {
	  UserVerifyData.findOne().where({id: verify_id}).populate('doc_type_id').exec(function (err, verify_data) {
		if (typeof verify_data == 'undefined') {
			resolve({
					status: 'Error',
					msg: 'Pass arguments invalid! Please pass valid arguments.'
				});
		} else {
			if (err) { return next(err); } else {
				if (typeof verify_data.gender != 'undefined') {
					if (verify_data.gender == 1) {
						verify_data.gender = 'Male';
					}
					if (verify_data.gender == 2) {
						verify_data.gender = 'Female';
					}
					if (verify_data.gender == 3) {
						verify_data.gender = 'Not Specified';
					}
				}
			  UserVerifyDataRequest.find(condition)
				.populate('user_id', {select: ['name','profile_image','slug']})
				.exec(function (err, requestData) {
				if (err) {
				  resolve({
					status:'Error',
					msg: 'Nodata found !'
				  }); 
				} else {
				  UserEducations.findOne().where({id:verify_data.edu_id}).exec(function(err, edu) {
					if(edu) {
					  verify_data.education = edu;
					}
					UserExperiences.findOne().where({id:verify_data.exp_id}).populate('company_id').exec(function(err, _exp) {
					  if(_exp) {
						verify_data.experience = _exp;
					  }
					  UserProjects.findOne().where({id:verify_data.project_id}).populate('company_id').exec(function(err, _project) {
						if(_project) {
						  verify_data.project = _project;
						}
						Users.findOne({id:user_id}).exec(function(err,user){                            
						  verify_data.user_name = user.name;
						  verify_data.request_data = requestData;
						  
						  if(verify_data.doc_url != undefined){
							verify_data.full_url = sails.config.appUrlwPort + '/uploads/docs/' + verify_data.tab_type + '/' + verify_data.user_id + '/' + verify_data.doc_url;
						  }
						  verify_data.data_txn_url = sails.config.ether_lieve_server;
						  verify_data.profile_image_url = sails.config.appUrlwPort + sails.config.profile_image_url;

						  resolve({
							status:'OK',
							msg: 'Verify Data!',
							data : verify_data
						  }); 
						});
					  })
					})
				  })
				}
			  });
			}
		}
	  });
	});      
  },

  StoreUserVerifyDataRequest: function (req, user_id,request_type) {
    return new Promise(function (resolve, reject) {
      var verify_id = req.param('id');
  	  var condition = '';
  	  var statusArr=[0,1];

      if (req.param('id')!= '' && typeof req.param('connection')!='undefined' && req.param('connection')!= '') {
        var verifyDataRequest = {
          verify_id: verify_id,
          user_id: req.param('connection'),
          owner_id: user_id
        }

        // where condition
        condition = {verify_id:verify_id,user_id:req.param("connection"),owner_id:user_id,status:{'$in': statusArr}}

        var data_flag=0;
        var doc_flag=0;
        if (req.param('to_verify_data_h') != '') {
          verifyDataRequest.to_verify_data = 1;
          data_flag=1;
        }
        if (req.param('to_verify_doc_h') != '') {
          verifyDataRequest.to_verify_doc = 1;
          doc_flag=1;
        }

        if(data_flag==1){
        	condition.to_verify_data=1;
        }
        if(doc_flag==1){
        	condition.to_verify_doc=1;
        }

        //console.log('Where Parameter===>',JSON.stringify(condition));
        
        UserVerifyDataRequest.findOne(condition).where().exec(function(err, _recExist) {
          if(_recExist) {
            resolve({
              status: 'Error',
              msg: 'Verify request is already sent'
            })
          }
          else{
	          UserVerifyData.find({"doc_id":{"$exists" : true, "$ne" : ""},select: ['doc_id']}).sort('createdAt DESC').limit(1).exec(function (err, forDocIds) {
	            if (forDocIds.length > 0 && forDocIds[0].doc_id != '') {
	              doc_id = forDocIds[0].doc_id
	              doc_id = doc_id.slice(3, doc_id.length)
	              doc_id++
	              doc_id = 'DOC' + doc_id
	            } else {
	              doc_id = 'DOC1201'
	            }
	            
	            var _newVerifyData = {
	              user_id: user_id,
	              comment: req.param('comment')
	            }
	            
	            var doc_file = req.file('doc_file');
	            console.log(doc_file);
	            var dir = process.cwd()+'/assets/uploads/docs/'+req.param('tab_type')+'/' + user_id + '/';
	  
	            if (!fs.existsSync(dir)) {
	              fs.mkdir(dir, function (err) {
	                if (err) { console.log('failed to create directory', err);
	                } else { }
	              });
	            }
	  
	            doc_file.upload({
	              dirname: require('path').resolve(sails.config.appPath, dir),
	              maxBytes: 7000000
	            }, function (err, uploadedFiles) {
	              //if (err) return res.negotiate(err)
					 if (err) return resolve({ status: 'Error', msg: 'Error on file upload' })
	              //console.log('uploadedFiles = ' + JSON.stringify(uploadedFiles))
	              if (uploadedFiles.length === 0) {
	              } else {
	                var allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/msword', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
	                var extension = uploadedFiles[0].type
	  
	                if (allowedTypes.indexOf(extension) === -1) {
	                  resolve({
	                    filename: path.basename(uploadedFiles[0].fd),
	                    status: 'Error',
	                    datatype: 1,
	                    msg: 'File type is not valid'
	                  })
	                }
	                _newVerifyData.doc_url = path.basename(uploadedFiles[0].fd)
	                _newVerifyData.doc_id = doc_id
	              }
	              
	              UserVerifyData.update({id:verify_id}, _newVerifyData).exec(function(err, _verifyData) {
	                UserVerifyDataRequest.create(verifyDataRequest).then(function (_verifyData) {
	                  Users.findOne({id:user_id}).exec(function(err,user_data){
	                    var user_slug_para = '';
	                    if(typeof user_data!='undefined' && typeof user_data.slug!='undefined' && user_data.slug!=''){
	                      user_slug_para = user_data.slug;
	                    }

	                    NotificationService.addNotification({
	                      user_id: req.param('connection'),
	                      feed_id: "",
	                      from_user_id: user_id,
	                      notification_text: '<a href="/authenticate">Data Authenticate</a> request from <a href="/profile/'+user_slug_para+'">'+user_data.name+'</a>.',
	                      type: request_type
	                    });
                      UserVerifyDataRequest.findOne({id:_verifyData.id})
                        .populate("user_id",{select:['name','profile_image']})
                        .exec(function(err,UserVerifyDataRequestData){
                          UserFcmkey.find({user_id:req.param('connection')}).exec(function(err,user_FCM_key) {
                          if(user_FCM_key != undefined && user_FCM_key.length > 0) {
                            for(i=0;i<user_FCM_key.length ;i++){
                              FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],UserVerifyDataRequestData,'New verification request',3);
                            }
                          }
                          resolve({
                            status: 'OK',
                            msg: 'Verify request sent successfully!',
                            data : UserVerifyDataRequestData
                          })
                        });
                      });
	                  });
	                })
                })
                
	            })
	          })
      		}
        })

      } else {
        resolve({
          status: 'Error',
          msg: 'Verify User is require'
        })
      }
    })
  },
  VerifyEmailOTP: function (req, user_id) {
    var user_login_id = user_id;
    var email_otp = req.param('email_otp');
    return new Promise(function (resolve, reject) {
      UserContactVerifyData.findOne({email_otp: email_otp,user_id: user_login_id}).exec(function (err, userExist) {
          if (!userExist) {
            resolve({
                status: 'Error',
                msg: 'Invalid OTP,Please try another',
                title: 'Email Verification'
              });
          }else {
            var verifyData = {is_email_verify: 1,email_otp:''};
            UserContactVerifyData.update(userExist.id, verifyData).then(function (_verify) {
              UpdateVerifyStatusService.VerifyStatus({
                user_id:user_login_id,
                phone:'',
                email:1,
              });
              UserFcmkey.find({user_id:user_id}).exec(function(err,user_FCM_key){
                if(user_FCM_key != undefined && user_FCM_key.length > 0){
                  for(i=0;i<user_FCM_key.length ;i++){
                    FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],_verify,'Email verification has been successfully',2);
                  }
                }
                resolve({
                  status: 'OK',
                  msg: 'Email verification has been successfully',
                  title: 'Email Verification'
                });
              });
          }).catch(function (error) {
            resolve({
                status: 'Error',
                msg: 'Invalid OTP,Please try another',
                title: 'Email Verification'
              });
          })
        }
      });
    });
  },
  CancelUserVerifyRequest: function (req, user_id) {
    var request_id = req.param('id');
    return new Promise(function (resolve, reject) {
      UserVerifyDataRequest.find({id: request_id}).then(function (_request) {
        if (_request && _request.length > 0) {
          _request[0].destroy().then(function (_request) {
            UserFcmkey.find({user_id:data_UserVerifyDataRequest.owner_id}).exec(function(err,user_FCM_key){
							if(user_FCM_key != undefined && user_FCM_key.length > 0){
								for(i=0;i<user_FCM_key.length ;i++){
									FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],data_UserVerifyDataRequest,'Verify request canceled successfully',4);
								}
							}
              resolve({ msg: 'Request canceled successfully', status: 'OK' });
            });
          }).catch(function (err) {
            resolve({ msg: 'Something went wrong. Please try again', status: 'Error' })
          })
        }else {
          resolve({ msg: 'Something went wrong. Please try again', status: 'Error' })
        }
      })
    })
  },
  GetVerifyRequestData: function (req, user_id) {
    page_no = 1;
    if(req.param("page_no") != undefined){
      page_no = req.param("page_no");
    }
    return new Promise(function (resolve, reject) {
    UserVerifyDataRequest.find().where({user_id: user_id}).populate('owner_id', {select: ['name', 'slug']}).populate('verify_id.doc_type_id', {select: ['title']}).paginate({page: page_no, limit: 10}).exec(function (err, records) {
      resolve({
          data: records,
          status: 'OK',
          msg: 'Verify Request Data List'
        })
      })
    })    
  },
  getOneVerifyRequestData: function (req, user_id) {
    return new Promise(function (resolve, reject) {
      var aid = req.param('id')
      UserVerifyData.findOne({id: aid}).populate('doc_type_id').populate('user_id').populate('verify_request_id').populate('verify_request_id.user_id').sort('createdAt DESC').exec(function (err, records) {
        UserEducations.findOne().where({id:records.edu_id}).exec(function(err, edu) {
          if(edu) {
            records.education = edu;
          }
          UserExperiences.findOne().where({id:records.exp_id}).populate('company_id').exec(function(err, _exp) {
            if(_exp) {
              records.experience = _exp;
            }
            UserProjects.findOne().where({id:records.project_id}).populate('company_id').exec(function(err, _project) {
              if(_project) {
                records.project = _project;
              }
              resolve({status:'OK',data:records,msg:'Verify request data!'});
            });
          });
        });
      });
    });
  },
  
  IgnoreVerifyRequest: function(req,user_id,request_type){
    return new Promise(function (resolve, reject) {
      var verify_id = req.param('id');
      var _data = {
        status:2
      }
      if(verify_id!=''){
        UserVerifyDataRequest.update({id:verify_id}, _data).exec(function verifyRecs (err, record) {
          if(record.length > 0) {
            Users.findOne({id:user_id}).exec(function (err, user_data) {
            if (err) {
              resolve({ status: 'Error', msg: err})
            }
              NotificationService.addNotification({
                user_id: record[0].owner_id,
                feed_id: "",
                from_user_id: user_id,
                notification_text: '<a href="/authenticate">Data Authenticate </a> request ignored by <a href="/profile/'+user_data.slug+'">'+user_data.name+'</a>.',
                type: request_type
              });
              UserFcmkey.find({user_id:record.owner_id}).exec(function(err,user_FCM_key){
                if(user_FCM_key != undefined && user_FCM_key.length > 0){
                  for(i=0;i<user_FCM_key.length ;i++){
                    FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],record,'Your verify request ignored successfully',9);
                  }
                }
                resolve({ status: 'OK', msg:'Verify request ignored successfully.'});
              });
            });
            
          } else {
            resolve({ status: 'Error', msg:'Invalid arugement passed. Please pass valid arugements.'});				
          }
        });
      }else{
        resolve({ status: 'Error', msg:'Verify_request_id is require.'});
      }
    });
  },
  
  dataAccessRequestList: function(req, user_id) {
    return new Promise(function (resolve, reject) {
      UserConnection.find({to_user_id: user_id,status: '1' }).exec(function (err, connection) {
        UserConnection.find({user_id: user_id,status: '1' }).exec(function (err, connection1) {
          connarray = []
          connarray1 = []
          connection1.forEach(function (factor, index) {
            connarray1.push(factor.to_user_id)
          })
          connection.forEach(function (factor, index) {
            connarray.push(factor.user_id)
          })
          user_ids = connarray1.concat(connarray)
          Users.find({id: {'$in': user_ids},select: ['name']}).exec(function (err, connections) {
            UserDataAccessRequest.find({owner_id:user_id}).populate('user_id',{select:['name']}).exec(function (err,data_access) {
                resolve({
                  list_data:data_access,
                  moment: moment,
                  user_connection:connections,
                });
              });
            });
          });
      });
    });
  },
  
  verifyRequestByBlockchain: function (req,user_id,request_type){
	return new Promise(function (resolve, reject) {
      var request_id  = req.param('req_verify_id');
      Users.findOne({id: user_id}).exec(function(err,user_data){
        UserVerifyDataRequest.findOne({id: request_id})
        .populate('verify_id')
        .populate('verify_id.edu_id')
        .populate('verify_id.edu_id.degree_type')
        .populate('verify_id.exp_id')
        .populate('verify_id.exp_id.company_id',{select:['company_name']})
        .populate('verify_id.project_id')
        .populate('verify_id.project_id.company_id',{select:['company_name']})
        .populate('verify_id.doc_type_id', {select: ['title']})
        .populate('owner_id', {select: ['name','ethaddress']}).exec(function (err, records) {
        if(records){
            if(typeof records.verify_id=='undefined' || typeof records.owner_id=='undefined'){
              resolve({ msg: 'data not found', status: 'Error' });
            }
            
            if(typeof user_data.ethaddress=='undefined' || typeof records.owner_id.ethaddress=='undefined'){
              resolve({ msg: 'Ethaddress not found', status: 'Error' });
            }

            var verify_data_string={};
            
            //set data based on verification request;
            var verifyData = '';

            if(records.to_verify_data==1){
              if(typeof records!='undefined' && typeof records.verify_id!='undefined'){

                //education 
                if(typeof records.verify_id.edu_id!='undefined' && records.verify_id.edu_id!=''){
                  var education = '';
                    education = records.verify_id.edu_id;

                  if(typeof education.school!='undefined' && education.school!=''){
                    verify_data_string.school = education.school;	
                  }
                  if(typeof education.degree!='undefined' && education.degree!=''){
                    verify_data_string.degree = education.degree;	
                  }
                  if(typeof education.study_field!='undefined' && education.study_field!=''){
                    verify_data_string.study_field = education.study_field;	
                  }
                  if(typeof education.degree_type!='undefined' && typeof education.degree_type.title!='undefined' && education.degree_type.title!=''){
                    verify_data_string.degree_type = education.degree_type.title;	
                  }
                  if(typeof education.from_year!='undefined' && education.from_year!=''){
                    verify_data_string.from_year = education.from_year;	
                  }
                  if(typeof education.to_year!='undefined' && education.to_year!=''){
                    verify_data_string.to_year = education.to_year;	
                  }
                }else if(typeof records.verify_id.project_id!='undefined' && records.verify_id.project_id!=''){
                  var project = '';
                    project = records.verify_id.project_id;

                  if(typeof project.title!='undefined' && project.title!=''){
                    verify_data_string.title = project.title;	
                  }
                  if(typeof project.project_url!='undefined' && project.project_url!=''){
                    verify_data_string.project_url = project.project_url;	
                  }
                  if(typeof project.company_id!='undefined' && typeof project.company_id.company_name!='undefined'){
                    verify_data_string.company = project.company_id.company_name;	
                  }
                  if(typeof project.location!='undefined' && project.location!=''){
                    verify_data_string.location = project.location;	
                  }
                  if(typeof project.from_month!='undefined' && project.from_month!=''){
                    verify_data_string.from_month = project.from_month;	
                  }
                  if(typeof project.from_year!='undefined' && project.from_year!=''){
                    verify_data_string.from_year = project.from_year;	
                  }
                  if(typeof project.to_month!='undefined' && project.to_month!=''){
                    verify_data_string.to_month = project.to_month;	
                  }
                  if(typeof project.to_year!='undefined' && project.to_year!=''){
                    verify_data_string.to_year = project.to_year;	
                  }
                }else if(typeof records.verify_id.exp_id!='undefined' && records.verify_id.exp_id!=''){
                  var experience = '';
                    experience = records.verify_id.exp_id;

                  if(typeof experience.title!='undefined' && experience.title!=''){
                    verify_data_string.position = experience.title;	
                  }
                  if(typeof experience.company_id!='undefined' && typeof experience.company_id.company_name!='undefined'){
                    verify_data_string.company = experience.company_id.company_name;	
                  }
                  if(typeof experience.location!='undefined' && experience.location!=''){
                    verify_data_string.location = experience.location;	
                  }
                  if(typeof experience.from_month!='undefined' && experience.from_month!=''){
                    verify_data_string.from_month = experience.from_month;	
                  }
                  if(typeof experience.from_year!='undefined' && experience.from_year!=''){
                    verify_data_string.from_year = experience.from_year;	
                  }
                  if(typeof experience.to_month!='undefined' && experience.to_month!=''){
                    verify_data_string.to_month = experience.to_month;	
                  }
                  if(typeof experience.to_year!='undefined' && experience.to_year!=''){
                    verify_data_string.to_year = experience.to_year;	
                  }
                }
                else{

                  //"tab_type" : "other_docs", 
                  if(typeof records.verify_id.tab_type!='undefined'){
                    var other_data =records.verify_id;
                    
                    if(typeof other_data.tab_type!='undefined' && typeof other_data.tab_type!='undefined'){
                      verify_data_string.tab_type = other_data.tab_type;
                    }
                    if(typeof other_data.doc_type_id!='undefined' && typeof other_data.doc_type_id.title!='undefined'){
                      verify_data_string.doc_type = other_data.doc_type_id.title;
                    }
                    
                    var name_flag=0;
                    if(typeof other_data.first_name!='undefined' && other_data.first_name!=''){
                      verify_data_string.first_name = other_data.first_name;
                      name_flag=1;
                    }
                    if(typeof other_data.last_name!='undefined' && other_data.last_name!=''){
                      verify_data_string.last_name = other_data.last_name;
                      name_flag=1;
                    }

                    if(typeof other_data.legal_name!='undefined' && other_data.legal_name!='' && name_flag==0){
                      verify_data_string.legal_name = other_data.legal_name;
                    }

                    //other docs
                    if(other_data.tab_type=="other_docs"){
                      if(typeof other_data.other_doc_info!='undefined' && other_data.other_doc_info!=''){
                        verify_data_string.other_doc_info = other_data.other_doc_info;
                      }
                    }else if(other_data.tab_type=='identity'){

                      //birthdate flag
                      if(typeof other_data.dob_flag!='undefined' && other_data.dob_flag==1){

                        if(typeof other_data.dob!='undefined' && other_data.dob!=''){
                          verify_data_string.dob = other_data.dob;
                        }
                        if(typeof other_data.birth_place!='undefined' && other_data.birth_place!=''){
                          verify_data_string.birth_place = other_data.birth_place;
                        }
                      }else if(typeof other_data.address_flag!='undefined' && other_data.address_flag==1){
                        //address
                        if(typeof other_data.address_line_1!='undefined' && other_data.address_line_1!=''){
                          verify_data_string.address_line_1 = other_data.address_line_1;
                        }
                        if(typeof other_data.address_line_2!='undefined' && other_data.address_line_2!=''){
                          verify_data_string.address_line_2 = other_data.address_line_2;
                        }
                        if(typeof other_data.city!='undefined' && other_data.city!=''){
                          verify_data_string.city = other_data.city;
                        }
                        if(typeof other_data.state!='undefined' && other_data.state!=''){
                          verify_data_string.state = other_data.state;
                        }
                        if(typeof other_data.country!='undefined' && other_data.country!=''){
                          verify_data_string.country = other_data.country;
                        }
                        if(typeof other_data.zip!='undefined' && other_data.zip!=''){
                          verify_data_string.zip = other_data.zip;
                        }
                      }else{
                        //identity

                        if(typeof other_data.issue_country!='undefined' && other_data.issue_country!=''){
                          verify_data_string.issue_country = other_data.issue_country;
                        }
                        if(typeof other_data.issue_place!='undefined' && other_data.issue_place!=''){
                          verify_data_string.issue_place = other_data.issue_place;
                        }
                        if(typeof other_data.doc_num!='undefined' && other_data.doc_num!=''){
                          verify_data_string.doc_num = other_data.doc_num;
                        }
                        if(typeof other_data.issue_date!='undefined' && other_data.issue_date!=''){
                          verify_data_string.issue_date = other_data.issue_date;
                        }
                        if(typeof other_data.expiry_date!='undefined' && other_data.expiry_date!=''){
                          verify_data_string.expiry_date = other_data.expiry_date;
                        }

                        if(typeof other_data.dob!='undefined' && other_data.dob!=''){
                          verify_data_string.dob = other_data.dob;
                        }

                        if(typeof other_data.gender!='undefined' && other_data.gender!=0){
                          var sex='';
                          if(other_data.gender==1){
                            sex='Male';
                          }
                          else if(other_data.gender==2){
                            sex='Female';
                          }
                          else if(other_data.gender==3){
                            sex='Not Specified';
                          }
                          verify_data_string.gender=sex;
                        }
                      }
                    }
                  }
                }
              }
            }else{
              verify_data_string='';
            }

            var doc_type_name   = "Others";
            
            if(typeof records.verify_id!='undefined' && typeof records.verify_id.doc_type_id!='undefined' && typeof records.verify_id.doc_type_id.title!='undefined'){
				doc_type_name = records.verify_id.doc_type_id.title;
            }
		  console.log("records eth --> ", JSON.stringify(records));
            Web3 = require('web3')
            web3 = new Web3(new Web3.providers.HttpProvider(eth_URL));
            var data_string     = "";
              data_string       = web3.fromAscii(JSON.stringify(verify_data_string));
            var admin_ethereum  = sails.config.eth_adminAddress;
            var data_type       = doc_type_name;    //'tyep ex.: email';
            var sender_ether    = records.owner_id.ethaddress; //sender user ether
            var verifier_ether  = user_data.ethaddress; //current user ether
            var data_hash       = require('crypto').createHash('md5').update(data_string).digest('hex');
            var key             = sender_ether + data_type;
				              key				= web3.fromAscii(key.toString());
            var keyhex          = require('crypto').createHash('md5').update(key).digest("hex");
            var cipher_key		  = require('crypto').createDecipher('aes-128-cbc', 'worldatyoulynkedworld');
            var eth_Pass		    = cipher_key.update(sails.config.eth_adminEthPass, 'hex', 'utf8');
                eth_Pass			  += cipher_key.final('utf8');
				
            web3.personal.unlockAccount(admin_ethereum, eth_Pass, sails.config.eth_timeout, function (error, result){
              if (error) {
				  console.log("error eth --> ", JSON.stringify(error));
				  console.error(error);
			  } else {
                var var_return = 0;
                /* IF Doc Verify */
                if(records.to_verify_doc==1 && typeof records.verify_id.doc_url != 'undefined' && records.verify_id.doc_url != '' ) {
                  fs.createReadStream(process.cwd() + "/assets/uploads/docs/" + records.verify_id.tab_type + "/" +records.owner_id.id + "/" + records.verify_id.doc_url).
                  pipe(require('crypto').createHash('md5').setEncoding('hex')).
                  on('finish', function () {
                    var doc_hash = this.read();	
                    //console.log(' DOC HASH -->> ' + doc_hash) //the hash
                    smartContract.enterStructData.sendTransaction(keyhex,sender_ether,verifier_ether,data_type,doc_hash,{
                      from: admin_ethereum, 
                      gas: sails.config.eth_gas, 
                      gasPrice: sails.config.eth_gas_price }, 
                      function (error, txnno) {
                        if (error) {
							resolve({ msg: 'Fail verify Request1', status: 'Error' });
                        } else {
                          var dateNow = new Date();
						              var mycomments = (typeof req.param('mycomments') != 'undefined')?req.param('mycomments'):'';
                          var update_verify ={
                            doc_txnno:txnno,
                            doc_hash:doc_hash,
                            verifydate: moment(dateNow).format('DD/MM/YYYY'),
                            verifiercomments: mycomments,
                            status:1
                          }
                          
                          UserVerifyDataRequest.update(records.id,update_verify).exec(function verifyRecs (err, result) {
                            if (err) { resolve({ status: 'Error', msg:'Fail to update verify request'}); }
                            var_return = 1;
                          });
                        } 
                      }
                    ); //sendTransaction
                  })
                }

                if(records.to_verify_data==1) {
                  smartContract.enterStructData.sendTransaction(keyhex,sender_ether,verifier_ether,data_type,data_hash,{
                    from: admin_ethereum, 
                    gas: sails.config.eth_gas, 
                    gasPrice: sails.config.eth_gas_price }, 
                    function (error, txnno) {
					  console.log("error2 txnno --> ", JSON.stringify(txnno));
                      if (error) {
						  console.log("error2 eth --> ", JSON.stringify(error));
                        resolve({ msg: 'Fail verify Request', status: 'Error' });
                      } else {
                        var  dateNow = new Date();
                        var update_verify ={
                          txnno:txnno,
                          hash:data_hash,
                          verifydate: moment(dateNow).format('DD/MM/YYYY'),
                          verifiercomments:req.param('mycomments'),
                          status:1
                        }
                        
                        UserVerifyDataRequest.update(records.id,update_verify).exec(function verifyRecs (err, result) {
                          if (err) {
                            resolve({ status: 'Error', msg:'Fail to update verify request'});
                          }
                          var_return = 1;
                        });
                      } 
                    }
                  ); //sendTransaction
                }
                
                var success_msg = '';
                var owner_name = 'successfully';
                
                if(typeof records!='undefined' && typeof records.owner_id!='undefined' && typeof records.owner_id.name!='undefined'){
                  owner_name = records.owner_id.name;
                }
                
                success_msg = 'Thank You!<br/> A confirmation is sent to '+owner_name;
                
                NotificationService.addNotification({
                  user_id: records.owner_id,
                  feed_id: "",
                  from_user_id: user_id,
                  notification_text: '<a href="/get-verified">Data Verified</a> by <a href="/profile/'+user_data.slug+'">'+user_data.name+'</a>.',
                  type: request_type
                });
                if(typeof records.verify_id!='undefined' || typeof records.owner_id!='undefined'){
                  UserFcmkey.find({user_id:records.owner_id.id}).exec(function(err,user_FCM_key){
                    if(user_FCM_key != undefined && user_FCM_key.length > 0){
                      for(i=0;i<user_FCM_key.length ;i++){
                        FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],{},'Your data verified by '+user_data.name,5);
                      }
                    }
                    resolve({ status: 'OK', msg:success_msg});
                  });
                } else {
                    resolve({ status: 'Error', msg:"Verification failed!"});
				}
              }
            }); 
          } else {
            resolve({ status: 'Error', msg:'Fail to verify request' });
          }
        });
      });
    });
  },

  StoreDataAccessRequest: function(req,user_id){
    return new Promise(function (resolve, reject) {
      if (typeof req.param('identification')=='undefined' && typeof req.param('educational')=='undefined' && typeof req.param('employment')=='undefined' && typeof req.param('projects')=='undefined' && typeof req.param('identity')=='undefined' && typeof req.param('dob')=='undefined' && typeof req.param('address')=='undefined'){
        resolve({
          status: 'Error',
          msg: 'Please select atlease one checkbox.'
        })
      }else{
        if (req.param('user_id') != '') {
          var dataAccessRequest = {
            user_id: req.param('user_id'),
            owner_id: user_id
          }
          dataAccessRequest.identification = (req.param('identification')!='')?req.param('identification'):0;
          dataAccessRequest.identity = (req.param('identity')!='')?req.param('identity'):0;
          dataAccessRequest.dob = (req.param('dob')!='')?req.param('dob'):0;
          dataAccessRequest.address = (req.param('address')!='')?req.param('address'):0;
          dataAccessRequest.employment = (req.param('employment')!='')?req.param('employment'):0;
          dataAccessRequest.educational = (req.param('educational')!='')?req.param('educational'):0;
          dataAccessRequest.projects = (req.param('projects')!='')?req.param('projects'):0;
          dataAccessRequest.comment = (req.param('comment')!='')?req.param('comment'):0;
          
          UserDataAccessRequest.findOne({owner_id:user_id,user_id:req.param('user_id')}).sort('createdAt DESC').exec(function (err,found){
            if(err){
              resolve({
                status: 'Error',
                msg: 'Something went wrong. Please try again.'
              });
            }
            if(found){
              var updateData = {};
              // Update only those data that have no any action means that they are still pending
              if(typeof found.identification!='undefined' && found.identification!=2 && found.identification!=3){
                updateData.identification = (req.param('identification') && (found.identification==2 || found.identification==3))?req.param('identification'):found.identification;
              }
              if(typeof found.employment!='undefined' && found.employment!=2 && found.employment!=3){
                updateData.employment = (req.param('employment') && req.param('employment')!='')?req.param('employment'):found.employment;
              }
              if(typeof found.educational!='undefined' && found.educational!=2 && found.educational!=3){
                updateData.educational = (req.param('educational') && req.param('educational')!='')?req.param('educational'):found.educational;
              }
              if(typeof found.projects!='undefined' && found.projects!=2 && found.projects!=3){
                updateData.projects = (req.param('projects') && req.param('projects')!='')?req.param('projects'):found.projects;
              }
              if(typeof found.dob!='undefined' && found.dob!=2 && found.dob!=3){
                updateData.dob = (req.param('dob') && req.param('dob')!='')?req.param('dob'):found.dob;
              }
              if(typeof found.address!='undefined' && found.address!=2 && found.address!=3){
                updateData.address = (req.param('address') && req.param('address')!='')?req.param('address'):found.address;
              }
              if(typeof found.identity!='undefined' && found.identity!=2 && found.identity!=3){
                updateData.identity = (req.param('identity') && req.param('identity')!='')?req.param('identity'):found.identity;
              }
  
              var getDate = moment(found.createdAt).format('DD/MM/YYYY')
              var current_date = moment(new Date()).format('DD/MM/YYYY')
  
              if(getDate==current_date){
                UserDataAccessRequest.update({id:found.id},updateData).exec(function (err,_DataAccess) {
                  if(err){
                    resolve({
                      status: 'Error',
                      msg: 'Something went wrong. Please try again.'
                    })
                  }
                  UserFcmkey.find({user_id:_DataAccess.owner_id}).exec(function(err,user_FCM_key){
                    if(user_FCM_key != undefined && user_FCM_key.length > 0){
                      for(i=0;i<user_FCM_key.length ;i++){
                        FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],_DataAccess,'Update data access request',7);
                      }
                    }
                    resolve({
                      status: 'OK',
                      msg: 'Data access request has been sent successfully!',
                      data: _DataAccess[0]
                    })
                  });
                });
              }else{
                UserDataAccessRequest.create(dataAccessRequest).exec(function (err,_DataAccess) {
                  UserFcmkey.find({user_id:_DataAccess.owner_id}).exec(function(err,user_FCM_key){
                    if(user_FCM_key != undefined && user_FCM_key.length > 0){
                      for(i=0;i<user_FCM_key.length ;i++){
                        FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],_DataAccess,'New data access request',6);
                      }
                    }
                    resolve({
                      status: 'OK',
                      msg: 'Data access request has been sent successfully!',
                      data: _DataAccess
                    })
                  });
                });
              }
            }else{
              UserDataAccessRequest.create(dataAccessRequest).exec(function (err,_DataAccess) {
                resolve({
                  status: 'OK',
                  msg: 'Data access request has been sent successfully!',
                  data: _DataAccess
                })
              })
            }
          })
        }else {
          resolve({
            status: 'Error',
            msg: 'Please select any user'
          })
        }
      }
    });
  },

  	/*
	Request Data Access
	Complete Access List
  	*/

	dataCompleteAccessList:function(req,user_id){
		return new Promise(function (fulfill, reject){
			var page_no = (typeof req.param("page") != 'undefined') ? req.param("page") : 1;
			var limit = (typeof req.param("climit") != 'undefined') ? req.param("climit") : 10;

			var condition = {
				'request_id':{
					owner_id : {
						"$exists" : true,
						"$ne" : "",
						"$in" : [user_id]
					},
				}
			};

			UserDataAccessAction.find(condition)
			.populate("request_id")
			.populate('request_id.owner_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
			.populate('request_id.user_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
			.populate('request_id.user_id.company_id')
			.exec(function(err,countData){
				UserDataAccessAction.find(condition)
				.populate("request_id")
				.populate('request_id.owner_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
				.populate('request_id.user_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
				.populate('request_id.user_id.company_id')
				.populate('request_id.user_id.UserVerifyData')
				.populate('request_id.user_id.UserVerifyData.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.populate('request_id.user_id.UserVerifyData.doc_type_id',{select:['title','type']})
				.populate('request_id.user_id.user_contact_verify')
				.populate('request_id.user_id.usereducations')
				.populate('request_id.user_id.usereducations.educationdocs',{select:['createdAt'],sort:{createdAt:1}})
				.populate('request_id.user_id.usereducations.educationdocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.populate('request_id.user_id.userexperiences')
				.populate('request_id.user_id.userexperiences.company_id',{select:['company_name','slug']})
				.populate('request_id.user_id.userexperiences.experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
				.populate('request_id.user_id.userexperiences.experiencedocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.populate('request_id.user_id.userprojects')
				.populate('request_id.user_id.userprojects.company_id',{select:['company_name','slug']})
				.populate('request_id.user_id.userprojects.projectdocs',{select:['createdAt'],sort:{from_year:-1,createdAt:-1}})
				.populate('request_id.user_id.userprojects.projectdocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.sort('createdAt DESC')
				.paginate({page: page_no, limit: limit})
				.exec(function (err,resultData){
					if(err){
						fulfill({
							status:"Error",
							msg:"Something went wrong. Please try again."
						});
					} else {
            var returnData = [];

            resultData.forEach(function(complete, index){
              temp = [];
              temp = complete;
              delete temp.createdAt;
              delete temp.createdAt;
              // Identification Data
              console.log(complete.request_id.id);
              temp.verifyDataRequest_id = complete.request_id.id;
              temp.name = complete.request_id.user_id.name;
              temp.slug = complete.request_id.user_id.slug;
              temp.requested_date = DateDifferentService.internationalDateFormat(complete.request_id.createdAt);
              temp.request_status = (temp.status==2) ? "Allowed" : "Deny";

              if(temp.type=='identification'){
                
                temp.data_type = "Personal Information (Data & Doc)";

                var verify_phone = 0;
                var verify_email = 0;

                var is_phone_verify = 0;
                var is_email_verify = 0;

                if(typeof complete.contact_email=='undefined'){
                    verify_email = 1;
                } else if(typeof complete.contact_email!='undefined' && complete.contact_email==1){
                    verify_email = 1;
                }
                
                if(typeof complete.contact_phone=='undefined'){
                    verify_phone = 1;
                } else if(typeof complete.contact_phone!='undefined' && complete.contact_phone==1){
                    verify_phone = 1;
                }


								temp.allowName = {"name": complete.request_id.user_id.name };
								if(complete.request_id.user_id.user_contact_verify.length > 0){
									var _contact = complete.request_id.user_id.user_contact_verify[0];
									if(typeof _contact.email!='undefined' && _contact.email!=''){
										if(verify_email!=''){
											is_email_verify = (_contact.is_email_verify) ? 1 : 0;
											temp.allowEmail = {"email":_contact.email,"is_verified":is_email_verify};
										}
									}
									if(typeof _contact.phone!='undefined' && _contact.phone!=''){ 
										if(verify_phone!=''){
											is_phone_verify = (_contact.is_phone_verify) ? 1 : 0;
											temp.allowPhone = {"phone":_contact.dial_code+' '+_contact.phone,"is_verified":is_phone_verify};
										}
									}
								}

								var UserVerifyData = temp.request_id.user_id.UserVerifyData;
								var displayData = [];

								UserVerifyData.forEach(function(verifydata, index){
									var temp2 = [];
									var temp2 = verifydata;
									if(verifydata.tab_type=='identity'){
										if(temp.identification!='1'){
											identification_data = temp.action_data;
											if(!Array.isArray(identification_data)) {
												identification_data = [identification_data];
											}
											i_checked = identification_data.filter(function (identi) { 
												return identi == verifydata.id;
											});

                      var dataTypeID = "";
                      if(verifydata.doc_type_id && verifydata.doc_type_id.id){
                          dataTypeID = verifydata.doc_type_id.id;
                      }

											if(i_checked==''){
												if(dataTypeID!=''){
													i_checked = identification_data.filter(function (identi) { 
														return identi == dataTypeID;
													});
												}else{
													i_checked = identification_data.filter(function (identi) { 
														return identi == "d_"+verifydata.id;
													});
												}
											}

											if(i_checked!=''){
												displayData.push(temp2);
											}
										}
                  }
                  
								});
								delete temp.request_id;
								temp.allowData = displayData;
								returnData.push(temp);

              }else if(temp.type=='educational'){

                temp.data_type = "Education (Data & Doc)";

                var usereducations = complete.request_id.user_id.usereducations;
                var allowEductions = [];
                usereducations.forEach(function(education, index){
                  var temp2 = [];
                  temp2 = education;

									var edu_checked = "";
									edu_checked = (complete.educational=='1') ? "1":"";

									var education_from_month = (temp2.from_month!=null) ? temp2.from_month : "";
									var education_from_year = (temp2.from_year!=null) ? temp2.from_year : "";
									var education_to_month = (temp2.to_month!=null) ? temp2.to_month : "";
									var education_to_year = (temp2.to_year!=null) ? temp2.to_year : "";

									if(complete.educational!='1'){
										educational_data = complete.action_data;

										if(!Array.isArray(educational_data)){
											educational_data=[educational_data];
										}

										edu_checked = educational_data.filter(function (person) { 
											return person == education.id;
										});
									}
									if(edu_checked!='') {
										allowEductions.push(temp2);
									}
                });

                delete temp.request_id;

                temp.allowData = allowEductions;
                returnData.push(temp);
                        	
              }else if(temp.type=='employment'){

                temp.data_type = "Experience (Data & Doc)";

                var allowExperiences = [];
                var userexperiences = complete.request_id.user_id.userexperiences;
                userexperiences.forEach(function(experience, index){
                  var temp2 = [];
                  temp2 = experience;

                  var emp_checked = "";
                  employment_data = complete.action_data;
                  
                  if(!Array.isArray(employment_data)){
                      employment_data=[employment_data];
                  }

                  emp_checked = employment_data.filter(function (person1) { 
                      return person1 == experience.id;
                  });
                  if(emp_checked!='') {
                    allowExperiences.push(temp2);
                  }
                });

                delete temp.request_id;
                temp.allowData = allowExperiences;
                returnData.push(temp);
              
              } else if(temp.type=='projects') {

                temp.data_type = "Projects (Data & Doc)";
                
                var userprojects = complete.request_id.user_id.userprojects;
                var allowProject = [];
                userprojects.forEach(function(project, index){
                  var temp2 = [];
                  temp2 = project;
                  var pro_checked = "";
                  pro_checked = (complete.projects=='1') ? "1":"";

                  project_data = complete.action_data;
                  if(!Array.isArray(project_data)){
                      project_data=[project_data];
                  }
                  
                  pro_checked = project_data.filter(function (person2) { 
                      return person2 == project.id;
                  });
                  if(pro_checked!='') {
                    allowProject.push(temp2);
                  }
                });
                
                delete temp.request_id;

                temp.allowData = allowProject;
                returnData.push(temp);              
              }
            });

						fulfill({
							status:"OK",
							data:resultData,
							msg:"Data Access Completed List!"
						});
					}
				});
			});
		});
	},

	/*
		Request Data Access
		Pending Request History
	*/
	dataAccessPendingList:function(req,user_id){
		return new Promise(function (fulfill, reject){
			var userID = user_id;
			var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
			var limit = (typeof req.param("limit") != 'undefined') ? req.param("limit") : 10;

			var condition = {
				"$or" : 
				[
					{ 'identification':1 },
					{ 'educational':1 },
					{ 'projects':1 },
					{ 'employment':1 }
				],
				owner_id:userID
			};
			UserDataAccessRequest.count(condition).exec(function (err,count){
			UserDataAccessRequest.find(condition)
				.populate('user_id',{select:['name']})
				.populate('user_id.company_id')
				.sort("createdAt DESC")
				.paginate({page: page_no, limit: limit})
				.exec(function (err,resultData){
					if(err){
						fulfill({status:"Error",msg:"Something went wrong. Please try again."});
					}

					var pendingData = [];
					var checkedData = [];
                    resultData.forEach(function(pendingData, index){
                    	var temp = [];
                    	var temp = pendingData;
                    	var data = [];
                    	var subchecks = [];

						if(pendingData.identification!=0){
                    		data.push({"checked":1,"text":"Personal Information"});
                    	}
                    	
                    	if(pendingData.educational!=0){
                    		data.push({"checked":1,"text":"Education"});
                    	}

                    	if(pendingData.employment!=0){
                    		data.push({"checked":1,"text":"Experience"});
                    	}
                    	
                    	if(pendingData.projects!=0){
                    		data.push({"checked":1,"text":"Projects"});
                    	}
                    	
                    	if(pendingData.identity){
                    		subchecks.push({"checked":1,"text":"Identity"});
							temp.identity = 1;
                    	}
                    	
                    	if(pendingData.dob){
                    		subchecks.push({"checked":1,"text":"Date of Birth"});
							temp.dob = 1;
                    	}

                    	if(pendingData.address){
                    		subchecks.push({"checked":1,"text":"Address"});
							temp.address = 1;
                    	}

                    	temp.checks = data;
                    	temp.subchecks = subchecks;
                    	checkedData.push(temp);
                    });

					fulfill({
						status:"OK",
						data:checkedData,
						msg: 'Pending data access list'
					});
				});
			});
		});
	},
  dataAccessRequest: function(req, user_id) { // old
    return new Promise(function (resolve, reject) {
       UserDataAccessRequest.find({owner_id:user_id}).populate('user_id',{select:['name']}).exec(function (err,data_access) {
          console.log(data_access);  
        if(err){
            resolve({
              status: 'Error',
              data:{},
              msg: 'Error, Data Access Request List !'
            });
          } else {
            resolve({
              status: 'OK',
              data:data_access,
              msg: 'Data Access Request List !'
            });
          }
        });
      });
  },
  authorizeList:function(req,user_id){
    return new Promise(function (resolve, reject) {
      var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
      var limit = 10;
      var startPoint = 0;
      var endPoint = 0;
      UserDataAccessRequest.find({user_id:user_id})
        .populate('owner_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
        .populate('user_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
        .populate('user_id.UserVerifyData')
        .populate('user_id.UserVerifyData.doc_type_id')
        .populate('user_id.user_contact_verify')
        .populate('user_id.usereducations')
        .populate('user_id.userexperiences')
        .populate('user_id.userexperiences.company_id')
        .sort('createdAt DESC')
        .paginate({page: page_no, limit: limit})
        .exec(function (err,resultData){

        if(err) {
          resolve({
            status:"Error",
            msg:"Something went wrong. Please try again.",
            data:{}
          });
        } else {
          resolve({
            status:"OK",
            data:resultData,
            msg:"Authorize list!"
          });
        }
      });
    });
  },


  pendingAccessDocumentRequests : function(req,user_id,data_type=''){
    return new Promise(function (resolve, reject) {
      var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
      var limit = (typeof req.param("limit") != 'undefined') ? req.param("limit") : 10;
      var startPoint = 0;
      var endPoint = 0;

      if(data_type==''){
          var condition = {
            "$or" : 
            [
              { 'identification':1 },
              { 'educational':1 },
              { 'projects':1 },
              { 'employment':1 }
            ],
            user_id:user_id,
          };
        }else{
          var condition = {
            "$or" : 
            [
              { 'identification':{"!" : [0,1]}},
              { 'educational':{"!" : [0,1]}},
              { 'projects':{"!" : [0,1]}},
              { 'employment':{"!" : [0,1]}}
            ],
            user_id:user_id,
          };
        }
            
      UserDataAccessRequest.count(condition).exec(function(err,count){
        UserDataAccessRequest.find(condition)
        .populate('owner_id',{select:['id','name','slug','email','headline','location','cover_image','profile_image']})
        .populate('owner_id.company_id')
        .populate('user_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
        .populate('user_id.company_id')
        .populate('user_id.UserVerifyData')
		    .populate('user_id.UserVerifyData.doc_country')
        .populate('user_id.UserVerifyData.verify_request_id',{where:{txnno:{"!":""}},limit:1})
        .populate('user_id.UserVerifyData.doc_type_id')
        .populate('user_id.user_contact_verify')
        .populate('user_id.usereducations')
        .populate('user_id.usereducations.degree_type',{select:['title']})
        .populate('user_id.usereducations.educationdocs',{select:['createdAt'],sort:{createdAt:1}})
        .populate('user_id.usereducations.educationdocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
        .populate('user_id.userexperiences')
        .populate('user_id.userexperiences.company_id')
        .populate('user_id.userexperiences.experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
        .populate('user_id.userexperiences.experiencedocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
        .populate('user_id.userprojects')
        .populate('user_id.userprojects.company_id')
        .populate('user_id.userprojects.projectdocs',{select:['createdAt'],sort:{from_year:-1,createdAt:-1}})
        .populate('user_id.userprojects.projectdocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})

        .sort('createdAt DESC')
        .paginate({page: page_no, limit: limit})
        .exec(function (err,resultData){

          if(err){
            resolve({
            status:"Error",
            message:"Something went wrong. Please try again.",
            msg: "Something went wrong. Please try again."
            });
          }

          var numberOfPages = count / limit;
          if(numberOfPages > 1){
            numberOfPages = Math.ceil(numberOfPages);
          }else{
            numberOfPages = 1;
          }

          if(page_no > 1){
            startPoint = (page_no-1)*limit+1;
            endPoint = (startPoint + resultData.length) - 1;
            console.log(endPoint);
          }else{
            if(resultData.length > 0){
              startPoint = 1;
              endPoint = (startPoint + resultData.length) - 1;
            }
          }
          if(endPoint > count){
            endPoint =  count;
          }

          resolve({
            status:"OK",
            msg:"Pending data access requests!",
            totalRecords:count,
            DisplayedRecords:count,
            numberofpages:numberOfPages,
            data:resultData,
            startPoint:startPoint,
            endPoint:endPoint,
            currentPage:page_no
          });
        });
      });
    });
  },
  
  pendingVerifyRequestList: function (req, user_id) {
    var userID = user_id;
    return new Promise(function (resolve, reject) {
      var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
      var limit = 10;
      var startPoint = 0;
      var endPoint = 0;
    
      UserVerifyDataRequest.find().where({user_id: userID,status:0,"txnno":""})
        .populate('owner_id', {select: ['name', 'slug']})
        .populate('verify_id.doc_type_id', {select: ['title']})
        .populate('verify_id.doc_country',{select: ['name']})
        .populate('verify_id.edu_id',{select:["school","degree","study_field", "degree_type", "description","from_year","to_year"]})
        .populate('verify_id.exp_id')
        .populate('verify_id.exp_id.company_id',{select: ['company_name']})
        .populate('verify_id.project_id')
        .populate('verify_id.project_id.company_id',{select: ['company_name']})
        .paginate({page: page_no, limit: limit})
        .sort("createdAt DESC")
        .exec(function (err, resultData) {
          var data = [];
		  var data_key = 0;
          for(var i=0; i < resultData.length; i++) {
            if(resultData[i]['verify_id'] == undefined){
				continue;
            }
            data[data_key] = {};
            data[data_key]['owner_id'] = resultData[i]['owner_id'];
            data[data_key]['verify_id'] = {};
            data[data_key]['request_date'] = resultData[i]['createdAt'];
            
            data[data_key]['verify_id']['tab_type'] = typeof resultData[i]['verify_id']['tab_type'] != 'undefined' ? resultData[i]['verify_id']['tab_type'] : '';
            data[data_key]['verify_id']['id'] = typeof resultData[i]['verify_id']['id'] != "undefined" ? resultData[i]['verify_id']['id'] : '';
            data[data_key]['id'] = resultData[i]['id'];
            /* identity */ 
            if(resultData[i]['verify_id']['dob'] != undefined){
              data[data_key]['verify_id']['dob'] = resultData[i]['verify_id']['dob'];
            }
            if(resultData[i]['verify_id']['doc_country'] != undefined){
              data[data_key]['verify_id']['doc_country'] = resultData[i]['verify_id']['doc_country'];
            }
            if(resultData[i]['verify_id']['doc_type_id'] != undefined) {
              data[data_key]['verify_id']['doc_type_id'] = resultData[i]['verify_id']['doc_type_id'];
            }
            if(resultData[i]['verify_id']['doc_num'] != undefined){
              data[data_key]['verify_id']['doc_num'] = resultData[i]['verify_id']['doc_num'];
            }
            if (resultData[i]['verify_id']['issue_date'] != undefined){
              data[data_key]['verify_id']['issue_date'] = resultData[i]['verify_id']['issue_date'];
            }
            if (resultData[i]['verify_id']['expiry_date'] != undefined){
              data[data_key]['verify_id']['expiry_date'] = resultData[i]['verify_id']['expiry_date'];
            }
            if (resultData[i]['verify_id']['doc_url'] != undefined){
              data[data_key]['verify_id']['doc_url'] = resultData[i]['verify_id']['doc_url'];
            }
            if(resultData[i]['verify_id']['referral_code'] != undefined){
              data[data_key]['verify_id']['referral_code'] = resultData[i]['verify_id']['referral_code'];
            }
            if(resultData[i]['verify_id']['doc_id'] != undefined){
              data[data_key]['verify_id']['doc_id'] = resultData[i]['verify_id']['doc_id'];
            }
            if(resultData[i]['verify_id']['gender'] != undefined){
              data[data_key]['verify_id']['gender'] = resultData[i]['verify_id']['gender'];
            }
            if(resultData[i]['verify_id']['birth_place'] != undefined){
              data[data_key]['verify_id']['birth_place'] = resultData[i]['verify_id']['birth_place'];
            }
            if(resultData[i]['verify_id']['legal_name'] != undefined){
              data[data_key]['verify_id']['legal_name'] = resultData[i]['verify_id']['legal_name'];
            }
            if(resultData[i]['verify_id']['dob_flag'] != undefined){
              data[data_key]['verify_id']['dob_flag'] = resultData[i]['verify_id']['dob_flag'];
            }
            if(resultData[i]['verify_id']['identity_flag'] != undefined){
              data[data_key]['verify_id']['identity_flag'] = resultData[i]['verify_id']['identity_flag'];
            }
            if(resultData[i]['verify_id']['state'] != undefined){
              data[data_key]['verify_id']['state'] = resultData[i]['verify_id']['state'];
            }
            if(resultData[i]['verify_id']['address_line_1'] != undefined){
              data[data_key]['verify_id']['address_line_1'] = resultData[i]['verify_id']['address_line_1'];
            }
            if(resultData[i]['verify_id']['address_line_2'] != undefined){
              data[data_key]['verify_id']['address_line_2'] = resultData[i]['verify_id']['address_line_2'];
            }
            if(resultData[i]['verify_id']['city'] != undefined){
              data[data_key]['verify_id']['city'] = resultData[i]['verify_id']['city'];
            }
            if(resultData[i]['verify_id']['country'] != undefined){
              data[data_key]['verify_id']['country'] = resultData[i]['verify_id']['country'];
            }
            if(resultData[i]['verify_id']['edu_id']!= undefined){
              data[data_key]['verify_id']['edu_id'] = resultData[i]['verify_id']['edu_id'];
            }
            if(resultData[i]['verify_id']['exp_id']!= undefined){
              edu_data = resultData[i]['verify_id']['exp_id'];
              data[data_key]['verify_id']['exp_id'] = {title:(edu_data['title'] != undefined ? edu_data['title'] : ''),
                                                'location':(edu_data['location'] != undefined ? edu_data['location'] : ''),
                                                'from_month':(edu_data['from_month'] != undefined ? edu_data['from_month'] : ''),
                                                'from_year':(edu_data['from_year'] != undefined ? edu_data['from_year'] : ''),
                                                'to_month':(edu_data['to_month'] != undefined ? edu_data['to_month'] : ''),
                                                'company_id':(edu_data['company_id'] != undefined ? edu_data['company_id'] : [])};
              
            }
            if(resultData[i]['verify_id']['project_id'] != undefined){
              project_data = resultData[i]['verify_id']['project_id'];
              data[data_key]['verify_id']['project_id'] = {title: (project_data['title'] != undefined ? project_data['title'] : ''),
                                                'project_url':(project_data['project_url'] != undefined ? project_data['project_url'] : ''),
                                                'description':(project_data['description'] != undefined ? project_data['description'] : ''),
                                                'from_month':(project_data['from_month'] != undefined ? project_data['from_month'] : ''),
                                                'from_year':(project_data['from_year'] != undefined ? project_data['from_year'] : ''),
                                                'to_month':(project_data['to_month'] != undefined ? project_data['to_month'] : ''),
                                                'to_year':(project_data['to_year'] != undefined ? project_data['to_year'] : ''),
                                                'company_id':(project_data['company_id'] != undefined ? project_data['company_id'] : '')};
              
            }
			data_key++;
          }
        if(err){
          resolve({
            status:"Error",
            message:"Something went wrong. Please try again.",
            msg:"Something went wrong. Please try again.",
          });
        }
        resolve({
          status:"OK",
          msg:'Pending verify request list',
          data:data,
        });
      });
    });
  },
  
  DeleteVerifyRecords : function(req,res){
    var id = req.param("id");
    return new Promise(function (resolve, reject) {
      if(id==''){
        resolve({
          status: 'Error',
          msg:'Data ID is required'
        });
      }
      UserVerifyData.count({id:id}).exec(function (err,found){
        if(found==0){
          resolve({
            status: 'Error',
            msg:'Record not exist'
          });
        }
        UserVerifyData.destroy({id:id}).exec(function (err){
          if (err) {
            resolve({
              status: 'Error',
              msg:'Record not delete. Please try again'
            });
          }
          UserVerifyDataRequest.destroy({verify_id:id}).exec(function (err){
            if (err) {
              resolve({
                status: 'Error',
                msg:'Record not delete. Please try again'
              });
            }
            resolve({
              status: 'OK',
              data : {},
              msg:'Record deleted successfully'
            });
          });
        });
      });
    });
  },
  completedVerifyRequestList: function (req, user_id) {
    var userID = user_id;
    return new Promise(function (resolve, reject) {
      var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
      var limit = 10;
      var startPoint = 0;
      var endPoint = 0;
    
      UserVerifyDataRequest.find().where({user_id: userID,txnno:{"$exists" : true, "$ne" : ""},status:1})
        .populate('owner_id', {select: ['name', 'slug']})
        .populate('verify_id.doc_type_id', {select: ['title']})
        .populate('verify_id.doc_country',{select: ['name']})
        .populate('verify_id.edu_id',{select:["school","degree","study_field", "degree_type", "description","from_year","to_year"]})
        .populate('verify_id.exp_id')
        .populate('verify_id.exp_id.company_id',{select: ['company_name']})
        .populate('verify_id.project_id')
        .populate('verify_id.project_id.company_id',{select: ['company_name']})
        .paginate({page: page_no, limit: limit})
        .sort("createdAt DESC")
        .exec(function (err, resultData) {
          var data = [];
          if(resultData.length > 0){
          for(var i=0;i < resultData.length;i++) {
            data[i] = {};
            data[i]['owner_id'] = resultData[i]['owner_id'];
            data[i]['verify_id'] = {};
            data[i]['request_date'] = resultData[i]['createdAt'];
            if(typeof resultData[i]['verify_id'] != 'undefined') {
              if(typeof resultData[i]['verify_id']['tab_type'] != 'undefined'){
                data[i]['verify_id']['tab_type'] = resultData[i]['verify_id']['tab_type'];
              }
              if(typeof resultData[i]['verify_id']['id'] != 'undefined'){
                data[i]['verify_id']['id'] = resultData[i]['verify_id']['id'];
              }
              data[i]['id'] = resultData[i]['id'];
              /* identity */ 
              if(resultData[i]['verify_id']['dob'] != undefined){
                data[i]['verify_id']['dob'] = resultData[i]['verify_id']['dob'];
              }
              if(resultData[i]['verify_id']['doc_country'] != undefined){
                data[i]['verify_id']['doc_country'] = resultData[i]['verify_id']['doc_country'];
              }
              if(resultData[i]['verify_id']['doc_type_id'] != undefined) {
                data[i]['verify_id']['doc_type_id'] = resultData[i]['verify_id']['doc_type_id'];
              }
              if(resultData[i]['verify_id']['doc_num'] != undefined){
                data[i]['verify_id']['doc_num'] = resultData[i]['verify_id']['doc_num'];
              }
              if (resultData[i]['verify_id']['issue_date'] != undefined){
                data[i]['verify_id']['issue_date'] = resultData[i]['verify_id']['issue_date'];
              }
              if (resultData[i]['verify_id']['expiry_date'] != undefined){
                data[i]['verify_id']['expiry_date'] = resultData[i]['verify_id']['expiry_date'];
              }
              if (resultData[i]['verify_id']['doc_url'] != undefined){
                data[i]['verify_id']['doc_url'] = resultData[i]['verify_id']['doc_url'];
              }
              if(resultData[i]['verify_id']['referral_code'] != undefined){
                data[i]['verify_id']['referral_code'] = resultData[i]['verify_id']['referral_code'];
              }
              if(resultData[i]['verify_id']['doc_id'] != undefined){
                data[i]['verify_id']['doc_id'] = resultData[i]['verify_id']['doc_id'];
              }
              if(resultData[i]['verify_id']['gender'] != undefined){
                data[i]['verify_id']['gender'] = resultData[i]['verify_id']['gender'];
              }
              if(resultData[i]['verify_id']['birth_place'] != undefined){
                data[i]['verify_id']['birth_place'] = resultData[i]['verify_id']['birth_place'];
              }
              if(resultData[i]['verify_id']['legal_name'] != undefined){
                data[i]['verify_id']['legal_name'] = resultData[i]['verify_id']['legal_name'];
              }
              if(resultData[i]['verify_id']['dob_flag'] != undefined){
                data[i]['verify_id']['dob_flag'] = resultData[i]['verify_id']['dob_flag'];
              }
              if(resultData[i]['verify_id']['identity_flag'] != undefined){
                data[i]['verify_id']['identity_flag'] = resultData[i]['verify_id']['identity_flag'];
              }
              if(resultData[i]['verify_id']['state'] != undefined){
                data[i]['verify_id']['state'] = resultData[i]['verify_id']['state'];
              }
              if(resultData[i]['verify_id']['address_line_1'] != undefined){
                data[i]['verify_id']['address_line_1'] = resultData[i]['verify_id']['address_line_1'];
              }
              if(resultData[i]['verify_id']['address_line_2'] != undefined){
                data[i]['verify_id']['address_line_2'] = resultData[i]['verify_id']['address_line_2'];
              }
              if(resultData[i]['verify_id']['city'] != undefined){
                data[i]['verify_id']['city'] = resultData[i]['verify_id']['city'];
              }
              if(resultData[i]['verify_id']['country'] != undefined){
                data[i]['verify_id']['country'] = resultData[i]['verify_id']['country'];
              }
              if(resultData[i]['verify_id']['edu_id']!= undefined){
                data[i]['verify_id']['edu_id'] = resultData[i]['verify_id']['edu_id'];
              }
              if(resultData[i]['verify_id']['exp_id']!= undefined){
                edu_data = resultData[i]['verify_id']['exp_id'];
                data[i]['verify_id']['exp_id'] = {title:(edu_data['title'] != undefined ? edu_data['title'] : ''),
                                                  'location':(edu_data['location'] != undefined ? edu_data['location'] : ''),
                                                  'from_month':(edu_data['from_month'] != undefined ? edu_data['from_month'] : ''),
                                                  'from_year':(edu_data['from_year'] != undefined ? edu_data['from_year'] : ''),
                                                  'to_month':(edu_data['to_month'] != undefined ? edu_data['to_month'] : ''),
                                                  'company_id':(edu_data['company_id'] != undefined ? edu_data['company_id'] : [])};
                
              }
              if(resultData[i]['verify_id']['project_id'] != undefined){
                project_data = resultData[i]['verify_id']['project_id'];
                data[i]['verify_id']['project_id'] = {title: (project_data['title'] != undefined ? project_data['title'] : ''),
                                                  'project_url':(project_data['project_url'] != undefined ? project_data['project_url'] : ''),
                                                  'description':(project_data['description'] != undefined ? project_data['description'] : ''),
                                                  'from_month':(project_data['from_month'] != undefined ? project_data['from_month'] : ''),
                                                  'from_year':(project_data['from_year'] != undefined ? project_data['from_year'] : ''),
                                                  'to_month':(project_data['to_month'] != undefined ? project_data['to_month'] : ''),
                                                  'to_year':(project_data['to_year'] != undefined ? project_data['to_year'] : ''),
                                                  'company_id':(project_data['company_id'] != undefined ? project_data['company_id'] : '')};
                
              }            
            }
			/* else {
              resolve({
                status:"Error",
                message:"Something went wrong. Please try again.",
                msg:"Something went wrong. Please try again."
              });
            }    */         
          }
        if(err){
          resolve({
            status:"Error",
            message:"Something went wrong. Please try again.",
            msg:"Something went wrong. Please try again."
          });
        } else {
          resolve({
            status:"OK",
            msg : 'Completed verify requestList!',
            data:data,
          });
        }
      } else {
        resolve({
          status:"OK",
          message:"No record found.",
          msg:"No record found."
        });
      }
      });
    });
  },

	completeDataAccessRequest: function (req,user_id){
		return new Promise(function (resolve, reject) {

			var page_no = (typeof req.param("page") != 'undefined') ? req.param("page") : 1;
			var limit = (typeof req.param("climit") != 'undefined') ? req.param("climit") : 10;
			var startPoint = 0;
			var endPoint = 0;

			var condition = {
				'request_id':{
					user_id : {
						"$exists" : true,
						"$ne" : "",
						"$in" : [user_id]
					},
				}
			};

			UserDataAccessAction.find(condition)
			.populate("request_id")
			.populate('request_id.owner_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
			.populate('request_id.user_id',{select:['id','name','slug','email','headline','location','cover_image','profile_image']})
			.exec(function(err,countData){
				UserDataAccessAction.find(condition)
				.populate("request_id")
				.populate('request_id.owner_id',{select:['id','name','slug','email','headline','location','cover_image','profile_image']})
				.populate('request_id.owner_id.company_id')
				.populate('request_id.user_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
				.populate('request_id.user_id.company_id')
				.populate('request_id.user_id.UserVerifyData')
				.populate('request_id.user_id.UserVerifyData.doc_country')
				.populate('request_id.user_id.UserVerifyData.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.populate('request_id.user_id.UserVerifyData.doc_type_id')
				.populate('request_id.user_id.user_contact_verify')
				.populate('request_id.user_id.usereducations')
				.populate('request_id.user_id.usereducations.degree_type',{select:['title']})
				.populate('request_id.user_id.usereducations.educationdocs',{select:['createdAt'],sort:{createdAt:1}})
				.populate('request_id.user_id.usereducations.educationdocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.populate('request_id.user_id.userexperiences')
				.populate('request_id.user_id.userexperiences.company_id')
				.populate('request_id.user_id.userexperiences.experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
				.populate('request_id.user_id.userexperiences.experiencedocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.populate('request_id.user_id.userprojects')
				.populate('request_id.user_id.userprojects.company_id')
				.populate('request_id.user_id.userprojects.projectdocs',{select:['createdAt'],sort:{from_year:-1,createdAt:-1}})
				.populate('request_id.user_id.userprojects.projectdocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.sort("createdAt DESC")
				.paginate({page: page_no, limit: limit})
				.exec(function (err,resultData){
					if(err){
						resolve({
							status:"Error",
							msg:"Something went wrong. Please try again."
						});
					}

					var count = countData.length;
					var numberOfPages = count / limit;
					if(numberOfPages > 1){
						numberOfPages = Math.ceil(numberOfPages);
					}else{
						numberOfPages = 1;
					}

					if(page_no > 1){
						startPoint = (page_no-1)*limit+1;
						endPoint = (startPoint + resultData.length) - 1;
					}else{
						if(resultData.length > 0){
							startPoint = 1;
							endPoint = (startPoint + resultData.length) - 1;
						}
					}

					if(endPoint > count){
						endPoint =  count;
					}

					resolve({
						status:'OK',
						msg:'Complete data access request list',
						totalRecords:count,
						DisplayedRecords:count.length,
						numberofpages:numberOfPages,
						data:resultData,
						startPoint:startPoint,
						endPoint:endPoint,
						currentPage:page_no
					});
				});
			});
		});
	},



  company_list : function(req,user_id){
    return new Promise(function (resolve, reject) {
      Companies.find({select: ['company_name']}).exec(function (err, company) {
        if(err){
          resolve({
            status:'Error',
            msg:'Complete data access request list',
            data : company
          });
        } else {
          resolve({
            status:'OK',
            msg:'Complete data access request list',
            data : company
          });
        }
      });
    });
  },
  authorizeAllowDeny:function(req,res,request_type){
    return new Promise(function (resolve, reject) {
		
      var actionData = {};
      var requestData = {};
      var combineData = {};

      if(typeof req.param("deny") !='undefined'){
        if(typeof req.param("deny") !='undefined' && req.param("deny")=='identificationdeny'){
          actionData.request_id = req.param("authorize_id");
          actionData.action_data = "";
          actionData.status = 3;
          actionData.type = req.param("type");
          requestData.identification = 3;
        }
        if(typeof req.param("deny") !='undefined' && req.param("deny")=='educationaldeny'){
          actionData.request_id = req.param("authorize_id");
          actionData.action_data = "";
          actionData.status = 3;
          actionData.type = req.param("type");
          requestData.educational = 3;
        }
        if(typeof req.param("deny") !='undefined' && req.param("deny")=='employmentdeny'){
          actionData.request_id = req.param("authorize_id");
          actionData.action_data = "";
          actionData.status = 3;
          actionData.type = req.param("type");
          requestData.employment = 3;
        }
        if(typeof req.param("deny") !='undefined' && req.param("deny")=='projectdeny'){
          actionData.request_id = req.param("authorize_id");
          actionData.action_data = "";
          actionData.status = 3;
          actionData.type = req.param("type");
          requestData.projects = 3;
        }
      }else{

        if(req.param("type")=='identification'){
          actionData.contact_email = (typeof req.param("contact_email")!='undefined' && typeof req.param("contact_email")!='') ? "1" : "0";
          actionData.contact_phone = (typeof req.param("contact_phone")!='undefined' && typeof req.param("contact_phone")!='') ? "1" : "0";
          if(typeof req.param("identification")!='undefined' && typeof req.param("identification")!=''){
            actionData.request_id = req.param("authorize_id");
            actionData.action_data = (typeof req.param("identification") === 'object' ? req.param("identification") : JSON.parse(req.param("identification")));
            actionData.type = req.param("type");
            actionData.sequence = 1;
            actionData.status = 2;
            requestData.identification = 2;
          }else{
            actionData.request_id = req.param("authorize_id");
            actionData.action_data = "";
            actionData.sequence = 1;
            actionData.status = 2;
            actionData.type = req.param("type");
            requestData.identification = 2;
          }
        }

        if(req.param("type")=='educational'){
          if(typeof req.param("educational")!='undefined' && typeof req.param("educational")!=''){
            actionData.request_id = req.param("authorize_id");
            actionData.action_data = (typeof req.param("educational") === 'object' ? req.param("educational") : JSON.parse(req.param("educational")));
            actionData.type = req.param("type");
            actionData.sequence = 2;
            actionData.status = 2;
            requestData.educational = 2;
          }else{
            actionData.request_id = req.param("authorize_id");
            actionData.action_data = "";
            actionData.type = req.param("type");
            actionData.sequence = 2;
            actionData.status = 2;
            requestData.educational = 2;
          }
        }

        if(req.param("type")=='employment'){
          if(typeof req.param("employment")!='undefined' && typeof req.param("employment")!=''){
            actionData.request_id = req.param("authorize_id");
            actionData.action_data = (typeof req.param("employment") === 'object' ? req.param("employment") : JSON.parse(req.param("employment")));
            actionData.type = req.param("type");
            actionData.sequence = 3;
            actionData.status = 2;
            requestData.employment = 2;
          }else{
            actionData.request_id = req.param("authorize_id");
            actionData.action_data = "";
            actionData.sequence = 3;
            actionData.status = 2;
            actionData.type = req.param("type");
            requestData.employment = 2;
          }
        }

        if(req.param("type")=='projects'){
          if(typeof req.param("projects")!='undefined' && typeof req.param("projects")!=''){
            actionData.request_id = req.param("authorize_id");
            
            actionData.action_data = (typeof req.param("projects") === 'object' ? req.param("projects") : JSON.parse(req.param("projects")));
            console.log("come in project 2");
            actionData.status = 2;
            actionData.sequence = 4;
            actionData.type = req.param("type");
            console.log(actionData);
            requestData.projects = 2;
          }else{
            actionData.request_id = req.param("authorize_id");
            actionData.action_data = "";
            actionData.sequence = 4;
            actionData.status = 2;
            actionData.type = req.param("type");
            requestData.projects = 2;
          }
        }
      }

      // return res.json({requestData:requestData,actionData:actionData});
      UserDataAccessAction.find({request_id:req.param("authorize_id"),type:req.param("type")}).exec(function(err,dataFound){
        if(dataFound.length==0){
          UserDataAccessRequest.update({id:req.param("authorize_id")},requestData).exec(function(err,dataRow){
            UserDataAccessAction.create(actionData).exec(function(err,data){
              var nText = "Authorize Data Access ";
              if(typeof req.param("deny") !='undefined'){
                nText += "deny";
              }else{
                nText += "allowed";
              }
              nText += " by";
                NotificationService.addNotification({
                    from_user_id: dataRow[0].user_id,
                    user_id: dataRow[0].owner_id,
                    notification_type: "DataAccessRequest",
                    notification_text: nText,
                    type: request_type
                });
                
              if(typeof req.param("deny") !='undefined'){
                UserFcmkey.find({user_id:dataRow[0].owner_id}).exec(function(err,user_FCM_key){
                  if(user_FCM_key != undefined && user_FCM_key.length > 0){
                    for(i=0;i<user_FCM_key.length ;i++){
                      FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],dataRow[0],'Your data access request has been deny',10);
                    }
                  }
                  resolve({status:"OK",msg:"Data access denied!",data:{}});
                });
              }else{
                UserFcmkey.find({user_id:dataRow[0].owner_id}).exec(function(err,user_FCM_key){
                  if(user_FCM_key != undefined && user_FCM_key.length > 0){
                    for(i=0;i<user_FCM_key.length ;i++){
                      FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],dataRow[0],'Your data access request has been allowed',11);
                    }
                  }
                  resolve({status:"OK",msg:"Data access allowed!",data:{}});
                });
              }
            });
          });
        } else{
          resolve({status:"Error",msg:"On this request you already have made action",data:{}});
        }
      });
    });
	},

	ApiCompleteDataAccessRequest:function(req,user_id){
		return new Promise(function (resolve, reject) {

			var page_no = (typeof req.param("page") != 'undefined') ? req.param("page") : 1;
			var limit = (typeof req.param("climit") != 'undefined') ? req.param("climit") : 10;
			var startPoint = 0;
			var endPoint = 0;

			var condition = {
				'request_id':{
					user_id : {
						"$exists" : true,
						"$ne" : "",
						"$in" : [user_id]
					},
				}
			};

			UserDataAccessAction.find(condition)
			.populate("request_id")
			.populate('request_id.owner_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
			.populate('request_id.user_id',{select:['id','name','slug','email','headline','location','cover_image','profile_image']})
			.exec(function(err,countData){
				UserDataAccessAction.find(condition)
				.populate("request_id")
				.populate('request_id.owner_id',{select:['id','name','slug','email','headline','location','cover_image','profile_image']})
				.populate('request_id.owner_id.company_id')
				.populate('request_id.user_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
				.populate('request_id.user_id.company_id')
				.populate('request_id.user_id.UserVerifyData')
				.populate('request_id.user_id.UserVerifyData.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.populate('request_id.user_id.UserVerifyData.doc_type_id',{select:['title']})
				.populate('request_id.user_id.user_contact_verify')
				.populate('request_id.user_id.usereducations')
				.populate('request_id.user_id.usereducations.educationdocs',{select:['createdAt'],sort:{createdAt:1}})
				.populate('request_id.user_id.usereducations.educationdocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.populate('request_id.user_id.userexperiences')
				.populate('request_id.user_id.userexperiences.company_id')
				.populate('request_id.user_id.userexperiences.experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
				.populate('request_id.user_id.userexperiences.experiencedocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.populate('request_id.user_id.userprojects')
				.populate('request_id.user_id.userprojects.company_id')
				.populate('request_id.user_id.userprojects.projectdocs',{select:['createdAt'],sort:{from_year:-1,createdAt:-1}})
				.populate('request_id.user_id.userprojects.projectdocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.sort("createdAt DESC")
				.paginate({page: page_no, limit: limit})
				.exec(function (err,resultData){
					if(err){
						resolve({
							status:"Error",
							msg:"Something went wrong. Please try again."
						});
					}

                    var returnData = [];
                    resultData.forEach(function(complete, index){
                    	temp = [];
                    	temp = complete;

                    	temp.name = temp.request_id.owner_id.name;
                    	temp.slug = temp.request_id.owner_id.slug;
                    	temp.requested_date = DateDifferentService.internationalDateFormat(temp.request_id.createdAt);
                    	temp.request_status = (temp.status==2) ? "Allowed" : "Deny"

                    	// Identification Data
						if(temp.type=='identification'){
							temp.data_type = "Personal Information (Data & Doc)";

                    		var verify_phone = 0;
                    		var verify_email = 0;

                            var is_phone_verify = 0;
                            var is_email_verify = 0;

                            if(typeof complete.contact_email=='undefined'){
                                verify_email = 1;
                            } else if(typeof complete.contact_email!='undefined' && complete.contact_email==1){
                                verify_email = 1;
                            }
                            
                            if(typeof complete.contact_phone=='undefined'){
                                verify_phone = 1;
                            } else if(typeof complete.contact_phone!='undefined' && complete.contact_phone==1){
                                verify_phone = 1;
                            }


							temp.allowName = {"name": complete.request_id.user_id.name };
							if(complete.request_id.user_id.user_contact_verify.length > 0){
								var _contact = complete.request_id.user_id.user_contact_verify[0];
								if(typeof _contact.email!='undefined' && _contact.email!=''){
									is_email_verify = (_contact.is_email_verify) ? 1 : 0;
									temp.allowEmail = {"email":_contact.email,"is_verified":is_email_verify,"is_allow":verify_email};
									
								}
								if(typeof _contact.phone!='undefined' && _contact.phone!=''){ 
									is_phone_verify = (_contact.is_phone_verify) ? 1 : 0;
									temp.allowPhone = {"phone":_contact.dial_code+' '+_contact.phone,"is_verified":is_phone_verify,"is_allow":verify_phone};
								}
							}

							var UserVerifyData = temp.request_id.user_id.UserVerifyData;
							var displayData = [];

							UserVerifyData.forEach(function(verifydata, index){
								var temp2 = [];
								var temp2 = verifydata;
								if(verifydata.tab_type=='identity'){
									var i_checked = "";
									if(temp.identification!='1'){
										identification_data = temp.action_data;
										if(!Array.isArray(identification_data)) {
											identification_data = [identification_data];
										}
										i_checked = identification_data.filter(function (identi) { 
											return identi == verifydata.id;
										});

                                        var dataTypeID = "";
                                        if(verifydata.doc_type_id && verifydata.doc_type_id.id){
                                            dataTypeID = verifydata.doc_type_id.id;
                                        }

										if(i_checked==''){
											if(dataTypeID!=''){
												i_checked = identification_data.filter(function (identi) { 
													return identi == dataTypeID;
												});
											}else{
												i_checked = identification_data.filter(function (identi) { 
													return identi == "d_"+verifydata.id;
												});
											}
										}

										if(i_checked.length!='') {
											i_checked = 1;
										}else{
											i_checked = 0;
										}
										if(i_checked!=''){
											displayData.push(temp2);
										}
									}
								}
							});
							delete temp.request_id;
							temp.allowData = displayData;
							returnData.push(temp);

						}else if(temp.type=='educational'){

                        		temp.data_type = "Education (Data & Doc)";

                        		var usereducations = complete.request_id.user_id.usereducations;
                        		var allowEductions = [];
                        		usereducations.forEach(function(education, index){
                        			var temp2 = [];
                        			temp2 = education;

									var edu_checked = "";
									edu_checked = (complete.educational=='1') ? "1":"";

									var education_from_month = (temp2.from_month!=null) ? temp2.from_month : "";
									var education_from_year = (temp2.from_year!=null) ? temp2.from_year : "";
									var education_to_month = (temp2.to_month!=null) ? temp2.to_month : "";
									var education_to_year = (temp2.to_year!=null) ? temp2.to_year : "";

									if(complete.educational!='1'){
										educational_data = complete.action_data;

										if(!Array.isArray(educational_data)){
											educational_data=[educational_data];
										}

										edu_checked = educational_data.filter(function (person) { 
											return person == education.id;
										});
									}
									if(edu_checked!='') {
										allowEductions.push(temp2);
									}
                        		});

                        		delete temp.request_id;

                        		temp.allowData = allowEductions;
                        		returnData.push(temp);
                    	
                    	}else if(temp.type=='employment'){

                    		temp.data_type = "Experience (Data & Doc)";

                    		var allowExperiences = [];
                    		var userexperiences = complete.request_id.user_id.userexperiences;
                    		userexperiences.forEach(function(experience, index){
                    			var temp2 = [];
                    			temp2 = experience;

		                        var emp_checked = "";
		                        employment_data = complete.action_data;
		                        
		                        if(!Array.isArray(employment_data)){
		                            employment_data=[employment_data];
		                        }

		                        emp_checked = employment_data.filter(function (person1) { 
		                            return person1 == experience.id;
		                        });
		                        if(emp_checked!='') {
		                        	allowExperiences.push(temp2);
		                        }

                    		});
                    		delete temp.request_id;

	                        temp.allowData = allowExperiences;
                			returnData.push(temp);
                    	
                    	}else if(temp.type=='projects'){

                    		temp.data_type = "Projects (Data & Doc)";
                    		
                    		var userprojects = complete.request_id.user_id.userprojects;
                    		var allowProject = [];
                    		userprojects.forEach(function(project, index){
                    			var temp2 = [];
                    			temp2 = project;
                                var pro_checked = "";
                                pro_checked = (complete.projects=='1') ? "1":"";

                                project_data = complete.action_data;
                                if(!Array.isArray(project_data)){
                                    project_data=[project_data];
                                }
                                
                                pro_checked = project_data.filter(function (person2) { 
                                    return person2 == project.id;
                                });
                                if(pro_checked!='') {
                                	allowProject.push(temp2);
                                }
                            });
                    		
                    		delete temp.request_id;

	                        temp.allowData = allowProject;
                			returnData.push(temp);
                    	}
                    });
					returnData.forEach(function(singlereturnData, index){
						if(returnData[index].action_data.length > 0) {
							delete returnData[index].action_data;
						}
						if(returnData[index].allowData.length > 0) {
							returnData[index].allowData.forEach(function(singleData, data_index){
								if(typeof returnData[index].allowData[data_index] != 'undefined') {
									delete returnData[index].allowData[data_index].createdAt;
									delete returnData[index].allowData[data_index].updatedAt;
									if(typeof returnData[index].allowData[data_index].company_id != 'undefined') {
										if(typeof returnData[index].allowData[data_index].company_id.status != 'undefined') {
											delete returnData[index].allowData[data_index].company_id.status;
										}
										delete returnData[index].allowData[data_index].company_id.createdAt;
										delete returnData[index].allowData[data_index].company_id.updatedAt;
									}
									if(typeof returnData[index].allowData[data_index].experiencedocs != 'undefined') {
										if(returnData[index].allowData[data_index].experiencedocs.length > 0) {
											delete returnData[index].allowData[data_index].experiencedocs[0].createdAt;
											delete returnData[index].allowData[data_index].experiencedocs[0].updatedAt;
											if(typeof returnData[index].allowData[data_index].experiencedocs[0].verify_request_id != 'undefined') {
												delete returnData[index].allowData[data_index].experiencedocs[0].verify_request_id;
											}
											if(typeof returnData[index].allowData[data_index].experiencedocs[0].user_id != 'undefined') {
												delete returnData[index].allowData[data_index].experiencedocs[0].user_id;
											}
											if(typeof returnData[index].allowData[data_index].experiencedocs[0].doc_type_id != 'undefined') {
												delete returnData[index].allowData[data_index].experiencedocs[0].doc_type_id;
											}
											if(typeof returnData[index].allowData[data_index].experiencedocs[0].color_scan != 'undefined') {
												delete returnData[index].allowData[data_index].experiencedocs[0].color_scan;
											}
											if(typeof returnData[index].allowData[data_index].experiencedocs[0].govt_issue_id != 'undefined') {
												delete returnData[index].allowData[data_index].experiencedocs[0].govt_issue_id;
											}
											if(typeof returnData[index].allowData[data_index].experiencedocs[0].doc_has_dob != 'undefined') {
												delete returnData[index].allowData[data_index].experiencedocs[0].doc_has_dob;
											}
											if(typeof returnData[index].allowData[data_index].experiencedocs[0].has_expirey_date != 'undefined') {
												delete returnData[index].allowData[data_index].experiencedocs[0].has_expirey_date;
											}
										}
									}
									if(typeof returnData[index].allowData[data_index].educationdocs != 'undefined') {
										if(returnData[index].allowData[data_index].educationdocs.length > 0) {
											delete returnData[index].allowData[data_index].educationdocs[0].createdAt;
											delete returnData[index].allowData[data_index].educationdocs[0].updatedAt;
											if(typeof returnData[index].allowData[data_index].educationdocs[0].verify_request_id != 'undefined') {
												delete returnData[index].allowData[data_index].educationdocs[0].verify_request_id;
											}
											if(typeof returnData[index].allowData[data_index].educationdocs[0].user_id != 'undefined') {
												delete returnData[index].allowData[data_index].educationdocs[0].user_id;
											}
											if(typeof returnData[index].allowData[data_index].educationdocs[0].doc_type_id != 'undefined') {
												delete returnData[index].allowData[data_index].educationdocs[0].doc_type_id;
											}
											if(typeof returnData[index].allowData[data_index].educationdocs[0].color_scan != 'undefined') {
												delete returnData[index].allowData[data_index].educationdocs[0].color_scan;
											}
											if(typeof returnData[index].allowData[data_index].educationdocs[0].govt_issue_id != 'undefined') {
												delete returnData[index].allowData[data_index].educationdocs[0].govt_issue_id;
											}
											if(typeof returnData[index].allowData[data_index].educationdocs[0].doc_has_dob != 'undefined') {
												delete returnData[index].allowData[data_index].educationdocs[0].doc_has_dob;
											}
											if(typeof returnData[index].allowData[data_index].educationdocs[0].has_expirey_date != 'undefined') {
												delete returnData[index].allowData[data_index].educationdocs[0].has_expirey_date;
											}
										}
									}
									if(typeof returnData[index].allowData[data_index].projectdocs != 'undefined') {
										if(returnData[index].allowData[data_index].projectdocs.length > 0) {
											delete returnData[index].allowData[data_index].projectdocs[0].createdAt;
											delete returnData[index].allowData[data_index].projectdocs[0].updatedAt;
											if(typeof returnData[index].allowData[data_index].projectdocs[0].verify_request_id != 'undefined') {
												delete returnData[index].allowData[data_index].projectdocs[0].verify_request_id;
											}
											if(typeof returnData[index].allowData[data_index].projectdocs[0].user_id != 'undefined') {
												delete returnData[index].allowData[data_index].projectdocs[0].user_id;
											}
											if(typeof returnData[index].allowData[data_index].projectdocs[0].doc_type_id != 'undefined') {
												delete returnData[index].allowData[data_index].projectdocs[0].doc_type_id;
											}
											if(typeof returnData[index].allowData[data_index].projectdocs[0].color_scan != 'undefined') {
												delete returnData[index].allowData[data_index].projectdocs[0].color_scan;
											}
											if(typeof returnData[index].allowData[data_index].projectdocs[0].govt_issue_id != 'undefined') {
												delete returnData[index].allowData[data_index].projectdocs[0].govt_issue_id;
											}
											if(typeof returnData[index].allowData[data_index].projectdocs[0].doc_has_dob != 'undefined') {
												delete returnData[index].allowData[data_index].projectdocs[0].doc_has_dob;
											}
											if(typeof returnData[index].allowData[data_index].projectdocs[0].has_expirey_date != 'undefined') {
												delete returnData[index].allowData[data_index].projectdocs[0].has_expirey_date;
											}
										}
									}
									
									if(typeof returnData[index].allowData[data_index].color_scan != 'undefined') {
										delete returnData[index].allowData[data_index].color_scan;
									}
									if(typeof returnData[index].allowData[data_index].govt_issue_id != 'undefined') {
										delete returnData[index].allowData[data_index].govt_issue_id;
									}
									if(typeof returnData[index].allowData[data_index].doc_has_dob != 'undefined') {
										delete returnData[index].allowData[data_index].doc_has_dob;
									}
									if(typeof returnData[index].allowData[data_index].has_expirey_date != 'undefined') {
										delete returnData[index].allowData[data_index].has_expirey_date;
									}
									if(typeof returnData[index].allowData[data_index].dob_flag != 'undefined') {
										delete returnData[index].allowData[data_index].dob_flag;
									}
									if(typeof returnData[index].allowData[data_index].address_flag != 'undefined') {
										delete returnData[index].allowData[data_index].address_flag;
									}
									if(typeof returnData[index].allowData[data_index].verify_request_id != 'undefined') {
										delete returnData[index].allowData[data_index].verify_request_id;
									}
								}
							});
						}
					});

					resolve({
						status:'OK',
						msg:'Complete data access request list',
						data:returnData
					});
				});
			});
		});
	},

	ApiPendingAccessDocumentRequests: function(req,user_id,data_type='') {
		return new Promise(function (resolve, reject) {
			var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
			var limit = (typeof req.param("limit") != 'undefined') ? req.param("limit") : 10;
			
			if(data_type=='') {
				var condition = {
					"$or" : 
					[
						{ 'identification':1 },
						{ 'educational':1 },
						{ 'projects':1 },
						{ 'employment':1 }
					],
					user_id:user_id,
				};
			} else {
				var condition = {
					"$or" : 
					[
						{ 'identification':{"!" : [0,1]}},
						{ 'educational':{"!" : [0,1]}},
						{ 'projects':{"!" : [0,1]}},
						{ 'employment':{"!" : [0,1]}}
					],
					user_id:user_id,
				};
			}

			UserDataAccessRequest.count(condition).exec(function(err,count) {
				UserDataAccessRequest.find(condition)
				.populate('owner_id',{select:['id','name','slug','headline','location','cover_image','profile_image']})
				.populate('owner_id.company_id',{select:['company_name','slug']})
				.populate('user_id',{select:['id','name','headline','location','cover_image','profile_image']})
				.populate('user_id.company_id')
				.populate('user_id.UserVerifyData',{where:{'tab_type':'identity'}})
				.populate('user_id.UserVerifyData.doc_type_id')
				.populate('user_id.UserVerifyData.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.populate('user_id.user_contact_verify')
				.populate('user_id.usereducations')
				.populate('user_id.usereducations.educationdocs',{select:['createdAt'],sort:{createdAt:1}})
				.populate('user_id.usereducations.educationdocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.populate('user_id.usereducations.degree_type')
				.populate('user_id.userexperiences')
				.populate('user_id.userexperiences.company_id',{select:['company_name','slug']})
				.populate('user_id.userexperiences.experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
				.populate('user_id.userexperiences.experiencedocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.populate('user_id.userprojects')
				.populate('user_id.userprojects.company_id',{select:['company_name','slug']})
				.populate('user_id.userprojects.projectdocs',{select:['createdAt'],sort:{from_year:-1,createdAt:-1}})
				.populate('user_id.userprojects.projectdocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
				.sort('createdAt DESC')
				.paginate({page: page_no, limit: limit})
				.exec(function (err,resultData) {
					if(err) {
						resolve({
							status:"Error",
							message:"Something went wrong. Please try again.",
							msg: "Something went wrong. Please try again."
						});
					}
          
					if(resultData.length > 0) {
					for(i=0;i<resultData.length;i++){
					  if(typeof resultData[i].owner_id != 'undefined') {
						if(typeof resultData[i].owner_id.loginid != 'undefined') {
						  delete resultData[i].owner_id.loginid;
						}
						if(typeof resultData[i].owner_id.password != 'undefined') {
						  delete resultData[i].owner_id.password;
						}
						if(typeof resultData[i].owner_id.referral != 'undefined') {
						  delete resultData[i].owner_id.referral;
						}
						if(typeof resultData[i].owner_id.ethaddress != 'undefined') {
						  delete resultData[i].owner_id.ethaddress;
						}
						if(typeof resultData[i].owner_id.socket_id != 'undefined') {
						  delete resultData[i].owner_id.socket_id;
						}
						if(typeof resultData[i].owner_id.is_verify_email != 'undefined') {
						  delete resultData[i].owner_id.is_verify_email;
						}
						if(typeof resultData[i].owner_id.createdAt != 'undefined') {
						  delete resultData[i].owner_id.createdAt;
						}
						if(typeof resultData[i].owner_id.updatedAt != 'undefined') {
						  delete resultData[i].owner_id.updatedAt;
						}
						if(typeof resultData[i].owner_id.about_me != 'undefined') {
						  delete resultData[i].owner_id.about_me;
						}
						if(typeof resultData[i].owner_id.city != 'undefined') {
						  delete resultData[i].owner_id.city;
						}
						if(typeof resultData[i].owner_id.country != 'undefined') {
						  delete resultData[i].owner_id.country;
						}
						if(typeof resultData[i].owner_id.state != 'undefined') {
						  delete resultData[i].owner_id.state;
						}
						if(typeof resultData[i].owner_id.industry_id != 'undefined') {
						  delete resultData[i].owner_id.industry_id;
						}
						if(typeof resultData[i].owner_id.language_id != 'undefined') {
						  delete resultData[i].owner_id.language_id;
						}
						if(typeof resultData[i].owner_id.is_verify_phone != 'undefined') {
						  delete resultData[i].owner_id.is_verify_phone;
						}
					  }
					  if(typeof resultData[i].user_id != 'undefined') {
						if(resultData[i].user_id.usereducations.length > 0) {
						  resultData[i].user_id.usereducations.forEach(function(usereducation, index){
							delete resultData[i].user_id.usereducations[index].grade;
							delete resultData[i].user_id.usereducations[index].from_month;
							delete resultData[i].user_id.usereducations[index].to_month;
							usereducation.educationdocs.forEach(function(educationdoc, doc_index){
							  delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].edu_id;
							  delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].createdAt;
							  delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].updatedAt;
							  delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].user_id;
							  delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].doc_type_id;
							  delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].color_scan;
							  delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].govt_issue_id;
							  delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].has_expirey_date;
							  delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].tab_type;
							  delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].doc_has_dob;
							  if(typeof resultData[i].user_id.usereducations[index].educationdocs[doc_index].identity_flag != 'undefined') {
								delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].identity_flag;
							  }
							  if(typeof resultData[i].user_id.usereducations[index].educationdocs[doc_index].dob_flag != 'undefined') {
								delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].dob_flag;
							  }
							  if(typeof resultData[i].user_id.usereducations[index].educationdocs[doc_index].address_flag != 'undefined') {
								delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].address_flag;
							  }
							  delete resultData[i].user_id.usereducations[index].educationdocs[doc_index].verify_request_id;
							});
						  });
						}
						if(resultData[i].user_id.userprojects.length > 0) {
						  resultData[i].user_id.userprojects.forEach(function(userproject, index){
							userproject.projectdocs.forEach(function(projectdoc, doc_index){
							  delete resultData[i].user_id.userprojects[index].projectdocs[doc_index].project_id;
							  delete resultData[i].user_id.userprojects[index].projectdocs[doc_index].createdAt;
							  delete resultData[i].user_id.userprojects[index].projectdocs[doc_index].updatedAt;
							  delete resultData[i].user_id.userprojects[index].projectdocs[doc_index].user_id;
							  delete resultData[i].user_id.userprojects[index].projectdocs[doc_index].doc_type_id;
							  delete resultData[i].user_id.userprojects[index].projectdocs[doc_index].color_scan;
							  delete resultData[i].user_id.userprojects[index].projectdocs[doc_index].govt_issue_id;
							  delete resultData[i].user_id.userprojects[index].projectdocs[doc_index].has_expirey_date;
							  delete resultData[i].user_id.userprojects[index].projectdocs[doc_index].doc_has_dob;
							  delete resultData[i].user_id.userprojects[index].projectdocs[doc_index].tab_type;
							  delete resultData[i].user_id.userprojects[index].projectdocs[doc_index].verify_request_id;
							});
						  });
						}
						if(resultData[i].user_id.userexperiences.length > 0) {
						  resultData[i].user_id.userexperiences.forEach(function(userexperience, index){
							userexperience.experiencedocs.forEach(function(experiencedoc, doc_index){
							  delete resultData[i].user_id.userexperiences[index].experiencedocs[doc_index].exp_id;
							  delete resultData[i].user_id.userexperiences[index].experiencedocs[doc_index].createdAt;
							  delete resultData[i].user_id.userexperiences[index].experiencedocs[doc_index].updatedAt;
							  delete resultData[i].user_id.userexperiences[index].experiencedocs[doc_index].user_id;
							  delete resultData[i].user_id.userexperiences[index].experiencedocs[doc_index].doc_type_id;
							  delete resultData[i].user_id.userexperiences[index].experiencedocs[doc_index].color_scan;
							  delete resultData[i].user_id.userexperiences[index].experiencedocs[doc_index].govt_issue_id;
							  delete resultData[i].user_id.userexperiences[index].experiencedocs[doc_index].has_expirey_date;
							  delete resultData[i].user_id.userexperiences[index].experiencedocs[doc_index].doc_has_dob;
							  delete resultData[i].user_id.userexperiences[index].experiencedocs[doc_index].tab_type;
							  delete resultData[i].user_id.userexperiences[index].experiencedocs[doc_index].verify_request_id;
							});
						  });
						}
						if(resultData[i].user_id.UserVerifyData.length > 0) {
						  resultData[i].user_id.UserVerifyData.forEach(function(verifyData, index){
							delete resultData[i].user_id.UserVerifyData[index].verify_request_id;
							if(typeof resultData[i].user_id.UserVerifyData[index].doc_type_id === 'object'){
							  delete resultData[i].user_id.UserVerifyData[index].doc_type_id.type;
							  if(typeof resultData[i].user_id.UserVerifyData[index].doc_type_id.country != 'undefined') {
								delete resultData[i].user_id.UserVerifyData[index].doc_type_id.country;
							  }
							  delete resultData[i].user_id.UserVerifyData[index].doc_type_id.createdAt;
							  delete resultData[i].user_id.UserVerifyData[index].doc_type_id.updatedAt;
							} else {
							  resultData[i].user_id.UserVerifyData[index].doc_type_id = {};
							  resultData[i].user_id.UserVerifyData[index].doc_type_id.title = 'Others';
							}
						  });
						}
						if(typeof resultData[i].identification == 'undefined' || (resultData[i].identification != '1' && typeof resultData[i].user_id.user_contact_verify != 'undefined') ){
						  delete resultData[i].user_id.user_contact_verify;
						  delete resultData[i].user_id.UserVerifyData;
						}
						var has_delete_dob = 0,
							has_delete_address = 0,
							has_delete_identity = 0;
						if(typeof resultData[i].dob == 'undefined' || resultData[i].dob != '1'){
						  has_delete_dob = 1;
						} else {
							resultData[i].dob = 1;
						}
						if(typeof resultData[i].address == 'undefined' || resultData[i].address != '1' ){
						  has_delete_address = 1
						} else {
							resultData[i].address = 1;
						}
						if(typeof resultData[i].identity == 'undefined' || resultData[i].address != '1' ){
						  has_delete_identity = 1;
						} else {
							resultData[i].identity = 1;
						}
						if(typeof resultData[i].user_id.UserVerifyData != 'undefined' && resultData[i].user_id.UserVerifyData.length > 0){
						  for(j=0;j<resultData[i].user_id.UserVerifyData.length;j++){
							if(typeof resultData[i].user_id.UserVerifyData[j] != 'undefined') {
							  if(typeof resultData[i].user_id.UserVerifyData[j]['dob_flag'] != 'undefined' && resultData[i].user_id.UserVerifyData[j]['dob_flag']=='1' && has_delete_dob == 1){
								//delete resultData[i].user_id.UserVerifyData[j];
								//console.log("come dob_flag "+i);
								resultData[i].user_id.UserVerifyData.splice(j, 1);
							  }else if(typeof resultData[i].user_id.UserVerifyData[j]['identity_flag'] != 'undefined' && resultData[i].user_id.UserVerifyData[j]['identity_flag']=='1' && has_delete_address == 1){
								//delete resultData[i].user_id.UserVerifyData[j];
								resultData[i].user_id.UserVerifyData.splice(j, 1);
								//console.log("come identity_flag "+i);
							  }else if(typeof resultData[i].user_id.UserVerifyData[j]['address_flag'] != 'undefined' && resultData[i].user_id.UserVerifyData[j]['address_flag']=='1' && has_delete_address == 1){
								//delete resultData[i].user_id.UserVerifyData[j];
								resultData[i].user_id.UserVerifyData.splice(j, 1);
								//console.log("come address_flag "+i);
							  }
							}
						  }
						}
						if(resultData[i].employment == undefined || (resultData[i].employment != '1' && resultData[i].user_id.userexperiences != undefined) ){
						  delete resultData[i].user_id.userexperiences;
						}
						if(resultData[i].educational == undefined || (resultData[i].educational != '1' && resultData[i].user_id.usereducations != undefined) ){
						  delete resultData[i].user_id.usereducations;
						}
						if(resultData[i].projects == undefined || (resultData[i].projects != '1' && resultData[i].user_id.userprojects != undefined) ){
						  delete resultData[i].user_id.userprojects;
						}
						
						if(typeof resultData[i].user_id['password'] != 'undefined'){
						  delete resultData[i].user_id['password'];
						}
						if(typeof resultData[i].user_id['referral'] != 'undefined'){
						  delete resultData[i].user_id['referral'];
						}
						if(typeof resultData[i].user_id['slug'] != 'undefined'){
						  delete resultData[i].user_id['slug'];
						}
						if(typeof resultData[i].user_id['ethaddress'] != 'undefined'){
						  delete resultData[i].user_id['ethaddress'];
						}
						if(typeof resultData[i].user_id['is_verify_phone'] != 'undefined'){
						  delete resultData[i].user_id['is_verify_phone'];
						}
						if(typeof resultData[i].user_id['is_verify_email'] != 'undefined'){
						  delete resultData[i].user_id['is_verify_email'];
						}
						if(typeof resultData[i].user_id['createdAt'] != 'undefined'){
						  delete resultData[i].user_id['createdAt'];
						}
						if(typeof resultData[i].user_id['updatedAt'] != 'undefined'){
						  delete resultData[i].user_id['updatedAt'];
						}
						if(typeof resultData[i].user_id['about_me'] != 'undefined'){
						  delete resultData[i].user_id['about_me'];
						}
						if(typeof resultData[i].user_id['state'] != 'undefined'){
						  delete resultData[i].user_id['state'];
						}
						if(typeof resultData[i].user_id['language_id'] != 'undefined'){
						  delete resultData[i].user_id['language_id'];
						}
						if(typeof resultData[i].user_id['industry_id'] != 'undefined'){
						  delete resultData[i].user_id['industry_id'];
						}
						if(typeof resultData[i].user_id['country'] != 'undefined'){
						  delete resultData[i].user_id['country'];
						}
						if(typeof resultData[i].user_id['city'] != 'undefined'){
						  delete resultData[i].user_id['city'];
						}
					  }
					}
				  }
					resolve({
						status:"OK",
						msg:"Pending data access requests!",
						data:resultData,
					});
				});
			});
		});
	},
	
  resendORcancelrequestdata: function(req,user_id,type_param){
    return new Promise(function (resolve, reject) {
      if(req.param("id")){
        UserDataAccessRequest.findOne({id:req.param("id")}).exec(function(err,found){
          if(err){
            resolve({
              status:"Error",
              message:"Something went wrong. Please try again."
            });
          }else if(typeof found!='undefined' && typeof found.id!='undefined'){

            // Cancel Request
            if(type_param=="C"){
              var updateData = {};
              // Update only those data that have no any action means that they are still pending
              if(typeof found.identification!='undefined' && found.identification!=2 && found.identification!=3){
                updateData.identification = 0;
              }
              if(typeof found.employment!='undefined' && found.employment!=2 && found.employment!=3){
                updateData.employment = 0;
              }
              if(typeof found.educational!='undefined' && found.educational!=2 && found.educational!=3){
                updateData.educational = 0;
              }
              if(typeof found.projects!='undefined' && found.projects!=2 && found.projects!=3){
                updateData.projects = 0;
              }

              // console.log(updateData);
              
              UserDataAccessRequest.update({id:found.id},updateData).exec(function(err,update){
                if(err){
                  resolve({
                    status:"Error",
                    message:"Requested data record not found. Please try again."
                  });
                } else {
                  UserFcmkey.find({user_id:user_id}).exec(function(err,user_FCM_key){
                    if(user_FCM_key != undefined && user_FCM_key.length > 0) {
                      for(i=0;i<user_FCM_key.length ;i++){
                        FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],found,'Request Data Access record has been canceled',8);
                      }
                    }
                    resolve({
                      status:"OK",
                      message:"Request Data Access record has been successfully canceled."
                    });
                  });
                }
              });
            } else if(type_param=="R") {
              var getDate = moment(found.createdAt).format('DD/MM/YYYY')
              var current_date = moment(new Date()).format('DD/MM/YYYY')
              if(getDate==current_date){
                updateData = {};
                if(found.identification){
                  updateData.identification = found.identification;
                }
                if(found.educational){
                  updateData.educational = found.educational;
                }
                if(found.employment){
                  updateData.employment = found.employment;
                }
                if(found.projects){
                  updateData.projects = found.projects;
                }
                if(found.dob){
                  updateData.dob = found.dob;
                }
                if(found.address){
                  updateData.address = found.address;
                }
                if(found.identity){
                  updateData.identity = found.identity;
                }

                UserDataAccessRequest.update({id:found.id},updateData).exec(function(err,update){
                  resolve({
                    status:"OK",
                    message:"Request Data Access record has been successfully resent."
                  });
                });
              }else{
                var resendData = {};
                resendData.owner_id = found.owner_id;
                resendData.user_id = found.user_id;
                resendData.status = 0;
                if(found.identification){
                  resendData.identification = 1;
                }
                if(found.educational){
                  resendData.educational = 1;
                }
                if(found.employment){
                  resendData.employment = 1;
                }
                if(found.projects){
                  resendData.projects = 1;
                }
                if(found.dob){
                  resendData.dob = 1;
                }
                if(found.address){
                  resendData.address = 1;
                }
                if(found.identity){
                  resendData.identity = 1;
                }

                UserDataAccessRequest.create(resendData).then(function (err,_DataAccess) {
                  resolve({
                    status: 'OK',
                    message: 'Data access request has been resent successfully!'
                  })
                })
              }
            }
          }else{
            resolve({
              status:"Error",
              message:"Requested data record not found. Please try again."
            });
          }
        });
      }else{
        resolve({
          status:"Error",
          message:"Something went wrong. Please try again."
        });
      }
    });
  },
  AuthorizeDataPdf:function(req,user_id) {
    return new Promise(function (resolve, reject) {
      UserDataAccessAction.find({request_id:req.param("id"),status:2})
        .populate("request_id")
        .populate('request_id.owner_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
        .populate('request_id.user_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
        .populate('request_id.user_id.company_id')
        .populate('request_id.user_id.UserVerifyData')
        .populate('request_id.user_id.UserVerifyData.doc_type_id')
        .populate('request_id.user_id.UserVerifyData.verify_request_id',{where:{txnno:{"!":""}},limit:1})
        .populate('request_id.user_id.user_contact_verify')
        .populate('request_id.user_id.usereducations')
        .populate('request_id.user_id.usereducations.educationdocs',{select:['createdAt'],sort:{createdAt:1}})
        .populate('request_id.user_id.usereducations.educationdocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
        .populate('request_id.user_id.userexperiences')
        .populate('request_id.user_id.userexperiences.company_id')
        .populate('request_id.user_id.userexperiences.experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
        .populate('request_id.user_id.userexperiences.experiencedocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
        .populate('request_id.user_id.userprojects')
        .populate('request_id.user_id.userprojects.company_id')
        .populate('request_id.user_id.userprojects.projectdocs',{select:['createdAt'],sort:{from_year:-1,createdAt:-1}})
        .populate('request_id.user_id.userprojects.projectdocs.verify_request_id',{where:{txnno:{"!":""}},limit:1})
        .sort('sequence ASC')
        .exec(function (err,completeListData){
          if(err){
            resolve({status:'Error',msg:'No record found'});
          }
          // return res.json(completeListData);
          var pdfFilename = req.param("id")+moment(new Date()).format('DD-MM-YYYY-h-m-s')+".pdf";
          sails.hooks.pdf.make("testPdf",
          {
            completeAuthorizes: completeListData,
            moment: moment,
          },
          {
            output: 'assets/pdfs/'+pdfFilename
          },
          function(err, result) {
            resolve({status:'OK',data:{'pdf_url':sails.config.appUrlwPort + sails.config.pdfDock + pdfFilename},msg:'Data access PDF'});
          }
        );
      });
    });
  },
  VerifyByUser:function(req,user_id) {
    page_no = req.param("page_no") != undefined ? req.param("page_no") : '1';
    return new Promise(function (resolve, reject) {
      UserVerifyDataRequest.find({verify_id:req.param("verify_id"),status:1})
        .populate("user_id",{select:['name','slug','profile_image']})
        .populate("user_id.userexperiences",{select:['title'],where:{display_status:'1'}})
        .paginate({page: page_no, limit: 10})
        .exec(function (err,completeListData){
          if(err) {
            resolve({status:'Error',msg:'No record found'});
          } else {
            if(completeListData.length > 0){
              for(i=0;i<completeListData.length;i++){
                if(completeListData[i]['user_id']["loginid"] != undefined){
                  delete completeListData[i]['user_id']["loginid"];
                }
                if(completeListData[i]['user_id']["password"] != undefined){
                  delete completeListData[i]['user_id']["password"];
                }
                if(completeListData[i]['user_id']["referral"] != undefined){
                  delete completeListData[i]['user_id']["referral"];
                }
                if(completeListData[i]['user_id']["ethaddress"] != undefined){
                  delete completeListData[i]['user_id']["ethaddress"];
                }
                if(completeListData[i]['user_id']["is_verify_phone"] != undefined){
                  delete completeListData[i]['user_id']["is_verify_phone"];
                }
                if(completeListData[i]['user_id']["is_verify_email"] != undefined){
                  delete completeListData[i]['user_id']["is_verify_email"];
                }
                if(completeListData[i]['user_id']["createdAt"] != undefined){
                  delete completeListData[i]['user_id']["createdAt"];
                }
                if(completeListData[i]['user_id']["updatedAt"] != undefined){
                  delete completeListData[i]['user_id']["updatedAt"];
                }
                if(completeListData[i]['user_id']["about_me"] != undefined){
                  delete completeListData[i]['user_id']["about_me"];
                }
                if(completeListData[i]['user_id']["city"] != undefined){
                  delete completeListData[i]['user_id']["city"];
                }
                if(completeListData[i]['user_id']["country"] != undefined){
                  delete completeListData[i]['user_id']["country"];
                }
                if(completeListData[i]['user_id']["headline"] != undefined){
                  delete completeListData[i]['user_id']["headline"];
                }
                if(completeListData[i]['user_id']["industry_id"] != undefined){
                  delete completeListData[i]['user_id']["industry_id"];
                }
                if(completeListData[i]['user_id']["language_id"] != undefined){
                  delete completeListData[i]['user_id']["language_id"];
                }
                if(completeListData[i]['user_id']["location"] != undefined){
                  delete completeListData[i]['user_id']["location"];
                }
                if(completeListData[i]['user_id']["state"] != undefined){
                  delete completeListData[i]['user_id']["state"];
                }
                if(completeListData[i]['user_id']["userexperiences"] != undefined &&  completeListData[i]['user_id']["userexperiences"].length > 0){
                  completeListData[i]['user_id']["userexperiences"] = completeListData[i]['user_id']["userexperiences"][0];
                }
                completeListData[i] = completeListData[i]['user_id'];
              }
            }
            resolve({status:'OK',msg:'Verify By User',data:{user_list : completeListData,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url}});
          }
      });
    });
  },
  verifyRequestedToUser:function(req,user_id) {
    page_no = req.param("page_no") != undefined ? req.param("page_no") : '1';
    return new Promise(function (resolve, reject) {
      UserVerifyDataRequest.find({verify_id:req.param("verify_id"),status:0})
        .populate("user_id",{select:['name','slug','profile_image']})
        .populate("user_id.userexperiences",{select:['title'],where:{display_status:'1'}})
        .paginate({page: page_no, limit: 10})
        .exec(function (err,completeListData){
          if(err) {
            resolve({status:'Error',msg:'No record found'});
          } else {
            if(completeListData.length > 0){
              for(i=0;i<completeListData.length;i++){
                if(completeListData[i]['user_id']["loginid"] != undefined){
                  delete completeListData[i]['user_id']["loginid"];
                }
                if(completeListData[i]['user_id']["password"] != undefined){
                  delete completeListData[i]['user_id']["password"];
                }
                if(completeListData[i]['user_id']["referral"] != undefined){
                  delete completeListData[i]['user_id']["referral"];
                }
                if(completeListData[i]['user_id']["ethaddress"] != undefined){
                  delete completeListData[i]['user_id']["ethaddress"];
                }
                if(completeListData[i]['user_id']["is_verify_phone"] != undefined){
                  delete completeListData[i]['user_id']["is_verify_phone"];
                }
                if(completeListData[i]['user_id']["is_verify_email"] != undefined){
                  delete completeListData[i]['user_id']["is_verify_email"];
                }
                if(completeListData[i]['user_id']["createdAt"] != undefined){
                  delete completeListData[i]['user_id']["createdAt"];
                }
                if(completeListData[i]['user_id']["updatedAt"] != undefined){
                  delete completeListData[i]['user_id']["updatedAt"];
                }
                if(completeListData[i]['user_id']["about_me"] != undefined){
                  delete completeListData[i]['user_id']["about_me"];
                }
                if(completeListData[i]['user_id']["city"] != undefined){
                  delete completeListData[i]['user_id']["city"];
                }
                if(completeListData[i]['user_id']["country"] != undefined){
                  delete completeListData[i]['user_id']["country"];
                }
                if(completeListData[i]['user_id']["headline"] != undefined){
                  delete completeListData[i]['user_id']["headline"];
                }
                if(completeListData[i]['user_id']["industry_id"] != undefined){
                  delete completeListData[i]['user_id']["industry_id"];
                }
                if(completeListData[i]['user_id']["language_id"] != undefined){
                  delete completeListData[i]['user_id']["language_id"];
                }
                if(completeListData[i]['user_id']["location"] != undefined){
                  delete completeListData[i]['user_id']["location"];
                }
                if(completeListData[i]['user_id']["state"] != undefined){
                  delete completeListData[i]['user_id']["state"];
                }

                if(completeListData[i]['user_id']["userexperiences"] != undefined &&  completeListData[i]['user_id']["userexperiences"].length > 0){
                  completeListData[i]['user_id']["userexperiences"] = completeListData[i]['user_id']["userexperiences"][0];
                }
                
                completeListData[i] = completeListData[i]['user_id'];
              }
            }
            resolve({status:'OK',msg:'Requested To User',data:{user_list : completeListData,'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url}});
          }
      });
    });
  },
}
