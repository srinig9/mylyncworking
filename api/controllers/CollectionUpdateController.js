/**
 * Collection Update
 *
 * @description :: Server-side logic for managing companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	notification_collection: function(req,res){
        Notifications.find({"notification_text":{like : '% ignore %'}}).exec(function(err,data){
            if(data != undefined && data.length > 0){
                updated_data = {notification_text:''};
                for(i=0;i<data.length;i++) {
                    updated_data['notification_text'] = data[i]['notification_text'].replace(" ignore ", " ignored ");;
                    Notifications.update({'id':data[i]['id']},updated_data).exec(function(err,data){

                    });
                }
            }
        });
    }
}