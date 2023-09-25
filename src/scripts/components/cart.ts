import * as cart from '@shopify/theme-cart'
import * as currency from '@shopify/theme-currency'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger)

const deleteItemKey = (key) => {
  cart
    .removeItem(key)
    .then((cart: any) => {
      (document.querySelector('cart-component') as unknown as CartComponent).removeItem(key)
      Toastify({
        text: 'Producto eliminado del carrito',
        duration: 3000,
        gravity: 'bottom',
        position: 'left',
        close: true,
      }).showToast()
    })
    .catch((error) => {
      console.error(error)
      Toastify({
        text: 'Ya no es posible eliminar el producto',
        duration: 3000,
        gravity: 'bottom',
        position: 'left',
        close: true,
      }).showToast()
    })
    .finally(() => {
      document.querySelectorAll('cart-icon').forEach((icon: CartIcon) => {
        icon.calculateItems()
      })
    })
}

class CartComponent extends HTMLElement {
  itemsElement: HTMLElement
  closeBtn: HTMLElement
  total: HTMLElement
  butnowBtn: HTMLElement

  titleElement: HTMLElement
  lineItemsElement: HTMLElement[]
  sideCartElement: HTMLElement
  timeline: gsap.core.Timeline

  constructor() {
    super()
    this.itemsElement = this.querySelector('#items')
    this.closeBtn = this.querySelector('button[close]')
    this.total = this.querySelector('#total')
    this.butnowBtn = this.querySelector('#buynow')

    this.titleElement = this.querySelector('h2')
    this.lineItemsElement = [];
    this.sideCartElement = this.querySelector('.cart');
    this.timeline = gsap.timeline()
  }

  connectedCallback() {
    this.total.innerText = currency.formatMoney(0)
    this.addEventListener('mousedown', (e) => e.target === this && this.close())
    this.closeBtn && this.closeBtn.addEventListener('click', () => this.close())
    this.renderSectionFromFetch()
  }

  open() {
    console.log('open')
    this.classList.add('-active')
    document.documentElement.style.overflow = 'hidden'
    this.timeline.clear(true);
    this.lineItemsElement = (Array.from(document.querySelectorAll('.product-item')) as unknown as HTMLElement[]).reverse()
    this.cartAnimate()
  }

  cartAnimate() {
    this.timeline
      .fromTo(this.sideCartElement, {
        opacity: 0,
        background: 'transparent'
      }, {
        opacity: 1,
        duration: 1.2,
        ease: 'linear'
      })
      .fromTo([
        this.titleElement,
        ...this.lineItemsElement.splice(this.lineItemsElement.length - 3).reverse(),
        this.querySelector('.subtotal')
      ], {
        xPercent: 100
      }, {
        duration: 2,
        xPercent: 0,
        ease: 'elastic.out(1, 0.5)',
        stagger: {
          each: .3
        }
      }, '<.3')
      .fromTo(this.sideCartElement, {
        background: 'transparent'
      }, {
        background: 'white',
        duration: .7,
        ease: 'linear'
      }, '<')
  }

  close() {
    this.classList.remove('-active')
    document.documentElement.style.overflow = 'auto'
  }

  updateTotal() {
    cart.getState().then((state) => {
      this.total.innerText = currency.formatMoney(state.total_price)
      if (state.item_count > 0) {
        this.butnowBtn.classList.remove('-disabled')
        this.butnowBtn.setAttribute('href', '/checkout')
      } else {
        this.butnowBtn.classList.add('-disabled')
        this.butnowBtn.setAttribute('href', '#')
      }
    })
  }

  renderSectionFromFetch() {
    const url = `/cart?sections[]=products-items`
    fetch(url)
      .then((response) => response.json())
      .then((html) => {
        html = html['products-items']
        this.itemsElement.innerHTML = new DOMParser()
          .parseFromString(html, 'text/html')
          .querySelector('.shopify-section').innerHTML
        this.lineItemsElement = Array.from(this.itemsElement.children) as unknown as HTMLElement[]
        this.updateTotal()
      })
  }

  addItem() {
    this.renderSectionFromFetch()
  }

  updateItem(key, quantity) {
    const item = this.itemsElement.querySelector(
      `.product-item[data-key="${key}"]`
    )
    const quantityElement = item.querySelector('[quantity]') as HTMLInputElement
    quantityElement.value = quantity
    this.updateTotal()
  }

  removeItem(key) {
    this.itemsElement.querySelector(`.product-item[data-key="${key}"]`).remove()
    this.updateTotal()
  }
}

customElements.define('cart-component', CartComponent)

class CartIcon extends HTMLElement {
  button = this.querySelector('button')
  quantity = this.querySelector('.data-quantity')
  itemsQuantity = 0

  cartComponent: CartComponent = document.querySelector('cart-component')

  constructor() {
    super()
  }

  connectedCallback() {
    this.calculateItems()
    this.button.addEventListener('click', () => {
      this.cartComponent.open()
    })
  }

  setItemsQuantity(quantity) {
    this.itemsQuantity = quantity
    this.quantity.innerHTML = quantity
  }

  calculateItems() {
    cart.getState().then((cart) => {
      this.setItemsQuantity(cart.item_count)
    })
  }
}

customElements.define('cart-icon', CartIcon)

class AddProductButton extends HTMLElement {

  button = this.querySelector('button')
  cartComponent: CartComponent = document.querySelector('cart-component')
  icons = document.querySelectorAll('cart-icon') as NodeListOf<CartIcon>

  constructor() {
    super()
  }

  connectedCallback() {
    this.button.addEventListener('click', this.addItem.bind(this))
  }

  addItem() {
    cart
      .addItem(Number(this.button.dataset.id))
      .then(this.onSuccess.bind(this))
      .catch(this.onError.bind(this))
      .finally(() => {
        this.icons.forEach((icon: CartIcon) => {
          console.log(icon)
          icon.calculateItems()
        })
      })
  }

  onSuccess(cart) {
    console.dir(cart)
    this.cartComponent.addItem()
    Toastify({
      text: 'Producto agregado al carrito',
      duration: 3000,
      gravity: 'bottom',
      position: 'left',
      offset: { y: 120, x: 20 },
      close: true,
    }).showToast()
  }

  onError(error) {
    console.error(error)
    Toastify({
      text: 'Ya no es posible agregar mas productos',
      duration: 3000,
      gravity: 'bottom',
      position: 'left',
      offset: { y: 120, x: 2 },
      close: true,
    }).showToast()
  }
}

customElements.define('add-product-button', AddProductButton)

class BuyNowButton extends AddProductButton {
  constructor() {
    super()
  }

  onSuccess(cart) {
    super.onSuccess(cart)
    location.href = '/checkout'
  }

  onError(error) {
    super.onError(error)
    location.href = '/checkout'
  }
}

customElements.define('buy-now-button', BuyNowButton)

class UpdateProduct extends HTMLElement {

  upBtn: HTMLButtonElement = this.querySelector('button[up]')
  downBtn: HTMLButtonElement = this.querySelector('button[down]')
  quantity: HTMLInputElement = this.querySelector('input')
  key: string = this.getAttribute('key')
  max: number = this.getAttribute('max') ? Number(this.getAttribute('max')) : 100000
  oldQuantity: number = 1

  cartComponent: CartComponent = document.querySelector('cart-component')

  icons: NodeListOf<CartIcon> = document.querySelectorAll('cart-icon')

  constructor() {
    super()
  }

  static get observedAttributes() {
    return ['key', 'max', 'oldQuantity']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue
    }
  }

  eventButtons() {
    this.upBtn.addEventListener('click', this.setQuantity.bind(this, 1))
    this.downBtn.addEventListener('click', this.setQuantity.bind(this, -1))
  }

  setQuantity(quantity) {
    const newQuantity = Number(this.quantity.value) + quantity
    if (newQuantity <= this.max && newQuantity > 0) {
      this.quantity.value = newQuantity
    } else if (newQuantity > this.max) {
      this.quantity.value = String(this.max)
    } else if (newQuantity <= 0) {
      this.quantity.value = String(0)
    } else {
      this.showErrorMessage()
    }
    this.quantity.dispatchEvent(new Event('change'))
  }

  changeQuantity(e) {
    const quantity = Number(e.target.value)
    if (quantity <= this.max && quantity > 0) {
      this.disabledElements(true)
      cart
        .updateItem(this.key, { quantity })
        .then((cart) => {
          console.dir(cart)

          const item = cart.items.find((item) => item.key === this.key)
          this.cartComponent.updateItem(item.key, item.quantity)

          this.oldQuantity = quantity
          if (this.oldQuantity <= item.quantity) {
            Toastify({
              text: 'Cantidad actualizada',
              duration: 3000,
              gravity: 'bottom',
              position: 'center',
              close: true,
            }).showToast()
          } else {
            this.showErrorMessage(item.quantity)
          }
        })
        .catch((error) => {
          console.error(error)
          this.showErrorMessage()
        })
        .finally(() => {
          this.disabledElements(false)
          this.icons.forEach((icon: CartIcon) => {
            icon.calculateItems()
          })
        })
    } else if (quantity > this.max) {
      this.quantity.value = String(this.max)
    } else if (quantity <= 0) {
      deleteItemKey(this.key)
    } else {
      this.showErrorMessage()
    }
  }

  disabledElements(disabled = true) {
    this.upBtn.disabled = disabled
    this.downBtn.disabled = disabled
    this.quantity.disabled = disabled
  }

  showErrorMessage(quantity = this.oldQuantity) {
    const message = `No se puede agregar mas de ${quantity} productos`
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'bottom',
      position: 'center',
      close: true,
    }).showToast()
  }

  connectedCallback() {
    this.quantity.addEventListener('change', this.changeQuantity.bind(this))
    this.oldQuantity = Number(this.quantity.value)
    this.eventButtons()
  }

  disconnectedCallback() {
    this.quantity.removeEventListener('change', this.changeQuantity.bind(this))
  }
}

customElements.define('update-quantity', UpdateProduct)

class RemoveProductButton extends HTMLElement {
  button = this.querySelector('button')

  constructor() {
    super()
    const key = this.dataset.key
    this.button.addEventListener('click', deleteItemKey.bind(this, key))
  }
}

customElements.define('remove-product-button', RemoveProductButton)
