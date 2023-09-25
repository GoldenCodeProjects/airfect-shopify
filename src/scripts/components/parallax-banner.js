import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger)

class ParallaxBanner extends HTMLElement {

  primary;
  object;

  constructor() {
    super();
    this.primary = this.querySelector('img.primary');
    this.object = this.querySelector('img.object');
    console.log(this.primary, this.object)
  }

  connectedCallback() {
    this.parralax();
  }

  parralax() {
    gsap.to(this.primary, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.75,
        markers: false,
        start: 'top top'
      },
      yPercent: -50
    });
    gsap.to(this.object, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.75,
        markers: false,
        start: 'top top'
      },
      y: 400
    });
  }

}

customElements.define('parallax-banner', ParallaxBanner)
