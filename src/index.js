import './styles/main.scss';

// Add your code here

const target = document.querySelector('.target');

animate({width: 200, height: 200}, {width: 400, height: 400})
  .duration(2000)
  .ease('easeInOutQuint')
  .step(obj => {
    target.style.width = obj.width + 'px';
    target.style.height = obj.height + 'px';
  })
  .play();

function animate(obj, end) {
  const easingFuncs = {
    linear: t => t,
    easeInQuad: t => t**2,
    easeOutQuad: t => t*(2-t),
    easeInOutQuad: t => t<.5 ? 2*t**2 : -1+(4-2*t)*t,
    easeInQuart: t => t**4,
    easeOutQuart: t => 1-(--t)*t**3,
    easeInOutQuart: t => t < .5?8*t**4 : 1-8*(--t)*t**3,
    easeInQuint: t => t**5,
    easeOutQuint: t => 1+(--t)*t**4,
    easeInOutQuint: t => t<.5 ? 16*t**5 : 1+16*(--t)*t**4
  };

  let start;
  let options = {
    easing: easingFuncs.linear,
    duration: 1000,
    step: () => {}
  };

  function iterate() {
    const now = new Date();
    const diff = now.getTime() - start.getTime();

    const interpolated = {};
    Object.keys(end).forEach(key => {
      const eased = options.easing(diff / options.duration);
      interpolated[key] = interpolate(eased, obj[key], end[key]);
    });
    options.step(interpolated);

    if (diff < options.duration) {
      requestAnimationFrame(iterate);
    }
  }

  function interpolate(t, start, end) {
    return start + ((end - start) * t);
  }

  return {
    play: function() {
      start = new Date();
      iterate();
      return this;
    },
    duration: function(duration) {
      options.duration = duration;
      return this;
    },
    ease: function(cb) {
      if (typeof cb === 'string') {
        options.easing = easingFuncs[cb];
      }
      if (typeof cb === 'function') {
        options.easing = cb;
      }
      return this;
    },
    step: function(cb) {
      options.step = cb;
      return this;
    }
  };
}