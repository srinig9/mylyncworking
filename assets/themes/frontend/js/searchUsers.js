jQuery(function($){
    $("#searchUserbox").Watermark("Search");
});

$(document).ready(function(){

    $("#searchUserbox").keyup(function(){
        var selfData = $(this);
        var findData = selfData.data("result");
        var searchbox = $(this).val();
        // var dataString = 'searchword='+ searchbox+'&filter='+findData;
        // alert(dataString);
        if(searchbox=='')
        {
            $("#displaysearchUsers").html("").show();
        }
        else
        {

            $.ajax({
                type: "POST",
                url: "/profile/searchUsers",
                data: {searchword:searchbox, filter:findData},
                cache: false,
                success: function(results)
                {
                    $("#displaysearchUsers").html(results.data).show();
                }
            });
        }return false;
    });
});

$(document).on("click",".display_box",function(){
    var user_id = $(this).data("id");
    var user_name = $(this).data("name");
    $("#displaysearchUsers").hide();
    $("#searchUserbox").val(user_name);
    $("#search_user_id").val(user_id);
});