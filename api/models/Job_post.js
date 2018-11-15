/**
 * Job_post.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user_id:{
      model: 'Users',
    },
    title:{
      type: 'string',
    },
    description:{
      type: 'string',
    },
    company_id:{
      model: 'UserExperiences'
    },
    location:{
      type: 'string',
    },
    job_type_id:{
      model: 'Job_type',
    },
    experience_id:{
      model: 'Job_experience',
    },
    status:{
      type: 'string',
    },
    contact_job_poster:{
      type: 'string',
    },
	is_feature_job:{
		type: 'integer',
		defaultsTo:0
	}
  }
};

