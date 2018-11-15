/**
 * UserExperiences.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		user_id: {
			model: 'users'
		},
		company_id: {
			model: 'companies',
			required: true,
		},
		title: {
			type: 'string',
			required: true,
		},
		location: {
			type: 'string',
			required: true,
		},
		description: {
			type: 'string'
		},
		current_work: {
			type: 'integer',
		},
		display_status: {
			type: 'integer',
		},
		from_month: {
			type: 'string',
			required: true,
		},
		from_year: {
			type: 'string',
			required: true,
		},
		to_year: {
			type: 'string',
		},
		to_month: {
			type: 'string',
		},
		experiencedocs:{
			collection: 'UserVerifyData',
			via: 'exp_id'
		}
	},
};