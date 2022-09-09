export const showPassword = function (inputPassword, iconshow, iconclose) {
    let btnOpen = document.querySelector(`.form--login ${iconshow}`);
    let input = document.querySelector(`.form--login ${inputPassword}`);
    let btnClose = document.querySelector(`.form--login ${iconclose}`);
    btnClose.classList.add('hienClass');
    btnClose.addEventListener('click', function (e) {
      this.classList.remove('hienClass');
      input.setAttribute('type', 'text');
      btnOpen.classList.add('hienClass');
    });
    btnOpen.addEventListener('click', function (e) {
      this.classList.remove('hienClass');
      input.setAttribute('type', 'password');
      btnClose.classList.add('hienClass');
    });
};
export const smoothScroll = function(x, duration){
  var target = document.querySelector(x);
  var targetPosition = target.getBoundingClientRect().top;
  // console.log(targetPosition);
  // window.scrollTo(0, targetPosition.top + window.pageYOffset);

  var startPosition = window.pageYOffset; //0
  var distance = targetPosition + window.pageYOffset - startPosition;
  var startTime = null;
  function animation(currentTime){
      if(startTime===null) startTime = currentTime;
      var timeElapse  = currentTime - startTime;
      console.log("Current: ", currentTime);  
      var run = ease(timeElapse, startPosition, distance, duration);
      console.log("KQ: ", run);
      window.scrollTo(0, run);
      if(timeElapse<duration) requestAnimationFrame(animation);
  }
  function ease (t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
      t--;
      return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
  };       
  requestAnimationFrame(animation);
}