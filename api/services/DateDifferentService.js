// api/services/DateDifferentService.js
var datetime = require('node-datetime');
var moment = require('moment')

module.exports = {
    
      /**
       * Send a customized welcome email to the specified email address.
       *
       * @required {String} emailAddress
       *   The email address of the recipient.
       * @required {String} firstName
       *   The first name of the recipient.
       */
      calculateDateDiff: function (fromdate, todate=null) {
        var old_date  = '';
        var to_flag   = 0;
        var month_days = 01;
        if(fromdate!=""){
          if(todate==''){  
            to_flag     = 1;
            var dateObj = new Date();
            var month   = dateObj.getUTCMonth() + 1; //months from 1-12
            if(month<10){month = '0'+month};

            var year    = dateObj.getUTCFullYear();
            month_days = new Date(year, month, 0).getDate();
            todate     = year+'-'+month+'-'+month_days;
          }else{
            var date_split = todate.split('-');

            month_days = new Date(date_split[0], date_split[1], 0).getDate();
            todate     = todate+'-'+month_days;
          }
          
          var From_date = new Date(fromdate);
          var To_date   = new Date(todate);

          var diff_date =  To_date - From_date;
          var years     = Math.floor(diff_date/31536000000);
          var months    = Math.round((diff_date % 31536000000)/2628000000);
          var days      = Math.floor(((diff_date % 31536000000) % 2628000000)/86400000);
          
          
          var month_calc= (diff_date % 31536000000)/2628000000;
          
         /* console.log('calc==',month_calc);
          console.log('days==',days);

          console.log('From Date=====',From_date,'======to data=======',To_date);
          console.log('months=====',months);
          console.log('years=====',years);*/ 

          
          if(months>11){
            years = years+parseInt(1);
            months=0;
          }

          if(years != 0) {
             years      = Math.abs(years);
              months    = Math.abs(months);
              old_date += years+' Year';

            if(years > 1){
                if(months > 1){
                   months = Math.abs(months);
                   months = months-parseInt(1);
                }
                old_date+='s ';
              } else {
                old_date +=' ';
              }

              if(months != 0) {
                months = Math.abs(months);
                 if(parseInt(months)>0){
                    old_date += '  '+months+' Month';
                    if(months > 1){
                      old_date +='s ';
                    } else {
                      old_date +=' ';
                    }
                  }

              /*  if(months>11){
                  months    = 1;
                  old_date += '  '+months+' Month';
                  
                  if(months > 1){
                    old_date +='s ';
                  } else {
                    old_date +=' ';
                  }
                }else{
                  //months = months-parseInt(1);
                  
                  if(parseInt(months)>0){
                    old_date += '  '+months+' Month';
                    if(months > 1){
                      old_date +='s ';
                    } else {
                      old_date +=' ';
                    }
                  }
                }*/
              }
            } else if(months != 0) {
              months = Math.abs(months);
              if(months>0){
                old_date += months+' Month';
                if(months > 1){
                  old_date +='s ';
                } else {
                  old_date +=' ';
                }
              }
            }
          }
        return old_date;
      },

      /**
      * Send a customized welcome email to the specified email address.
      *
      * @required {String} emailAddress
      *   The email address of the recipient.
      * @required {String} firstName
      *   The first name of the recipient.
      */
     calculateFullDateDiff: function (fromdate, todate=null) {
       var old_date = '0';
       if(fromdate!=""){
         if(todate==''){  
            todate = new Date();
         }
         
         var From_date  = new Date(fromdate);
         var To_date    = new Date(todate);
         var diff_date  =  To_date - From_date;
           
         var years    = Math.floor(diff_date/31536000000);
         var months   = Math.floor((diff_date % 31536000000)/2628000000);
         var days     = Math.floor(((diff_date % 31536000000) % 2628000000)/86400000);
         var hours    = Math.floor((diff_date % 86400000) / 3600000); // hours
         var minutes  = Math.round(((diff_date % 86400000) % 3600000) / 60000); // minutes
           
         if(years != 0) {
           old_date += years+' Year';
           if(years > 1){
             old_date+='s ';
             } else {
               old_date +=' ';
             }
           } else if(months != 0) {
             old_date += months+' Month';
             if(months > 1){
               old_date +='s ';
             } else {
               old_date +=' ';
             }
           } else if(days != 0){
            old_date += days+' Day';
            if(days > 1){
              old_date +='s ';
            } else {
              old_date +=' ';
            }
           } else if(hours != 0){
            old_date += hours+' Hour';
            if(hours > 1){
              old_date +='s ';
            } else {
              old_date +=' ';
            }
           } else if(minutes != 0) {
            old_date += minutes+' Minute';
            if(minutes > 1){
              old_date +='s ';
            } else {
              old_date +=' ';
            }
           } else {
            old_date = ' Now';
           }
       }
       
       return old_date;
     },


      monthList: function (monthNo) {
        var d = new Date();
        var month = new Array();
          month[0] = "January";
          month[1] = "February";
          month[2] = "March";
          month[3] = "April";
          month[4] = "May";
          month[5] = "June";
          month[6] = "July";
          month[7] = "August";
          month[8] = "September";
          month[9] = "October";
          month[10] = "November";
          month[11] = "December";

          return month[monthNo];
      },

      time_ago: function (time_val) {

        var time = Date.parse(time_val) / 1000;
          var units = [
          { name: "s", limit: 60, in_seconds: 1 },
          { name: "m", limit: 3600, in_seconds: 60 },
          { name: "h", limit: 86400, in_seconds: 3600  },
          { name: "d", limit: 604800, in_seconds: 86400 },
          { name: "w", limit: 2629743, in_seconds: 604800  },
          { name: "mo", limit: 31556926, in_seconds: 2629743 },
          { name: "y", limit: null, in_seconds: 31556926 }
        ];

        var diff = (new Date() - new Date(time*1000)) / 1000;
        if (diff < 5) return "now";
        
        var i = 0, unit;
        while (unit = units[i++]) {
          if (diff < unit.limit || !unit.limit){
            var diff =  Math.floor(diff / unit.in_seconds);
            return diff + "" + unit.name + (diff>1 ? "" : "");
          }
        };
      },

      time_ago_full: function (time_val) {

        var dt = datetime.create(time_val);
        var formattedDate = dt.format('Y-m-d H:M:S');
        var time = Date.parse(formattedDate) / 1000;
        
        var units = [
          { name: " second", limit: 60, in_seconds: 1 },
          { name: " minute", limit: 3600, in_seconds: 60 },
          { name: " hour", limit: 86400, in_seconds: 3600  },
          { name: " day", limit: 604800, in_seconds: 86400 },
          { name: " week", limit: 2629743, in_seconds: 604800  },
          { name: " month", limit: 31556926, in_seconds: 2629743 },
          { name: " year", limit: null, in_seconds: 31556926 }
        ];

        var diff = (new Date() - new Date(time*1000)) / 1000;
        if (diff < 5) return "now";
        
        var i = 0, unit;
        while (unit = units[i++]) {
          if (diff < unit.limit || !unit.limit){
            var diff =  Math.floor(diff / unit.in_seconds);
            return diff + "" + unit.name + (diff>1 ? "s" : "");
          }
        };
      },

      getMonth: function (monthNo) {
        var d = new Date();
        var month = new Array();
          month[0] = "Jan";
          month[1] = "Feb";
          month[2] = "Mar";
          month[3] = "Apr";
          month[4] = "May";
          month[5] = "Jun";
          month[6] = "Jul";
          month[7] = "Aug";
          month[8] = "Sep";
          month[9] = "Oct";
          month[10] = "Nov";
          month[11] = "Dec";
         
         return month[parseInt(monthNo)-parseInt(1)];
      },

      getDateFormat: function(createdAt){
        //console.log(createdAt);

        var sd = datetime.create(createdAt);
        var formatted = moment(createdAt).format('DD-MMM-YYYY HH:mm:ss');
        return formatted;
      },

      getOnlyDateFormat: function(createdAt){
        //console.log(createdAt);
        var sd = datetime.create(createdAt);
        var formatted = sd.format('d/m/Y');
        return formatted;
      },

      internationalDateFormat: function(createdAt){
        if(moment(createdAt, "DD/MM/YYYY", true).isValid()){
          array = createdAt.split("/");
          createdAt = array[2]+'-'+array[1]+'-'+array[0];
          formatted = moment(createdAt).format('DD-MMM-YYYY');
        }else if(moment(createdAt, "DD-MM-YYYY", true).isValid()){
          array = createdAt.split("-");
          createdAt = array[2]+'-'+array[1]+'-'+array[0];
          formatted = moment(createdAt).format('DD-MMM-YYYY');
        }else{
          formatted = moment(createdAt).format('DD-MMM-YYYY');
        }

        // if(mode==''){
        //   createdAt = createdAt;
        // }else if(mode==1){ // Convert dd/mm/yyyy to yyyy-mm-dd
        //   array = createdAt.split("/");
        //   createdAt = array[2]+'-'+array[1]+'-'+array[0];
        // }else if(mode==1){ // Convert dd-mm-yyyy to yyyy-mm-dd
        //   array = createdAt.split("-");
        //   createdAt = array[2]+'-'+array[1]+'-'+array[0];
        // }
        // var sd = datetime.create(createdAt);
        // formatted = sd.format('d-n-Y');
        return formatted;
      }
  };