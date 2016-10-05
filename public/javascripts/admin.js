$(document).ready(function(){
    $('.location').on('change', function(e){
        e.preventDefault();
        var id = $(this).val();
        //if(confirm('Do you want to remove: ' + $(this).data().page)){
            $.ajax({
                url: '/feedback_link/' + id,
                type: 'GET',
                data: {id: $(this).data().id},
                //alert($(this).data().userid);
                success: function() {
                    window.location.href = '/feedback_link'
                }
            });
        //}
    });
});
