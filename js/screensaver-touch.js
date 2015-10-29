/**
 * Screensaver-touch.js
 * Adapted from screensaver.js @ https://github.com/scimusmn/kiosk_video_player/blob/master/src/js/screensaver.js
 * After X minutes of inactivity, snap back to slide one.
 */

$(function() {

  // Start the clock
  idleTime = 0;

  // How long is timeout
  timeoutSeconds = 30;

  // Increment the idle time counter every minute.
  idleInterval = setInterval('timerIncrement()', 1000);// 1 second

  // Zero the idle timer on movement.
  $(this).bind('touchstart keypress mousemove', function(e) {
    idleTime = 0;
  });

});

/**
 * Start the screensaver after X seconds of inactivity.
 */
function timerIncrement() {

  idleTime = idleTime + 1;

  // If it's been X seconds of inactivity, save the screen
  if (idleTime > timeoutSeconds) {

    // Reset to first slide w English
    changeLanguage('en');
    $('.my-gallery').swipeshow().goTo(0);
    idleTime = 0;

  }

}
