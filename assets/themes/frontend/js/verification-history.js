$(document).on("click",".showMyModal",function(e){
    var id = $(this).data("id");
    
    showMyModal(id);
    $('#current_verifier_block').hide();
    e.preventDefault();
});

$(document).on("click",".show_verify_data_popup",function(){
    var id = $(this).data("id");
    show_verify_data_popup(id);
});

$(document).on("click",".show_verify_data_popup2",function(){
    var id = $(this).data("id");
    show_verify_data_popup(id);
});

$(document).on("click",".show_verify_data_popup3",function(){
    var id = $(this).data("id");
    show_verify_data_popup(id);
});

$(document).on("click",".paginate_button",function(){
    var page_no = $(this).data("page_no");
    $("input[name='page_no']").val(page_no);
    getVerifyHistoryData();
})

$(document).on("change",".main-limit",function(){
    getVerifyHistoryData();
});

$(document).on("keyup","#searchTxt",function(){
    var searchTerm = $(this).val().toLowerCase();
    $('#upload_history tbody tr').each(function(){
        var lineStr = $(this).text().toLowerCase();
        if(lineStr.indexOf(searchTerm) === -1){
            $(this).hide();
        }else{
            $(this).show();
        }
    });
});

function getVerifyHistoryData(){
    var form = $("#getDataTables")[0]; // You need to use standard javascript object here
    var formData = new FormData(form);
    $.ajax({
        type: "POST",
        url: "/getVerifiedList",
        data: formData,
        contentType: false,
        processData: false,
        success: function (result) {
            if(result.status=="OK"){
                $(".totalRecords").text(result.totalRecords);
                // Displaying numbers record
                $(".showing_number").text("Showing "+result.startPoint+" to "+result.endPoint+" of "+result.totalRecords+" entries");

                // Pagination
                var paginate = "";
                if(result.numberofpages > 0){
                    paginate += '<li class="paginate_button previous disabled" id="example_previous"><a href="#" aria-controls="example" data-dt-idx="0" tabindex="0"><i class="fa fa-angle-left" aria-hidden="true"></i></a></li>';
                    for (i = 1; i <= result.numberofpages; i++) {
                        var activeClass = "";
                        if(i==result.currentPage){
                            activeClass = "active";
                        }
                        paginate += '<li class="paginate_button '+activeClass+'" data-page_no="'+i+'"><a href="javascript:;" aria-controls="example" tabindex="0">'+i+'</a></li>';
                    }
                    paginate += '<li class="paginate_button next" id="example_next"><a href="#" aria-controls="example" data-dt-idx="4" tabindex="0"><i class="fa fa-angle-right" aria-hidden="true"></i></a></li>';
                }

                $(".pagination").html(paginate);
                
                var html = "";
                if(typeof result.data!='undefined' && result.data.length>0){
                    $.each(result.data, function( index, userVerifyData ) {
                         var created_timestamp='';   
                         var formatedDate = moment(userVerifyData.createdAt).format('DD-MMM-YYYY');
                         created_timestamp =  moment(formatedDate).format("X");

                        var doc_type = "";
                        if(typeof userVerifyData.doc_type_id!='undefined' && typeof userVerifyData.doc_type_id.title != "undefined" && userVerifyData.doc_type_id.title != "") {
                            doc_type = userVerifyData.doc_type_id.title;
                        }
                        var tab_type = "";
                        if(typeof userVerifyData.tab_type != "undefined" && userVerifyData.tab_type != "") {
                            tab_type = userVerifyData.tab_type;
                            tab_type = tab_type.charAt(0).toUpperCase() + tab_type.slice(1);
                        }
                        var verify_by = "";
                        verify_by_arr = [];
                        var last_verify_date=''; 
                        if(userVerifyData.verify_request_id.length > 0) {
                            $.each(userVerifyData.verify_request_id, function( index, verify_by_data ) {
                                if((typeof verify_by_data.txnno!='undefined' && verify_by_data.txnno!='') 
                                    || (typeof verify_by_data.doc_txnno!='undefined' && verify_by_data.doc_txnno!='')){
                                 
                                    if(userVerifyData.verify_request_id.length > 2 && index == 1) {
                                        verify_by = verify_by_data.user_id.name;
                                    } else {
                                        verify_by_arr.push(verify_by_data.user_id.name);
                                    }
                                    
                                    if(typeof verify_by_data.verifydate!='undefined' && verify_by_data.verifydate!=''){
                                        last_verify_date = verify_by_data.verifydate;
                                    }
                                }
                            });

                            if(verify_by != "") {
                                verify_by += " +" + String(userVerifyData.verify_request_id.length-1); 
                            } else {
                                if(verify_by_arr.length>0){
                                    verify_by = verify_by_arr.join(" & ");
                                }
                            }
                            if(verify_by!=''){
                                verify_by='<span class="green-checked"><i class="fa fa-check-circle" aria-hidden="true"></i></span> '+ verify_by;
                            }
                        }
                        var document_id='-';
                        if(typeof userVerifyData!='undefined' && typeof userVerifyData.doc_id!='undefined' && userVerifyData.doc_id!=''){
                            document_id = userVerifyData.doc_id;
                        }
                        
                        var attachment_exist='Details';
                         if(typeof userVerifyData!='undefined' && typeof userVerifyData.doc_url!='undefined' && userVerifyData.doc_url!=''){
                            attachment_exist = '<i class="fa fa-paperclip" aria-hidden="true"></i>&nbsp;&nbsp;Details';
                        }

                        var C_className = (index%2==1) ? "even" : "odd";
                        var verifydate_timestamp = '';
                        if(last_verify_date!=''){
                            verifydate_timestamp =  moment(last_verify_date,'DD/MM/YYYY').format("X");
                            last_verify_date = moment(last_verify_date,'DD/MM/YYYY').format('DD-MMM-YYYY');
                        }
                        html += '<tr class="'+C_className+'"><td><span style="display:none;">'+created_timestamp+'</span>'+formatedDate+'</td><td>'+tab_type+'</td><td>'+doc_type+'</td><td><span style="display:none">'+verifydate_timestamp+'</span>'+last_verify_date+'</td><td><a class="show_verify_data_popup" data-id="'+userVerifyData.id+'" href="javascript:;">'+verify_by+'</a></td><td><a href="javascript:;" class="show_verify_data_popup" data-id="'+userVerifyData.id+'">'+attachment_exist+'</a></td></tr>';
                    });
                }
                $("#upload_history tbody").html(html);
            }
        }
    });
}

$('form#form_verify_request').submit(function (event) {
    $('#connection_input').val($('#connection').val());
    var ajax_url  = '/store_user_verify_request';
    var source_id = '';
    var form_id  = '#form_verify_request';
    if($('input[name="to_verify_data"]').is(':checked')) {
        $('#to_verify_data').val('1');
    } else {
        $('#to_verify_data').val('');
    }
    if($('input[name="to_verify_doc"]').is(':checked')) {
        $('#to_verify_doc').val('1');
    } else {
        $('#to_verify_doc').val('');
    }
    
    StoreModalData(ajax_url,source_id,form_id,'');
    event.preventDefault();
    $('#connection_input').val('');
});

$('input[name="to_verify_data"]').on("change", function() {
    if ($(this).prop( 'checked' ) === false && $('input[name="to_verify_doc"]').prop( 'checked' ) === false) {
        $('input[name="to_verify_doc"]').prop('checked', true);
    }
});

$('input[name="to_verify_doc"]').on("change", function() {
    if ($(this).prop( 'checked' ) === false && $('input[name="to_verify_data"]').prop( 'checked' ) === false) {
        $('input[name="to_verify_data"]').prop('checked', true);
    }
});