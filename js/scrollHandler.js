$(document).ready(function() {
  //defines scrolling amount necessary to scroll
  var scrollSensitivity = 7;
  // prevents scheduling of multiple animation events
  var cur = 1;
  if (window.location.hash == "#page-2") {
    cur = 2;
  }
  // Scrolls on mouse wheel
  $(window).on('wheel', function(event) {
    if (event.originalEvent.deltaY >= scrollSensitivity) {
        if (window.location.hash != "#page-2" && cur != 2) {
          cur = 2;
          scrollToHash("#page-2");
        }
    } else if (event.originalEvent.deltaY <= -1*scrollSensitivity) {
        if (window.location.hash != "#page-1" && cur != 1) {
          cur = 1;
          scrollToHash("#page-1");
        }
    }
  });

  // Scrolls on arrow
  $(document).keydown(function(e) {
    switch(e.which) {
        case 38: // up
          if (window.location.hash != "#page-1" && cur != 1) {
            cur = 1;
            scrollToHash("#page-1");
          }

        case 40: // down
          if (window.location.hash != "#page-2" && cur != 2) {
            cur = 2;
            scrollToHash("#page-2");
          }

        default: return; // exit this handler for other keys
      }
    });

  // handles down button scrolling
  $('#down').click(function() {
    if ($(this).attr('data-hash') == "#page-2") {
      cur = 2;
      scrollToHash("#page-2");
    }
  });

  //handles window resize
  $(window).resize(function () {
    if (window.location.hash == "") {
      scrollToHashInstant("#page-1");
    } else if (window.location.hash == "#page-1") {
      scrollToHashInstant("#page-1");
    } else if (window.location.hash == "#page-2") {
      scrollToHashInstant("#page-2");
    }
  });

  // animates a scroll to a hash
  function scrollToHash(hash) {
    $(hash).children().show();
    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 600, function(){
      // Add hash (#) to URL when done scrolling (default click behavior)
      window.location.hash = hash;
      if(hash == "#page-1") {
        $("#page-2").children().hide();
      } if(hash == "#page-2") {
        $("#page-1").children().hide();
      }
    });
  }

  // instantly scrolls to a hash
  function scrollToHashInstant(hash) {
    console.log(hash);
    $(window).scrollTop($(hash).offset().top);
    window.location.hash = hash;
  }

});
