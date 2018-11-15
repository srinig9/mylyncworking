/**
 * GroupUsers.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		is_owner:{
			type:'integer'
		},
		is_admin:{
			type:'integer'
		},
		group_id:{
			model:'groups'
		},
		user_id: {
			model: 'users'
		},
	}
};

