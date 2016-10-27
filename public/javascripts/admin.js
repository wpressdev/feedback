$(document).ready(function(){
    // code to get all records from table via select box
    $("#fcompanies").on("change", function() {
        var string = $(this).find(":selected").val().split('+');
        var id = string[0];
        $.ajax({
            url:'send_feedback_link',
            type: 'GET',
            data: id,
            success: function(result) {
                $('#showdata').html(result);
                window.location.href = '/send_feedback_link/' + id;
            }
        });
    });

    // code to apply sorting and search
    $(function(){
        $('table').tablesorter({
                widgets        : ['zebra', 'columns'],
                usNumberFormat : false,
                sortReset      : true,
                sortRestart    : true
        });
    });
    $(".search").keyup(function () {
        var searchTerm = $(".search").val();
        var listItem = $('.results tbody').children('tr');
        var searchSplit = searchTerm.replace(/ /g, "'):containsi('");

      $.extend($.expr[':'], {'containsi': function(elem, i, match, array){
            return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
        }
      });

      $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function(e){
        $(this).attr('visible','false');
      });

      $(".results tbody tr:containsi('" + searchSplit + "')").each(function(e){
        $(this).attr('visible','true');
      });

      var jobCount = $('.results tbody tr[visible="true"]').length;
        $('.counter').text(jobCount + ' item');

      if(jobCount === '0') {$('.no-result').show();}
        else {$('.no-result').hide();}
    });
});

