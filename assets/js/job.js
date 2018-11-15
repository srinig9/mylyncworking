$(function(){
    $('.bookmark i').click(function() {
        job_id      = $(this).attr("job_id");
        is_bookmark = 0; 
        var bookmark = $(this);
        if ($(bookmark).hasClass('fa-bookmark-o')) {
            is_bookmark = 1;
        }
		ajaxindicatorstart('LOADING');		
        
		$.ajax({
          type: "POST",
          url: "/job/book-mark",
          data: {'job_id':job_id,'bookmark':is_bookmark},
          success: function(result){
            //result = JSON.parse(result);
            if(result.status=="OK"){
				ajaxindicatorstop();
				if ($(bookmark).hasClass('fa-bookmark-o')) {
                    $(bookmark).removeClass('fa-bookmark-o').addClass('fa-bookmark');
                } else {
                    $(bookmark).removeClass('fa-bookmark').addClass('fa-bookmark-o');
                }
				$.bootstrapGrowl(result.msg, {type: 'success', delay: 1000,width:350,align:'center'});
            } else {
				ajaxindicatorstop();
				$.bootstrapGrowl(result.msg, {type: 'danger', delay: 1000,width:350,align:'center'});
            }
        }
        });
    });
}); 