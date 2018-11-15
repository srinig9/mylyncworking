/* ============================================================
 * bootstrap-portfilter.js for Bootstrap v2.3.1
 * https://github.com/geedmo/portfilter
 * ============================================================*/
!function(d){var c="portfilter";var b=function(e){this.$element=d(e);this.stuff=d("[data-tag]");this.target=this.$element.data("target")||""};b.prototype.filter=function(g){var e=[],f=this.target;this.stuff.fadeOut("fast").promise().done(function(){d(this).each(function(){if(d(this).data("tag")==f||f=="all"){e.push(this)}});d(e).show()})};var a=d.fn[c];d.fn[c]=function(e){return this.each(function(){var g=d(this),f=g.data(c);if(!f){g.data(c,(f=new b(this)))}if(e=="filter"){f.filter()}})};d.fn[c].defaults={};d.fn[c].Constructor=b;d.fn[c].noConflict=function(){d.fn[c]=a;return this};d(document).on("click.portfilter.data-api","[data-toggle^=portfilter]",function(f){d(this).portfilter("filter")})}(window.jQuery);

$('[data-toggle="tooltip"]').tooltip();

var TxtType = function(el, toRotate, period) {
	this.toRotate = toRotate;
	this.el = el;
	this.loopNum = 0;
	this.period = parseInt(period, 10) || 2000;
	this.txt = '';
	this.tick();
	this.isDeleting = false;
};

TxtType.prototype.tick = function() {
	var i = this.loopNum % this.toRotate.length;
	var fullTxt = this.toRotate[i];

	if (this.isDeleting) {
	this.txt = fullTxt.substring(0, this.txt.length - 1);
	} else {
	this.txt = fullTxt.substring(0, this.txt.length + 1);
	}

	this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

	var that = this;
	var delta = 200 - Math.random() * 100;

	if (this.isDeleting) { delta /= 2; }

	if (!this.isDeleting && this.txt === fullTxt) {
	delta = this.period;
	this.isDeleting = true;
	} else if (this.isDeleting && this.txt === '') {
	this.isDeleting = false;
	this.loopNum++;
	delta = 500;
	}

	setTimeout(function() {
	that.tick();
	}, delta);
};

window.onload = function() {
	var elements = document.getElementsByClassName('typewrite');
	for (var i=0; i<elements.length; i++) {
		var toRotate = elements[i].getAttribute('data-type');
		var period = elements[i].getAttribute('data-period');
		if (toRotate) {
		  new TxtType(elements[i], JSON.parse(toRotate), period);
		}
	}
	// INJECT CSS
	var css = document.createElement("style");
	css.type = "text/css";
	css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
	document.body.appendChild(css);
};
	
// $(window).scroll(function() {
// 	var scroll = $(window).scrollTop();
// 	if(scroll >= 1) {
// 		/* Before login header */
// 		$("header").addClass("stickyheader"); 
// 		/* After login header */
// 		$(".mt_header_container").addClass("stickyheader"); 
// 	}
// 	else {
// 		/* Before login header */
// 		$("header").removeClass("stickyheader");
// 		/* After login header */
// 		$(".mt_header_container").removeClass("stickyheader"); 
// 	}  
// }); 

$(function(){
    $('.navbar-toggle').click(function(){
        $('.navbar-toggle').toggleClass('navbar-on');
        $('nav.navtooglec').fadeToggle();
        $('nav.navtooglec').removeClass('nav-hide');
    });
});

// Text animatin slider
// if(typeof $('#typed-strings').html() != 'undefined') {
// 	document.addEventListener('DOMContentLoaded', function() {
// 	  var typed = new Typed('#typed', {
// 		stringsElement: '#typed-strings',
// 		typeSpeed: 40,
// 		backSpeed: 40,
// 		startDelay: 1000,
// 		smartBackspace: true,
// 		loop: true,
// 		loopCount: Infinity
// 	  });
// 	});
// }

function prettyLog(str) {
  console.log('%c ' + str, 'color: green; font-weight: bold;');
}

function toggleLoop(typed) {
  if (typed.loop) {
    typed.loop = false;
  } else {
    typed.loop = true;
  }
}

$(document).ready(function(){
    //$('[name="description"]').ckeditor();
    if ($.fn.select2) {
	    $( ".location" ).select2({
	    	placeholder: "Location",
	    	allowClear: true,
	        ajax: {
	            url: "/location",
	            dataType: 'json',

	            delay: 250,
	            type: "POST",
	            data: function (params) {
	                return {
	                    key: params.term // search term
	                };
	            },
	            processResults: function (data) {
	                // parse the results into the format expected by Select2.
	                // since we are using custom formatting functions we do not need to
	                // alter the remote JSON data
	                return {
	                    results: data
	                };
	            },
	            cache: true
	        },
	        minimumInputLength: 2
		});
	}

});

$(".static-container").css({"padding-top":$('.mt_header_container').height()});


// Award page slider
$('.btn-vertical-slider').on('click', function () {
        
    if ($(this).attr('data-slide') == 'next') {
        $('#awardCarousel').carousel('next');
    }
    if ($(this).attr('data-slide') == 'prev') {
        $('#awardCarousel').carousel('prev')
    }

});
$('.btn-vertical-slider1').on('click', function () {
        
    if ($(this).attr('data-slide') == 'next') {
        $('#eventCarousel').carousel('next');
    }
    if ($(this).attr('data-slide') == 'prev') {
        $('#eventCarousel').carousel('prev')
    }

});

