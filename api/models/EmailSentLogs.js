/**
 * EmailSentLogs.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
  		user_id: {
  			model: 'users'
          },
        to_email:{
            type: 'string',
            defaultsTo:'none'
        },
        message:{
            type: 'string',
        },
        status:{
            type: 'string',
            defaultsTo:'0'
        },
        email_type:{
            type: 'string',
            defaultsTo:'none'
      },
    }
  };