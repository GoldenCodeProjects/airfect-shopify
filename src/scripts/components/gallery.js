import { Fancybox } from '@fancyapps/ui/src/Fancybox/Fancybox.js'
import Swiper, { Thumbs, EffectFade, Navigation } from 'swiper'

Fancybox.bind('a[preview]', {
  groupAll: true,
  on: {
    ready: () => {
      setTimeout(() => {
        document
          .querySelector('.fancybox__track')
          .setAttribute(
            'style',
            'transform: translate3d(0px, 0px, 0px) scale(1);'
          )
      }, 0)
    },
  },
})

var thumbs = new Swiper('.thumbs', {
  direction: 'vertical',
  spaceBetween: 10,
  slidesPerView: 3,
  //loop: true
})

var previews = new Swiper('.previews', {
  modules: [Thumbs, EffectFade, Navigation],
  //effect: 'fade',
  thumbs: {
    swiper: thumbs,
  },
})
