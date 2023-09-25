import * as cart from '@shopify/theme-cart'
import Toastify from 'toastify-js'

if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super()

        this.form = this.querySelector('form')
        this.form.querySelector('[name=id]').disabled = false
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this))
        this.cartComponent = document.querySelector('cart-component')
      }

      onSubmitHandler(evt) {
        evt.preventDefault()
        const submitButton = this.querySelector('[type="submit"]')
        if (submitButton.classList.contains('-loading')) return

        this.handleErrorMessage()

        submitButton.setAttribute('aria-disabled', true)
        submitButton.classList.add('-loading')
        this.querySelector('.loading-overlay__spinner').classList.remove(
          'u-hide'
        )

        const id = new FormData(this.form).get('id')
        console.log(id)

        cart
          .addItem(Number(id))
          .then(this.onSuccess.bind(this))
          .catch(this.onError.bind(this))
          .finally(() => {
            fbq('track', 'AddToCart');
            document.querySelectorAll('cart-icon').forEach((icon) => {
              console.log(icon)
              icon.calculateItems()
            })
            submitButton.removeAttribute('aria-disabled', true)
            submitButton.classList.remove('-loading')
            this.querySelector('.loading-overlay__spinner').classList.add(
              'u-hide'
            )
          })
      }

      onSuccess(cart) {
        console.dir(cart)
        document.querySelector('cart-component').addItem()
        Toastify({
          text: 'Producto agregado al carrito',
          duration: 300000,
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

      handleErrorMessage(errorMessage = false) {
        this.errorMessageWrapper =
          this.errorMessageWrapper ||
          this.querySelector('.product-form__error-message-wrapper')
        this.errorMessage =
          this.errorMessage ||
          this.errorMessageWrapper.querySelector('.product-form__error-message')

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage
          this.errorMessageWrapper.classList.remove('u-hide')
        } else {
          this.errorMessage.textContent = ''
          this.errorMessageWrapper.classList.add('u-hide')
        }
      }
    }
  )
}
