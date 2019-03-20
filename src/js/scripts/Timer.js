export default function Timer (start) {
  if (start === true) {
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
    })();

    var lastTime = (new Date()).getTime();
    var displayNode = document.getElementById('timer');
    var numSeconds = 0;
    (function timer() {
      requestAnimFrame(timer);
      var currentTime = (new Date()).getTime();

      if (currentTime - lastTime >= 1000) {
        lastTime = currentTime;
        numSeconds++;
        displayNode.innerText = numSeconds;
      }
    }());
}
else {
  numSeconds = 0;
}
};