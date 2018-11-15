var FCM = require('fcm-node');

var type = {1:"Phone verify confirm",
            2:"Email verify confirm",
            3:'New verification request',
            4:'Verify request canceled successfully',
            5:'Your data verified by',
            6:'New data access request',
            7:'Update data access request',
            8:'Request Data Access record has been canceled',
            9:'Your verify request ignored successfully',
            10:'Your request has been denyed',
            11:'Your request has been successfully allowed',
            12:"is start follow you",
            13:"is accepted your connection request",
            14:"sent you a connection request",
        }
module.exports = {
    sendNotificationMessage: function (to_key,note_data,body,type_flag) {

        var server_key = 'AAAA4M-V8Hk:APA91bFUfccJgfPjcvY5bletQUgqf7b3_7K2aXF9om8KCbOKarSjnhHTAIKaWEzIo79JjgvV3sDUxNwTEvylIptpXKRd83BfMpf_AM35RVhdYlsdq6qrfNWQh5yOaPTP-9JuWyJvOsfO';
        var fcm = new FCM(server_key);
        //to_key = "eOB7ZuIpfPA:APA91bFThkiMWM5zzYXEWyhBSxJivFR3axNltzlgKfYi8vPmwvCLhc9_2HSF7V64_H9bt_xMFe24zg-2Ign95nmDklAOhA1ud7hLtlxRoFi6CTWMlW4TkjEdJN2-2FU_vB3ikBn1yLWG";
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: to_key, 
            collapse_key: 'new_messages',
            
            notification: {
                title: '', 
                body: body,
                "sound" : "default"
            },
            
            data: {  //you can send only notification or only data(or include both)
                notification_data:note_data,
                type_flag : type_flag
            }
        };
        fcm.send(message, function(err, response){
            if (err) {
                console.log(err);
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
        /* UserFcmkey.find({user_id:data_UserVerifyDataRequest.owner_id}).exec(function(err,user_FCM_key){
							if(user_FCM_key != undefined && user_FCM_key.length > 0){
								for(i=0;i<user_FCM_key.length ;i++){
									FcmService.sendNotificationMessage(user_FCM_key[i]['fcm_key'],data_UserVerifyDataRequest,'Verify request canceled successfully',4);
								}
                            }
                         }); */
    }
}