    $(document).on("click", "#verify_email_btn", function (event) {
        event.preventDefault();
        verify_email_by_otp();
    });


    $(document).on("click", "#verify_email_reset", function (event) {
        event.preventDefault();

        if($('#verify_email_flag').val()==1){
         var r = confirm("Any verification on the change record will be lost. Do you want to continue?");
            if (r == true) {
               verify_email_by_otp();
            } else {}
        }else{
           verify_email_by_otp(); 
        }
    });
	
    $(document).on("click", "#verify_phone_btn", function (event) {
        event.preventDefault();
        send_verify_phone_code();
    });
    
    $(document).on("click", "#verify_phone_reset", function (event) {
        event.preventDefault();
        if($('#verify_phone_flag').val()==1){
            var r = confirm("Any verification on the change record will be lost. Do you want to continue?");
            if (r == true) {
                send_verify_phone_code();
            } else {
               
            }
        }else{
            send_verify_phone_code();
        }
    });


$('#form_email_otp .email_otp_quick').hide();
$('#form_email_otp .email_otp_load').show();
$('#form_email_otp .origin_email_msg1').show();
$('#form_email_otp .origin_email_msg2').hide();


$('#form_phone_otp .origin_phone_msg2').hide();
$('#form_phone_otp .phone_otp_quick').hide();
$('#form_phone_otp .origin_phone_msg1').show();
$('#form_phone_otp .origin_phone_msg2').hide();

function verify_email_by_otp(){
     var email_id = $("#verify_email").val();
        email_id = email_id.trim();
        
        if(!isEmailValid(email_id)){
            $('#verify_email').focus();
            $.bootstrapGrowl('Please enter valid email address', {type: 'danger', delay: 1000,align: 'center'});
            return false;
        }
        
        $('#form_email_otp .origin_email_msg2').hide();
        $('#form_email_otp .email_otp_quick').hide();

        if(email_id!=''){
            var formData = {email:email_id};
            $.ajax({
                url: '/send_email_verify_code',
                method: 'POST',
                data:  formData,
                success: function(json_obj)
                {
                    if(json_obj.status=='OK'){
                        $.bootstrapGrowl(json_obj.msg, {type: 'success', delay: 800});
                    
                        $('#form_email_otp .email_otp_quick').show();
                        $('#form_email_otp .email_otp_load').hide();

                        $('#form_email_otp .origin_email_msg1').hide();
                        $('#form_email_otp .origin_email_msg2').show();

                        $('#form_email_otp .email_id').html('');
                        $('#form_email_otp .email_id').html(email_id);

                        $('#verify_email_flag').val(0);

                        setTimeout(function() { $('#email_otpModal').modal('show'); }, 1000);

                    }
                    else{
                       $.bootstrapGrowl(json_obj.msg, {type: 'danger', delay: 1000});
                       //setTimeout(function() { location.reload(); }, 1000);
                    }
                }
            });
        }else{
             $.bootstrapGrowl('Email is require', {type: 'danger', delay: 1000});
        }
    }

    function send_verify_phone_code()
    {
        var phone_no = $("#verify_phone").val();
        phone_no = phone_no.trim();

        var dial_code= $('#dial_code').val();
            dial_code = dial_code.trim();
        
        $('#form_phone_otp .origin_phone_msg2').hide();
        $('#form_phone_otp .phone_otp_quick').hide();

        if(phone_no!='' && dial_code!=''){
            var formData = {phone:phone_no,dial_code:dial_code};
            $.ajax({
                url: '/send_phone_verify_code',
                method: 'POST',
                data:  formData,
                success: function(json_obj)
                {
                    if(json_obj.status=='OK'){
                        $.bootstrapGrowl(json_obj.msg, {type: 'success', delay: 1000});
                        
                        $('#form_phone_otp .phone_otp_quick').show();
                        $('#form_phone_otp .phone_otp_load').hide();

                        $('#form_phone_otp .origin_phone_msg1').hide();
                        $('#form_phone_otp .origin_phone_msg2').show();

                        $('#form_phone_otp .dial').html('');
                        $('#form_phone_otp .phone_no').html('');

                        $('#form_phone_otp .dial').html(dial_code);
                        $('#form_phone_otp .phone_no').html(phone_no);

                        $('#verify_phone_flag').val(0);

                        setTimeout(function() {  $('#otpModal').modal('show');}, 1500);
                    }
                    else{
                       $.bootstrapGrowl(json_obj.msg, {type: 'danger', delay: 1000});
                       
                    }
                }
            });
        }else{
            var msg='';
            if(phone_no=='' && dial_code==''){
               msg = 'Phone no and Dial code both are required'; 
            }else{
                if(phone_no==''){
                    msg = 'Phone no is required';
                  }
                  if(dial_code=='')
                  {
                    msg = 'Dial code is required';
                  }
              }
             $.bootstrapGrowl(msg,{type: 'danger', delay: 1000});
        }
    }


    $(document).on("click", ".send_phone_otp", function (event) {
        event.preventDefault();
        var phone_no    = $("#phone_otp").val();
        phone_no        = phone_no.trim();
        if(phone_no!=''){
            var formData = {otp:phone_no};
            $.ajax({
                url: '/verify_phone_otp',
                method: 'POST',
                data:  formData,
                success: function(json_obj)
                {
                    if(json_obj.status=='OK'){
                        $.bootstrapGrowl(json_obj.msg, {type: 'success', delay: 1000});
                        setTimeout(function() { location.reload(); }, 1000);
                    }
                    else{
                       $.bootstrapGrowl(json_obj.msg, {type: 'danger', delay: 1000});
                       //setTimeout(function() { location.reload(); }, 1000);
                    }
                }
            });
        }else{
             $.bootstrapGrowl('OTP is require', {type: 'danger', delay: 1000});
        }
    });

     $(document).on("click", ".verify_email_otp", function (event) {
        event.preventDefault();
        var email_otp   = $("#email_otp").val();
        email_otp       = email_otp.trim();

        if(email_otp!=''){
            var formData = {email_otp:email_otp};
            $.ajax({
                url: '/verify-email',
                method: 'POST',
                data:  formData,
                success: function(json_obj)
                {
                    if(json_obj.status=='OK'){
                        $.bootstrapGrowl(json_obj.msg, {type: 'success', delay: 1000});
                        setTimeout(function() { location.reload(); }, 1000);
                    }
                    else{
                       $.bootstrapGrowl(json_obj.msg, {type: 'danger', delay: 1000});
                       //setTimeout(function() { location.reload(); }, 1000);
                    }
                }
            });
        }else{
             $.bootstrapGrowl('OTP is require', {type: 'danger', delay: 1000});
        }
    });

    function isEmailValid(email) {
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(email);
	}


/* Verify related last changes */

   $('.show_verify_button').hide();
   $('.show_verify_phone_button').hide();

   if($('#verify_email_flag').val()==1){
       var email_data =  $(".email_verify_field").val();
        $(".email_verify_field").keyup(function(){
            if(email_data!=$('.email_verify_field').val()){
                $(".email_verify_check").hide();
                $('.show_verify_button').show();
            }else{
                $(".email_verify_check").show();
                $('.show_verify_button').hide();
            }
        });
    }else{
        $(".email_verify_check").hide();
        $('.show_verify_button').show();
    }
    
    if($('#verify_phone_flag').val()==1){
        var phone_data = $('.phone_verify_field').val();
        $('.phone_verify_field').keyup(function(){
            if(phone_data!=$('.phone_verify_field').val()){
                $(".phone_verify_check").hide();
                $('.show_verify_phone_button').show();
            }else{
                $(".phone_verify_check").show();
                $('.show_verify_phone_button').hide();
            }
        });
    }else{
        $(".phone_verify_check").hide();
        $('.show_verify_phone_button').show();
    }