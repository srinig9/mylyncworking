/**
 * UserEducations.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
		user_id: {
			model: 'users'
		},
		school: {
			type: 'string',
			required: true,
		},
		degree: {
			type: 'string',  
		},
		study_field: {
			type: 'string',  
		},
		grade: {
			type: 'string',
		},
		degree_type: {
			model: 'degreetype'
		},
		description: {
			type: 'string',
		},
		display_status: {
			type: 'integer',
		},
		from_year: {
			type: 'string',
		},
		to_year: {
			type: 'string',
		},
		educationdocs:{
			collection: 'UserVerifyData',
			via: 'edu_id'
		}
    },
    validationMessages: {
		school: {
			required: 'School is required'
		},
	}
};