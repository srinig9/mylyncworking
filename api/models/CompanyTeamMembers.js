/**
 * CompanyTeamMembers.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
		company_id: {
			 model: 'companies',
		},
		user_id:{
			model: 'users',
		},
		allow_verify:{
			type: 'integer',
			defaultsTo:0
		},
		allow_job_post:{
			type: 'integer',
			defaultsTo:0
		},
		user_admin:{
			type: 'integer',
			defaultsTo:0
		},
		super_user:{
			type: 'integer',
			defaultsTo:0
		},
		download:{
			type: 'integer',
			defaultsTo:0
		},
		is_mainuser:{
			type: 'integer',
			defaultsTo:0
		},
		display_status:{
			type: 'integer',
			defaultsTo:0
		},
		status:{
			type: 'integer',
			defaultsTo:0
		}
    }
};