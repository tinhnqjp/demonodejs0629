
$(document).ready(function(){
    //Check to see if the window is top if not then display button
    $(window).scroll(function(){
        if ($(this).scrollTop() >= 50) {
            $('#moveTop').fadeIn();
        } else {
            $('#moveTop').fadeOut();
        }
    });

    $('#moveTop').click(function(){
        $('html, body').animate({scrollTop : 0},200);
        return false;
    });
});