import Swiper, {
  Navigation,
  Pagination,
  EffectFade,
  Autoplay,
  Lazy,
} from 'swiper'
import 'swiper/scss'
import 'swiper/scss/navigation'
import 'swiper/scss/pagination'
import 'swiper/scss/effect-fade'

if (customElements.get('component-carousel') === undefined) {
  class Carousel extends HTMLElement {
    images = this.querySelectorAll('img')
    swiper = this.querySelector('.swiper') as HTMLElement
    dinamic_height = this.getAttribute('dinamic-height')
    carousel = null

    constructor() {
      super()
      if (this.dinamic_height) {
        this.setDinaicHeight()
        window.addEventListener('resize', this.setDinaicHeight.bind(this))
      }
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

    setDinaicHeight() {
      const wiewportHeight = window.innerHeight
      const headerHeight = document.querySelector('header').offsetHeight
      const sectionNavigation = document.querySelector('header') as HTMLElement
      const navigationHeight = sectionNavigation.offsetHeight
      this.style.height = `${
        wiewportHeight - headerHeight - navigationHeight
      }px`
    }

    setCarousel() {
      this.carousel = new Swiper(this.swiper, {
        modules: [Navigation, Pagination, EffectFade, Autoplay, Lazy],
        effect: 'fade',
        fadeEffect: {
          crossFade: true,
        },
        autoplay: {
          delay: 3500,
          disableOnInteraction: true,
        },
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 700,
        preloadImages: false,
        lazy: false,
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
