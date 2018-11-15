/*CODE BY BHAVESH
* 31-01-2018
*/

    $(document).ready(function() {
        $('.ex_company_name').select2({
            minimumInputLength: 1,
             tags: true,
             dropdownParent: $("#edit_experience"),
            placeholder: "Enter Company Name",
             createSearchChoice:function(term, data) {
                if ($(data).filter(function() { 
                    return this.text.localeCompare(term)===0; 
                }).length===0) 
                {return {id:term, text:term};} 
            },
        });

        $('.pr_company_name').select2({
            minimumInputLength: 1,
            tags: true,
            dropdownParent: $("#edit_project"),
            placeholder: "Enter Company or Organization",
            allocreateSearchChoice:function(term, data) {
                if ($(data).filter(function() { 
                    return this.text.localeCompare(term)===0; 
                }).length===0) 
                {return {id:term, text:term};} 
            },
        });
		
		$(".del_doc").click(function(){
			if (confirm('Do you want to continue document deletion? Document only delete after save data.')) {
				var form = $(this).closest('form')[0];
				var form_id = $(form).attr("id");
				$('#' + form_id + ' .general_block_url').hide();
				$('#' + form_id + ' .general_block_upload').show();
				$('#' + form_id + ' #del_doc').val('1');
			}
		});
    });

    $(function () {
        // Education Check Dates
        $(".edu_from_year").datepicker({
            minViewMode: 2,
            endDate: '+0d',
            format: 'yyyy',
            autoclose: true,
        }).on('changeDate', function (selected) {
            var startDate = new Date(selected.date.valueOf());
            $('.edu_to_year').datepicker('setStartDate', startDate);
        }).on('clearDate', function (selected) {
            $('.edu_to_year').datepicker('setStartDate', null);
        });

        $(".edu_to_year").datepicker({
            minViewMode: 2,
            endDate: '+0d',
            format: 'yyyy',
            autoclose: true,
        }).on('changeDate', function (selected) {
            var endDate = new Date(selected.date.valueOf());
            $('.edu_from_year').datepicker('setEndDate', endDate);
        }).on('clearDate', function (selected) {
            $('.edu_from_year').datepicker('setEndDate', null);
        });
        // End

        // Experience Check Dates
        $("#ex_from_year").datepicker({
            minViewMode: 2,
            endDate: '+0d',
            format: 'yyyy',
            autoclose: true,
        }).on('changeDate', function (selected) {
            var startDate = new Date(selected.date.valueOf());
            $('#ex_to_year').datepicker('setStartDate', startDate);
        }).on('clearDate', function (selected) {
            $('#ex_to_year').datepicker('setStartDate', null);
        });

        $("#ex_to_year").datepicker({
            minViewMode: 2,
            endDate: '+0d',
            format: 'yyyy',
            autoclose: true,
        }).on('changeDate', function (selected) {
            var endDate = new Date(selected.date.valueOf());
            $('#ex_from_year').datepicker('setEndDate', endDate);
        }).on('clearDate', function (selected) {
            $('#ex_from_year').datepicker('setEndDate', null);
        });
        // End

        // Project Check Dates
        $("#pro_from_year").datepicker({
            minViewMode: 2,
            endDate: '+0d',
            format: 'yyyy',
            autoclose: true,
        }).on('changeDate', function (selected) {
            var startDate = new Date(selected.date.valueOf());
            $('#pro_to_year').datepicker('setStartDate', startDate);
        }).on('clearDate', function (selected) {
            $('#pro_to_year').datepicker('setStartDate', null);
        });

        $("#pro_to_year").datepicker({
            minViewMode: 2,
            endDate: '+0d',
            format: 'yyyy',
            autoclose: true,
        }).on('changeDate', function (selected) {
            var endDate = new Date(selected.date.valueOf());
            $('#pro_from_year').datepicker('setEndDate', endDate);
        }).on('clearDate', function (selected) {
            $('#pro_from_year').datepicker('setEndDate', null);
        });

        // End
    });

    /* Add And Edit Education */
    $(".educations_popup").click(function(){
        $('#edit_education').modal('show');
        $('#form_Education')[0].reset();
        $('.edu_title').html('Add Education');
        $('#id').val('');
        $('#del_doc').val('0');
		$('.general_block_url').hide();
		$('.general_block_upload').show();
		$('.delete_btn').hide();

        var form_id  = '#form_Education';
        $(form_id+' .old_edu_string').val('');

    });

    //general function for add/edit
    $('form#form_Education').submit(function (event) {
        var ajax_url  = '/store_education';
        var source_id = '#edit_education';
        var form_id  = '#form_Education';
        
        if($('.edu_title').html()=='Edit Education'){
            ajax_url  = '/update_education';

            var old_string='';
            var new_string='';

            old_string=$.trim($(form_id+' .old_edu_string').val());
            new_string=$.trim($(form_id+' #school').val())+'-'+$.trim($(form_id+' #degree').val())+'-'+$.trim($(form_id+' #study_field').val())+'-'+$.trim($(form_id+' #degree_type').val())+'-'+$.trim($(form_id+' #edu_from_year').val())+'-'+$.trim($(form_id+' #edu_to_year').val())+'-'+$.trim($(form_id+' #description').val());
            
            if($(form_id+" #is_verify_flag").val()==1){
                if(old_string!=new_string){
                    if (confirm('Any verification on this record will be lost. Do you want to continue edit?')) {
                    }else{
                        return false;
                    }
                }
            }
        }

        //console.log(old_string);
        //console.log(new_string);
        
        var to_year = $('form#form_Education #edu_to_year').val();
        var from_year = $('form#form_Education #edu_from_year').val();
        var checked = true;

        if(checkdate(from_year,"",to_year,"",checked,msg=1)==false){
            return false;
        }

		var redirect_var = '';
		if(window.location.pathname == '/get-verified') {
			redirect_var = 'education';
		}
        StoreModalData(ajax_url,source_id,form_id,redirect_var);
        event.preventDefault();
    });

    function edit_education(id) {
        $('#edit_education').modal('show');
        $('.edu_title').html('Edit Education');
        $('.delete_btn').show();
        var ajax_url = '/get_one_education';
        var target_id ='form#form_Education';
        fillmodalform(ajax_url,id,target_id);
    }
	
    function delete_education() {

        var is_verify_flag  = '';
        var form_id         = 'form#form_Education';
        var msg             ='Do you want to continue deletion?';
            is_verify_flag  = $(form_id+" #is_verify_flag").val();

            if(is_verify_flag==1){
                msg = 'Any verification on the deleted record will be lost. Do you want to continue deletion?';
            }

		if (confirm(msg)) {
			// Save it!
			var ajax_url = '/delete_education';
			var id = $(form_id).find('#id').val();
			var redirect_var = '';
			if(window.location.pathname == '/get-verified') {
				redirect_var = 'education';
			}
			deleteData(ajax_url, id, redirect_var);
		} else {
			// Do nothing!
		}
    }
    /* End */

    /* Add And Edit Experience */
    $(".experience_popup").click(function(){
        var target_id='form#form_experience';

        $('#edit_experience').modal('show');
        $('#form_experience')[0].reset();
        $('form#form_experience #id').val('');
        $(".ex_company_name").val('').change();
        $('.ex_title').html('Add Experience');
		$('.delete_btn').hide();

        $(target_id+" #doc_url_link").attr("href", "#");
        $(target_id+" .general_block_upload").show();
        $(target_id+" .general_block_url").hide();
        $(target_id+" .old_exp_string").val('');

        $(target_id+" #ex_to_year").attr('disabled', false);
        $(target_id+" #to_month").attr('disabled', false);

    });

    $('form#form_experience').submit(function (event) {
        var ajax_url  = '/store_experience';
        var pid = $('form#form_experience #id').val();
        var source_id = '#edit_experience';
        var form_id  = '#form_experience';
        
        var to_year = $('form#form_experience #ex_to_year').val();
        var to_month = $('form#form_experience #to_month').val();
        var from_year = $('form#form_experience #ex_from_year').val();
        var from_month = $('form#form_experience #from_month').val();

        var checked = true;
        /*if($('form#form_experience #ex_current_work').prop('checked') == true){
            checked = false;
        }*/

        if(checkdate(from_year,from_month,to_year,to_month,checked)==false){
            return false;
        }

        if(pid!=''){
            ajax_url ='/update_experience';

            var old_string='';
            var new_string='';

            var isChecked = $(form_id+' #ex_current_work').is(':checked');
            var current_work=0;
            if(isChecked){
                current_work=1;
            }else{
                current_work=0;
            }

            old_string=     $.trim($(form_id+' .old_exp_string').val());
            new_string=     $.trim($(form_id+' #title').val())+'-'+$.trim($(form_id+' #company_id').val())+'-'+$.trim($(form_id+' #autocomplete').val())+'-';
            new_string+=    $.trim($(form_id+' #from_month').val())+'-'+$.trim($(form_id+' #ex_from_year').val())+'-'+$.trim($(form_id+' #to_month').val())+'-';
            new_string+=    $.trim($(form_id+' #ex_to_year').val())+'-'+current_work+'-'+$.trim($(form_id+' #description').val());
            
            if($(form_id+" #is_verify_flag").val()==1){
                if(old_string!=new_string){
                    if (confirm('Any verification on this record will be lost. Do you want to continue edit?')) {
                    }else{
                        return false;
                    }
                }
            }
        }
       
        var redirect_var = '';
		if(window.location.pathname == '/get-verified') {
			redirect_var = 'experience';
		}
        StoreModalData(ajax_url,source_id,form_id,redirect_var);
        event.preventDefault();
    });

    function edit_experience(id) {
        $('#edit_experience').modal('show');
        $('.ex_title').html('Edit Experience');
        $('.delete_btn').show();
        var ajax_url = '/get_one_experience';
        var target_id ='form#form_experience';

        $(target_id+" #doc_url_link").attr("href", "#");
        $(target_id+" .general_block_upload").show();
        $(target_id+" .general_block_url").hide();

        fillmodalform(ajax_url,id,target_id);
    }
	
    function delete_experience() {
        var is_verify_flag  = '';
        var form_id         = 'form#form_experience';
        var msg             = 'Do you want to continue deletion?';
            is_verify_flag  = $(form_id+" #is_verify_flag").val();

        if(is_verify_flag==1){
            msg = 'Any verification on the deleted record will be lost. Do you want to continue deletion?';
        }

		if (confirm(msg)) {
			// Save it!
			var ajax_url = '/delete_experience';
			var id = $(form_id).find('#id').val();
			var redirect_var = '';
			if(window.location.pathname == '/get-verified') {
				redirect_var = 'experience';
			}
			deleteData(ajax_url, id, redirect_var);
		} else {
			// Do nothing!
		}
    }
    /* End */

    /* Add and Edit Project*/
    $(".project_popup").click(function(){
        var target_id="form#form_project";
        $('#edit_project').modal('show');
        $('form#form_project')[0].reset();
        $('form#form_project #id').val('');
        $('.pr_title').html('Add Project');
        $("form#form_project #company_id").val(null).trigger("change");
		$('.delete_btn').hide();

        $(target_id+" #doc_url_link").attr("href", "#");
        $(target_id+" .general_block_upload").show();
        $(target_id+" .general_block_url").hide();

        $(target_id+" .old_project_string").val('');

    });

    $('form#form_project').submit(function (event) {
        var ajax_url  = '/store_project';
        var pid = $('form#form_project #id').val();
        var source_id = '#edit_project';
        var form_id  = '#form_project';

        var to_year = $('form#form_project #pro_to_year').val();
        var to_month = $('form#form_project #to_month').val();
        var from_year = $('form#form_project #pro_from_year').val();
        var from_month = $('form#form_project #from_month').val();
        var checked = true;

        if(checkdate(from_year,from_month,to_year,to_month,checked)==false){
            return false;
        }

        $('.pr_title').html('Edit Project');

        if(pid!=''){
            ajax_url ='/update_project';

            var old_string='';
            var new_string='';

            old_string=     $.trim($(form_id+' .old_project_string').val());

            new_string=     $.trim($(form_id+' #title').val())+'-'+$.trim($(form_id+' #project_url').val())+'-'+$.trim($(form_id+' #company_id').val())+'-'+$.trim($(form_id+' #location_autocomplete').val())+'-';
            new_string+=    $.trim($(form_id+' #from_month').val())+'-'+$.trim($(form_id+' #pro_from_year').val())+'-'+$.trim($(form_id+' #to_month').val())+'-';
            new_string+=    $.trim($(form_id+' #pro_to_year').val())+'-'+$.trim($(form_id+' #description').val());
            
            if($(form_id+" #is_verify_flag").val()==1){
                if(old_string!=new_string){
                    if (confirm('Any verification on this record will be lost. Do you want to continue edit?')) {
                    }else{
                        return false;
                    }
                }
            }
        }

		var redirect_var = '';
		if(window.location.pathname == '/get-verified') {
			redirect_var = 'project';
		}
        StoreModalData(ajax_url,source_id,form_id,redirect_var);
        event.preventDefault();
    });

    function edit_project(id) {
        $('#edit_project').modal('show');
        $('.pr_title').html('Edit Project');
        $('.delete_btn').show();
        var ajax_url = '/get_one_project';
        var target_id ='form#form_project';
        $("form#form_project #company_id").val(null).trigger("change");

        $(target_id+" #doc_url_link").attr("href", "#");
        $(target_id+" .general_block_upload").show();
        $(target_id+" .general_block_url").hide();


        fillmodalform(ajax_url,id,target_id);
    }
	
    function delete_project() {
        var is_verify_flag  = '';
        var form_id         = 'form#form_project';
        var msg             = 'Do you want to continue deletion?';
            is_verify_flag  = $(form_id+" #is_verify_flag").val();

            if(is_verify_flag==1){
                msg = 'Any verification on the deleted record will be lost. Do you want to continue deletion?';
            }

		if (confirm(msg)) {
			// Save it!
			var ajax_url = '/delete_project';
			var id = $(form_id).find('#id').val();
			var redirect_var = '';
			if(window.location.pathname == '/get-verified') {
				redirect_var = 'project';
			}
			deleteData(ajax_url, id, redirect_var);
		} else {
			// Do nothing!
		}
    }
    /* End*/

    /*RECOMMENDATION*/
    $(".recommended_popup").click(function(){
        $('#edit_recommedation').modal('show');
        $('#form_recommedation')[0].reset();
    });

    $('form#form_recommedation').submit(function (event) {
        var ajax_url  = '/sent_recommendation';
        var source_id = '#edit_recommedation';
        var form_id  = '#form_recommedation';
        StoreModalData(ajax_url,source_id,form_id,"");
        event.preventDefault();
    });

    function accept_recommendation(id){
        $('.rec_'+id).show();
    }

    //accept_recommendation
    function submit_rec_form(id){
        if(typeof id!='undefined' && id!=''){
            var ajax_url  = '/accept_recommendation';
            var form_id  = '#rec_form_'+id;
            var form = $(form_id)[0]; // You need to use standard javascript object here
            var formData = new FormData(form);
            $.ajax({
                type: "POST",
                url: ajax_url,
                data: formData,
                contentType: false,
                processData: false,
                enctype: 'multipart/form-data',
                success: function (result) {
                    if(result.status=='OK'){
                        $.bootstrapGrowl(result.msg, {type: 'success', delay: 2000});
                        setTimeout(function() { location.reload(); }, 3000);
                    }else{
                        $.bootstrapGrowl(result.msg, {type: 'danger', delay: 2000});
                    }
                },
                error: function (err) {
                 console.log(err);
                }
            });
        }else{
           $.bootstrapGrowl('Data not found',{type: 'danger', delay: 2000}); 
        }
    }

    //decline_recommendation
    function declineRecommends(id){
        $('.rec_'+id).hide();
        var r = confirm("Are you sure to decline Recommendation!");
        if (r == true) {
            var ajax_url="/decline_recommendation/"+id;
            ajaxGet(id,ajax_url);
        }
    }

    //hide_recommendation
    function HideRecommends(id){
        var r = confirm("Are you sure to hide Recommendation!");
        if (r == true) {
            var ajax_url="/hide_recommendation/"+id;
            ajaxGet(id,ajax_url);
        }
    }

    function ajaxGet(para,ajax_url){
        $.ajax({
          type: "GET",
          url: ajax_url,
          data: para,
          cache: false,
          success: function(result){
            if(result.status=="OK"){
                 $.bootstrapGrowl(result.msg, {type: 'success', delay: 1000});
                 setTimeout(function() { location.reload(); }, 2000);
            }else{
                 $.bootstrapGrowl(result.msg, {type: 'danger', delay: 1000});
            }
          }
        });
    }
    /*END*/

    /*SOCIAL*/
    $(".social_popup").click(function(){
        $('#edit_social').modal('show');
        $('#form_social')[0].reset();
    });

    $('form#form_social').submit(function (event) {
        var ajax_url  = '/store_social';
        var pid = $('form#form_social #pid').val();
        var source_id = '#edit_social';
        var form_id  = '#form_social';
        if(pid!=''){
            ajax_url ='/store_social';
        }
        StoreModalData(ajax_url,source_id,form_id,"");
        event.preventDefault();
    });

    function edit_social(id) {
        $('#edit_social').modal('show');
        var target_id ='form#form_social';
    }
    /*END*/

    function fillmodalform(ajax_url,id,target_id){
        $(target_id+" .old_edu_string").val('');
        $(target_id+" .old_exp_string").val('');
        $(target_id+" .old_project_string").val('');
        $(target_id+" #is_verify_flag").val(0);

        $.getJSON(ajax_url+'/'+id,'', function (json) {
            $.each(json, function (key, value) {
                $(target_id+" select[name=" + key + "]").val(null).trigger("change");
                $(target_id+' input[name="' + key + '"]').val(value);
                $(target_id+' textarea[name="' + key + '"]').val(value);
                if(key=='company_id'){
                    if(value!=''){
                        $(target_id+" select[name=" + key + "]").val(value).trigger("change");
                    }else{
                        $(target_id+" select[name=" + key + "]").val(null).trigger("change");
                    }
                }

                if(key=="from_month"){
                    if(value!='' && value!=null){
                        if(value.length>2){
                            value= moment().month(value).format("MM");
                        }
                    }
                }

                if(key=="to_month"){
                    if(value!='' && value!=null){
                        if(value.length>2){
                            value= moment().month(value).format("MM");
                        }
                    }
                }

                $(target_id+" select[name=" + key + "]").val(value);

                if(key=="edu_string"){
                    $(target_id+" .old_edu_string").val(value);
                }
                if(key=="exp_string"){
                    $(target_id+" .old_exp_string").val(value);
                }
                if(key=="project_string"){
                    $(target_id+" .old_project_string").val(value);
                }

				/* Education */
				if(key=='educationdocs' || key=='experiencedocs' || key=='projectdocs'){
					$.each(value, function (doc_key, doc_value) {

                        if(key=='educationdocs'){
                            if(typeof doc_value.verify_request_id!='undefined' && doc_value.verify_request_id.length>0){
                                $(target_id+" #is_verify_flag").val(1);
                            }else{
                                $(target_id+" #is_verify_flag").val(0);
                            }
                        }

                        if(key=='projectdocs'){
                            if(typeof doc_value.verify_request_id!='undefined' && doc_value.verify_request_id.length>0){
                                $(target_id+" #is_verify_flag").val(1);
                            }else{
                                $(target_id+" #is_verify_flag").val(0);
                            }
                        }

                        if(key=='experiencedocs'){
                            if(typeof doc_value.verify_request_id!='undefined' && doc_value.verify_request_id.length>0){
                                $(target_id+" #is_verify_flag").val(1);
                            }else{
                                $(target_id+" #is_verify_flag").val(0);
                            }
                        }

						//console.log("doc_value --->>> ", JSON.stringify(doc_value));
						if(typeof doc_value.doc_url != 'undefined' && doc_value.doc_url != '') {
							$(target_id+" #doc_url_link").attr("href", "/download_document/"+doc_value.doc_url);
							$(target_id+" #doc_url").html(doc_value.doc_url);
							$(target_id+" .general_block_upload").hide();
							$(target_id+" .general_block_url").show();
						} else {
							$(target_id+" #doc_url_link").attr("href", "#");
							$(target_id+" .general_block_upload").show();
							$(target_id+" .general_block_url").hide();
							
						}
					});
				}
				
				/* Experience */
                if(key=="current_work"){
                    if(value==1){
                        $(target_id+" input[name=" + key + "]").prop('checked', true);
                        $(target_id+" input[name='to_year']").attr('disabled', true);
                        $(target_id+" select[name='to_month']").attr('disabled', true);
                    }else{
                         $(target_id+" input[name=" + key + "]").removeAttr('checked');
                         $(target_id+" #ex_to_year").attr('disabled', false);
                         $(target_id+" #to_month").attr('disabled', false);
                    }
                }
				
            });
        });
    }

    function deleteData(ajax_url, id, tab_redirect){
		$.getJSON(ajax_url+'/'+id,'', function (result) {
			if(result.status=='OK') {
				$.bootstrapGrowl(result.msg, {type: 'success', delay: 1000});
				setTimeout(function() {
					if(tab_redirect=='') {
						location.reload();
					} else {
						var current_url = window.location.pathname;
						window.location = current_url + "#" +tab_redirect;
						location.reload();
					}
				}, 1200);
			} else {
				if(typeof result.msg!='undefined') {
					$.bootstrapGrowl(result.msg, {type: 'danger', delay: 1000});
				}
			}
		});
    }

    function StoreModalData(ajax_url,source_id,form_id,tab_redirect){
        ajaxindicatorstart('LOADING');
		//alert(tab_redirect);
        var form = $(form_id)[0]; // You need to use standard javascript object here
        var formData = new FormData(form);
        $.ajax({
            type: "POST",
            url: ajax_url,
            data: formData,
            contentType: false,
            processData: false,
            enctype: 'multipart/form-data',
            success: function (result) {
                if(result.status=='OK'){
                    $(source_id).modal('hide');
                    $.bootstrapGrowl(result.msg, {type: 'success', delay:1000});
                    setTimeout(function() {
                        ajaxindicatorstop();
						if(tab_redirect=='') {
							location.reload();
						} else {
							var current_url = window.location.pathname;
							window.location = current_url + "#" +tab_redirect;
							location.reload();
						}
					}, 3000);
                }else{
                    if(typeof result.statusDescription!='undefined'){
                        $.bootstrapGrowl(result.statusDescription.summary, {type: 'danger', delay: 1000});
                    }else{
                        if(typeof result.msg!='undefined'){
                            $.bootstrapGrowl(result.msg, {type: 'danger', delay: 1000});
                        }
                    }
                    ajaxindicatorstop();
                }
            },
            error: function (err) {
             console.log(err);
             ajaxindicatorstop();
            }
        });
    }

    function checkdate(from_year, from_month, to_year, to_month, checked, msg){

        var msgYear = "To year must be greater than from year";
        var msgMonth = "To month must be greater than from month";

        var now = new Date();
        var month = now.getMonth()+1;
        var year = now.getFullYear();

        if(msg!=''){
            msgYear = "Completion year must be greater or equal to Starting year";
            msgMonth = "Completion month must be greater or equal to Starting month";
        }


        if(checked!=false){
            
            if(parseInt(from_year)==parseInt(year)){
                if(parseInt(from_month) > parseInt(month)){
                   $.bootstrapGrowl("You cannot select future month", {type: 'danger', delay: 1000});
                   return false;
                }
            }

            if(parseInt(to_year)==parseInt(year)){
                if(parseInt(to_month) > parseInt(month)){
                    $.bootstrapGrowl("You cannot select future month", {type: 'danger', delay: 1000});
                    return false;
                }
            }

            if(parseInt(to_year) < parseInt(from_year)){
               $.bootstrapGrowl(msgYear, {type: 'danger', delay: 1000});
               return false;
            }

            if(parseInt(from_year) == parseInt(to_year)){
                if(parseInt(to_month) < parseInt(from_month)){
                   $.bootstrapGrowl(msgMonth, {type: 'danger', delay: 1000});
                   return false;
                }
            
            if(parseInt(from_year)==parseInt(year)){
              if(parseInt(from_month) > parseInt(month)){
                   $.bootstrapGrowl("You cannot select future month", {type: 'danger', delay: 1000});
                   return false;
                }
            }  
                if(parseInt(to_year)==parseInt(year)){
                    if(parseInt(to_month) > parseInt(month)){
                        $.bootstrapGrowl("You cannot select future month", {type: 'danger', delay: 1000});
                        return false;
                    }
                }
            }
        }else{
            if(parseInt(from_month) > parseInt(month) && parseInt(from_month) != parseInt(month)){
               $.bootstrapGrowl("You cannot select future month", {type: 'danger', delay: 1000});
               return false;
            }
            return true;
        }

        return true;
    }
/*END*/

//Store Form Data By AJAX POST
    function StoreFormData(form_id,ajax_url){
        var form = $('form#'+form_id)[0];
        var formData = new FormData(form);
            $.ajax({
                type: "POST",
                url: ajax_url,
                data: formData,
                contentType: false,
                processData: false,
                enctype: 'multipart/form-data',
                success: function (result) {
                    console.log(result);
                   if(result.status=='OK'){
                        $.bootstrapGrowl(result.msg, {type: 'success', delay: 1000});
                        setTimeout(function() { location.reload(); }, 1200);
                    }else{
                        if(typeof result.statusDescription!='undefined'){
                            $.bootstrapGrowl(result.statusDescription.summary, {type: 'danger', delay: 1000});
                        }else{
                            if(typeof result.msg!='undefined'){
                                $.bootstrapGrowl(result.msg, {type: 'danger', delay: 1000});
                            }
                        }
                    }
                },
            error: function (err) {
            console.log(err);
            }
        });
    }

//Get Method for Pass Data

function AjaxGet(ajax_url){
    $.ajax({
        url: ajax_url,
        method: 'GET',
        success: function(results)
        {
            if(results.status=='OK'){
                $.bootstrapGrowl(results.msg, {type: 'success', delay: 1000});
                setTimeout(function() { location.reload(); }, 1000);
            }
            else{
                $.bootstrapGrowl(results.msg, {type: 'danger', delay: 1000});
            }
        }
    });
}