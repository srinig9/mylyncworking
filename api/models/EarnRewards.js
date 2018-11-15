/**
 * EarnRewards.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 * data options :: type: { referral, account_create }
 */

module.exports = {
	attributes: {
		used_referral_id: {
			model: 'userreferralused'
		},
		user_id: {
			model: 'users'
		},
		amount: {
			type:"string"
		},
		type: {
			type:"string"
		}
	}
};

