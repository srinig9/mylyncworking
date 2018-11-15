
/**
 * UserDataAccessRequest.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
		owner_id: {
			model: 'users'
		},
		user_id: {
			model: 'users'
		},
		comment: {
			type: 'string'
		},
		identification: {
			type: 'integer',
			defaultsTo:0
		},
		educational: {
			type: 'integer',
			defaultsTo:0
		},
		employment: {
			type: 'integer',
			defaultsTo:0
		},
		projects: {
			type: 'integer',
			defaultsTo:0
		},
		status: {
			type: 'integer',
			defaultsTo:0
		},
		contact_email: {
			type: 'integer',
			defaultsTo:0
		},
		contact_phone: {
			type: 'integer',
			defaultsTo:0
		},
		requestActions: {
			collection: 'userdataaccessaction',
			via: 'request_id'
		},
    }
};