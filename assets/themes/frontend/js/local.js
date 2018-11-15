$(function(){
    $("[data-load]").each(function(){
        $(this).load($(this).data("load"), function(){
        });
    });
});

// feed like and dislike buttons toggle
$(document).ready(function(){
    $(".p51_feed_post_action .active-action").click(function(){
        $(this).toggleClass("active");
    });
});

$("#slider_p8").owlCarousel({
    loop:   false,
    margin: 10,
    nav:    true,
    dots:   false,
    navText: ['<i class="fa fa-angle-up"','<i class="fa fa-angle-up"'],
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
});

$("#slider_11").owlCarousel({
    loop:   false,
    margin: 10,
    nav:    true,
    dots:   false,
    navText: ['<i class="fa fa-angle-up"','<i class="fa fa-angle-up"'],
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        1000:{
            items:3
        }
    }
});

$(function() {
    $(".meter > span").each(function() {
        $(this)
            .data("origWidth", $(this).width())
            .width(0)
            .animate({
                width: $(this).data("origWidth")
            }, 1200);
    });
});

/*$(".p51_sidebar .p51_title_container").click(function(){
    $(this).children('p51_content').slideToggle();
});
*/
$('.p51_sidebar .p51_content li').on('click', function() {
    $(this).children('span').toggleClass('open closed');
});
$(".p51_title_container").click(function(){
    $(this).parents(".p51_sidebar").find(".p51_content").slideToggle();
    if($(this).find(".open").hasClass('open')){
        $(this).find(".open").toggleClass('closed open');
    } else {
        $(this).find(".closed").toggleClass('closed open');
    }
});