// Change title on page focus
window.onblur = function() {
  document.title = "Where'd you go? ツ";
};
window.onfocus = function() {
  document.title = "{{ page.title }} | Zachary Espiritu";
};

// Lazysizes configuration
window.lazySizesConfig = {
  addClasses: true
};

// Smooth anchor scrolling
$(document).ready(function(){
  $('a[href*=#]').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var $target = $(this.hash);
      $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
      if ($target.length) {
        var targetOffset = $target.offset().top;
        $('html,body').animate({scrollTop: targetOffset}, 1000);
        return false;
      }
    }
  });
});
