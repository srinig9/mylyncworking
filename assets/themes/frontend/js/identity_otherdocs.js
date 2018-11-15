    $(document).ready(function(){
        var startDate2 = new Date('1955-01-01');
        $('.identity_dob_input,.identity_date_pickert').datepicker({
            format: 'dd-M-yyyy',
            autoclose: true,
            startDate: startDate2,
            setDate: startDate2
        });

        $(".identity_del_doc").click(function(){
            if (confirm('Any verification on the deleted record will be lost. Do you want to continue deletion?')) {
                $('.identity_general_block_url').hide();
                $('.identity_general_block_upload').show();
                $('#identity_del_doc').val('1');
            }
        });

        $(".other_del_doc").click(function(){
            if (confirm('Any verification on the deleted record will be lost. Do you want to continue deletion?')) {
                $('form#form_other_docs .identity_general_block_url').hide();
                $('form#form_other_docs .identity_general_block_upload').show();
                $('#other_docs_del_doc').val('1');
            }
        });
    });

    /* Identity Related Function */
    $(document).on("click",".identity_popup",function(){
        var identity_info=0;
        var identity_dob=0;
        var identity_address=0;
        var target_id = 'form#form_identity_info';

        $('.identity_info').hide();
        $('.identity_info2').hide();
        $('.identity_address').hide();
        $('.identity_dob').hide();

        $('#form_identity_info')[0].reset();

        $('form#form_identity_info .myfileuploads').html('');

        $('form#form_identity_info #legal_name').prop('required',false);
        $('form#form_identity_info #dob_legal_name').prop('required',false);

        if(this.id=="identity_info"){
            $('.identity_info').show();
            $('.identity_info2').show();
            $('.identity_address').hide();
            $('.identity_dob').hide();

            
            $('form#form_identity_info #addressline1').prop('required',false);
            $('form#form_identity_info #zipcode').prop('required',false);
            $('form#form_identity_info .address_location').prop('required',false);

            
            $('form#form_identity_info .doc_type_options').val('');
            $('form#form_identity_info .doc_type_options option:first').prop('selected',true);
            $("form#form_identity_info .doc_type_options").val(null).trigger("change");

            $("#identity_info_val").prop('checked',true);
            $("#identity_dob_val").prop('checked',false);
            $("#identity_address_val").prop('checked',false);
            $('form#form_identity_info #dob').prop('required',false);

            $(".identity_modal_title").html('Add Identity');

            $('form#form_identity_info #legal_name').show();
            $('form#form_identity_info #legal_name').prop('required',true);

            $('#dob_legal_name,#birth_country,#birth_place').prop('required',false);

            $('form#form_identity_info #doc_country').prop('required',true);
            $('form#form_identity_info #doc_type_id').prop('required',true);
            $("form#form_identity_info #documentnum").prop('required',true);

            $("form#form_identity_info #documentnum").removeAttr("placeholder");
            $("form#form_identity_info #identity_document_no").html('Document Number'); 
            $("form#form_identity_info #documentnum").attr("placeholder", "Document Number");

            $("form#form_identity_info #issuedate").prop('required',true);
            $("form#form_identity_info #expirydate").prop('required',true);
            $('form#form_identity_info .issuedate_block').show();
            $('form#form_identity_info .expirydate_block').show();

        }
        else if(this.id=="identity_dob"){
            $('.identity_info').hide();
            $('.identity_info2').hide();
            $('.identity_address').hide();
            $('.identity_dob').show();
            
            $("#identity_info_val").prop('checked',false);
            $("#identity_dob_val").prop('checked',true);
            $("#identity_address_val").prop('checked',false);
            $('form#form_identity_info #documentnum').prop('required',false);
            $('form#form_identity_info #identity_dob').prop('required',false);
            $('form#form_identity_info #identity_gender').prop('required',false);
            
            $('form#form_identity_info #dob').prop('required',true);
            $('#dob_legal_name,#birth_country,#birth_place').prop('required',true);

            $(target_id+" .passport_identity_fields").hide();
            $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',false);

            $('form#form_identity_info #doc_country').prop('required',false);
            $('form#form_identity_info #doc_type_id').prop('required',false);

            $('form#form_identity_info #addressline1').prop('required',false);
            $('form#form_identity_info #zipcode').prop('required',false);
            $('form#form_identity_info .address_location').prop('required',false);
            
            $("form#form_identity_info #issuedate").prop('required',false);
            $("form#form_identity_info #expirydate").prop('required',false);

            $(".identity_modal_title").html('Add Date of Birth');
            
            $('form#form_identity_info #legal_name').prop('required',false);
            $('form#form_identity_info #dob_legal_name').prop('required',true);

        }
        else if(this.id=="identity_address"){
            $('.identity_info').hide();
            $('.identity_info2').hide();
            $('.identity_address').show();
            $('.identity_dob').hide();
            
            $('form#form_identity_info #legal_name').prop('required',false);

            $(target_id+" .passport_identity_fields").hide();
            $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',false);

            //$('form#form_identity_info #dob_legal_name').prop('required',false);
            $('form#form_identity_info #doc_country').prop('required',false);
            $('form#form_identity_info #doc_type_id').prop('required',false);
            $('form#form_identity_info #dob').prop('required',false);

            $('#dob_legal_name,#birth_country,#birth_place').prop('required',false);

            $('form#form_identity_info #issuedate').prop('required',false);
            $('form#form_identity_info #expirydate').prop('required',false);

            $('form#form_identity_info #identity_dob').prop('required',false);
            $("form#form_identity_info #identity_gender").prop('required',false);
            $("form#form_identity_info #documentnum").prop('required',false);

            $('form#form_identity_info #addressline1').prop('required',true);
            $('form#form_identity_info #zipcode').prop('required',true);
            $('form#form_identity_info .address_location').prop('required',true);


            $("#identity_info_val").prop('checked',false);
            $("#identity_dob_val").prop('checked',false);
            $("#identity_address_val").prop('checked',true);

            $(".identity_modal_title").html('Add Address');
        }

        /*$("#identity_info_val").prop('checked',false);
        $("#identity_dob_val").prop('checked',false);
        $("#identity_address_val").prop('checked',false);
        */

        $('form#form_identity_info .doc_country_option').val('');
        $("form#form_identity_info .doc_country_option").val(null).trigger("change");


        $("form#form_identity_info .dob_country_option").val(null).trigger("change");
        $('form#form_identity_info .doc_country_option option:first').prop('selected',true);
        $("form#form_identity_info #identity_gender").val('');


        $('form#form_identity_info .dob_country_option').val('');
        $('form#form_identity_info .dob_country_option option:first').prop('selected',true);
        $("form#form_identity_info .dob_country_option").val(null).trigger("change");
        
        $('form#form_identity_info .doc_type_options').val('');
        $('form#form_identity_info .doc_type_options option:first').prop('selected',true);
        $("form#form_identity_info .doc_type_options").val(null).trigger("change");


        $("form#form_identity_info #id").val('');
        $('.passport_info').hide();
        
        $('.identity_address').find('input:text').val('');
        $('.passport_identity_fields').find('input:text').val('');
        $('.identity_dob').find('input:text').val('');
        $('.identity_info').find('input:text').val('');
        $('.identity_info2').find('input:text').val('');
        $('.comment_data').val('');
        $('#documentnum').val('');
        $('.passport_info').find('input:text').val('');
        
        $('#gender option:first').prop('selected',true);

        var login_user='';
        login_user=$("form#form_identity_info #identity_login_user").val();

        $('form#form_identity_info #legal_name').val(login_user);
        $('form#form_identity_info #dob_legal_name').val(login_user);
        
        //$('.doc_type_options option:last').prop('selected',true);

        $('#identity_del_doc').val('0');
        $('.identity_general_block_url').hide();
        $('.identity_general_block_upload').show();

        $('#identity_modal').modal('show');
    });


    function edit_identity_popup(id){
        var verify_id = id;
        var ajax_url='';
        var target_id='';
        $('#form_identity_info')[0].reset();

        $('#identity_modal').modal('show');
        //$(".identity_modal_title").html('Edit Personal Information');
        
        ajax_url = '/one_one_verify_data/'+verify_id;
        target_id ='form#form_identity_info';
        
        $(target_id+" #identity_country").val('');
        $(target_id+" #birth_country").val('');

        fill_identity_form(ajax_url,target_id);
    }


    $(document).on("click","#identity_info_val",function(){

        if($("form#form_identity_info #identity_info_val").prop('checked') == true){
            $('form#form_identity_info .identity_info').show();
        }else{
            $('form#form_identity_info .identity_info').hide();
        }
    });

    $(document).on("click","#identity_dob_val",function(){
        if($("#identity_dob_val").prop('checked') == true){
            $('.identity_dob').show();
        }else{
            $('.identity_dob').hide();
        }
    });

    $(document).on("click","#identity_address_val",function(){
        if($("#identity_address_val").prop('checked') == true){
            $('.identity_address').show();
        }else{
            $('.identity_address').hide();
        }
    });


    function delete_identity(){
        var is_verify_flag  = '';
        var form_id         = 'form#form_identity_info';
        var msg             ='Do you want to continue deletion?';
            is_verify_flag  = $(form_id+" #is_verify_flag").val();

        if(is_verify_flag==1){
            msg = 'Any verification on the deleted record will be lost. Do you want to continue deletion?';
        }

        if (confirm(msg)) {
            // Save it!
            var ajax_url = '/delete-verify-data';
            var id = $('form#form_identity_info').find('#id').val();
            if(id!=''){
                var redirect_var = '';
                if(window.location.pathname == '/get-verified') {
                    redirect_var = 'identification';
                }
             deleteData(ajax_url,id,redirect_var);
            }else{
                $.bootstrapGrowl('ID can not blank', {type: 'danger', delay: 300});
            }
        } else {
            // Do nothing!
        }
    }


    $('.passport_info').hide();
    $('.doc_type_options').change(function(){
        var target_id = 'form#form_identity_info';
        var select_option= $(".doc_type_options option:selected").text();

        //issuedate === issue_date
        //expirydate == expiry_date

       if(select_option=="Passport"){
            $('.passport_info').show();

            //change fields
            $(target_id+" .passport_identity_fields").show();
            $(target_id+" .other_identity_name").hide();
            $(target_id+" #legal_name").prop('required',false);
            $(target_id+" #legal_name").val('');
            $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',true);

            $(target_id+" #documentnum").removeAttr("placeholder");
            $(target_id+" #identity_document_no").html('Passport No'); 
            $(target_id+" #documentnum").attr("placeholder", "Passport Number");
            $(target_id+' #identity_dob').prop('required',false);
            $(target_id+" #identity_gender").prop('required',false);

            $(target_id+' .issuedate_block').show();
            $(target_id+' .expirydate_block').show();
            $(target_id+" #issuedate").prop('required',true);
            $(target_id+" #expirydate").prop('required',true);

       }
        else if(select_option=="Driving License"){

            //change fields
            $(target_id+" #documentnum").removeAttr("placeholder");
            $(target_id+" #identity_document_no").html('License No'); 
            $(target_id+" #documentnum").attr("placeholder", "License Number");
            $(target_id+' #identity_dob').prop('required',true);
            $(target_id+" #identity_gender").prop('required',false);

            $(target_id+" .passport_identity_fields").hide();
            $(target_id+" .other_identity_name").show();
            $(target_id+" #legal_name").prop('required',true);
            $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',false);

            $(target_id+' .issuedate_block').show();
            $(target_id+' .expirydate_block').show();
            $(target_id+" #issuedate").prop('required',true);
            $(target_id+" #expirydate").prop('required',true);

        }else if(select_option=="Aadhar Card"){

             //change fields
            $(target_id+" .passport_identity_fields").hide();
            $(target_id+" .other_identity_name").show();
            $(target_id+" #legal_name").prop('required',true);
            $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',false);

            $(target_id+" #identity_document_no").html('Aadhar Number'); 
            $(target_id+" #documentnum").removeAttr("placeholder");
            $(target_id+" #documentnum").attr("placeholder", "Aadhar Number");
            $(target_id+' #identity_dob').prop('required',true);
            $(target_id+" #identity_gender").prop('required',true);

            $(target_id+' .issuedate_block').hide();
            $(target_id+' .expirydate_block').hide();

            $(target_id+" #issuedate").prop('required',false);
            $(target_id+" #expirydate").prop('required',false);

        }else if(select_option=="ID Card"){
              //change fields
            $(target_id+" .passport_identity_fields").hide();
            $(target_id+" .other_identity_name").show();
            $(target_id+" #legal_name").prop('required',true);
            $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',false);

            $(target_id+" #documentnum").removeAttr("placeholder");
            $(target_id+" #identity_document_no").html('ID Card Number'); 
            $(target_id+" #documentnum").attr("placeholder", "ID Card Number");
            $(target_id+' #identity_dob').prop('required',true);
            $(target_id+" #identity_gender").prop('required',false);

            $(target_id+' .issuedate_block').show();
            $(target_id+' .expirydate_block').show();
            $(target_id+" #issuedate").prop('required',true);
            $(target_id+" #expirydate").prop('required',true);

        }else{
            $('.passport_info').hide();
            $('.passport_info').find('input:text').val('');

            $(target_id+" .passport_identity_fields").hide();
            $(target_id+" .other_identity_name").show();
            $(target_id+" #legal_name").prop('required',true);
            $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',false);

            $(target_id+" #documentnum").removeAttr("placeholder");
            $(target_id+" #identity_document_no").html('Document Number'); 
            $(target_id+" #documentnum").attr("placeholder", "Document Number");

            $(target_id+" #issuedate").prop('required',false);
            $(target_id+" #expirydate").prop('required',false);
            $(target_id+' .issuedate_block').show();
            $(target_id+' .expirydate_block').show();
        }       

    });


    /* OtherDocs Functions */

    function delete_other_docs(){
        var is_verify_flag  = '';
        var form_id         = 'form#form_other_docs';
        var msg             ='Do you want to continue deletion?';
            is_verify_flag  = $(form_id+" #is_verify_flag").val();

        if(is_verify_flag==1){
            msg = 'Any verification on the deleted record will be lost. Do you want to continue deletion?';
        }

        if (confirm(msg)) {
            // Save it!
            var ajax_url = '/delete-verify-data';
            var id = $(form_id).find('#id').val();
            if(id!=''){
                 var redirect_var = '';
                if(window.location.pathname == '/get-verified') {
                    redirect_var = 'other_docs';
                }
                deleteData(ajax_url,id,redirect_var);
            }else{
                $.bootstrapGrowl('ID can not blank', {type: 'danger', delay: 300});
            }
        } else {
            // Do nothing!
        }
    }


    $('#form_other_docs .other_doc_type_option').change(function(){
        var select_option= $(".other_doc_type_option option:selected").text();
       if(select_option=="Others"){
            $("#form_other_docs #other_doc_info").removeAttr("disabled");
            $("#form_other_docs #other_doc_info").prop('required',true);

       }else{
            $("#form_other_docs #other_doc_info").val('');
            $("#form_other_docs #other_doc_info").attr("disabled", true);
            $("#form_other_docs #other_doc_info").prop('required',false);
       }
    });


    $(document).on("click",".other_docs_popup",function(){
        $('#form_other_docs')[0].reset();
        $(".other_docs_modal_title").html('Add Document');

        $("#form_other_docs .old_other_docs_string").val('');
        
        //$('.other_doc_type_option option:last').prop('selected',true);
        $("form#form_other_docs #id").val('');

        $('#other_docs_del_doc').val('0');
        $('form#form_other_docs .identity_general_block_url').hide();
        $('form#form_other_docs .identity_general_block_upload').show();
        $("form#form_other_docs #other_doc_info").removeAttr("disabled");
        $("form#form_other_docs #other_doc_info").prop('required',false);

        $(' form#form_other_docs .myfileuploads').html('');
        
        $('#other_docs_modal').modal('show');
    });

    function edit_otherdocs_popup(id){
        var verify_id = id;
        var ajax_url='';
        var target_id='';
        
        $('#other_docs_modal').modal('show');
        $(".other_docs_modal_title").html('Edit Document');

        ajax_url = '/one_one_verify_data/'+verify_id;
        target_id ='form#form_other_docs';
        
        fill_identity_form(ajax_url,target_id);
    }


    function fill_identity_form(ajax_url,target_id){
        $('form#form_identity_info #dob').prop('required',false);
        $(target_id+" .identity_general_block_upload").show();
        $(target_id+" .identity_general_block_url").hide();
        $(target_id+" #birth_country").val('');
        $(target_id+" #identity_country").val('');
        $(target_id+" #issuecountry").val('');
        $(target_id+" .address_state").val('');
        $(target_id+" #state_location").val('');
        $(".identity_modal_title").html('');
        $(target_id+" #is_verify_flag").val(0);

        $(target_id+' #legal_name').prop('required',false);
        $(target_id+' #dob_legal_name').prop('required',false);

        $('.identity_info').hide();
        $('.identity_info2').hide();
        $('.identity_dob').hide();
        $('.identity_address').hide();
        $(target_id+' #identity_doc_type').val('');
        $(target_id+" .old_other_docs_string").val('');

        var address_string  = '';
        var state_name      = '';
        var city_name       = '';
        var country_name    = '';

        $.getJSON(ajax_url, function (json) {
            $.each(json, function (key, value) {
                $(target_id+' input[name="' + key + '"]').val(value);
                $(target_id+' textarea[name="' + key + '"]').val(value);
                $(target_id+" select[name=" + key + "]").val(value);

                if(key=="issue_country"){
                    if(value!=''){
                        $(target_id+" #birth_country").val(value);
                        $(target_id+" #identity_country").val(value);
                        $(target_id+" #issuecountry").val(value);
                    }
                }

                if(key=="legal_name"){
                    if(value!=''){
                        $(target_id+" #dob_legal_name").val(value);
                        $(target_id+" #legal_name").val(value);
                    }
                }

                if(key=="doc_country"){
                    if(value!=''){
                        $(target_id+" #identity_country").val(value);
                         $(target_id+" .dob_country_option").val(value);
                        
                        $(target_id+" #birth_country").val(value);
                        $(target_id+" select[name=" + key + "]").val(value).trigger("change");
                        $(target_id+" .dob_country_option").val(value).trigger("change");


                    }else{
                        $(target_id+" select[name=" + key + "]").val(null).trigger("change");
                        $(target_id+" .dob_country_option").val(null).trigger("change");
                    }
                }

                if(key=="state"){
                    if(value!=''){
                        state_name=value;
                        $(target_id+" #administrative_area_level_1").val(value);
                        
                         $(target_id+" #state_location").val(value);
                    }
                }

                if(key=="city"){
                    if(value!=''){
                        city_name=value;
                    }
                }

                 if(key=="country"){
                    if(value!=''){
                        country_name=value;
                    }
                }

                if(key=="issue_date"){
                    if(value!=''){
                        var issues_dt='';
                        issues_dt = value.replace('/','-');
                        issues_dt=moment(issues_dt,'DD-MM-YYYY').format('DD-MMM-YYYY');

                         $(target_id+' input[name="' + key + '"]').val(issues_dt);
                    }
                }

                if(key=="expiry_date"){
                    if(value!=''){
                        var expire_dt='';
                        expire_dt = value.replace('/','-');
                        expire_dt=moment(expire_dt,'DD-MM-YYYY').format('DD-MMM-YYYY');

                         $(target_id+' input[name="' + key + '"]').val(expire_dt);
                    }
                }

                if(key=="other_doc_string"){
                    $(target_id+" .old_other_docs_string").val(value);
                }

                if(key=="identity_string"){
                    $(target_id+" .old_identity_string").val(value);
                    
                    address_string = city_name+','+state_name+','+country_name;
                    $(target_id+' .address_location').val(address_string);

                }

                if(key=='identity_flag'){
                    $("#identity_info_val").removeAttr('onclick');
                    if(value==1){
                        $(".identity_modal_title").html('Edit Identity');
                        $(target_id+' #legal_name').prop('required',true);
                        //$(target_id+' #dob_legal_name').prop('required',false);

                        $('#dob_legal_name,#birth_country,#birth_place').prop('required',false);

                        $(target_id+' #dob_date').prop('required',false);
                        $(target_id+' #dob_month').prop('required',false);
                        $(target_id+' #dob_year').prop('required',false);

                        $(target_id+' #doc_country').prop('required',true);
                        $(target_id+' #doc_type_id').prop('required',true);
                        $(target_id+' #dob').prop('required',false);

                        $(target_id+' #addressline1').prop('required',false);
                        $(target_id+' #zipcode').prop('required',false);
                        $(target_id+' .address_location').prop('required',false);

                        $(target_id+" #birth_country").val('');
                        $(target_id+" #identity_country").val('');
                        $(target_id+" .address_state").val('');

                        $('.identity_info').show();
                        $('.identity_info2').show();

                        $("#identity_info_val").prop('checked',true);
                    }else{
                        $('.identity_info').hide();
                        $('.identity_info2').hide();
                        $("#identity_info_val").prop('checked',false);
                        $(target_id+' #doc_country').prop('required',false);
                        $(target_id+' #doc_type_id').prop('required',false);
                    }
                }

                if(key=='dob_flag'){
                    $("#identity_dob_val").removeAttr('onclick');
                    if(value==1){
                        $(".identity_modal_title").html('');
                        $(".identity_modal_title").html('Edit Date of Birth');
                        $(target_id+" .passport_identity_fields").hide();
                        $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',false);

                        $(target_id+' #addressline1').prop('required',false);
                        $(target_id+' #zipcode').prop('required',false);
                        $(target_id+' .address_location').prop('required',false);

                        $(target_id+' #dob_date').prop('required',true);
                        $(target_id+' #dob_month').prop('required',true);
                        $(target_id+' #dob_year').prop('required',true);


                        $(target_id+" #identity_country").val('');
                        $(target_id+" #issuecountry").val('');
                        $(target_id+' #legal_name').prop('required',false);
                        //$(target_id+' #dob_legal_name').prop('required',true);

                        $(target_id+' #doc_country').prop('required',false);
                        $(target_id+' #doc_type_id').prop('required',false);
                        $(target_id+' #dob').prop('required',true);

                        $('#dob_legal_name,#birth_country,#birth_place').prop('required',true);

                        $(target_id+' #documentnum').prop('required',false);
                        $(target_id+' #identity_dob').prop('required',false);
                        $(target_id+' #identity_gender').prop('required',false);

                        $(target_id+' #issuedate').prop('required',false);
                        $(target_id+' #expirydate').prop('required',false);

                        $('.identity_dob').show();
                        $("#identity_dob_val").prop('checked',true);
                        $('form#form_identity_info #dob').prop('required',true);
                    }else{
                        $('form#form_identity_info #dob').prop('required',false);
                        $('.identity_dob').hide();
                        $("#identity_dob_val").prop('checked',false);
                    }
                }

                if(key=='doc_url'){
                    if(value!='') {
                            $(target_id+" #identity_doc_url_link").attr("href", "/download_document/"+value);
                            $(target_id+" #identity_doc_url").html(value);
                            $(target_id+" .identity_general_block_upload").hide();
                            $(target_id+" .identity_general_block_url").show();
                        } else {
                            $(target_id+" #identity_doc_url_link").attr("href", "#");
                            $(target_id+" .identity_general_block_upload").show();
                            $(target_id+" .identity_general_block_url").hide();
                        }
                }
				
                if(key=='dob'){
                    $('form#form_identity_info #dob').prop('required',true);
                    if(value!=''){
                        var myString = '';
                            myString = value;
                        var arr  = myString.split('/');
                        var arr2 = myString.split('-');

                        if(arr.length==3) {
                            $(target_id+' #dob_date').val(arr[0]);
                            $(target_id+' #dob_month').val(arr[1]);
                            $(target_id+' #dob_year').val(arr[2]);
                            //-----------identity date birth
                            $(target_id+' #identity_dob_date').val(arr[0]);
                            $(target_id+' #identity_dob_month').val(arr[1]);
                            $(target_id+' #identity_dob_year').val(arr[2]);
                        } else if(arr2.length==3) {
                            $(target_id+' #dob_date').val(arr2[0]);
                            $(target_id+' #dob_month').val(arr2[1]);
                            $(target_id+' #dob_year').val(arr2[2]);
                            //-----------identity date birth
                            $(target_id+' #identity_dob_date').val(arr2[0]);
                            $(target_id+' #identity_dob_month').val(arr2[1]);
                            $(target_id+' #identity_dob_year').val(arr2[2]);
                        }
                        $('form#form_identity_info #identity_dob').val(value);
                    }
                }

                if(key=='createdAt'){
                    address_string = city_name+','+state_name+','+country_name;
                    $(target_id+' .address_location').val(address_string);
                }

                if(key=='verify_request_id'){
                    if(value.length>0){
                        $(target_id+" #is_verify_flag").val(1);
                    }else{
                        $(target_id+" #is_verify_flag").val(0);
                    }
                }

                if(key=='doc_type_id') {
                    if(typeof value.id!='undefined' && typeof value.title!='undefined'){
                        if(value.id!='') {
                            $(target_id+' .other_doc_type_option').val(value.id);

                            $(target_id+' #identity_doc_type').val(value.id);

                            $(target_id+' .doc_type_options').val(value.id);
                            $(target_id+" select[name=" + key + "]").val(value.id);

                            $(target_id+' .doc_type_options option[value='+value.id+']').attr('selected','selected');

                        } else {
                             $(target_id+' #identity_doc_type').val('');
                        }

                        if(value.title!='' && value.title=="Passport") {
                            $('.passport_info').show();

                            $(target_id+" .passport_identity_fields").show();
                            $(target_id+" .other_identity_name").hide();
                            $(target_id+" #legal_name").prop('required',false);
                            $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',true);

                            $(target_id+" #documentnum").removeAttr("placeholder");
                            $(target_id+" #identity_document_no").html('Passport Number'); 
                            $(target_id+" #documentnum").attr("placeholder", "Passport Number");
                            $(target_id+' #identity_dob').prop('required',false);
                            $(target_id+" #identity_gender").prop('required',false);

                            $(target_id+' .issuedate_block').show();
                            $(target_id+' .expirydate_block').show();
                            $(target_id+" #issuedate").prop('required',true);
                            $(target_id+" #expirydate").prop('required',true);
                        } else if(value.title!='' && value.title=="Driving License") {
                            
							//change fields
                            $(target_id+" .passport_identity_fields").hide();
                            $(target_id+" .other_identity_name").show();
                            $(target_id+" .other_identity_name").removeAttr('style');
                            $(target_id+" #legal_name").prop('required',true);
                            $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',false);


                            $(target_id+" #documentnum").removeAttr("placeholder");
                            $(target_id+" #identity_document_no").html('License Number'); 
                            $(target_id+" #documentnum").attr("placeholder", "License Number");
                            $(target_id+' #identity_dob').prop('required',true);
                            $(target_id+" #identity_gender").prop('required',false);

                            $(target_id+' .issuedate_block').show();
                            $(target_id+' .expirydate_block').show();
                            $(target_id+" #issuedate").prop('required',true);
                            $(target_id+" #expirydate").prop('required',true);

                        }else if(value.title!='' && value.title=="Aadhar Card"){
                             //change fields
                            $(target_id+" .passport_identity_fields").hide();
                            $(target_id+" .other_identity_name").show();
                            $(target_id+" #legal_name").prop('required',true);
                            $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',false);

                            $(target_id+" #identity_document_no").html('Aadhar Number'); 
                            $(target_id+" #documentnum").removeAttr("placeholder");
                            $(target_id+" #documentnum").attr("placeholder", "Aadhar Number");
                            $(target_id+' #identity_dob').prop('required',true);
                            $(target_id+" #identity_gender").prop('required',true);

                            $(target_id+' .issuedate_block').hide();
                            $(target_id+' .expirydate_block').hide();

                            $(target_id+" #issuedate").prop('required',false);
                            $(target_id+" #expirydate").prop('required',false);

                        }else if(value.title!='' && value.title=="ID Card"){
                             //change fields
                            $(target_id+" .passport_identity_fields").hide();
                            $(target_id+" .other_identity_name").show();
                            $(target_id+" #legal_name").prop('required',true);
                            $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',false);

                            $(target_id+" #documentnum").removeAttr("placeholder");
                            $(target_id+" #identity_document_no").html('ID Card Number'); 
                            $(target_id+" #documentnum").attr("placeholder", "ID Card Number");
                            $(target_id+' #identity_dob').prop('required',true);
                            $(target_id+" #identity_gender").prop('required',false);

                            $(target_id+' .issuedate_block').show();
                            $(target_id+' .expirydate_block').show();
                            $(target_id+" #issuedate").prop('required',true);
                            $(target_id+" #expirydate").prop('required',true);

                        } else if(value.title!='' && value.title=="Others") {
							
                            $(target_id+" #other_doc_info").removeAttr("disabled");
                            $(target_id+" #other_doc_info").prop('required',true);
                        } else {
                            $(target_id+" .passport_identity_fields").hide();
                            $(target_id+" .other_identity_name").show();
                            $(target_id+" #legal_name").prop('required',true);
                            $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',false);

                            $('.passport_info').hide();
                            $(target_id+" #other_doc_info").val('');
                            $(target_id+" #other_doc_info").attr("disabled", true);
                             $(target_id+" #other_doc_info").prop('required',false);
                            
                            $(target_id+' .issuedate_block').show();
                            $(target_id+' .expirydate_block').show();

                            $(target_id+" #documentnum").removeAttr("placeholder");
                            $(target_id+" #identity_document_no").html('Document Number'); 
                            $(target_id+" #documentnum").attr("placeholder", "Document Number");
                        }
                    }     
				} else {
					//$(".identity_modal_title").html('Edit Identity');
					//$(target_id+' #legal_name').prop('required',true);
					//$(target_id+' #dob_legal_name').prop('required',false);

					$('#dob_legal_name,#birth_country,#birth_place').prop('required',false);

					//$(target_id+' #doc_country').prop('required',true);
					//$(target_id+' #doc_type_id').prop('required',true);
					$(target_id+' #dob').prop('required',false);

					$(target_id+' #addressline1').prop('required',false);
					$(target_id+' #zipcode').prop('required',false);
					$(target_id+' .address_location').prop('required',false);

					//$(target_id+" #birth_country").val('');
					//$(target_id+" #identity_country").val('');
					//$(target_id+" .address_state").val('');

					/* $('.identity_info').show();
					$('.identity_info2').show(); */

					//$("#identity_info_val").prop('checked',true);
				}

                if(key=='address_flag') {

                    $("#identity_address_val").removeAttr('onclick');
                    if(value==1){
                        $(".identity_modal_title").html('Edit Address');
                        $(target_id+' #addressline1').prop('required',true);
                        $(target_id+' #zipcode').prop('required',true);
                        $(target_id+' .address_location').prop('required',true);

                        $(target_id+" .passport_identity_fields").hide();
                        $("#legal_first_name,#legal_last_name,#passport_identity_country,#passport_identity_issue_place").prop('required',false);

                        $(target_id+" #birth_country").val('');
                        $(target_id+" #issuecountry").val('');
                        $(target_id+" #state_location").val('');

                        $(target_id+' #legal_name').prop('required',false);
                        //$(target_id+' #dob_legal_name').prop('required',false);
                        $(target_id+' #dob').prop('required',false);

                        $('#dob_legal_name,#birth_country,#birth_place').prop('required',false);

                        $(target_id+' #documentnum').prop('required',false);
                        $(target_id+' #identity_dob').prop('required',false);
                        $(target_id+' #identity_gender').prop('required',false);

                        $(target_id+' #issuedate').prop('required',false);
                        $(target_id+' #expirydate').prop('required',false);
                        $(target_id+' #doc_country').prop('required',false);
                        $(target_id+' #doc_type_id').prop('required',false);

                        $(target_id+' #dob_date').prop('required',false);
                        $(target_id+' #dob_month').prop('required',false);
                        $(target_id+' #dob_year').prop('required',false);


                        $('.identity_address').show();
                        $("#identity_address_val").prop('checked',true);
                    }else{
                        $('.identity_address').hide();
                        $("#identity_address_val").prop('checked',false);
                    }
                }
            });
        });
    }


$('.doc_country_option').change(function(){
    var select_option= $(".doc_country_option option:selected").val();
    if(select_option==''){
        select_option=0;
    }

    if(select_option!=0){
    var ajax_url='/country-wise-document/'+select_option;
        $.ajax({
            url: ajax_url,
            method: 'GET',
            success: function(results)
            {
                $("#form_identity_info .doc_type_options").html('');
                var html='';
                html +='<option value="" selected>Select National ID</option>';

                if(typeof results!='undefined' && results.length>0){
                    $.each(results, function (key, data) {
                        html +='<option value="'+data.id+'">'+data.title+'</option>';
                    });

                
                $("#form_identity_info .doc_type_options").html(html);
                var doctype='';

                doctype = $("#form_identity_info #identity_doc_type").val();
                $("#form_identity_info .doc_type_options").val(doctype);
                }
            }
        });
    }
});
    function Getverify_Checkdate(birthdate,issuedate,expirydate,msg){

        var msgYear     = "To year must be greater than from year";
        var msgMonth    = "To month must be greater than from month";

        var now         = new Date();
        var month       = now.getMonth()+1;
        var year        = now.getFullYear();
        var current_date= now.getTime();
        var bdate       = '';
        var issue_date  = '';
        var expiry_date = '';

        if(birthdate!=''){
            bdate = new Date(birthdate).getTime();
            if(parseInt(bdate)>=parseInt(current_date)){
                $.bootstrapGrowl("Birthdate cannot greater than future date", {type: 'danger', delay: 1000,width: 350});
                return false;
            }
        }

        if(issuedate!=''){
            issue_date = new Date(issuedate).getTime();
            if(parseInt(issue_date)>parseInt(current_date)){
                $.bootstrapGrowl("Issue Date cannot greater than future date", {type: 'danger', delay: 1000,width: 350});
                return false;
            }

            if(bdate!=''){
                if(parseInt(bdate)>parseInt(issue_date)){
                    $.bootstrapGrowl("Issue Date cannot less than Birthdate", {type: 'danger', delay: 1000,width: 350});
                    return false;
                }
            }
        }

        if(expirydate!=''){
            expiry_date = new Date(expirydate).getTime();
            if(parseInt(expiry_date)<=parseInt(current_date)){
                $.bootstrapGrowl("Expiry Date cannot less than future date", {type: 'danger', delay: 1000,width: 350});
                return false;
            }

            if(issuedate!=''){
                if(parseInt(expiry_date)<=parseInt(issuedate)){
                    $.bootstrapGrowl("Expiry Date cannot less than Issue date", {type: 'danger', delay: 1000,width: 350});
                    return false;
                }
            }

            if(bdate!=''){
                if(parseInt(bdate)>=parseInt(expiry_date)){
                    $.bootstrapGrowl("Expiry Date cannot less than Birthdate", {type: 'danger', delay: 1000,width: 350});
                    return false;
                }
            }
        }
        return true;
    }


function upload_Identity_Files(target_id,ajax_url){
          ajaxindicatorstart('LOADING');
        var form = $(target_id)[0]; // You need to use standard javascript object here
        var formData = new FormData(form);
        $.ajax({
            type: 'POST',
            url: ajax_url,
            data:  formData,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            success: function (response)
            {
                var Datahtml = "";
                $.each(response, function( index, value ) {
                    Datahtml += "<input type='hidden' name='files' value='"+value.image+"'>";
                });

                $("form"+target_id).find(".myfileuploads").html(Datahtml);
                ajaxindicatorstop();
            }
        });
    }