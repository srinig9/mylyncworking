function submitVerify(ajax_url,source_id,form_id){
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
                    if(source_id!=''){
                        $(source_id).modal('hide');
                    }
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

function showMyModal(myRecID) {
    $('#myModal').modal('hide');
    $('#myModal_authenticate').modal('show');
    var monthNames = [ "-", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    
    var current_user_id ='';
	var rinkeby_ether_url ='';
	
    current_user_id =$('#login_user_id').val();
	rinkeby_ether_url= $('#rinkeby_ether_url').val();

    $.getJSON('/get-one-verify-request-data/'+myRecID, function (json) {
        //console.log("Anil -->> " + JSON.stringify(json));
        
        var target_id ='form#form_verify_request_authenticate';

        $(target_id+' .verify_authenticate_comment').val('');
        $('.info_table_2 tr').removeAttr('style');
        $('.info_table_2 span').html('');
        $('.info_table_1 tr').removeAttr('style');
        $('.info_table_1 span').html('');
        $(target_id+" #doc_url_link").attr("href", "#");

        var separator_id = 0;
        var name_flag=0;
        

        $.each(json, function (key, value) {
            $("span[id=" + key + "]").html(value);

            $(target_id+" input[name=" + key + "]").val(value);

			if(key=='user_id'){
				var user_slug='';
				if(typeof value.slug!='undefined'){
					user_slug = value.slug;
				}
				$("#more_info").html('<a style="color:white;" href="/messages/'+user_slug+'"><i class="fa fa-angle-double-right" aria-hidden="true"></i> More Info Required</a>');
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

            if(key=='to_verify_data'){
                if(value==1){
                    separator_id=parseInt(separator_id)+1;
                    value='Data';
                    $('.info_table_1').show();
                }else{
                    $('.info_table_1').hide();
                    value='';
                }
            }
			
            if(key=="gender"){
                if(value!=''){
                    if(value=="1"){
                        $(target_id+" #gender").html('Male');
                    }else if(value=="2"){
                        $(target_id+" #gender").html('Female');
                    }else if(value=="3"){
                        $(target_id+" #gender").html('Not Specified');
                    }else{
                        $(target_id+" #gender").html('');
                    }
                }
            }

            if(key=='doc_url'){
                if(value!=''){
                    $(target_id+" #doc_url_link").attr("href", "/download_document/"+value);
                    }else{
                    $(target_id+" #doc_url_link").attr("href", "#");
                }
            }

            if(key=='doc_id'){
				if(value=='') {
					$(target_id+' #myModalTitle h3 #title_doc_id').html('');
				} else {
					$(target_id+' #myModalTitle h3 #title_doc_id').html(' #' + value);
				} 
			}
			
            if(key=='doc_type_id') {
                if(typeof value.title!='undefined'){
                    $(target_id+' span[id=' + key + ']').html(value.title);
                    var document_name = ' - ' + value.title;
                    $(target_id+' #myModalTitle h3 #title_doc_type').html(document_name);
                    $(target_id+' #doc_name').html(value.title);

                    if(value.title=="Passport"){
                        name_flag=1;
                    }
                }
            }
            
            if(key=='user_id'){
                if(value.name != '') {
					var req_name = ' - ' + value.name;
					$(target_id+' #myModalTitle h3 #requestor_name').html(req_name);
				}
            }
			
			if(key=='tab_type'){
				$(target_id+' #myModalTitle h3 #title_type').html(" - " + value);
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
                    $(target_id+" span[id=" + key + "]").html(value);
                }
            } else {
                $(target_id+" span[id=" + key + "]").html('');
            }

			if(key=='createdAt'){
				value = moment(value).format('Do MMM, YYYY');
				$(target_id+" #" + key).html(value);
            }
            
            if(key=='to_verify_doc'){
                if(value==1){
                    separator_id=parseInt(separator_id)+1;
                    value='Document';
                    $('.info_table_2').show();
                }else{
                    value='';
                    $('.info_table_2').hide();
                }
            }
            
            if(key=='verify_request_id' && value.length > 0){
                $( "#verify_by_box" ).html('');
                

                $.each(value, function (key_verify, value_verify) {
                    if(value_verify.txnno != "") {
                        var html_block_date ='';
                        if(typeof value_verify.verifydate!='' && value_verify.verifydate!=''){
                            html_block_date = moment(value_verify.verifydate,'DD/MM/YYYY').format('Do MMM, YYYY');
                        }

                        var profile_image = '/themes/frontend/images/default-user.png';
                        
                        if(typeof value_verify.user_id!='undefined' && typeof value_verify.user_id.profile_image!='undefined' && value_verify.user_id.profile_image!=''){
                            profile_image = '/uploads/users/'+value_verify.user_id.profile_image;
                        }

                        var html_block = '<div class="p8_v_1000_li"><div class="p8_1001"><img class="p8_1001_img" src="'+profile_image+'" alt="'+value_verify.user_id.name+'" width="65" height="65">';
                            html_block += '<div class="p8_1001_content">';
                            html_block += '<div class="p18_1001_user"><a href="">'+value_verify.user_id.name+'</a> </div>';
                            html_block += '<div class="p18_1001_dated">'+html_block_date+'</div></div></div>';
                            html_block += '<div class="p8_1002">';
                            html_block += '<div class="p8_1002_description">';
                            html_block += '<p><b>Comments : </b>&nbsp; '+value_verify.verifiercomments+'</p>';
                            html_block += '<p style="text-decoration:underline;"><b>Blockchain Transaction ID</b>&nbsp;&nbsp;</p>';
                            if(typeof value_verify.txnno!='undefined' && value_verify.txnno!=''){
                                html_block += '<p><b>DataTxid : </b>&nbsp;<a href="'+rinkeby_ether_url+value_verify.txnno+'" target="_blank">'+value_verify.txnno+'</a></p>';
                            }
                            if(typeof value_verify.doc_txnno!='undefined' && value_verify.doc_txnno!='')
                            {
                                html_block += '<p><b>DocumentTxid : </b>&nbsp;<a href="'+rinkeby_ether_url+value_verify.doc_txnno+'" target="_blank">'+value_verify.doc_txnno+'</a></p>';
                            }
                            
							var request_user_id = '';
							var compare_data_id = '';
							if(typeof value_verify.user_id!='undefined' && typeof value_verify.user_id.id!='undefined'){
								request_user_id = value_verify.user_id.id;
							}
							
							compare_data_id = value_verify.verify_id+'/'+request_user_id;
							
                            html_block += '<p><b>Validate : </b>&nbsp; <a href="/comparedata/'+compare_data_id+'" target="_blank"><i class="fa fa-clone" aria-hidden="true"></i> Compare with Blockchain Data</a></p>';
                            
                            html_block += '</div></div></div>';
                        
                            $( "#verify_by_box" ).append( html_block );
					}
					if(value_verify.user_id.id ==current_user_id) {
                       $('#req_verify_id').val(value_verify.id);
						if(value_verify.txnno != "") {
							$('#current_verifier_block').hide();
							$('#req_verify_id').val('');
						} else {
							$('#current_verifier_block').show();
						}
					}
				});
            }
            
            if(separator_id>1){
                $('span[id="separator"]').html('-');
            }else{
                $('span[id="separator"]').html(''); 
            }

            if(key!="gender"){
                 if(key=='legal_name'){
                    if(value!='' && name_flag==1){
                        $(target_id+" #legal_name").html('');
                    }
                }
                else{
                    $("span[id=" + key + "]").html(value);
                }
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
                if(typeof value.from_year!='undefined'){
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
				$(target_id+" span[id='project_title']").html(value.title);
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

function saveVerifyData() {
    var myDataId = document.getElementById('myDataId').value;
    var myComment = document.getElementById('mycomments').value;
    //alert(myComment)
    $.get('/saveVerifyData/'+myDataId+'/'+myComment, function (res) {
    // document.getElementById("email").value = res[0];
    });
}