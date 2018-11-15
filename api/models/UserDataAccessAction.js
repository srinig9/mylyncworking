/**
 * UserDataAccessAction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		request_id:{
			model:'UserDataAccessRequest'
		},
		type:{
			type: 'string'
		},
		status: {
			type: 'integer',
			defaultsTo:0
		},
		sequence: {
			type: 'integer',
			defaultsTo:0
		},
	}
};

