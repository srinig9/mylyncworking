// api/services/twilioSms.js
var twilio = require('twilio');
var Promise = require('promise');
module.exports = {
	_config: {
		model: []
    },
	
    sendSMS : function(country_code, phone_no, message){
		return new Promise(function (resolve, reject) {
			var client = new twilio('ACdbdf6f2ac2b095de421ec27a070ae3f9', 'a071dc27bfce9a550b000e3ee298b36b');
			var from_num = '+3197004498941';
			if(country_code == '+1') {
				from_num = '+15203326734';
			}
		    client.messages.create({
                to: phone_no,
                from: from_num,
                body: message
            }, function(error, message) {
                console.log(twilioSms);
                if (!error) {
                    resolve({'status' : message.sid, 'error' : '', 'data' : message});
                } else {
                    resolve({'status' : false, 'error' : error.message});
                }
            });
        });
    }
}