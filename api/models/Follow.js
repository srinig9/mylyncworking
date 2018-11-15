/**
 * Follow.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		company_id:{
			model: 'companies'
		},
		user_id:{
			model: 'users'
		},
		status:{ // 0 for not taken action for is member or not
			type: 'string',
			required: true
		},
		is_member:{  // 0 for not member and 1 for member
			type: 'string',
			required: true
		},
		is_authorized:{  // 0 for not member and 1 for member
			type: 'string',
			required: true
		},
	}
};

