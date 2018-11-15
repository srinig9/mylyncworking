/**
 * UserSocials.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
  		user_id: {
  			model: 'users'
  		},
      social_id:{
        model: 'socials'
      },
  		link: {
          type: 'string',
            required: true,
  		},
    }
  };