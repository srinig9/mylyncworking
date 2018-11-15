//send connection request
function sendConnectionRequest(user_id, ajax_url) {
    $.ajax({
        type: "POST",
        url: ajax_url,
        data: {'user_id': user_id},
        //contentType: false,
        //processData: false,
        success: function (result) {
            if (result.success == 1) {
                setTimeout(function () {
                    $.bootstrapGrowl(result.msg, {
                        type: 'success',
                        width: 'auto'
                    });
                }, 2000);
            } else {
                setTimeout(function () {
                    $.bootstrapGrowl(result.msg, {
                        type: 'danger',
                        width: 'auto'
                    });
                }, 2000);
            }
        },
        error: function (error) {
            $.bootstrapGrowl('Internal server error !', {type: 'danger', width: 'auto'});
        }
    });
}

//accept reject request
function acceptRejectRequest(id, status, ajax_url) {
    $.ajax({
        type: "POST",
        url: ajax_url,
        data: 'id=' + id + '&status=' + status,
        dataType: 'json',
        success: function (result) {
            if (result.success == 1) {
                setTimeout(function () {
                    $.bootstrapGrowl(result.msg, {
                        type: 'success',
                        width: 'auto'
                    });
                }, 2000);
            } else {
                $.bootstrapGrowl('Fail to send request', {
                    type: 'danger',
                    width: 'auto'
                });
            }
        },
        error: function (jqXhr) {
            $.toaster('Internal server error', 'Fail', 'danger');
        }
    });
}