import Swiper, { Navigation, Autoplay } from 'swiper'
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'swiper/scss/autoplay';
import 'swiper/scss/effect-fade';

if (customElements.get('component-cards') === undefined) {
  class Cards extends HTMLElement {
    constructor() {
      super()
      this.swiper = this.querySelector('.swiper')
      this.carousel = null
      this.next = this.querySelector('.swiper-button-next')
      this.prev = this.querySelector('.swiper-button-prev')
      this.style.display = 'block'
      this.style.position = 'relative'
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
        modules: [Navigation, Autoplay],
        slidesPerView: 3,
        spaceBetween: 40,
        centeredSlides: true,
        loop: true,
        speed: 700,
        autoplay: {
          delay: 5500,
        },
        navigation: {
          nextEl: this.next,
          prevEl: this.prev,
        },
        breakpoints: {
          0: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        },
      })
    }
  }

  customElements.define('component-cards', Cards)
}
