/**
 * UserReferralUsed.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
		owner_id: {
			model: 'users'
		},
		module:{
			type: 'string',
			required: true
		},
		action:{
			type: 'string',
			required: true
		},
		object_id:{
			type: 'string'
		},
		type:{
			type: 'string'
		}
    }
};