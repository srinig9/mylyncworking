/**
 * Companies.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		company_name:{
			type: 'string',
			required: true,
		},
		slug:{
			type: 'string',
			unique: true
		},
		year_founded:{
			type: 'string',
		},
		company_size:{
			type: 'string',
		},
		email:{
			type: 'string',
			unique: true
		},
		phone:{
			type: 'string',
			unique: true
		},
		specialties:{
			type: 'text',
		},
		website:{
			type: 'string',
		},
		skype:{
			type: 'string',
		},
		status:{
			type: 'string',
			defaultsTo:"1"
		},
		followers:{
	      collection: 'follow',
	      via: 'company_id'
		},
		// This defines the other half of our association with ideas.  This is the 'many' side.	
		companydata: {
	      collection: 'users',
	      via: 'company_id'
	    },
	    user_id:{
	    	model:'users'
	    },
		// This defines the other half of our association with Feed Comments. This is the 'many' side.	
		applycompany: {
			collection: 'Applyjob',
			via: 'company_id'
		},
	    companyexperience:{
	    	collection: 'UserExperiences',
			via: 'company_id'
	    },
	    teammember:{
	    	collection: 'CompanyTeamMembers',
			via: 'company_id'
	    },
	},
	validationMessages: { //hand for i18n & l10n
		company_name:{
			required: 'Company Name is required',
		},
	}	
};
