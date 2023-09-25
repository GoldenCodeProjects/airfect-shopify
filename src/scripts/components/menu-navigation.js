import { gsap } from 'gsap'

class MenuNavigation extends HTMLElement {
  constructor() {
    super()
    this.navigation = this.querySelector('.menu')
    this.closeBtn = this.querySelector('button')
    this.closeBtn &&
      this.closeBtn.addEventListener('click', this.close.bind(this))
  }

  open() {
    this.navigation.classList.toggle('-open')
    document.documentElement.style.overflow = 'hidden'
    document.body.appendChild(this.overlay)
    gsap.fromTo('.menu-overlay', { opacity: 0 }, { opacity: 1 }).duration(0.7)
  }

  close() {
    this.navigation.classList.toggle('-open')
    document.documentElement.style.overflow = 'visible'
    gsap
      .fromTo('.menu-overlay', { opacity: 1 }, { opacity: 0 })
      .duration(0.7)
      .eventCallback('onComplete', () => {
        const overlay = document.querySelector('.menu-overlay')
        overlay.removeEventListener('click', this.close.bind(this))
        overlay.remove()
      })
  }

  get overlay() {
    const overlay = document.createElement('div')
    overlay.classList.add('menu-overlay')
    overlay.addEventListener('click', this.close.bind(this))
    return overlay
  }
}

customElements.define('menu-navigation', MenuNavigation)

class MenuOpen extends HTMLElement {
  constructor() {
    super()
    this.openBtn = this.querySelector('button')
    this.openBtn && this.openBtn.addEventListener('click', this.open.bind(this))
  }

  open() {
    document.querySelector('menu-navigation').open()
  }
}

customElements.define('menu-open', MenuOpen)
