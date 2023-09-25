import Swiper, { Navigation, Pagination, Autoplay, EffectFade } from 'swiper'

if (customElements.get('component-carousel') === undefined) {
  class Carousel extends HTMLElement {
    constructor() {
      super()
      this.images = this.querySelectorAll('img')
      this.swiper = this.querySelector('.swiper')
      this.carousel = null
    }

    static get observedAttributes() {
      return []
    }

    attributeChangedCallback(attr, oldVal, newVal) {
      if (oldVal !== newVal) {
        this[attr] = newVal
      }
    }

    connectedCallback() {
      this.setCarousel()
    }

    setCarousel() {
      this.carousel = new Swiper(this.swiper, {
        modules: [Navigation, Pagination, Autoplay, EffectFade],
        slidesPerView: 1,
        spaceBetween: 0,
        effect: 'fade',
        speed: 700,
        autoplay: {
          delay: 4500,
          disableOnInteraction: true,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      })
    }
  }

  customElements.define('component-carousel', Carousel)
}
