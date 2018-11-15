/**
 * Skills.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		skill_id: {
			collection: 'Job_skills',
			via: 'skill_id'
		},
		title: {
			type: 'text',
			required: true,
		},
	}
};

