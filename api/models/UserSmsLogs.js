/**
 * UserSmsLogs.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
  		user_id: {
  			model: 'users'
          },
      message_id:{
        type: 'string',
      },
      message:{
        type: 'string',
      },
      sendto:{
        type: 'string',
      },
      status:{
        type: 'string',
      },
      sms_type:{
        type: 'string',
        defaultsTo:'none'
      },
    }
  };