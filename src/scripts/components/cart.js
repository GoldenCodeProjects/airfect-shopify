import * as cart from '@shopify/theme-cart'
import * as currency from '@shopify/theme-currency'
import Toastify from 'toastify-js'


const deleteItemKey = (key) => {
  cart
    .removeItem(key)
    .then((cart) => {
      console.dir(cart)
      document.querySelector('cart-component').removeItem(key)
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
      document.querySelectorAll('cart-icon').forEach((icon) => {
        icon.calculateItems()
      })
    })
}

class CartComponent extends HTMLElement {
  constructor() {
    super()
    this.itemsElement = this.querySelector('#items')
    this.closeBtn = this.querySelector('button[close]')
    this.total = this.querySelector('#total')
    this.butnowBtn = this.querySelector('#buynow')
  }

  connectedCallback() {
    this.total.innerText = currency.formatMoney(0)
    this.addEventListener('mousedown', (e) => e.target === this && this.close())
    this.closeBtn.addEventListener('click', () => this.close())
    this.renderSectionFromFetch()
  }

  open() {
    this.classList.add('-active')
    document.documentElement.style.overflow = 'hidden'
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
    item.querySelector('[quantity]').value = quantity
    this.updateTotal()
  }

  removeItem(key) {
    this.itemsElement.querySelector(`.product-item[data-key="${key}"]`).remove()
    this.updateTotal()
  }
}

customElements.define('cart-component', CartComponent)

class CartIcon extends HTMLElement {
  constructor() {
    super()
    this.button = this.querySelector('button')
    this.itemsQuantity = 0
  }

  connectedCallback() {
    this.calculateItems()
    this.button.addEventListener('click', () => {
      document.querySelector('cart-component').open()
    })
  }

  setItemsQuantity(quantity) {
    this.itemsQuantity = quantity
    this.button.querySelector('.data-quantity').innerHTML = quantity
  }

  calculateItems() {
    cart.getState().then((cart) => {
      this.setItemsQuantity(cart.item_count)
    })
  }
}

customElements.define('cart-icon', CartIcon)

class AddProductButton extends HTMLElement {
  constructor() {
    super()
    this.button = this.querySelector('button')
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
        document.querySelectorAll('cart-icon').forEach((icon) => {
          console.log(icon)
          icon.calculateItems()
        })
      })
  }

  onSuccess(cart) {
    console.dir(cart)
    document.querySelector('cart-component').addItem()
    Toastify({
      text: 'Producto agregado al carrito',
      duration: 3000,
      gravity: 'top',
      position: 'right',
      offset: { y: 120 },
      close: true,
    }).showToast()
  }

  onError(error) {
    console.error(error)
    Toastify({
      text: 'Ya no es posible agregar mas productos',
      duration: 3000,
      gravity: 'top',
      position: 'right',
      offset: { y: 120 },
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
    super.onCorrectAdd(cart)
    location.href = '/checkout'
  }

  onError(error) {
    super.onError(error)
    location.href = '/checkout'
  }
}

customElements.define('buy-now-button', BuyNowButton)

class UpdateProduct extends HTMLElement {
  constructor() {
    super()
    this.upBtn = this.querySelector('button[up]')
    this.downBtn = this.querySelector('button[down]')
    this.quantity = this.querySelector('input')
    this.key = this.getAttribute('key')
    this.max = this.getAttribute('max') | 100000
    this.oldQuantity = 1
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
      this.quantity.value = this.max
    } else if (newQuantity <= 0) {
      this.quantity.value = 0
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
          document
            .querySelector('cart-component')
            .updateItem(item.key, item.quantity)

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
          document.querySelectorAll('cart-icon').forEach((icon) => {
            icon.calculateItems()
          })
        })
    } else if (quantity > this.max) {
      this.quantity.value = this.max
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
    this.oldQuantity = this.quantity.value
    this.eventButtons()
  }

  disconnectedCallback() {
    this.quantity.removeEventListener('change', this.changeQuantity.bind(this))
  }
}

customElements.define('update-quantity', UpdateProduct)

class RemoveProductButton extends HTMLElement {
  constructor() {
    super()
    const key = this.dataset.key
    this.button = this.querySelector('button')
    this.button.addEventListener('click', deleteItemKey.bind(this, key))
  }
}

customElements.define('remove-product-button', RemoveProductButton)
