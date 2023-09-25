import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger)

class ScrollingImages extends HTMLElement {

  constructor() {
    super()
    /** @type {HTMLTemplateElement} */
    this.line = this.querySelector('template[name]')
    this.images = [...this.line.content.cloneNode(true).children]
    this.startFrom = this.getAttribute('startFrom')
    this.attachShadow({ mode: "open" });
  }

  get styles() {
    const style = document.createElement('style')
    style.innerHTML = `
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
      }
      :host .line {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        opacity: 1;
      }
      :host .line_wrapper{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        position: absolute;
        width: 100%;
        height: auto;
        ${this.startFrom === 'top' ? 'top: 0;' : 'bottom: 0;'}
      }
      :host .line_wrapper img{
        width: 100%;
        height: auto;
      }
    `
    return style
  }

  get HTML() {
    const line = document.createElement('div')
    line.classList.add('line')
    line.append((() => {
      const wrapper = document.createElement('div')
      wrapper.classList.add('line_wrapper')
      wrapper.append(...(() => {
        this.images.push(...this.images.map(image => image.cloneNode(true)))
        return this.images
      })())
      return wrapper
    })())
    return line
  }

  render() {
    this.shadowRoot.prepend(this.styles, this.HTML)
  }

  connectedCallback() {
    this.render()
    this.scrolling()
  }

  scrolling() {
    const line = this.shadowRoot.querySelector('.line')
    const wrapper = this.shadowRoot.querySelector('.line_wrapper')
    const height = line.clientHeight
    const scrollTo = this.startFrom === 'top' ? height * -1 : height
    gsap.to(wrapper, {
      scrollTrigger: {
        trigger: line,
        toggleActions: 'restart pause reverse pause',
        scrub: true
      },
      y: scrollTo
    })
  }

}

customElements.define('scrolling-images', ScrollingImages)
