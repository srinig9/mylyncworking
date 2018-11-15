/**
 * VerifyController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var path = require('path')
var moment = require('moment')
var Web3 = require('web3')
var fs = require('fs')

var contractFile = sails.config.contract_file;
var eth_URL = sails.config.appEtherUrl + ':' + sails.config.portEtherIo;

var web3 = new Web3(new Web3.providers.HttpProvider(eth_URL));
var contract = JSON.parse(fs.readFileSync(contractFile, 'utf8'))
var abiDefinition = contract.abi

global.smartContract = web3.eth.contract(abiDefinition).at(contract.networks[sails.config.network_addr_num].address)

var contractAddress = contract.networks[sails.config.network_addr_num].address

module.exports = {

  /*
  * VerifyController.getVerified
  * retrieve verifications list for sending for verification
  */
  getVerified: function (req, res, next) {
  	var statusArr = [0,1];
    Doctype.find({'$or':[{type:'other_docs'},{type:'identity'}]}).exec(function (err, doc_type) {
      if (err) {
        return res.json({ status: 'Error', message: err,  _data: ''})
      }

      doc_type_id = [],
      doc_type_other = []

      _.each(doc_type, function (val) {
        if (val.type == 'identity') {
        	if(typeof val.title!='undefined' && val.title!='Others'){
              doc_type_id.push(val)
            }
        }
         if (val.type == 'other_docs') {
          doc_type_other.push(val)
        }
        
      })

      UserVerifyData.find({user_id: req.user.id}).populate('doc_type_id').populate('doc_country').populate('verify_request_id',{where:{status:{'$in': statusArr}},sort:{createdAt:1},limit:2}).populate('verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2}).where({tab_type:'identity'}).sort('createdAt DESC').exec(function (err, userVerifyDatas) {
        if (err) {
          return res.json({ status: 'Error', message: err, _data: '' })
        }
       UserVerifyData.find({user_id: req.user.id}).populate('doc_type_id').populate('verify_request_id',{where:{status:{'$in': statusArr}},sort:{createdAt:1},limit:2}).populate('verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2}).where({tab_type:'other_docs'}).sort('createdAt DESC').exec(function (err, verify_other_docs) {
        
        if (err) {
          return res.json({ status: 'Error', message: err, _data: '' })
        }

        UserContactVerifyData.findOne({user_id: req.user.id}).exec(function (err, verifyData) {
          if (err) {
            return res.json({ status: 'Error', message: err, _data: '' })
          }
          Users.findOne({id: req.user.id})
          .populate('usereducations',{sort:{from_year:-1,createdAt:-1}})
          .populate('usereducations.educationdocs',{select:['createdAt'],sort:{createdAt:1}})
          .populate('usereducations.educationdocs.verify_request_id',{where:{status:{'$in': statusArr}},select:['tab_type'],sort:{createdAt:1},limit:2})
          .populate('usereducations.educationdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
          .populate('userexperiences',{sort:{from_year:-1,current_work:-1}})
          .populate('userexperiences.company_id',{select:['company_name'],sort:{from_year:-1,current_work:-1}})
          .populate('userexperiences.experiencedocs',{select:['createdAt'],sort:{createdAt:1}})
          .populate('userexperiences.experiencedocs.verify_request_id',{where:{status:{'$in': statusArr}},select:['tab_type'],sort:{createdAt:1},limit:2})
          .populate('userexperiences.experiencedocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{createdAt:1},limit:2})
          .populate('userprojects',{sort:{from_year:-1,createdAt:-1}})
          .populate('userprojects.company_id',{select:['company_name'],sort:{from_year:-1,createdAt:-1}})
          .populate('userprojects.projectdocs',{select:['createdAt'],sort:{from_year:-1,createdAt:-1}})
          .populate('userprojects.projectdocs.verify_request_id',{where:{status:{'$in': statusArr}},select:['tab_type'],sort:{from_year:-1,createdAt:-1},limit:2})
          .populate('userprojects.projectdocs.verify_request_id.user_id',{select:['name','slug','profile_image'],sort:{from_year:-1,createdAt:-1},limit:2})

          .exec(function (err, userdata) {
	      	 	if (err) {
	            	return res.json({ status: 'Error', message: err, _data: '' })
	          	}
            Companies.find({select: ['company_name']}).exec(function (err, company) {
	            if (err) {
	            	return res.json({ status: 'Error', message: err, _data: '' })
	          	}
              UserDataService.UserDetailsForGetVerify(req,req.user.id).then(function (userInfo) {
                Country_Dial_Code.find({select:['dial_code','name']}).exec(function (err, dial_code) {
                	if (err) {
		            	return res.json({ status: 'Error', message: err, _data: '' })
		          	}
					Degreetype.find({status:1}).exec(function (err, degreetype) {
						if (err) {
		            		return res.json({ status: 'Error', message: err, _data: '' })
		          		}
		          		Countries.find({select:['name']}).exec(function (err,country) {
		          			if (err) {
		            			return res.json({ status: 'Error', message: err, _data: '' })
		          			}

                      		return res.view('verification/getverified', {
								userVerifyDatas: userVerifyDatas,
		            			verifyOtherDocsData: verify_other_docs,
							  	doc_type_id: doc_type_id,
							  	country:country,
		            			doc_type_other:doc_type_other,
		  						userverify: verifyData,
		  						dial_code:dial_code,
		  						degreetypes:degreetype,
		  						userInfo: userdata.usereducations,
		  						userexp: userdata.userexperiences,
		  						user_project:userdata.userprojects,
		  						companylist: company,
		  						userData: userInfo,
		  						moment: moment,
		  						status: 'OK',
		  						title: 'Get Verified | Lynked.World'
  					  		})
  					  	})
  					})
                  })
                })
              })
            })
          })
        })
      })
    })
  },

	/*
	* VerifyController.saveVerified
	* retrieve verifications list for sending for verification
	*/
	saveVerified: function (req, res, next) {
		var tab_type = req.param('tab_type');
		var doc_id='';
		
		UserVerifyData.find({"doc_id":{"$exists" : true, "$ne" : ""},select: ['doc_id']}).sort('createdAt DESC').limit(1).exec(function (err, forDocIds) {
			if (err) {
				console.log('error in save verification')
			}

			var _newVerifyData = {
				user_id: req.user.id,
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

				/* if (typeof req.param('identity_dob') != 'undefined' && req.param('identity_dob') != '') {
					_newVerifyData.dob = req.param('identity_dob')
				} */
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
				if(bcd_dob == 14) {
					/* console.log('DATE --> ', moment().format("DD-MM-YYYY"));
					console.log('DATE --> ', moment(_newVerifyData.dob).format("DD-MM-YYYY"));
					console.log('DATE COMP --> ', moment(moment().format("DD-MM-YYYY")).isAfter(_newVerifyData.dob));
					if(moment(moment().format("DD-MM-YYYY")).isAfter(moment(_newVerifyData.dob).format("DD-MM-YYYY"))) {
						return res.json({
							status: 'Error',
							msg: 'Future Date of Birth not allowed'
						})
					} */
				} else {
					return res.json({
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
				if (typeof req.param('issue_date') != 'undefined' && req.param('issue_date').trim() != '') {
					_newVerifyData.issue_date = moment(req.param('issue_date')).format('DD-MM-YYYY');
				}
				if (typeof req.param('expiry_date') != 'undefined' && req.param('expiry_date').trim() != '') {
					_newVerifyData.expiry_date = moment(req.param('expiry_date')).format('DD-MM-YYYY')
				}
			}

			if(typeof req.param('identity_dob_val') != 'undefined' && req.param('identity_dob_val') != '') {
				_newVerifyData.dob_flag = req.param('identity_dob_val');

				if(typeof req.param('dob_legal_name')!='undefined' && req.param('dob_legal_name').trim() != '') {
					_newVerifyData.legal_name = '';
					_newVerifyData.legal_name = req.param('dob_legal_name').trim();
				}else{
					return res.json({
						status: 'Error',
						msg: 'Legal Name is required'
					})
				}

				if (typeof req.param('issue_country') != 'undefined' && req.param('issue_country') != '') {
					_newVerifyData.issue_country = '';
					_newVerifyData.issue_country = req.param('issue_country')
				}
				if(typeof req.param('birth_doc_country') !='undefined' && req.param('birth_doc_country')!=''){
					_newVerifyData.doc_country = '';
					_newVerifyData.doc_country = req.param('birth_doc_country');
				}else{
					return res.json({
						status: 'Error',
						msg: 'Country is required'
					})
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
				if(bcd_dob == 14) {
					/* console.log('DATE --> ', moment().format("DD-MM-YYYY"));
					console.log('DATE --> ', moment(_newVerifyData.dob).format("DD-MM-YYYY"));
					console.log('DATE COMP --> ', moment(moment().format("DD-MM-YYYY")).isAfter(_newVerifyData.dob));
					if(moment(moment().format("DD-MM-YYYY")).isAfter(moment(_newVerifyData.dob).format("DD-MM-YYYY"))) {
						return res.json({
							status: 'Error',
							msg: 'Future Date of Birth not allowed'
						})
					} */
				} else {
					return res.json({
						status: 'Error',
						msg: 'Date of Birth required'
					})
				}
				
				if (typeof req.param('birth_place') != 'undefined' && req.param('birth_place').trim()!= '') {
					_newVerifyData.birth_place = req.param('birth_place').trim();
				}else{
					return res.json({
						status: 'Error',
						msg: 'Birth Place is required'
					})
				}
			}

			if (typeof req.param('identity_address_val') != 'undefined' && req.param('identity_address_val') != '') {
				_newVerifyData.address_flag = req.param('identity_address_val')

				if(typeof req.user!='undefined' && typeof req.user.name!='undefined' && req.user.name!=''){
					_newVerifyData.legal_name = '';
					_newVerifyData.legal_name = req.user.name;
				}
				if (typeof req.param('state') != 'undefined' && req.param('state') != '') {
					_newVerifyData.state = req.param('state')
				}
				if (typeof req.param('address_line_1') != 'undefined' && req.param('address_line_1').trim() != '') {
					_newVerifyData.address_line_1 = req.param('address_line_1').trim();
				}else{
					return res.json({
						status: 'Error',
						msg: 'Address_1 is required'
					})
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

			/*if (typeof req.param('dob') != 'undefined' && req.param('dob') != '' && req.param('birth_place') != 'undefined' && req.param('birth_place') != '') {
				if (req.param('color_scan_dob') != 'undefined' && req.param('color_scan_dob') != '') {
					_newVerifyData.color_scan = req.param('color_scan_dob')
				}
				if (typeof req.param('govt_issue_id_dob')!='undefined' && req.param('govt_issue_id_dob') != '') {
					_newVerifyData.govt_issue_id = req.param('govt_issue_id_dob')
				}
				_newVerifyData.doc_has_dob = 1;
			}*/

			//doc_file = req.file('doc_file');
	        var uploadPath = process.cwd() + "/.tmp/public/uploads/docs/" + tab_type + "/" + req.user.id;
	        var real_uploadPath = process.cwd() + "/assets/uploads/docs/" + tab_type + "/" + req.user.id;
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
              		return res.json({
                		status: 'OK',
                		msg: 'Data save successfully'
            		})
          		});
              }
              else{
                if(uploadedFiles.length > 0){
                  	var fd = uploadedFiles[0].fd;
                  	var myarr = fd.split("\\");
                  	var filename = path.basename(myarr[myarr.length-1]);

	              	var allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/msword', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
	                var extension = uploadedFiles[0].type;

	                if (allowedTypes.indexOf(extension) === -1) {
	                  return res.json({
	                    filename: path.basename(uploadedFiles[0].fd),
	                    status: 'Error',
	                    datatype: 1,
	                    msg: 'File type is not valid'
	                  })
	                }

                  fs.readFile(fd, function (err, data) {
                    fs.writeFile(sails.config.appPath + '/assets/uploads/docs/' + tab_type + '/'+ req.user.id + '/' + filename, data, function (err) {
                    });
                  });
                  _newVerifyData.doc_url = filename;
                  _newVerifyData.doc_id = doc_id;
                }

                UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
	              return res.json({
	                status: 'OK',
	                msg: 'Data save successfully'
		            })
	          });
            }
        }); 

      })
	},

	/*
	* VerifyController.saveData
	* get-verified-save data-for verification
	*/
	/*
	saveData: function (req, res, next) {
		date = new Date()
		var _data = {
			username: req.user.name,
			ethaddress: req.user.ethaddress,
			type: req.param('type'),
			value: req.param('data'),
			formattedDate: moment(date).format('DD/MM/YYYY'),
			hash: require('crypto').createHash('md5').update(req.param('data')).digest('hex'),
			status: 'verify'
		}

		Verify.create(_data, function IdsCreated (err, record) {
			if (err) {
				return res.json({ status: 'Error', message: err, _data})
			}
			console.log('records created..', record)
			return res.json({
				status: 'OK'
			})
		})
	},*/


	/*
	* VerifyController.saveData
	* get a verify data for displaying them in a detailed screen 
	* before sending it for verification
	*/
	/*
	getVerifyData: function (req, res, next) {
		Users.find(function (err, users) {
			if (users.length == 0) {
				console.log('Error - no users returned...')
			}else {
				Verify.findOne(req.param('id'), function verifyRecs (err, record) {
					if (err) {
						return res.json({ status: 'Error', message: err, _data})
					}
					var sHTML = (typeof record.value != 'undefined') ? record.value : ''
					if (record.value[0] == '{') {
						var dataJSON = JSON.parse(record.value)
						var key
						var sHTML = '<table><tr>'
						for (key in dataJSON) {
							if (dataJSON.hasOwnProperty(key)) {
								key1 = key.substr(0, 1).toUpperCase() + key.substr(1)
								// console.log(key1 + " = " + dataJSON[key])
								sHTML += '<td>' + key1 + ' </td><td>:</td> <td>' + dataJSON[key] + '</td></tr>'
							}
						}
						sHTML += '</table>'
					}
					usersHTML = '<select class="js-example-basic-multiple form-control" name="verifier" id="verifier" multiple="multiple">'
					for (var usersCount = 0; usersCount < users.length; usersCount++) {
						if (users[usersCount].name != req.user.name)
							usersHTML += '<option value="' + users[usersCount].ethaddress + '">' + users[usersCount].name + '</option>'
					}
					usersHTML += '</select>'

					var date = new Date()

					var response = []
					response[0] = record
					response[1] = sHTML
					response[2] = usersHTML
					response[3] = moment(date).format('DD/MM/YYYY')
					res.json(response)
				}) // verify
			} // if users 
		}) // users
	},
	*/


	/*
	* VerifyController.sendVerifyData
	*
	*/
	/*
	sendVerifyData: function (req, res, next) {
		Verify.findOne(req.param('id'), function verifyRecs (err, verifyRec) {
			if (err) {
				return res.json({ status: 'Error', message: err, _data})
			}

			delete verifyRec['id']

			verifyRec['verifier'] = req.param('verifier')
			verifyRec['verifyid'] = req.param('id')
			verifyRec['status'] = 'verify'

			// console.log("Data...", verifyRec)
			// console.log("Id,,,", req.param('id'))

			Verification.create(verifyRec, function verifyRecs (err, record) {
				if (err) {
				  return res.json({ status: 'Error', message: err.message })
				}
				console.log('Record created successfully....', record.id)
			})
		})
	},
	*/

	/*
	* VerifyController.sendVerifyData
	* Loading verification data for an user
	* This is will appear in the authenticate screen
	*/
	
	/* loadMyVerifyData: function (req, res, next) {
		Verification.find({verifier: req.user.ethaddress}, function verifyRecs (err, records) {
			if (err) {
				return res.json({ status: 'Error', message: err, _data})
			}
			var date = new Date()

			// console.log("records created..", records)
			return res.view('verification/authenticate', {
				verifyRecs: records,
				status: 'OK',
				title: '',
				todayDate: moment(date).format('DD/MM/YYYY')
			})
		})
	},*/


	/*
	* VerifyController.getVerificationData
	* Loading a verification data given a record id from verification model
	* This is will appear in the authenticate detail screen
	*/
	/*
	getVerificationData: function (req, res, next) {
		Verification.findOne(req.param('id'), function verifyRecs (err, record) {
			if (err) {
				return res.json({ status: 'Error', message: err, data: ''})
			}

			var sHTML = (typeof record.value != 'undefined') ? record.value : ''
			if (record.value[0] == '{') {
				var dataJSON = JSON.parse(record.value)
				var key

				var sHTML = '<table><tr>'
				for (key in dataJSON) {
					if (dataJSON.hasOwnProperty(key)) {
						key1 = key.substr(0, 1).toUpperCase() + key.substr(1)
						// console.log(key1 + " = " + dataJSON[key])
						sHTML += '<td>' + key1 + ' </td><td>:</td> <td>' + dataJSON[key] + '</td></tr>'
					}
				}
				sHTML += '</table>'
			}
			//    usersHTML = '<select class="js-example-basic-multiple form-control" name="verifier" id="verifier" multiple="multiple">'
			//     for(var usersCount=0; usersCount < users.length; usersCount++) {
			//         if (users[usersCount].name != req.user.name)
			//             usersHTML += '<option value="' + users[usersCount].ethaddress+ '">'+ users[usersCount].name +'</option>'
			//     }
			//     usersHTML +='</select>'

			var commentsHTML = ''

			Verification.find({verifyid: record.verifyid, status: 'verified'}, function verifyComments (error, comments) {
				if (error) {
					return res.json({ status: 'Error', message: 'Record not found' })
				}
				console.log('Comments....', comments.length)

				if (comments) {
					var commentsHTML = ' '
					for (var commentsCount = 0; commentsCount < comments.length; commentsCount++) {
						commentsHTML += '<div class="p8_v_1000_li"><div class="p8_1001">'
						commentsHTML += '<img class="p8_1001_img" src="https://placehold.it/95x95/71CFEB/025ba2" alt="John Doe" width="65" height="65">'
						commentsHTML += '<div class="p8_1001_content">'
						commentsHTML += '<div class="p18_1001_user"><a href="">' + comments[commentsCount].verifiername + '</a> </div>'
						commentsHTML += '<div class="p18_1001_dated">' + comments[commentsCount].verifydate + '</div>'
						commentsHTML += '</div></div>'

						commentsHTML += '<div class="p8_1002"><div class="p8_1002_description">'
						commentsHTML += '<b>Blockchain txn # </b><a href="' + sails.config.ether_lieve_server + comments[commentsCount].txnno + '">' + comments[commentsCount].txnno + '</a>'
						commentsHTML += '| <br> <a href="/comparedata/' + comments[commentsCount].verifyid + '" target="_blank"><i class="fa fa-clone" aria-hidden="true"></i> Compare with Blockchain Data</a></div>'
						commentsHTML += '<div class="p8_1002_description"><p>' + comments[commentsCount].comments
						commentsHTML += '</div></div></div>'
					}

					var date = new Date()
					var response = []
					response[0] = record
					response[1] = sHTML
					response[2] = commentsHTML
					response[3] = moment(date).format('DD/MM/YYYY')
					res.json(response)
				} else {
					var date = new Date()
					var response = []
					response[0] = record
					response[1] = sHTML
					response[2] = commentsHTML
					response[3] = moment(date).format('DD/MM/YYYY')
					res.json(response)
				}
			})
		}) // verify
	},
	*/


	/*
	* VerifyController.saveVerifyData
	*
	*
	*/
	/*
	saveVerifyData: function (req, res, next) {
		Verification.findById(req.param('id'), (err, verifyRec) => {

			verifyRecord = verifyRec[0]
			console.log('Error', err)
			console.log('Verify Record', verifyRecord)

			var key = verifyRecord.ethaddress + verifyRecord.type
			console.log('Key....', key)
			var key = key.toString()
			console.log('Key....', key)
			var keyhex = require('crypto').createHash('md5').update(key).digest('hex')

			smartContract.enterStructData.sendTransaction
			(keyhex, verifyRecord.ethaddress, verifyRecord.verifier, verifyRecord.type, verifyRecord.hash, { from: sails.config.eth_adminAddress, gas: sails.config.eth_gas, gasPrice: sails.config.eth_gas_price }, function (error, txnno) {
				if (error) {
					console.error(error)
				} else {
					console.log('Send transaction successful ' + txnno)
					dateNow = new Date()
					//  order.updated = moment.tz(dateNow, "Europe/London").format("DD-MMM-YYYY HH:mm")
					var _data = {
						txnno: txnno,
						status: 'verified',
						verifydate: moment(dateNow).format('DD/MM/YYYY'),
						verifiername: req.user.name,
						comments: req.param('comments')
					}

	
					Verification.update({id: req.param('id')}, _data).exec(function verifyRecs (err, record) {
						if (err) {
							return res.json({ status: 'Error', message: err, _data})
						}
						console.log('Record updated successfully....', record)
					}) // update
				} // else error in txnno
			}) // sendTransaction
		}) // verify findById
	},
	*/

	/*
	* VerifyController.compareData
	*
	*
	*/
	compareData: function (req, res) {
		
		if(req.param('id')=='undefined' || req.param('user_id')=='undefined'){
			return res.json({ status: 'Error', message:'fail to compare data,Some parameter are missing' })
		}

		UserVerifyDataRequest.findOne().where({verify_id: req.param('id'),user_id:req.param('user_id')})
		.populate('verify_id')
		.populate('verify_id.edu_id')
		.populate('verify_id.edu_id.degree_type')
		.populate('verify_id.exp_id')
		.populate('verify_id.exp_id.company_id')
		.populate('verify_id.project_id')
		.populate('verify_id.project_id.company_id')
		.populate('owner_id', {select: ['name', 'slug', 'ethaddress']})
		.populate('verify_id.doc_type_id', {select: ['title']})
		.exec(function (err, records) {
			UserDataService.UserDetailsForGetVerify(req,req.user.id).then(function (userInfo) {
				if (err) {
					return res.json({ status: 'Error', message: err.message })
				} else {
					res.view('verification/compare-data', {
						userData: userInfo,
						verifyData:records,
						title:'Blockchain Verification | Lynked World'
					})
				}
			})
		})
	},

	/*
	* VerifyController.verifydata
	*
	*
	*/
	verifydata: function (req, res, next) {
		Web3 = require('web3')
		web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

		var fs = require('fs')
		var contract = JSON.parse(fs.readFileSync(contractFile, 'utf8'))

		var abiDefinition = contract.abi
		var smartContract = web3.eth.contract(abiDefinition).at(contract.networks['4'].address)
		var contractAddress = contract.networks['4'].address

		var user = req.param('user').trim()
		var datatype = req.param('datatype').trim()
		var data = req.param('data').trim()

		var key = require('crypto').createHash('md5').update(user + datatype).digest('hex')
		var dataEnteredHash = require('crypto').createHash('md5').update(data).digest('hex')
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
	},

	// jay vaghela
	SendEmailVerifyCode: function (req, res) {
		VerifyService.SendEmailVerifyCode(req, req.user.id).then(function(emailResponce){
			return res.json(emailResponce);
		});
	},

  SendPhoneVerifyCode: function (req, res) {
    var phone_no = req.param('phone');
    var dial_code = req.param('dial_code');
    var user_id = req.user.id;
    var my_contact= '';
    var otp_text = 'Your Lynked.World confirmation code is : ';
    var verify_type='phone_verify';
    
    if(phone_no=='' || dial_code==''){
      return res.json({status: 'Error',msg: 'Phone & Dial code both required' })
    }

    SmsLogsService.checkSmsLog(user_id,verify_type).then(function(smslimit){
      if(smslimit>=3){
        return res.json({status: 'OK',msg: 'Sent Phone OTP successfully' })
      }

    UserContactVerifyData.findOne({user_id: user_id,is_phone_verify:0,phone: phone_no,dial_code:dial_code}).exec(function (err, userEmail) {
      if (userEmail) {
        var msg = otp_text + userEmail.phone_otp
        var messageInfo = ''
        my_contact = dial_code+phone_no;

       twilioSms.sendSMS(dial_code, my_contact, msg).then(function(data){
          if(data.status){            
            messageInfo = {
              owner_id   : req.user.id,
              message_id : data.data.sid,
              message    : data.data.body,
              sendto     : data.data.to,
                status     : data.data.status,
                sms_type    :'phone_verify'
            }
            SmsLogsService.StoreSmsLogs(messageInfo);

            return res.json({ _verify: userEmail,status: 'OK',msg: 'Resend Phone OTP successfully' })
          } else {
            return res.json({status: 'Error',msg: 'Fail to send OTP,Please try again' })
          }
        });

      }else {
        UserContactVerifyData.find({phone: phone_no,is_phone_verify:1,dial_code:dial_code}).where({'user_id.id':{'!':user_id},'user_id.company_id': {"$exists" :false}}).exec(function (err, checkEmail) {

          if(typeof req.user.company_id=='undefined' || req.user.company_id==''){
            if(checkEmail.length > 0) {
              return res.json({
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
                    owner_id   : req.user.id,
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
                        return res.json({
                          verifyData: verifyData,
                          status: 'Error',
                          msg: 'Fail to store information,Please try again'
                        })
                      }
                      return res.json({
                        _verify: _verify,
                        status: 'OK',
                        msg: 'Sent Phone OTP successfully'
                      })
                    })
                  }else {
                    if (typeof userExist.phone == 'undefined' && typeof userExist.phone_otp == 'undefined') {
                      UserContactVerifyData.update(userExist.id, verifyData).then(function (_verify) {
                        return res.json({
                          _verify: _verify,
                          status: 'OK',
                          msg: 'Sent Phone OTP successfully'
                        })
                      }).catch(function (error) {
                        return res.json({
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
                            return res.json({
                              status: 'OK',
                              msg: 'Phone already verify'
                            })
                          }
                        }
                      }

                      UserContactVerifyData.update(userExist.id, verifyData).then(function (_verify) {
                        return res.json({
                          _verify: _verify,
                          status: 'OK',
                          msg: 'Resend Phone OTP successfully'
                        })
                      }).catch(function (error) {
                        return res.json({
                          verifyData: verifyData,
                          status: 'Error',
                          msg: 'Fail to store information,Please try again'
                        })
                      })
                    }
                  }
                }else {
                  return res.json({
                    status: 'Error',
                    msg: 'Fail to send OTP,Please try again'
                  })
                }
              })
            })
        })
      }
    })
    })
  },

  VerifyPhoneOTP: function (req, res) {
    var phone_otp = req.param('otp')
    var user_id = req.user.id
    UserContactVerifyData.findOne({phone_otp: phone_otp,user_id: user_id}).exec(function (err, userExist) {
      if (!userExist) {
        return res.json({
          status: 'Error',
          msg: 'Invalid OTP,Please try another'
        })
      }else {

        UserContactVerifyData.find({phone:userExist.phone,is_phone_verify:1,dial_code:userExist.dial_code}).where({'user_id.id':{'!':user_id},'user_id.company_id': {"$exists" :false}}).exec(function (err, checkEmail) {
          if(typeof req.user.company_id=='undefined' || req.user.company_id==''){
            if(checkEmail.length > 0) {
              return res.json({
                checkEmail: checkEmail,
                status: 'Error',
                msg: 'Phone Number is associated with other account'
              })
            }
          }

        var verifyData = {is_phone_verify: 1,phone_otp:''};
        UserContactVerifyData.update(userExist.id, verifyData).then(function (_verify) {
					UserFcmkey.find({user_id:user_id}).exec(function(err,user_FCM_key){
              UpdateVerifyStatusService.VerifyStatus({
                  user_id:user_id,
                  phone:1,
                  email:0,
							});
							if(user_FCM_key != undefined && user_FCM_key.length > 0){
								for(i=0;i<user_FCM_key.length ;i++){
									FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],_verify,'Phone verification has been successfully',1);
								}
							}
								return res.json({
									_verify: _verify,
									status: 'OK',
									msg: 'Phone verification has been successfully'
								})
							});
            }).catch(function (error) {
              return res.json({
                status: 'Error',
                msg: 'Invalid OTP,Please try another'
              })
            })
        })
      }
    })
  },

  VerifyEmailByLink: function (req, res) {
    var email_otp = req.param('otp');

    var crypto = require('crypto')
    var mykey2 = crypto.createDecipher('aes-128-cbc', 'mypassword')
    var mystr2 = mykey2.update(email_otp, 'hex', 'utf8')
    mystr2 += mykey2.final('utf8')

    var parameters = mystr2.split('_')
    var otp_code = (typeof parameters[0] != 'undefined') ? parameters[0] : ''
    var user_login_id = (typeof parameters[1] != 'undefined') ? parameters[1] : ''

    UserContactVerifyData.findOne({email_otp: otp_code,user_id: user_login_id}).exec(function (err, userExist) {
      if (!userExist) {
        var para = {
          status: 'Error',
          msg: 'Invalid OTP, Please try another1',
          title: 'Email Verification'
        }
        if (!req.isAuthenticated()) {
          para['layout'] = 'layouts/loginLayout'
          para['isLogin'] = 0
        }
        return res.view('verification/verify-message', para)
      } else {
         UserContactVerifyData.find({email: userExist.email, is_email_verify:1}).where({'user_id.id':{'!':user_login_id},'user_id.company_id': {"$exists" :false}}).exec(function (err, checkEmail) {
          if(typeof req.user=='undefined' || typeof req.user.company_id=='undefined' || req.user.company_id==''){
            if (checkEmail.length > 0) {
                return res.json({
                  checkEmail: checkEmail,
                  status: 'Error',
                  msg: 'Email is associated with other account'
                })
			}
		  }

         var verifyData = {is_email_verify: 1,email_otp:''};
          UserContactVerifyData.update(userExist.id, verifyData).then(function (_verify) {
            
            UpdateVerifyStatusService.VerifyStatus({
              user_id:user_login_id,
              phone:'',
              email:1,
            });

            var para = {
              status: 'OK',
              msg: 'Email verification has been successfully',
              title: 'Email Verification'
            }

            if (!req.isAuthenticated()) {
              para['layout'] = 'layouts/loginLayout'
              para['isLogin'] = 0
            }
            return res.view('verification/verify-message', para)
          }).catch(function (error) {
            var para = {
              status: 'Error',
              msg: 'Invalid OTP, Please try another2',
              title: 'Email Verification'
            }
            if (!req.isAuthenticated()) {
              para['layout'] = 'layouts/loginLayout'
              para['isLogin'] = 0
            }
            return res.view('verification/verify-message', para)
          })
         })
      }
    })
  },

VerifyEmailOTP: function (req, res) {
  var user_login_id = req.user.id;
  var email_otp = req.param('email_otp');
  email_otp     = email_otp.trim();
  
  if(email_otp==''){
      return res.json({
        status: 'Error',
        msg: 'Email OTP is require'
      });
  }

  UserContactVerifyData.findOne({email_otp: email_otp,user_id: user_login_id}).exec(function (err, userExist) {
      if (!userExist) {
           return res.json({
            status: 'Error',
            msg: 'Invalid OTP,Please try another',
            title: 'Email Verification'
          });
      }else {

        UserContactVerifyData.find({email: userExist.email,is_email_verify:1}).where({'user_id.id':{'!':user_id},'user_id.company_id': {"$exists" :false}}).exec(function (err, checkEmail) {
          if(typeof req.user.company_id=='undefined' || req.user.company_id==''){
            if (checkEmail.length > 0) {
                return res.json({
                  checkEmail: checkEmail,
                  status: 'Error',
                  msg: 'Email is associated with other account'
                })
              }
            }

          var verifyData = {is_email_verify: 1,email_otp:''};
          UserContactVerifyData.update(userExist.id, verifyData).then(function (_verify) {
						UserFcmkey.find({user_id:user_login_id}).exec(function(err,user_FCM_key){
							if(user_FCM_key != undefined && user_FCM_key.length > 0){
								for(i=0;i<user_FCM_key.length ;i++){
									FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],_verify,'Email verification has been successfully',2);
								}
							}
							UpdateVerifyStatusService.VerifyStatus({
								user_id:user_login_id,
								phone:'',
								email:1,
							});

							return res.json({
								status: 'OK',
								msg: 'Email verification has been successfully',
								title: 'Email Verification'
							});
					});

        }).catch(function (error) {
            return res.json({
              status: 'Error',
              msg: 'Invalid OTP,Please try another',
              title: 'Email Verification'
            });
        })
      })
    }
  });
},

  storeEducationForVerify: function (req, res) {
    VerifyService.storeEducationForVerify(req,req.user.id,'web').then(function(storeEducationForVerifyData){
      return res.json(storeEducationForVerifyData); 
    });
  },

  storeExperienceForVerify: function (req, res) {
    VerifyService.storeExperienceForVerify(req,req.user.id,'web').then(function(ExperienceForVerifyData){
      return res.json(ExperienceForVerifyData);
    });
  },

  getOneVerifyData: function (req, res, next) {
    var verify_id = req.param('id')
		if (!req.user) {
		err = {
				status: 'Error',
				msg: 'No User Login, Please Login first',
				message: 'No User Login, Please Login first',
			};
		return next(err);
		} else {
			UserVerifyData.findOne().where({id: verify_id}).populate('doc_type_id').populate('verify_request_id',{select:['status'],where:{status:1},limit:1}).exec(function (err, verify_data) {
				if (err) { return next(err); } else {
					UserDataService.userListForVerifyRequest(req,req.user.id).then(function(userListForVerifyRequestList){
						var UserConnection = {};
						if(userListForVerifyRequestList.status == 'OK') {
							UserConnection = userListForVerifyRequestList.data
						}
							UserVerifyDataRequest.find({owner_id: req.user.id,verify_id: verify_id}).populate('user_id', {select: ['name']}).exec(function (err, requestData) {
								if (err) {return next(err);} else {
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

											var identity_string = '';

											if(typeof verify_data.tab_type!='undefined' && verify_data.tab_type=="other_docs"){
												var docType=(typeof verify_data.doc_type_id!='undefined' && typeof verify_data.doc_type_id.id!='undefined')?verify_data.doc_type_id.id:'';
												var otherDoc=(typeof verify_data.other_doc_info!='undefined')?verify_data.other_doc_info.trim():'';
												var comment=(typeof verify_data.comment!='undefined' && verify_data.comment!='' && verify_data.comment != null)?verify_data.comment.trim():'';
												var docUrl=(typeof verify_data.doc_url!='undefined' && verify_data.doc_url!='')?verify_data.doc_url.trim():'';

												identity_string = docType+'-'+otherDoc+'-'+comment+'-'+docUrl;
												verify_data.other_doc_string = identity_string;

											}else if(typeof verify_data.tab_type!='undefined' && verify_data.tab_type=="identity"){
												var name_str='';
												var docType 	=(typeof verify_data.doc_type_id!='undefined' && typeof verify_data.doc_type_id.id!='undefined')?verify_data.doc_type_id.id:'';
												var first_name 	=(typeof verify_data.first_name!='undefined')?verify_data.first_name.trim():'';
												var last_name 	=(typeof verify_data.last_name!='undefined')?verify_data.last_name.trim():'';
												var legal_name 	=(typeof verify_data.legal_name!='undefined')?verify_data.legal_name.trim():'';
												var doc_num 	=(typeof verify_data.doc_num!='undefined')?verify_data.doc_num.trim():'';

												var issueCountry=(typeof verify_data.issue_country!='undefined')?verify_data.issue_country.trim():'';
												var issue_place	=(typeof verify_data.issue_place!='undefined')?verify_data.issue_place.trim():'';
												var issue_date	=(typeof verify_data.issue_date!='undefined')?verify_data.issue_date.trim():'';
												var expiry_date	=(typeof verify_data.expiry_date!='undefined')?verify_data.expiry_date.trim():'';
												var dob 		=(typeof verify_data.dob!='undefined' && verify_data.dob != null) ? verify_data.dob.trim() : '';
												var birth_place =(typeof verify_data.birth_place!='undefined' && verify_data.birth_place!='')?verify_data.birth_place.trim():'';
												var address_1 	=(typeof verify_data.address_line_1!='undefined' && verify_data.address_line_1!='')?verify_data.address_line_1.trim():'';
												var address_2 	=(typeof verify_data.address_line_2!='undefined' && verify_data.address_line_2!='')?verify_data.address_line_2.trim():'';
												var city 		=(typeof verify_data.city!='undefined' && verify_data.city!='')?verify_data.city.trim():'';
												var state 		=(typeof verify_data.state!='undefined' && verify_data.state!='')?verify_data.state.trim():'';
												var country 	=(typeof verify_data.country!='undefined' && verify_data.country!='')?verify_data.country.trim():'';
												var doc_country =(typeof verify_data.doc_country!='undefined' && verify_data.doc_country!='')?verify_data.doc_country.trim():'';
												var gender 		=(typeof verify_data.gender!='undefined')?verify_data.gender:'';
												var comment 	=(typeof verify_data.comment!='undefined' && verify_data.comment!='' && verify_data.comment != null)?verify_data.comment.trim():'';
												var docUrl 		=(typeof verify_data.doc_url!='undefined' && verify_data.doc_url!='')?verify_data.doc_url.trim():'';
												var zip 		=(typeof verify_data.zip!='undefined' && verify_data.zip!='')?verify_data.zip.trim():'';

												if(first_name!='' || last_name!=''){
													name_str=first_name+last_name;
												}else{
													name_str=legal_name;
												}

												identity_string = docType+name_str+doc_num+issueCountry+issue_place+issue_date;
												identity_string+= expiry_date+dob+birth_place+address_1+address_2+city+state;
												identity_string+= country+zip+doc_country+gender+comment+docUrl;

												verify_data.identity_string = identity_string;

											}
											
										verify_data.user_name = req.user.name;
										verify_data.connection = UserConnection
										verify_data.request_data = requestData
										return res.json(verify_data)
										})
									})
								})
							}
						})
					})
				}
			})
		}
  },

	StoreUserVerifyDataRequest: function (req, res) {
		VerifyService.StoreUserVerifyDataRequest(req,req.user.id,'web').then(function(searviceData){
      return res.json(searviceData);
    });
	},

	CancelUserVerifyRequest: function (req, res, next) {
		var request_id = req.param('id')
		UserVerifyDataRequest.find({id: request_id}).then(function (_request) {
			if (_request && _request.length > 0) {
				data_UserVerifyDataRequest = _request[0];
				_request[0].destroy().then(function (_request) {
					if(data_UserVerifyDataRequest.owner_id != undefined){
						UserFcmkey.find({user_id:data_UserVerifyDataRequest.owner_id}).exec(function(err,user_FCM_key){
							if(user_FCM_key != undefined && user_FCM_key.length > 0){
								for(i=0;i<user_FCM_key.length ;i++){
									FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],data_UserVerifyDataRequest,'Verify request canceled successfully',4);
								}
							}
							return res.json({ msg: 'Request canceled successfully', status: 'OK' });
						});
					} else {
						return res.json({ msg: 'Request canceled successfully', status: 'OK' });
					}
				}).catch(function (err) {
					return res.json({ msg: 'Something went wrong. Please try again', status: 'Error' })
				})
			} else {
				return res.json({ msg: 'Something went wrong. Please try again', status: 'Error' })
			}
		})
	},

	GetVerifyRequestData: function (req, res, next) {
		var userID = req.user.id
		UserVerifyDataRequest.find().where({user_id: userID}).populate('owner_id', {select: ['name', 'slug']}).populate('verify_id.doc_type_id', {select: ['title']}).exec(function (err, records) {
			UserDataService.UserDetailsForGetVerify(req,req.user.id).then(function (userInfo) {
				return res.view('verification/authenticate', {
					verifyRecs: records,
					status: 'OK',
					moment: moment,
					userData: userInfo,
					title: 'Verify Others Data | Lynked World'
				})
			})
		})
	},

	getOneVerifyRequestData: function (req, res) {
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
						return res.json(records);
					})  
				})
			})
		})
	},

	//check blockchain ethereum code
	/* testBlock: function (req, res, next) {
		verifyRecord = [];
		verifyRecord.type = 'email';
		verifyRecord.ethaddress = '0xaf496aa6d69170121a54f0d1b9d6f879aac6f081';
		verifyRecord.verifier = '0x5861f66dacc6b458f5bff93bf45416eeda7c1c70';
		verifyRecord.hash = require('crypto').createHash('md5').update('david@arusys.com').digest('hex');
		var admin_Ether= '0xaf496aa6d69170121a54f0d1b9d6f879aac6f081';

		var key = verifyRecord.ethaddress + verifyRecord.type;
		var key = key.toString();
		var keyhex = require('crypto').createHash('md5').update(key).digest("hex"); 
	  
		smartContract.enterStructData.sendTransaction(  keyhex, 
					verifyRecord.ethaddress , 
					verifyRecord.verifier, 
					verifyRecord.type, 
					verifyRecord.hash, 
					{  from:admin_Ether, 
					 gas: 3000000, 
					 gasPrice:1000000000 }, 
					function (error, txnno) {
		 if (error) {
		  console.error(error)
		 } else {
			console.log("-->>>>> Send transaction successful " + txnno);
		 } //else error in txnno

		}); //sendTransaction
	}, */

	/* 
	* Submit to Blockchain and save txnno
	*/
	verifyRequestByBlockchain: function (req,res){
		VerifyService.verifyRequestByBlockchain(req,user_id,'web').then(function(service_data){
			return res.json(service_data);
		});
	},

	dataAccessRequest: function(req, res) {
		var self = this;
		self.dataCompleteAccessList(req).then(function(completeListData){
			self.dataAccessList(req).then(function(pendingListData){
				Follow.find({user_id:req.user.id}).exec(function(err,_companies){
					if(err){
						return res.json(err);
					}
					company_ids = [];
					_companies.forEach(function(_company, index){
						company_ids.push(_company.company_id);
					});
					Users.find().where({"company_id" : { id: {"$in" : company_ids }}}).populate("company_id").exec(function(err,_users){
						UserConnectionService.getUserConnection(req.user.id).then(function(user_ids){
							_followCompanies = [];
							if(_users != undefined){
								_users.forEach(function(user, index){
									_followCompanies.push(user.id);
								});
							}
							connection_ids = user_ids.concat(_followCompanies);
							Users.find({id: {'$in': connection_ids},select: ['name']}).populate("company_id").sort("name ASC").exec(function (err, connections){
								UserDataService.UserDetailsForGetVerify(req,req.user.id).then(function(userInfo){
									// return res.json(pendingListData);
								
										return res.view("verification/data-access-request", {
											userData:userInfo,
											moment: moment,
											user_connection:connections,
											pendingAuthorizes: pendingListData,
											completeAuthorizes: completeListData,
											title: 'Data Access Request | Lynked World'
										});
								});
							});
						});
					});
				});
			}).catch(function (error) {
				return res.json(error);		
			});
		}).catch(function (error) {
			return res.json(error);
		});
	},

	dataAccessList:function(req,res){
		return new Promise(function (fulfill, reject){
			var userID = req.user.id;
			var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
			var limit = (typeof req.param("limit") != 'undefined') ? req.param("limit") : 10;
			var startPoint = 0;
			var endPoint = 0;

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
				.paginate({page: page_no, limit: limit})
				.sort("createdAt DESC")
				.exec(function (err,resultData){
					if(err){
						fulfill({status:"Error",message:"Something went wrong. Please try again."});
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
					fulfill({
						status:"OK",
						moment: moment,
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

	dataCompleteAccessList:function(req,res){
		return new Promise(function (fulfill, reject){
			var userID = req.user.id;
			var page_no = (typeof req.param("page") != 'undefined') ? req.param("page") : 1;
			var limit = (typeof req.param("climit") != 'undefined') ? req.param("climit") : 10;
			var startPoint = 0;
			var endPoint = 0;

			var condition = {
				'request_id':{
					owner_id : {
						"$exists" : true,
						"$ne" : "",
						"$in" : [req.user.id]
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
				.sort('createdAt DESC')
				.paginate({page: page_no, limit: limit})
				.exec(function (err,resultData){
					if(err){
						fulfill({
							status:"Error",
							message:"Something went wrong. Please try again."
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

					fulfill({
						status:"OK",
						moment: moment,
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

	StoreDataAccessRequest: function(req,res){
		
		VerifyService.StoreDataAccessRequest(req,req.user.id).then(function(result){
            NotificationService.addNotification({
                from_user_id: result.data.owner_id,
                user_id: result.data.user_id,
                notification_type: "DataAccessRequest",
                notification_text: "Data Access Request from",
                type: 'web'
            });
            return res.json(result);
		});
	},

	resendORcancelrequestdata: function(req,res){
		var type_param = req.param("type");
		VerifyService.resendORcancelrequestdata(req,req.user.id,type_param).then(function(service_responce){
			return res.json(service_responce);
		});
	},

	AuthorizeData: function(req, res) {
		UserDataService.UserDetailsForGetVerify(req,req.user.id).then(function(userInfo){
		    VerifyService.pendingAccessDocumentRequests(req,req.user.id).then(function(authorizeListData) {					
		    	VerifyService.completeDataAccessRequest(req,req.user.id).then(function(completeListData) {
		    		// return res.json(completeListData);
					return res.view("verification/authorize", {
						userData:userInfo,
						moment: moment,
						authorizes: authorizeListData,
						completeAuthorizes: completeListData,
						title: 'Authorize Data Acccess | Lynked World'
					});
				});
	    	});
		});
	},

	getDataTables:function(req,res){
		VerifyService.authorizeListDatatable(req,req.user.id).then(function(authorizeListData){
			return res.json(authorizeListData);
		});
	},

  GetVerifyRequestList: function (req, res) {
    var userID = req.user.id;
	
    var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
    var limit = (typeof req.param("limit") != 'undefined') ? req.param("limit") : 10;
    var startPoint = 0;
    var endPoint = 0;
	
    UserVerifyDataRequest.count({user_id: userID,status:0}).exec(function (err, count) {

      UserVerifyDataRequest.find().where({user_id: userID,status:0,"txnno":""})
        .populate('owner_id', {select: ['name', 'slug']})
        .populate('verify_id.doc_type_id', {select: ['title']})
        .paginate({page: page_no, limit: limit})
        .sort('createdAt DESC')
        .exec(function (err, resultData) {

        if(err){
          return res.json({
            status:"Error",
            message:"Something went wrong. Please try again."
          });
        }


        var numberOfPages = count / limit;
        if(numberOfPages > 1){
          numberOfPages = numberOfPages;
        }else{
          numberOfPages = 1;
        }

        if(page_no > 1){
          startPoint = page_no*limit;
          endPoint = (startPoint + resultData.length) - 1;
          console.log(endPoint);
        }else{
          if(resultData.length > 0){
            startPoint = 1;
            endPoint = (startPoint + resultData.length) - 1;
          }
        }

        return res.json({
          status:"OK",
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
  },
  
  GetCompletedVerifyRequestList: function (req, res) {
    var userID = req.user.id;
	
    var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
    var limit = (typeof req.param("limit") != 'undefined') ? req.param("limit") : 10;
    var startPoint = 0;
    var endPoint = 0;
	
    UserVerifyDataRequest.count({user_id: userID,status:1}).exec(function (err, count) {
      UserVerifyDataRequest.find().where({user_id: userID,txnno:{"$exists" : true, "$ne" : ""},status:1})
        .populate('owner_id', {select: ['name', 'slug']})
        .populate('verify_id.doc_type_id', {select: ['title']})
        .paginate({page: page_no, limit: limit})
        .sort('createdAt DESC')
        .exec(function (err, resultData) {

        if(err){
          return res.json({
            status:"Error",
            message:"Something went wrong. Please try again."
          });
        }

        var numberOfPages = count / limit;
        if(numberOfPages > 1){
          numberOfPages = numberOfPages;
        }else{
          numberOfPages = 1;
        }

        if(page_no > 1){
          startPoint = page_no*limit;
          endPoint = (startPoint + resultData.length) - 1;
          console.log(endPoint);
        }else{
          if(resultData.length > 0){
            startPoint = 1;
            endPoint = (startPoint + resultData.length) - 1;
          }
        }

        return res.json({
          status:"OK",
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
  },

  IgnoreVerifyRequest: function(req,res){		
		VerifyService.IgnoreVerifyRequest(req,req.user.id,'web').then(function(StoreDataAccessRequestData){
			return res.json(StoreDataAccessRequestData);
		});
  },
  
  getVerifiedList:function(req,res){
    var page_no = (typeof req.param("page_no") != 'undefined') ? req.param("page_no") : 1;
    var limit = (typeof req.param("limit") != 'undefined') ? req.param("limit") : 10;
    var startPoint = 0;
    var endPoint = 0;

    //UserVerifyData.count({user_id: req.user.id}).exec(function (err, count) {

    UserVerifyDataRequest.find({owner_id:req.user.id}).exec(function (err, request_data) {
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

    UserVerifyData.find({id: {'$in': verify_data}}).populate('doc_type_id').populate('verify_request_id',{where:{status:1}}).populate('verify_request_id.user_id').sort('createdAt DESC')
       .paginate({page: page_no, limit: limit})
       .exec(function (err, resultData) {
        if (err) {
          return res.json({ 
            status: 'Error', 
            message: "err",
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

        return res.json({
          status:"OK",
          moment: moment,
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
  },

  scantoGetVerified:function(req,res){
    UserDataService.UserDetails(req,req.user.id).then(function (userInfo) {
      return res.view("verification/scan-to-get-verified",{
        userData: userInfo
      });
    });
  },

	authorizeAllowDeny:function(req,res){
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
			
		} else {
			if(req.param("type")=='identification') {
				actionData.contact_email = (typeof req.param("contact_email")!='undefined' && typeof req.param("contact_email")!='') ? "1" : "0";
				actionData.contact_phone = (typeof req.param("contact_phone")!='undefined' && typeof req.param("contact_phone")!='') ? "1" : "0";
				if(typeof req.param("identification")!='undefined' && typeof req.param("identification")!=''){
					actionData.request_id = req.param("authorize_id");
					actionData.action_data = req.param("identification");
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
					actionData.action_data = req.param("educational");
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
					actionData.action_data = req.param("employment");
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
					actionData.action_data = req.param("projects");
					actionData.status = 2;
					actionData.sequence = 4;
					actionData.type = req.param("type");
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
									type: 'web'
							});

						if(typeof req.param("deny") !='undefined'){
							UserFcmkey.find({user_id:dataRow[0].owner_id}).exec(function(err,user_FCM_key){
								if(user_FCM_key != undefined && user_FCM_key.length > 0){
									for(i=0;i<user_FCM_key.length ;i++){
										FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],dataRow[0],'Your data access request has been deny',10);
									}
								}
								return res.json({status:"OK",msg:"Your request has been deny."});
							});
						}else{
							UserFcmkey.find({user_id:dataRow[0].owner_id}).exec(function(err,user_FCM_key){
								if(user_FCM_key != undefined && user_FCM_key.length > 0){
									for(i=0;i<user_FCM_key.length ;i++){
										FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],dataRow[0],'Your data access request has been allowed',11);
									}
								}
								return res.json({status:"OK",msg:"Your request has been successfully allowed."});
							});// return res.redirect("/authorize");
						}
					});
				});
			}else{
				return res.json({status:"Error",msg:"On this request you already have made action"});
			}
		});
	},

	download_document : function(req,res) {
		//var docUrl = '37d7f3dc-948f-4bda-a76e-1ae058af1d8a.png';
		var docUrl = req.param('doc_url')
		//var docID = '5a7dd67ba6bd442c30c53fd3';
		// gets the id either in urlencode, body or url query
		//UserVerifyData.find().where({ id: docID }).exec(function (err, foundfile) {

		UserVerifyData.findOne({doc_url : docUrl}).exec(function (err, userVerifyDatas) {
			console.log(JSON.stringify(err)); 
			console.log(JSON.stringify(userVerifyDatas)); 
			if (err) { return res.serverError(err) }
		
			console.log(sails.config.appUrl + '/uploads/docs/' + userVerifyDatas.tab_type + '/' + userVerifyDatas.user_id + '/' + userVerifyDatas.doc_url);
			res.download(process.cwd() + '/assets/uploads/docs/' + userVerifyDatas.tab_type + '/' + userVerifyDatas.user_id + '/' + userVerifyDatas.doc_url, function (err) {
				if (err) {
					return res.serverError(err)
				} else {
					return res.ok()
				}
			})
		})
	},

  VerifyDocumentCron : function(req,res){
    UserVerifyData.find().exec(function(err, userVerifyDatas){
			if(typeof userVerifyDatas!='undefined' && userVerifyDatas.length>0){
        userVerifyDatas.forEach(function (vdata, index) {
          if(typeof vdata.id!='undefined'){
            if(typeof vdata.doc_url=='undefined') {
              var verifyData = {doc_url: ''};
              UserVerifyData.update(vdata.id, verifyData).then(function (_verify) {
                console.log('===DONE===');
              }).catch(function (error) {
                  console.log('===FAIL===');
                  //return res.json('DATA UPDATED---'); 
              })
            }
          }
        })
        //after update stop script
        return res.json('---UPDATE UNDEFINED DOCUMENT URL SUCCESSFULLY---');
			}
    });
  },

  /* Education_Verify_Cron : function(req,res){
    var user_id = '5a3df5e2fd99f610247e673a';

    //UserEducations.find().where({user_id:user_id}).exec(function(err,edu_data){
    UserEducations.find().exec(function(err,edu_data){

      if(typeof edu_data!='undefined' && edu_data.length>0){
        console.log('======================ffff=================');
        
        edu_data.forEach(function (_education, index) {
          if(typeof _education.user_id!='undefined' && _education.user_id!=''){
            UserVerifyData.findOne().where({edu_id:_education.id}).exec(function (err,edu_exist) {
              if(!edu_exist){
                //education id not exist on verify section
              
                console.log('==============no data exist==============',JSON.stringify(_education.id));
                  Doctype.findOne({title: 'Others', type: 'education'}).exec(function (err, doc_type) {
                    if(err) {
                      return res.json('FAIL....');
                    }
                    var _newVerifyData = {
                      user_id: _education.user_id,
                      doc_type_id: doc_type.id,
                      doc_id: '',
                      edu_id: _education.id,
                      comment: '',
                      tab_type: 'education',
                      doc_hash: ''
                    }
                    UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
                      console.log('Insert education successfully');
                    });
                  });
                }else{
                  console.log('DATA ALREADY EXIST',_education.id);
                }
              });
            }
          })
        return res.json('OLD EDUCATION DETAIL ADDED ON VERIFY TABLE');
      }
    });
  },

  Experience_Verify_Cron: function(req,res){
    var user_id = '5a3df5e2fd99f610247e673a';

    //UserExperiences.find().where({user_id:user_id}).exec(function(err,exp_data){
    UserExperiences.find().exec(function(err,exp_data){
      
      if(typeof exp_data!='undefined' && exp_data.length>0){
        console.log('======================Experiece=================');
        exp_data.forEach(function (_experience, index) {
          if(typeof _experience.user_id!='undefined' && _experience.user_id!=''){
            UserVerifyData.findOne().where({exp_id:_experience.id}).exec(function (err,exp_exist) {
              if(!exp_exist){
                //education id not exist on verify section
              console.log('==============no data exist==============',JSON.stringify(_experience.id));
                  Doctype.findOne({title: 'Others', type: 'experience'}).exec(function (err, doc_type) {
                    if(err) {
                      return res.json('FAIL....');
                    }
                    var _newVerifyData = {
                      user_id: _experience.user_id,
                      doc_type_id: doc_type.id,
                      doc_id: '',
                      exp_id: _experience.id,
                      comment: '',
                      tab_type: 'experience',
                      doc_hash: ''
                    }
                    UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
                      console.log('Insert experience successfully');
                    });
                  });
                }else{
                  console.log('DATA ALREADY EXIST',_experience.id);
                }
              });
            }
          })
        return res.json('OLD EXPERIENCE DETAIL ADDED ON VERIFY TABLE');
      }
    });
  },

  Project_Verify_Cron: function(req,res){
    var user_id = '5a3df5e2fd99f610247e673a';
    
    //UserProjects.find().where({user_id:user_id}).exec(function(err,project_data){
    UserProjects.find().exec(function(err,project_data){
      
      if(typeof project_data!='undefined' && project_data.length>0){
        console.log('===================Project=================');

        project_data.forEach(function (_project, index) {
          if(typeof _project.user_id!='undefined' && _project.user_id!='' &&  _project.user_id!=null){
            
            UserVerifyData.findOne().where({project_id:_project.id}).exec(function (err,project_exist) {
              if(!project_exist){
                //project id not exist on verify section
              console.log('==============no data exist==============',JSON.stringify(_project.id));
                  Doctype.findOne({title: 'Others', type: 'project'}).exec(function (err, doc_type) {
                    if(err) {
                      return res.json('FAIL....');
                    }
                    var _newVerifyData = {
                      user_id: _project.user_id,
                      doc_type_id: doc_type.id,
                      doc_id: '',
                      project_id: _project.id,
                      comment: '',
                      tab_type: 'project',
                      doc_hash: ''
                    }
                    UserVerifyData.create(_newVerifyData).then(function (_verifyData) {
                      console.log('Insert project successfully');
                    });
                  });
                }else{
                  console.log('DATA ALREADY EXIST',_project.id);
                }
              });
            }
          })
        return res.json('OLD PROJECT DETAIL ADDED ON VERIFY TABLE');
      }
    });
  }, */
  
  VerifyHistory : function(req,res){
    UserDataService.UserDetailsForGetVerify(req,req.user.id).then(function (userInfo) {
      return res.view("verification/verification-history",{
        userData: userInfo,
        title:'Verification History | Lynked.World'
      });
    });
  },

  UpdateVerifyRecord: function(req,res){
    var verify_id = req.param('id');
    var identity_info_check=0;
    var identity_dob_check=0;
    var identity_address_check=0;

    console.log('POST=====',JSON.stringify(req.params.all()));
    
    var tab_type = req.param('tab_type');
    UserVerifyData.findOne({id:verify_id}).exec(function (err,dataExist) {
      if(!dataExist){
        return res.json({
          status:"Error",
          msg:"Record not found"
        });
      }

      var _newVerifyData = {
        user_id: req.user.id,
        tab_type: req.param('tab_type'),
        doc_hash: ''
      }
        _newVerifyData.identity_flag  = 0;
        _newVerifyData.dob_flag       = 0;
        _newVerifyData.address_flag   = 0;

        var old_string = (typeof req.param('old_identity_string')!='undefined')?req.param('old_identity_string'):'';
        var new_string = '';

        var upload_file_name	= '';
        	upload_file_name 	= (typeof req.param('upload_file_name') != 'undefined')? req.param('upload_file_name').trim():''; 

        //for checking verification 
        var docType =  	(typeof req.param('doc_type_id') != 'undefined')? req.param('doc_type_id').trim():''; 
        var otherDoc=	(typeof req.param('other_doc_info') != 'undefined')? req.param('other_doc_info').trim():''; 
        var comment = 	(typeof req.param('comment') != 'undefined')? req.param('comment').trim():''; 
        var docUrl  = 	(typeof dataExist.doc_url!='undefined')?dataExist.doc_url:'';
        
        var name_str='';
  		var first_name 	=(typeof req.param('first_name')!='undefined')?req.param('first_name').trim():'';
  		var last_name 	=(typeof req.param('last_name')!='undefined')?req.param('last_name').trim():'';
  		var legal_name 	=(typeof req.param('legal_name')!='undefined')?req.param('legal_name').trim():'';
  		var doc_num 	=(typeof req.param('doc_num')!='undefined')?req.param('doc_num').trim():'';

  		var issueCountry= '';
  			issueCountry=(typeof req.param('issue_country')!='undefined')?req.param('issue_country').trim():'';
  		
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

			if(bcd_dob == 14) {
				} else {
					return res.json({
						status: 'Error',
						msg: 'Date of Birth required'
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

			if(bcd_dob == 14) {
				} else {
					return res.json({
						status: 'Error',
						msg: 'Date of Birth required'
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
  				                	  	
	  	if(first_name!='' || last_name!=''){
	  		name_str=first_name+last_name;
	  	}else{
	  		name_str=legal_name;
	  	}

        if(typeof req.param("identity_del_doc")!='undefined')
        {
          	if(req.param("identity_del_doc") == '1'){
          		docUrl='';
          	}else if(req.param("identity_del_doc") == '0'){
	        	if(upload_file_name!=''){
	        		docUrl =upload_file_name;
	        	}
	        }
    	}

        if(typeof req.param('tab_type')!='undefined' && req.param('tab_type')=="other_docs"){
			new_string = docType+'-'+otherDoc+'-'+comment+'-'+docUrl;
		}else{
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

        if(typeof req.param('tab_type')!='undefined' && req.param('tab_type')=="other_docs")
		{
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
          	identity_info_check=1;

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
	          _newVerifyData.issue_date = moment(req.param('issue_date')).format('DD-MM-YYYY');
	        }
	        if (typeof req.param('expiry_date') !='undefined') {
	          _newVerifyData.expiry_date = moment(req.param('expiry_date')).format('DD-MM-YYYY');
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

          	if(typeof req.param('dob_legal_name')!='undefined' && req.param('dob_legal_name').trim() != '') {
				_newVerifyData.legal_name = '';
				_newVerifyData.legal_name = req.param('dob_legal_name').trim();
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
	          
	        if (typeof req.param('birth_place')!='undefined' && req.param('birth_place').trim() != '') {
	        	_newVerifyData.birth_place = req.param('birth_place').trim();
	        }

          	if (dob=='') {
	            return res.json({
	              status: 'Error',
	              msg: 'Please enter Birthdate'
	            })
          	}

        }

        if (typeof req.param('identity_address_val')!='undefined' && req.param('identity_address_val') != '') {
            _newVerifyData.address_flag = req.param('identity_address_val');
            identity_address_check=1;

             if (typeof req.param('address_line_1')!='undefined' && req.param('address_line_1').trim()!='') {
           		_newVerifyData.address_line_1 = req.param('address_line_1').trim();
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

        //verification Request data has been lost
        if(old_string!=''){
          if(new_string!=old_string){
            //verification Request data has been lost

            var statusArr = [1,2];
            UserVerifyData.find({select:['id']}).where({id:req.param('id')}).then(function (userverifydatas) {
              var userverifydata_ids = [];
              _.each(userverifydatas, function (userverifydata) {
                userverifydata_ids.push(userverifydata.id);
              });
              
              UserVerifyDataRequest.destroy({verify_id:userverifydata_ids,status:{'$in': statusArr}}).exec(function (err){
                if (err) {
                  resolve({
                    status: 'Error',
                    msg:'Identity verify request not delete. Please try again'
                  });
                }
              });
            }); 
          }
        }

   
        //document related script
       	var uploadPath = process.cwd() + "/.tmp/public/uploads/docs/" + tab_type + "/" + req.user.id;
        var real_uploadPath = process.cwd() + "/assets/uploads/docs/" + tab_type + "/" + req.user.id;
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
	            UserVerifyData.update(req.param('id'), _newVerifyData).then(function (_verify) {
		          return res.json({
		            status: 'OK',
		            msg: 'Record update successfully'
		          })
		        }).catch(function (error) {
		          return res.json({
		            status: 'Error',
		            msg: 'Fail to update record'
		          })
		        });
              }
              else{
				var fd = uploadedFiles[0].fd;
				var myarr = fd.split("\\");
				var filename = path.basename(myarr[myarr.length-1]);
				fs.readFile(fd, function (err, data) {
					fs.writeFile(sails.config.appPath + '/assets/uploads/docs/' + tab_type + '/'+ req.user.id + '/' + filename, data, function (err) {
					});
              	});
				  _newVerifyData.doc_url=filename;
		
	       		UserVerifyData.update(req.param('id'), _newVerifyData).then(function (_verify) {
			          return res.json({
			            status: 'OK',
			            msg: 'Record update successfully'
			          })
	        		}).catch(function (error) {
			          return res.json({
			            status: 'Error',
			            msg: 'Fail to update record'
			          })
	        	});
    		}
      	});
    });
  },

  DeleteVerifyRecords : function(req,res){
    var id = req.param("id");
    if(id==''){
      return res.json({
        status: 'Error',
        msg:'Data ID is required'
      });
    }
    UserVerifyData.count({id:id}).exec(function (err,found){
      if(found==0){
        return res.json({
          status: 'Error',
          msg:'Record not exist'
        });
      }
      UserVerifyData.destroy({id:id}).exec(function (err){
        if (err) {
          return res.json({
            status: 'Error',
            msg:'Record not delete. Please try again'
          });
        }
        UserVerifyDataRequest.destroy({verify_id:id}).exec(function (err){
          if (err) {
            return res.json({
              status: 'Error',
              msg:'Record not delete. Please try again'
            });
          }
          return res.json({
            status: 'OK',
            msg:'Record deleted successfully'
          });
        });
      });
    });
  },


  CountryWiseDocument: function(req,res){
  	var country_id = req.param('id');
  	Doctype.count({country:country_id}).exec(function (err, found) {
      	if (err) {
	  	 	return res.json({
	          status: 'Error',
	          msg:'error'
	        });
  	  	}
      	if(found==0){
      		var condition = {where: {type:'identity',country:null,title:{"$ne":'Others'}}};
      	}else{
      		var condition = {'$or':[{country:{"$exists" : false}},{country:country_id}],type:'identity',title:{"$ne":'Others'}};
      	}

	  	Doctype.find().where(condition).sort('country DESC').exec(function (err, country_data) {
	  	  if (err) {
	  	 	return res.json({
	          status: 'Error',
	          msg:'data not found'
	        });
	  	  }
	  	  return res.json(country_data);
	  	});
  	});
  },

	uploadFiles:function(req,res){
		var tab_type = req.param('tab_type');
		var user_id  = req.user.id;

		var uploadPath = process.cwd() + "/.tmp/public/uploads/docs/" + tab_type + "/" + req.user.id;
    var real_uploadPath = process.cwd() + "/assets/uploads/docs/" + tab_type + "/" + req.user.id;

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
			dirname: require('path').resolve(sails.config.appPath, './.tmp/public/uploads/docs/'+tab_type+"/"+user_id)
		},function (err, uploadedFiles) {

			var array = [];
			var insertData = [];
			if(uploadedFiles.length > 0){
				var fd = uploadedFiles[0].fd;
				uploadedFiles.forEach(function(factor, index){
					array.push(factor.fd);
				});

				array.forEach(function(imagepath, index){
					var myarr = imagepath.split("\\");
					var filename = path.basename(myarr[myarr.length-1]);
					fs.readFile(fd, function (err, data) {
						fs.writeFile(sails.config.appPath+'/assets/uploads/docs/'+tab_type+"/"+user_id+"/"+filename, data, function (err) {

						});
					});
					var _newMedia = { image: filename };
					insertData.push(_newMedia);
				});
			}
			return res.json(insertData);
		});
	},

	AuthorizeDataPdf:function(req,res){

		UserDataAccessAction.find({request_id:req.param("id"),status:2})
		.populate("request_id")
		.populate('request_id.owner_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
		.populate('request_id.user_id',{select:['id','name','email','headline','location','cover_image','profile_image']})
		.populate('request_id.user_id.company_id')
		.populate('request_id.user_id.UserVerifyData')
		.populate('request_id.user_id.UserVerifyData.doc_country')
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
				return res.json(err);
			}
			// return res.json(completeListData);
			var pdfFilename = req.param("id")+moment(new Date()).format('DD-MM-YYYY-h-m-s')+".pdf";
			sails.hooks.pdf.make(
				"testPdf",
				{
					completeAuthorizes: completeListData,
					moment: moment,
				},
				{
					orientation: "landscape",
					header:{ height:"30px" },
					footer:{ height:"50px" },
					output: 'assets/pdfs/'+pdfFilename
				},
				function(err, result) {
					// console.log(result);
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

	CompareBlockchainHash : function(req,res){
		var tab_type = req.param('tab_type');
		var data_string={};
		var old_hash='';
		var doc_type='';

		console.log(JSON.stringify(req.params.all()));
		
		if(typeof req.param('old_hash') != 'undefined' && req.param('old_hash') != '') {
			old_hash = req.param('old_hash');
		}
		if(typeof req.param('document_title') != 'undefined' && req.param('document_title') != '') {
			doc_type = req.param('document_title');
		}

		//common fields
		if(tab_type=="project" || tab_type=="experience" || tab_type=="education"){
			if(tab_type=="education"){
				if (typeof req.param('school') != 'undefined' && req.param('school') != '') {
				data_string.school = req.param('school');
			}
			if (typeof req.param('degree') != 'undefined' && req.param('degree') != '') {
				data_string.degree = req.param('degree');
			}
			if (typeof req.param('study_field') != 'undefined' && req.param('study_field') != '') {
				data_string.study_field = req.param('study_field');
			}
			if (typeof req.param('degree_type') != 'undefined' && req.param('degree_type') != '') {
				data_string.degree_type = req.param('degree_type');
			}
			if (typeof req.param('from_year') != 'undefined' && req.param('from_year') != '') {
				data_string.from_year = req.param('from_year');
			}
			if (typeof req.param('to_year') != 'undefined' && req.param('to_year') != '') {
				data_string.to_year = req.param('to_year');
			}
			}else{
				// For project and experience
				if (typeof req.param('title') != 'undefined' && req.param('title') != '') {
				data_string.title = req.param('title');
			}
			if (typeof req.param('position') != 'undefined' && req.param('position') != '') {
				data_string.position = req.param('position');
			}
			if (typeof req.param('project_url') != 'undefined' && req.param('project_url') != '') {
				data_string.project_url = req.param('project_url');
			}
			if (typeof req.param('company') != 'undefined' && req.param('company') != '') {
				data_string.company = req.param('company');
			}
			if (typeof req.param('location') != 'undefined' && req.param('location') != '') {
				data_string.location = req.param('location');
			}
			if (typeof req.param('from_month') != 'undefined' && req.param('from_month') != '') {
				data_string.from_month = req.param('from_month');
			}
			if (typeof req.param('from_year') != 'undefined' && req.param('from_year') != '') {
				data_string.from_year = req.param('from_year');
			}
			if (typeof req.param('to_month') != 'undefined' && req.param('to_month') != '') {
				data_string.to_month = req.param('to_month');
			}
			if (typeof req.param('to_year') != 'undefined' && req.param('to_year') != '') {
				data_string.to_year = req.param('to_year');
			}
		}

			}else if (tab_type=="other_docs"){
				if (typeof req.param('tab_type') != 'undefined' && req.param('tab_type') != '') {
				data_string.tab_type = req.param('tab_type');
			}
				if (doc_type!='') {
				data_string.doc_type = doc_type;
			}
				if (typeof req.param('other_doc_info') != 'undefined' && req.param('other_doc_info') != '') {
				data_string.other_doc_info = req.param('other_doc_info');
			}
			}else if(tab_type=="identity"){

				if(typeof req.param('address_flag')!='undefined' && req.param('address_flag')==1){
					if (typeof req.param('tab_type') != 'undefined' && req.param('tab_type') != '') {
					data_string.tab_type = req.param('tab_type');
				}
				if (typeof req.param('legal_name') != 'undefined' && req.param('legal_name') != '') {
					data_string.legal_name = req.param('legal_name');
				}
				if (typeof req.param('address_line_1') != 'undefined' && req.param('address_line_1') != '') {
				data_string.address_line_1 = req.param('address_line_1');
				}
				if (typeof req.param('address_line_2') != 'undefined' && req.param('address_line_2') != '') {
					data_string.address_line_2 = req.param('address_line_2');
				}
				if (typeof req.param('city') != 'undefined' && req.param('city') != '') {
					data_string.city = req.param('city');
				}
				if (typeof req.param('state') != 'undefined' && req.param('state') != '') {
					data_string.state = req.param('state');
				}
				if (typeof req.param('country') != 'undefined' && req.param('country') != '') {
					data_string.country = req.param('country');
				}
				if (typeof req.param('zip') != 'undefined' && req.param('zip') != '') {
					data_string.zip = req.param('zip');
				}
				}else if(typeof req.param('dob_flag')!='undefined' && req.param('dob_flag')==1){
					if (typeof req.param('tab_type') != 'undefined' && req.param('tab_type') != '') {
					data_string.tab_type = req.param('tab_type');
				}
				if (typeof req.param('legal_name') != 'undefined' && req.param('legal_name') != '') {
					data_string.legal_name = req.param('legal_name');
				}
				if (typeof req.param('dob') != 'undefined' && req.param('dob') != '') {
					data_string.dob = req.param('dob');
				}
				if (typeof req.param('birth_place') != 'undefined' && req.param('birth_place') != '') {
					data_string.birth_place = req.param('birth_place');
				}
				}else{	

					var nameFlag=0;
					if (typeof req.param('tab_type') != 'undefined' && req.param('tab_type') != '') {
					data_string.tab_type = req.param('tab_type');
				}

				if (doc_type!='') {
					data_string.doc_type = doc_type;
				}

					if (typeof req.param('first_name') != 'undefined' && req.param('first_name') != '') {
					data_string.first_name = req.param('first_name');
					nameFlag=1;
				}
				if (typeof req.param('last_name') != 'undefined' && req.param('last_name') != '') {
					data_string.last_name = req.param('last_name');
					nameFlag=1;
				}
				if (typeof req.param('legal_name') != 'undefined' && req.param('legal_name') != '' && nameFlag==0) {
					data_string.legal_name = req.param('legal_name');
				}
				if (typeof req.param('issue_country') != 'undefined' && req.param('issue_country') != '') {
					data_string.issue_country = req.param('issue_country');
				}
				if (typeof req.param('issue_place') != 'undefined' && req.param('issue_place') != '') {
					data_string.issue_place = req.param('issue_place');
				}
				if (typeof req.param('doc_num') != 'undefined' && req.param('doc_num') != '') {
					data_string.doc_num = req.param('doc_num');
				}
				if (typeof req.param('issue_date') != 'undefined' && req.param('issue_date') != '') {
					data_string.issue_date = req.param('issue_date');
				}
				if (typeof req.param('expiry_date') != 'undefined' && req.param('expiry_date') != '') {
					data_string.expiry_date = req.param('expiry_date');
				}
				if (typeof req.param('dob') != 'undefined' && req.param('dob') != '') {
					data_string.dob = req.param('dob');
				}
				if (typeof req.param('gender') != 'undefined' && req.param('gender') != '') {
					data_string.gender = req.param('gender');
				}
			}
			}

		data_string     	= web3.fromAscii(JSON.stringify(data_string));
	var data_hash       = require('crypto').createHash('md5').update(data_string).digest('hex');
	
	if(data_hash==old_hash){
		return res.json({
			status:'OK',
			msg:'Blockchain hash matched successfully',
			hash:data_hash,
		});	
	}else{
		return res.json({
					status: 'Error',
					msg:'Blockchain hash not matched',
					hash:data_hash
			});	
		}
	}
}