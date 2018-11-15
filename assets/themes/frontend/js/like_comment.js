/* Edit action on Comment and Comment reply */
$(document).on("click",".btneditComment",function(event){
    var comment_id = $(this).data("comment_id");
    var comment_text = $(this).data("text");
    
    var html = "<form method='POST' class='EditComment'>";
    html += "<input type='hidden' name='id' value='"+comment_id+"'>";

    if(comment_text=='reply'){
        var parents = $(this).parents(".comment-reply");
        var comments = parents.find(".comment-text").text();
        html += "<input type='text' name='comments' value='"+comments+"'>";
    }else{
        var parents = $(this).parents(".main-comment");
        var comments = parents.find(".comment-text").text();
        html += "<input type='text' name='comments' value='"+comments+"'>";
    }
    html += "<a href='javascript:;' class='btnEditCancel'><i class='fa fa-times'></i></a>";
    html += "</form>";
    parents.find(".comment-text").html(html);
});

/* Cancel Edit Comment and Comment reply */
$(document).on("click",".btnEditCancel",function(event){
    var parents = $(this).parents(".EditComment");
    var comments = parents.find("input[name='comments']").val();
    parents.replaceWith(comments);
});

/* Delete Comment and Comment reply */
$(document).on("click",".deleteComment",function(event){
    var comment_id = $(this).data("comment_id");
    var comment_text = $(this).data("text");
    if(comment_text=='reply'){
        var parents = $(this).parents(".comment-reply");
    }else{
        var parents = $(this).parents(".main-comment");
    }

    $.confirm({content:"Are You Sure To Delete Comment?",
        header: "Delete",
        confirm:function () {
            $.ajax({
                url: '/deleteComment/'+comment_id,
                method: 'GET',
                success: function(results)
                {
                    if(results.status=='OK'){
                        parents.remove();
                    }else{
                        $.bootstrapGrowl(results.message, {type: 'danger', delay: 2000});
                    }
                }
            });
        },
        cancel:function () {
            console.log('confirm')
        }
    });
});

/* Update Comment*/

$(document).on("submit", ".EditComment", function (event) {
    event.preventDefault();
    var this_self = $(this);
    var formData = new FormData( this );
    $.ajax({
        url: '/updateComment',
        method: 'POST',
        data:  formData,
        mimeType:"multipart/form-data",
        processData: false,
        contentType: false,
        success: function(results)
        {
            var json_obj = jQuery.parseJSON( results );
            if(json_obj.status=='OK'){
                this_self.replaceWith(json_obj.data.comments);
            }else{
                $.bootstrapGrowl(json_obj.message, {type: 'danger', delay: 1000});
            }
        }
    });
});

$("#file-input").on("change", function(e) {
    var files = e.target.files,
        filesLength = files.length;
    for (var i = 0; i < filesLength; i++) {
        var f = files[i]
        var fileReader = new FileReader();
        fileReader.onload = (function(e) {
            var file = e.target;
            
            var html = '<span class="pip">';
            html += '<div class="col-md-3"><img class="imageThumb img-responsive img-thumbnail" src="'+e.target.result+'" title="'+file.name+'">';
            html += '<span class="remove p51_feed_video_share_button"><i class="fa fa-trash"></i></span></div></span>';
            $("#displayImages").css("display","none");
            $("#displayImages").append(html);
            $(document).on("click",".remove",function(e){
                $(this).parents(".pip").remove();
            });
        });
        fileReader.readAsDataURL(f);
    }
    uploadFiles();
});

function uploadFiles(){
    ajaxindicatorstart('LOADING');
    var form = $("#createFeed")[0]; // You need to use standard javascript object here
    var formData = new FormData(form);
    $.ajax({
        type: 'POST',
        url: "/uploadFiles",
        data:  formData,
        processData: false,
        contentType: false,
        enctype: 'multipart/form-data',
        success: function (response)
        {
            if(response.status=="OK"){
                var Datahtml = "";
                $.each(response.data, function( index, value ) {
                    Datahtml += "<input type='hidden' name='files' value='"+value.image+"'>";
                });
                $("form#createFeed").find(".myfileuploads").append(Datahtml);
                $("#displayImages").css("display","block");
            }else{
                $.bootstrapGrowl(response.message, {type: 'danger', delay: 1000});
            }
            ajaxindicatorstop();
        }
    });
}

// Display comment pagination
$(function(){
    $( ".mycomments" ).each(function( index ) {
        $(this).children(".comment-wrap").slice(-3).show();
    });
    
    $(".see-more").click(function(e){ // click event for load more
        e.preventDefault();
        var done = $('<div class="see-more=done">done</div>');
        $(this).siblings(".comment-wrap:hidden").slice(-3).show(); // select next 5 hidden divs and show them
        if($(this).siblings(".comment-wrap:hidden").length == 0){ // check if any hidden divs
            $(this).replaceWith(''); // if there are none left
        }
    });
});

// Like Comment
$(document).on("click",".btncommentlike",function(){
    comment_id = $(this).data('cid');
    var parents = $(this).parents(".comment-wrap");
    feed_id = parents.data('fid');
    var closest = $(this).closest(".comment-wrap");
   
    $.ajax({
        url: '/likecomment/'+feed_id+'/'+comment_id+'/1',
        method: 'POST',
        success: function(results)
        {
            if(results.status=='OK'){
                closest.find('.totalcomtlikes').text(results.totallikes);
                // parents.find('.btndislike').removeClass("active");
            }
            else{
                $.bootstrapGrowl(results.message, {type: 'danger', delay: 2000});
            }
        }
    });
});

// Accept Request from other user
$(document).on("click",".btnaccept",function(){
    var parents = $(this).parents('li');
    var user_id = $(this).val();
    $.ajax({
        url: '/acceptRequest/'+user_id,
        method: 'GET',
        success: function(results)
        {
            console.log(results);
            if(results.status=='OK'){
				user_id = results.user_id;
				send_notification(user_id);
                $.bootstrapGrowl(results.message, {type: 'success', delay: 2000});
                parents.remove();
            }
            else{
                $.bootstrapGrowl(results.message, {type: 'danger', delay: 2000});
            }
        }
    });
});

// Reject Request from other user
$(document).on("click",".btnreject",function(){
    var parents = $(this).parents('li');
    var user_id = $(this).val();
    $.ajax({
        url: '/rejectRequest/'+user_id,
        method: 'GET',
        success: function(results)
        {
            if(results.status=='OK'){
                $.bootstrapGrowl(results.message, {type: 'success', delay: 2000});
                parents.remove();
            }
            else{
                $.bootstrapGrowl(results.message, {type: 'danger', delay: 2000});
            }
        }
    });
});

// Dislike / undislike feed
$(document).on("click",".btndislike",function(){
    var parents = $(this).parents('.feed_list');
    var feed_id = parents.data('id');
    
    $.ajax({
        url: '/like/'+feed_id+'/2',
        method: 'POST',
        success: function(results)
        {
            if(results.status=='OK'){
               
                parents.find('.btnlike').removeClass("active");
                parents.find('.total_likes').text(" "+results.totalLikes+" Likes");
                parents.find('.total_dislikes').text(" "+results.totalDislikes+" Dislikes");
            }
            else{
                $.bootstrapGrowl(results.message, {type: 'danger', delay: 2000});
            }
        }
    });
});
// Like / Unlike feed
$(document).on("click",".btnlike",function(){
    var parents = $(this).parents('.feed_list');
    var feed_id = parents.data('id');
    var owner_id = $(this).parents('div[data-owner_id]').attr("data-owner_id");
    $.ajax({
        url: '/like/'+feed_id+'/1',
        method: 'POST',
        data : {owner_id :owner_id },
        success: function(results)
        {
            if(results.status=='OK'){
                owner_id = results.owner_id;
                send_notification(owner_id);

                parents.find('.btndislike').removeClass("active");
                parents.find('.total_likes').text(" "+results.totalLikes+" Likes");
                parents.find('.total_dislikes').text(" "+results.totalDislikes+" Dislikes");
            }
            else{
                $.bootstrapGrowl(results.message, {type: 'danger', delay: 2000});
            }
        }
    });
});

// Send request
$(".userknown").submit(function(event) {
    event.preventDefault();
    var formData = new FormData( this );
    var parents = $(this).parents('.peopleyouknow');
    $.ajax({
        url: '/sendRequest',
        method: 'POST',
        data:  formData,
        mimeType:"multipart/form-data",
        processData: false,
        contentType: false,
        success: function(results)
        {
            var json_obj = jQuery.parseJSON( results );
            if(json_obj.status == 'OK'){
				user_id = json_obj.user_id;
				send_notification(user_id);
                $.bootstrapGrowl(json_obj.message, {type: 'success', delay: 2000});
                parents.remove();
            }
            else{
                $.bootstrapGrowl(json_obj.message, {type: 'danger', delay: 2000});
            }
        }
    });
});

// Comment on feed
// $(".commentForm").submit(function(event) {
$(document).on("submit", ".commentForm", function (event) {
 
    event.preventDefault();
    var this_self = $(this);
    var parents = $(this).parents('.list_connection');
    owner_id = $(this).parents('div[data-owner_id]').attr("data-owner_id");
    var formData = new FormData( this );
    formData.append("owner_id", owner_id);
    $.ajax({
        url: '/feedComment',
        method: 'POST',
        data:  formData,
        mimeType:"multipart/form-data",
        processData: false,
        contentType: false,
        success: function(results)
        {
            data = results;
            try {
               var json_obj = jQuery.parseJSON(data);
                if(json_obj.status=="Error"){
                    $.bootstrapGrowl("Please enter comment first", {type: 'danger', delay: 1000});
                }
                return false;
            } catch (e) {
                if($(this_self).hasClass('formReply')){
                    $(this_self).before(data);
                    parents.find(".formReply").css("display","none");
                } else {
                    var total_string = parents.find(".total_comments").text();
                    var total_comments = total_string.match(/-?\d+\.?\d*/);
                    var a = parseInt(total_comments, 10);
                    var b = parseInt(1, 10);
                    total = a+b;
                    parents.find(".total_comments").text(total+" Comments");
                    parents.find(".mycomments").append(data);
                }
                parents.find('textarea[name="comments"]').val("");
                owner_id = $(data).attr("owner_id");
                send_notification(owner_id);
                return false;
            }
        }
    });
});

// Open comment reply form
$(document).on("click",".btncommentreply", function(){
    $(this).parents('.comment-wrap').find('.formReply').css("display","block");
});

// Apply Job
$(document).on("click",".btnEasyApply",function(){
    $(".resume_file_name").html('');
    var parents = $(this).parents('.feed_list');
    var feed_id = parents.data('id');
    $.ajax({
        url: '/getjjobcompanyname/'+feed_id,
        method: 'GET',
        success: function(results)
        {
            if(results.status=='OK'){
                if(typeof results.response.company_id != 'undefined'){
                    $(".followtocomp").text("Follow "+results.response.company_id.company_name);
                    $(".applytocomp").text("Appy to "+results.response.company_id.company_name);
                    $('input[name="company_id"]').val(results.response.company_id.id);
                }else{
                    $(".followtocomp").text("Follow");
                    $(".applytocomp").text(results.response.title);

                    $('input[name="company_id"]').val('');
                }
                $('input[name="job_id"]').val(results.response.id);

            }
            $('#myModal').modal('show');
        }
    });
});


$(document).on("submit", "#applyingForm", function (event) {
    event.preventDefault();
    var formData = new FormData( this );
    $.ajax({
        url: '/applyjob',
        method: 'POST',
        data:  formData,
        mimeType:"multipart/form-data",
        processData: false,
        contentType: false,
        success: function(results)
        {
            var json_obj = jQuery.parseJSON( results );
            if(json_obj.status=='OK'){
                $("#applyingForm")[0].reset();
                $.bootstrapGrowl(json_obj.msg, {type: 'success', delay: 1000});
                $('#myModal').modal('hide');
            }else{
                $.bootstrapGrowl(json_obj.msg, {type: 'danger', delay: 1000});
            }
        }
    });
});


$(document).on("click",".btnHide",function(){
    var action = $(this).text();
    var parents = $(this).parents(".list_connection");
    var feed_id = parents.find(".feed_list").data("id");

    $.confirm({content:"Are you sure to "+action+"?",
        header: "Delete",
        confirm:function () {
            $.ajax({
                url: '/feedspams',
                method: 'POST',
                data:{ feed_id:feed_id, spamtext:action},
                success: function(results)
                {
                    if(results.status=='OK'){
                        $.bootstrapGrowl(results.message, {type: 'success', delay: 2000});
                        parents.remove();
                    }else{
                        $.bootstrapGrowl(results.message, {type: 'danger', delay: 2000});
                    }
                }
            });
        },
        cancel:function () {
            console.log('confirm')
        }
    });
});

$(document).on("click",".btnSpam",function(){
    var action = $(this).text();
    var parents = $(this).parents(".list_connection");
    var feed_id = parents.find(".feed_list").data("id");
    
    $.confirm({content:"Are you sure to "+action+"?",
        header: "Delete",
        confirm:function () {
            $.ajax({
                url: '/feedspams',
                method: 'POST',
                data:{ feed_id:feed_id, spamtext:action, sendEmail:1},
                success: function(results)
                {
                    if(results.status=='OK'){
                        $.bootstrapGrowl(results.message, {type: 'success', delay: 2000});
                        parents.remove();
                    }else{
                        $.bootstrapGrowl(results.message, {type: 'danger', delay: 2000});
                    }
                }
            });
        },
        cancel:function () {
            console.log('confirm')
        }
    });

});

$(document).on("click",".btnBlockUser",function(){
    var action = $(this).text();
    var parents = $(this).parents(".list_connection");
    var owner_id = parents.find(".feed_list").data("owner_id");
    $.confirm({content:"Are you sure to "+action+"?",
        header: "Block",
        confirm:function () {
            window.location.href = '/blockuser/'+owner_id;
        },
        cancel:function () {
            console.log('confirm')
        }
    });
});


$(document).on("click",".btnDeleteMedia",function(){
    var parents = $(this).parents(".DeleteMedia");
    var mediaID = parents.data("id");

    $.confirm({content:"Are you sure to delete this image?",
        header: "Delete",
        confirm:function () {
            ajaxindicatorstart('LOADING');
            $.ajax({
                url: '/deleteFeedmedia',
                method: 'POST',
                data:{id:mediaID},
                success: function(results)
                {
                    if(results.status=='OK'){
                        $.bootstrapGrowl(results.message, {type: 'success', delay: 2000});
                        parents.remove();
                    }else{
                        $.bootstrapGrowl(results.message, {type: 'danger', delay: 2000});
                    }
                    ajaxindicatorstop();
                }
            });
        },
        cancel:function () {
            console.log('confirm')
        }
    });
});

// $(document).on("click","body",function(){
//     alert("HERE");
//     var self_c = $(this);
//     var list_connection = self_c.find(".list_connection");
//     list_connection.find(".wrc").addClass("hide");
//     list_connection.find(".spamRecords").removeClass("hide");
// });

// $(document).on("click",".btnReportPost",function(){
//     var parents = $(this).parents(".p51_feed_post");
//     parents.find(".p51_feed_post_more_info").addClass("open");
//     parents.find(".wrc").addClass("hide");
//     parents.find(".spamRecords").removeClass("hide");
// });

$(document).on("click",".btnDeleteFeed",function(){
    var parents = $(this).parents('.feed_list');
    var feed_id = parents.data('id');
    $.confirm({content:"Are you sure you want to delete the post?",
        header: "Delete",
        confirm:function () {
            var url = "/deleteFeed/"+feed_id;
            window.location.href = url;
        },
        cancel:function () {
            console.log('confirm')
        }
    });
});

$(document).ready(function(){
    $(document).on("click",".dropdown-submenu button", function(e){
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });
});