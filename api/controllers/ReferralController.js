/**
 * ReferralController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var path = require("path");

module.exports = {
    
    getReferral:function (req, res) {
		var referral_code = '';
		if(typeof req.param('code')!='undefined' && req.param('code')!=''){
			referral_code = req.param('code');
		}
		//console.log("Inside referral");
        UserReferralUsed.findOne({user_id: req.user.id}).exec(function(err, user) {
			if(typeof user == 'undefined' || typeof user.id == 'undefined'){
				return res.view("user/referral-code", {
					title: 'Referral | Lynked.World',
					ref_code:referral_code
				});
			} else {
				res.redirect('/');
			}
		});
    },
	
	useReferral: function (req, res) {
		UserDataService.useReferral(req,req.user.id).then(function(ServiceData){
			return res.json(ServiceData);
		});
    },
	
    getUsedReferral:function (req, res) {
		var user_id = req.user.id;
		var self = this;
		UserReferralUsed.find({select:['user_id'], where:{referral_user_id:user_id}}).populate('user_id').sort('createdAt DESC').paginate({page:1, limit: 5}).exec(function(err, count_first_tier) {
			self.my_referral(req,res).then(function(_usedUsers_tier1){
				if (!_usedUsers_tier1){ /* //reject(err); */ } else {
					usedUsers_tier1_ids = [];
					_usedUsers_tier1.forEach(function(tier1, index){
						usedUsers_tier1_ids.push(tier1.user_id.id);
					});
					UserReferralUsed.find({referral_user_id: usedUsers_tier1_ids}).populate('user_id').sort('createdAt DESC').paginate({page:1, limit: 3}).exec(function(err, _usedUsers_tier2) {
						if (err){ /* //reject(err); */ } else {
							usedUsers_tier2_ids = [];
							_usedUsers_tier2.forEach(function(tier2, index){
								usedUsers_tier2_ids.push(tier2.user_id.id);
							});
							UserReferralUsed.find({referral_user_id: usedUsers_tier2_ids}).populate('user_id').sort('createdAt DESC').paginate({page:1, limit: 3}).exec(function(err, _usedUsers_tier3) {
								if (err){ /* //reject(err); */ } else {
									UserConnectionService.getUserConnection(req.user.id).then(function(connections){
										if (err){ /* //reject(err); */ } else {
											UserReferralUsed.findOne({user_id: req.user.id}).exec(function(err, referralUsed) {
												if (err){ /* //reject(err); */ } else {
													
													if(typeof referralUsed == 'undefined' || typeof referralUsed.id == 'undefined'){ referralUsed_flag = true;
													} else { referralUsed_flag = false; }
													
													return res.view("connection/referral-used", {
														title: 'Referral used by connections | Lynked.World',
														connections_tier1: count_first_tier,
														tier1_count: _usedUsers_tier1.length,
														connections_tier2: _usedUsers_tier2,
														tier2_count: _usedUsers_tier2.length,
														connections_tier3: _usedUsers_tier3,
														tier3_count: _usedUsers_tier3.length,
														total_connection: connections.length,
														referralUsed_flag: referralUsed_flag
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		});
    },
	
	my_referral:function(req,res){
		var user_id = req.user.id;
		return new Promise(function (fulfill, reject){
			UserReferralUsed.find({select:['user_id'], where:{referral_user_id:user_id}}).populate('user_id').sort('createdAt DESC').exec(function(err, count_first_tier) {
				if(err){
					fulfill(false);
				}else{
					fulfill(count_first_tier);
				}
			});
		});
	},

	load_more_referral: function(req,res){
		var user_id = req.user.id;
		var page = 1;
		if(req.param("page_no") != undefined){
			page = req.param("page_no");
		}
		
		UserReferralUsed.find({select:['user_id'], where:{referral_user_id:user_id}}).populate('user_id').sort('createdAt DESC').paginate({page:page, limit: 1}).exec(function(err, count_first_tier) {
			if(count_first_tier.length == 0){
				return res.json({connections_tier1:false});
			}
			return res.render('connection/ajax/referral-load-more',{
				connections_tier1:count_first_tier
			});
		});
	},
	
	load_more_referral_second: function(req,res){
		var user_id = req.user.id;
		var page = 1;
		if(req.param("page_no") != undefined){
			page = req.param("page_no");
		}
		
		var self = this;
		self.my_referral(req,res).then(function(_usedUsers_tier1){
			if (!_usedUsers_tier1){
				return res.json({connections_tier2:false});
			}else {
				usedUsers_tier1_ids = [];
				_usedUsers_tier1.forEach(function(tier1, index){
					usedUsers_tier1_ids.push(tier1.user_id.id);
				});
				
				UserReferralUsed.find({referral_user_id: usedUsers_tier1_ids}).populate('user_id').sort('createdAt DESC').paginate({page:page, limit: 1}).exec(function(err, _usedUsers_tier2) {	
					if(_usedUsers_tier2.length == 0){
						return res.json({connections_tier2:false});
					}
					return res.render('connection/ajax/referral-second-tier-load-more',{
						connections_tier2:_usedUsers_tier2
					});
				});
			}
		});
	},
	
	load_more_referral_third: function(req,res){
		var user_id = req.user.id;
		var page = 1;
		if(req.param("page_no") != undefined){
			page = req.param("page_no");
		}
		var self = this;
		self.my_referral(req,res).then(function(_usedUsers_tier1){
			if (!_usedUsers_tier1){
				return res.json({connections_tier3:false});
			}else {
				usedUsers_tier1_ids = [];
				_usedUsers_tier1.forEach(function(tier1, index){
					usedUsers_tier1_ids.push(tier1.user_id.id);
				});
				UserReferralUsed.find({referral_user_id: usedUsers_tier1_ids}).populate('user_id').sort('createdAt DESC').paginate({page:page, limit: 1}).exec(function(err, _usedUsers_tier2) {	
					if (err){ 
							return res.json({connections_tier3:false}); 
						} else {
							usedUsers_tier2_ids = [];
							_usedUsers_tier2.forEach(function(tier2, index){
								usedUsers_tier2_ids.push(tier2.user_id.id);
							});
						
						UserReferralUsed.find({referral_user_id: usedUsers_tier2_ids}).populate('user_id').sort('createdAt DESC').exec(function(err, _usedUsers_tier3) {
							if (err){ 
								 return res.json({connections_tier3:false});
							} else {
								if(_usedUsers_tier3.length == 0){
									return res.json({connections_tier3:false});
								}
								return res.render('connection/ajax/referral-third-tier-load-more',{
									connections_tier3:_usedUsers_tier3
								});
							}
						});
					}
				});
			}
		});
	},
};

