/**
 * UserProjects.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		user_id: {
			model: 'users'
		},
		title: {
			type: 'string',
			required: true,
		},
		project_url: {
			type: 'string',
			defaultsTo:'',
		},
		company_id: {
			model: 'companies',
		},
		description: {
			type: 'string',
			defaultsTo:'',
		},
		location: {
			type: 'string',
			defaultsTo:'',
		},
		from_month: {
			type: 'string',
		},
		from_year: {
			type: 'string',
		},
		to_year: {
			type: 'string',
		},
		to_month: {
			type: 'string',
		},
		projectdocs:{
			collection: 'UserVerifyData',
			via: 'project_id'
		}
	}
};