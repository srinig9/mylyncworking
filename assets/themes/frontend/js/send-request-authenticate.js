function show_verify_data_popup(id) {
	$('#myModal').modal('show');

	var ajax_url = '/one_one_verify_data';
	var target_id ='form#form_verify_request';

	send_verification_fillmodalform(ajax_url,id,target_id);
}

function send_verification_fillmodalform(ajax_url,id,target_id){
	var monthNames = [ "-", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	
	$(target_id+" #verify_general_block_upload").show();
	$(target_id+" #doc_url_link").attr("href", "#");

	$.getJSON(ajax_url+'/'+id,'', function (json) {
		
		$('.info_table_2 tr').removeAttr('style');
		$('.info_table_2 span').html('');

		$('.info_table_1 tr').removeAttr('style');
		$('.info_table_1 span').html('');
		
		/* alert('ANIL OK');
		console.log('ANIL -->>  ' + JSON.stringify(json)); */
		$.each(json, function (key, value) {
			$(target_id+' input[name="' + key + '"]').val(value);
			$(target_id+' textarea[name="' + key + '"]').val(value);
			$(target_id+" select[name=" + key + "]").val(value).trigger("change");
			$(target_id+" select[name=" + key + "]").val(value);

			if(key=='connection'){
				var select_option='<option value="">Select User</option>';
				if(value.length>0){
					$.each(value, function(index, itemData) {
						console.log(itemData.name);
						select_option+='<option value="'+itemData.id+'">'+itemData.name+'</option>';
					});
				}
				$(target_id+" #"+key).html(select_option);
			}
			
			if(key=='doc_url'){
				if(value!=''){
					$(target_id+" #verify_general_block_upload").hide();
					$(target_id+" #doc_url_link").attr("href", "/download_document/"+value);
					$(target_id+" #doc_url").html(value);

					/* $(target_id+' input[name="to_verify_data"]').prop("disabled", false);
					$(target_id+' input[name="to_verify_doc"]').prop("disabled", false);*/
				}else{
					$(target_id+" #doc_url_link").attr("href", "#");
					$(target_id+" #verify_general_block_upload").show();
					//
					/* $(target_id+' input[name="to_verify_data"]').prop("disabled", true);
					$(target_id+' input[name="to_verify_doc"]').prop("disabled", true); */
				}
			} else {
				
				//$(target_id+" #doc_url_link").attr("href", "#");

				/* $(target_id+' input[name="to_verify_data"]').prop("disabled", true);
				$(target_id+' input[name="to_verify_doc"]').prop("disabled", true); */
				/* $('input[name="to_verify_data"]').attr("disabled", true);
				$('input[name="to_verify_doc"]').attr("disabled", true); */
			}
			
			if(key=="dob"){
                if(value!='' && value.length<11){
                    value= moment(value,'DD-MM-YYYY').format('DD-MMM-YYYY');
                }
            }

            if(key=="issue_date"){
                if(value!='' && value.length<11){
                    value= moment(value,'DD-MM-YYYY').format('DD-MMM-YYYY');
                }   
            }
            if(key=="expiry_date"){
                if(value!='' && value.length<11){
                    value= moment(value,'DD-MM-YYYY').format('DD-MMM-YYYY');
                }   
            }
            
			if(key=='comment'){
				if(value != null && value.length == 0){
					$(target_id+" span[id='"+key+"']").parent().parent().css({'display':'none'});
				}else{
					$(target_id+' #comment_input_box').val(value);
					//$(target_id+' #comment_input_box').hide();
					$(target_id+" span[id='"+key+"']").parent().parent().css({'display':'block'});
				}
			}
			
			if(key=="gender"){
				if(value!=''){
					if(value==1){
						$(target_id+" span[id=" + key + "]").html('Male');
					}else if(value==2){
						$(target_id+" span[id=" + key + "]").html('Female');
					}else if(value==3){
						$(target_id+" span[id=" + key + "]").html('Not Specified');
					}else{
						$(target_id+" span[id=" + key + "]").html('');
					}
				}
			}

			if(key=='doc_id'){
				if(value=='') {
					$(target_id+' input[name="to_verify_data"]').prop("disabled", true);
					$(target_id+' .uploadbar_row').show();
					$(target_id+' #myModalTitle h3 #title_doc_id').html('');
					//$(target_id+' input[name="to_verify_doc"]').hide();
					//$(target_id+' input[name="to_verify_doc"]').removeAttr("checked");
					//$(target_id+' input[name="to_verify_doc"]').val('');
				} else {
					$(target_id+' input[name="to_verify_data"]').prop("disabled", false);
					$(target_id+' .uploadbar_row').hide();
					$(target_id+' #myModalTitle h3 #title_doc_id').html(' - ' + value);
					//$(target_id+' input[name="to_verify_doc"]').show();
					//$(target_id+' input[name="to_verify_doc"]').val('1');
				} 
			}
			//request_data_inner
			if(key=="request_data"){
				var user_list='';
				if(value.length>0){
					var count=0;
					$(target_id+" .request_data").show();
					$.each(value, function(index, itemData) {
						if(typeof itemData.user_id!='undefined'){
							count++;
							var data_access='';
							var user_name='';
							if(typeof itemData.user_id!='undefined' && typeof itemData.user_id.name!='undefined'){
								user_name = itemData.user_id.name;
							}
							
							user_list+='<tr>';
								user_list+='<td>'+count+'</td>';
								user_list+='<td>'+user_name+'</td>';

								if(itemData.to_verify_data==1 && itemData.to_verify_doc==0){
									data_access='DATA';
								}
								else if(itemData.to_verify_doc==1 && itemData.to_verify_data==0){
									data_access='DOCUMENT';
								}
								else if(itemData.to_verify_doc==1 && itemData.to_verify_data==1){
									data_access='DATA / DOCUMENT';
								}
								user_list+='<td>'+data_access+'</td>';
								var action='';
								action = "cancelVerifyRequest('"+itemData.id+"')";
								if(typeof itemData.status!='undefined' && itemData.status==1){
									if(itemData.txnno != ''){
										user_list+='<td><span class="green-checked"><i class="fa fa-check-circle" aria-hidden="true"></i></span>&nbsp; <a href="javascript:;" class="showMyModal btn btn-success" data-id="'+itemData.verify_id+'">View</a></td>';
									}
								}else if(typeof itemData.status!='undefined' && itemData.status==2){
									user_list+='<td><a href="javascript:;" class="btn btn-warning" disabled>Ignored</a></td>';
								}else{
									user_list+='<td><a href="javascript:;" class="btn btn-info" onclick="'+action+'">Cancel</a></td>';
								}

								user_list+='</tr>';
						}
					});

					$(target_id+" .request_data_inner").html(user_list);
				}else{
					$(target_id+" .request_data_inner").html('');
					$(target_id+" .request_data").hide();
				}
			}
			
			if(key=='user_name'){
				$(target_id+' #myModalTitle h3 #title_name').html(value);
			}
			
			if(key=='tab_type'){
				$(target_id+' #myModalTitle h3 #title_type').html(" - " + value);
				$(target_id+' #tab_type_input').val(value);
			}
			
			var name_flag=0;
			if(key=='doc_type_id'){
				if(typeof value.title!='undefined'){
					value = value.title;
					$(target_id+' #myModalTitle h3 #title_data').html(" - " + value);
					$(target_id+' #doc_name').html(value);

					if(value.title=="Passport"){
                    	name_flag=1;
                	}
				}
			}
			if(key=='address_line_2' || key=='zip'){
				if(value!=''){
					value=', '+value;
				}
			}
			
			if(key!="gender"){
				if(value==1){
					value='Yes';
				}
			}

			if(value != ''){
				if(key!="gender"){
					if(key=='legal_name'){
	                    if(value!='' && name_flag==1){
	                        $(target_id+" #legal_name").html('');
	                    }
                	}
	                else{
	                    $(target_id+" span[id=" + key + "]").html(value);
	                }
				}
			} else {
				$(target_id+" span[id=" + key + "]").html('');
			}

			if(key=='createdAt'){
				value = moment(value).format('Do MMM, YYYY');
				$(target_id+" #" + key).html(value);
			}
			
			/* education Keys */
			if(key=='education'){
				if(typeof value.school!='undefined'){
					$(target_id+" span[id='edu_school']").html(value.school);
				}
				if(typeof value.degree!='undefined'){
					$(target_id+" span[id='edu_degree']").html(value.degree);
				}
				if(typeof value.study_field!='undefined'){
					$(target_id+" span[id='edu_study_field']").html(value.study_field);
				}
				if(typeof value.grade!='undefined'){
					$(target_id+" span[id='edu_grade']").html(value.grade);
				}
				if(typeof value.from_year!='undefined'){
					$(target_id+" span[id='edu_from_year']").html(value.from_year);
				}
				if(typeof value.to_year!='undefined'){
					$(target_id+" span[id='edu_to_year']").html(value.to_year);
				}
				if(typeof value.description!='undefined'){
					$(target_id+" span[id='edu_description']").html(value.description);
				}
			}
			
			/* Experience Keys */
			if(key=='experience'){
				if(typeof value.company_id!='undefined' && typeof value.company_id.company_name!='undefined'){
					$(target_id+" span[id='company_name']").html(value.company_id.company_name);
				}
				if(typeof value.title!='undefined'){
					$(target_id+" span[id='exp_title']").html(value.title);
				}
				if(typeof value.location!='undefined'){
					$(target_id+" span[id='exp_location']").html(value.location);
				}
				if(typeof value.description!='undefined'){
					$(target_id+" span[id='exp_description']").html(value.description);
				}
				if(typeof value.from_month!='undefined'){
					$(target_id+" span[id='exp_from_month']").html(monthNames[parseInt(value.from_month)]);
				}
				if(typeof value.from_year!='undefined'){
					$(target_id+" span[id='exp_from_year']").html(value.from_year);
				}
				if(typeof value.to_month!='undefined'){
					$(target_id+" span[id='exp_to_month']").html(monthNames[parseInt(value.to_month)]);
				}
				if(typeof value.to_year!='undefined'){
					$(target_id+" span[id='exp_to_year']").html(value.to_year);
				}
				if(value.current_work == 1) {
					$(target_id+" span[id='exp_current_work']").html('I currently work here');
				}
			}

			/* Project Keys */
			if(key=='project'){
				if(typeof value.company_id!='undefined' && typeof value.company_id.company_name!='undefined'){
					$(target_id+" span[id='project_company']").html(value.company_id.company_name);
				}
				if(typeof value.title!='undefined'){
					$(target_id+" span[id='project_title']").html(value.title);
				}
				if(typeof value.project_url!='undefined'){
					$(target_id+" span[id='project_url']").html(value.project_url);
				}
				if(typeof value.location!='undefined'){
					$(target_id+" span[id='project_location']").html(value.location);
				}
				if(typeof value.from_year!='undefined'){
					$(target_id+" span[id='project_from_year']").html(value.from_year);
				}
				if(typeof value.to_year!='undefined'){
					$(target_id+" span[id='project_to_year']").html(value.to_year);
				}
				if(typeof value.description!='undefined'){
					$(target_id+" span[id='project_description']").html(value.description);
				}
			}
			
		});

		$('.info_table_2 tr').each(function(k,v){
			if($(v).find('td').eq(1).find('span').text() == ''){
				$(v).css({'display':'none'});
			}
		});

		$('.info_table_1 tr').each(function(k,v){
			if($(v).find('td').eq(1).find('span').text() == ''){
				$(v).css({'display':'none'});
			}
		});
		
	});
}

function cancelVerifyRequest(rid){
	if(rid!=''){
		var ajax_url='/cancel_verify_request/'+rid;
		AjaxGet(ajax_url);
	}else{
		$.bootstrapGrowl('ID not exist', {type: 'danger', delay: 1000}); 
	}
}