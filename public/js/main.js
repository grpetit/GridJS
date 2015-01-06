$(document).ready(function () {

});

$(window).load(function () {

});


function _postResult(result){
    $.ajax({
        type: "POST",
        url: "/result",
        data: result
    })
    .done(function{
    
    })
    .fail(function{
    
    })
    
}