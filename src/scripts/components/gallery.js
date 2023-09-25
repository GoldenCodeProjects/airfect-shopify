import Swiper, { Thumbs, EffectFade, Navigation } from 'swiper'
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/effect-fade';
import { Fancybox } from "@fancyapps/ui";


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
  spaceBetween: 10,
  slidesPerView: 4,
  slideToClickedSlide: true,
  watchSlidesVisibility: true,
  watchSlidesProgress: true,
  breakpoints: {
    320: {
      slidesPerView: 3,
    },
    480: {
      slidesPerView: 5,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  },
})

var previews = new Swiper('.previews', {
  modules: [Thumbs, EffectFade, Navigation],
  effect: 'fade',
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  thumbs: {
    swiper: thumbs,
  },
})
