class VariantSelects extends HTMLElement {
  constructor() {
    super()
    this.addEventListener('change', this.onVariantChange)
  }

  onVariantChange() {
    this.updateOptions()
    this.updateMasterId()
    this.toggleAddButton(true, '', '-loading')
    //this.updatePickupAvailability();
    this.removeErrorMessage()

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', '-disabled')
      this.setUnavailable()
    } else {
      //this.updateMedia();
      this.updateURL()
      this.updateVariantInput()
      this.renderProductInfo()
      //this.updateShareUrl();
    }
  }

  updateOptions() {
    this.options = Array.from(
      this.querySelectorAll('select'),
      (select) => select.value
    )
  }

  /**
   * Set the current variant of all variants
   */
  updateMasterId() {
    this.currentVariant = this.getVariantData().find(
      (variant) =>
        !variant.options
          .map((option, index) => this.options[index] === option)
          .includes(false)
    )
  }

  // updateMedia() {
  //   if (!this.currentVariant) return;
  //   if (!this.currentVariant.featured_media) return;
  //   const newMedia = document.querySelector(
  //     `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
  //   );

  //   console.log(newMedia);

  //   if (!newMedia) return;
  //   const modalContent = document.querySelector(`#ProductModal-${this.dataset.section} .product-media-modal__content`);
  //   const newMediaModal = modalContent.querySelector( `[data-media-id="${this.currentVariant.featured_media.id}"]`);
  //   const parent = newMedia.parentElement;
  //   if (parent.firstChild == newMedia) return;
  //   modalContent.prepend(newMediaModal);
  //   parent.prepend(newMedia);
  //   this.stickyHeader = this.stickyHeader || document.querySelector('sticky-header');
  //   if(this.stickyHeader) {
  //     this.stickyHeader.dispatchEvent(new Event('preventHeaderReveal'));
  //   }
  //   window.setTimeout(() => {
  //     parent.scrollLeft = 0;
  //     parent.querySelector('li.product__media-item').scrollIntoView({behavior: 'smooth'});
  //   });
  // }

  /**
   * Change the url of the page to the current variant
   */
  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return
    window.history.replaceState(
      {},
      '',
      `${this.dataset.url}?variant=${this.currentVariant.id}`
    )
  }

  updateShareUrl() {
    const shareButton = document.getElementById(`Share-${this.dataset.section}`)
    if (!shareButton) return
    shareButton.updateUrl(
      `${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`
    )
  }

  /**
   * Update the variant input with the current variant id
   */
  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment`
    )
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]')
      input.value = this.currentVariant.id
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })
  }

  // updatePickupAvailability() {
  //   const pickUpAvailability = document.querySelector('pickup-availability');
  //   if (!pickUpAvailability) return;

  //   if (this.currentVariant && this.currentVariant.available) {
  //     pickUpAvailability.fetchAvailability(this.currentVariant.id);
  //   } else {
  //     pickUpAvailability.removeAttribute('available');
  //     pickUpAvailability.innerHTML = '';
  //   }
  // }

  removeErrorMessage() {
    const section = this.closest('section')
    if (!section) return
    const productForm = section.querySelector('product-form')
    if (productForm)
      productForm.handleErrorMessage(
        !this.currentVariant.available ? 'No disponible' : false
      )
  }

  renderProductInfo() {
    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`
    )
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`
        const html = new DOMParser().parseFromString(responseText, 'text/html')
        const destination = document.getElementById(id)
        const source = html.getElementById(id)

        if (source && destination) destination.innerHTML = source.innerHTML

        const price = document.getElementById(id)

        if (price) price.classList.remove('u-hide')
        price.outerHTML = html.getElementById(
          `price-${this.dataset.section}`
        ).outerHTML

        this.toggleAddButton(
          !this.currentVariant.available,
          this.currentVariant.available ? 'Agregar al carrito' : 'Agotado',
          '-loading'
        )
      })
  }

  /**
   *
   * @param {boolean} disable Disable the add to cart button and checkout button
   * @param {string} text Text to insert into the add to cart button
   * @param {string} modifyClass Class to add or remove
   */
  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(
      `product-form-${this.dataset.section}`
    )
    if (!productForm) return
    const addButton = productForm.querySelector('[name="add"]')
    const addButtonText = productForm.querySelector('[name="add"] > span')

    if (!addButton) return

    if (disable) {
      addButton.setAttribute('disabled', 'disabled')
      //if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled')
      //addButtonText.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return

    if (disable) {
      addButton.classList.add(modifyClass)
    } else {
      addButton.classList.remove(modifyClass)
    }
  }

  setUnavailable() {
    const button = document.getElementById(
      `product-form-${this.dataset.section}`
    )
    const addButton = button.querySelector('[name="add"]')
    const addButtonText = button.querySelector('[name="add"] > span')
    const price = document.getElementById(`price-${this.dataset.section}`)
    if (!addButton) return
    addButtonText.textContent = window.variantStrings.unavailable
    if (price) price.classList.add('visibility-hidden')
  }

  /**
   * Get the variants json inside the form
   * @returns {object} The variants data json
   */
  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent)
    return this.variantData
  }
}

customElements.define('variant-selects', VariantSelects)
