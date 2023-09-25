class Modal extends HTMLElement {

  isOpen = false
  closeBtns = null

  constructor() {
    super()
    this.isOpen = Boolean(this.getAttribute('open'))
    this.insert(this.innerHTML)
  }

  insert(content) {
    this.innerHTML = `
      <div class="modal-dialog">
        <button class="modal-close" aria-label="Close" close>
          &times;
        </button>
        ${content}
      </div>
    `
    this.closeBtns = this.querySelectorAll('button[close]')
  }

  connectedCallback() {
    this.setAttribute('role', 'dialog')
    this.setAttribute('aria-modal', 'true')
    this.setAttribute('aria-hidden', 'false')
    this.setAttribute('tabindex', '-1')
    this.isOpen && this.open()
    this.addEventListener('mousedown', (e) => e.target === this && this.close())
    this.addEventListener('keydown', (e) => e.keyCode === 27 && this.close())
    this.closeBtns.forEach((btn) =>
      btn.addEventListener('click', this.close.bind(this))
    )
  }

  open() {
    this.isOpen = true
    this.classList.add('-open')
    document.documentElement.setAttribute('aria-hidden', 'true')
    document.body.setAttribute('style', 'overflow: hidden')
    this.focus()
  }

  close(e?: Event) {
    if (e) e.preventDefault()
    this.isOpen = false
    this.classList.remove('-open')
    document.documentElement.removeAttribute('aria-hidden')
    document.body.removeAttribute('style')
  }
}

customElements.define('component-modal', Modal)

class OpenModal extends HTMLElement {
  target = this.getAttribute('target') || 'component-modal'
  modal = document.querySelector(this.target) as Modal
  button = this.querySelector('button') as HTMLButtonElement

  constructor() {
    super()
  }

  connectedCallback() {
    this.button.addEventListener('click', (e) => {
      e.preventDefault()
      this.modal.isOpen ? this.modal.close() : this.modal.open()
    })
  }
}

customElements.define('open-modal', OpenModal)
