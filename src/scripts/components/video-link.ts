class VideoLink extends HTMLElement {
  videoType = this.getAttribute('video-type')
  videoId = this.getAttribute('video-id')
  coverUrl = this.getAttribute('cover-url') || null

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  getTemplate() {
    const template = document.createElement('template')
    template.innerHTML = `
      <div class="preset">
        <slot name="btn"></slot>
        ${
          this.coverUrl
            ? `<img src="${this.coverUrl}">`
            : '<slot name="placeholder"></slot>'
        }
      </div>
      <div class="video -hide"></div>
      ${this.getStyles()}
    `
    return template
  }

  getStyles() {
    return `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
          height: 100%;
          --color-primary: #fff;
          --color-bg: #ccc;
        }

        .preset {
          position: relative;
          width: 100%;
          height: 100%;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .preset.-hide {
          opacity: 0;
          visibility: hidden;
        }

        .preset img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          pointer-events: none;
          position: relative;
          filter: blur(7px) saturate(0.6);
          z-index: 1;
          transition: filter 0.3s ease-in-out;
        }

        ::slotted(button) {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: block;
          z-index: 3;
          color: var(--color-primary) !important;
          transition: transform 0.3s linear, opacity 0.3s ease;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: var(--color-bg) !important;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0.8;
          box-shadow: 0 0 7px 1px black;
        }

        ::slotted(button:hover) {
          transform: translate(-50%, -50%) scale(1.1);
          opacity: 1;
        }

        .video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          transition: opacity 0.3s ease-in-out;
          pointer-events: none;
          background-color: black;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .video.-hide {
          opacity: 0;
          visibility: hidden;
        }

        .video iframe {
          width: 100%;
          aspect-ratio: 16/9;
          max-height: 80%;
          pointer-events: auto;
          border: none;
        }
      </style>
    `
  }

  render() {
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true))
  }

  connectedCallback() {
    this.render()
    this.events()
  }

  events() {
    this.shadowRoot
      .querySelector('slot[name="btn"]')
      .addEventListener('click', () => {
        this.shadowRoot.querySelector('.preset').classList.add('-hide')
        const video = this.shadowRoot.querySelector('.video')
        video.classList.remove('-hide')
        video.innerHTML =
          this.videoType === 'youtube'
            ? `
        <iframe src="https://www.youtube.com/embed/${this.videoId}?enablejsapi=1" class="js-youtube" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      `
            : `
        <iframe src="https://player.vimeo.com/video/${this.videoId}" class="js-vimeo" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      `
      })
  }
}

customElements.define('video-link', VideoLink)
