import { fromFetch } from 'rxjs/fetch';
import { switchMap, of, catchError, debounceTime, fromEvent, map, filter, tap, throwError } from 'rxjs';

class PredictiveSearch extends HTMLElement {
  constructor() {
    super()
    this.apiUrl = `https://kat-manager.herokuapp.com/api/v1/products/all`
    this.rendering = this.getAttribute('render') === 'true'

    this.form = this.querySelector('form[role="search"]')
    this.input = this.querySelector('input[type="search"]')
    this.closeBtn = this.querySelector('button[close]')
    this.submitBtn = this.querySelector('#submit-bottom')
    this.submitBtnText = this.querySelector('#submit-bottom span')

    this.predictiveSearchContainer = this.querySelector('#predictive-search')
    this.predictiveSearchResults = this.querySelector('#predictive-search-results')
    this.overlayCreated = false
    this.items = []
  }

  get searchUrlParam() {
    return new URLSearchParams(location.search).get('search')
  }

  connectedCallback() {
    if(this.searchUrlParam) this.input.value = this.searchUrlParam
    this.setListeners();
  }

  setListeners() {
    this.closeBtn && this.closeBtn.addEventListener('click', this.close.bind(this));
    this.onFormSubmit()

    if(!this.rendering) return

    this.onInputChange()
    this.submitBtn && this.submitBtn.addEventListener('click', () => this.gotoSearch(this.input.value))
  }

  onInputChange() {
    return fromEvent(this.input, 'input').pipe(
      debounceTime(500),
      map((event) => String(event.target.value).trim()),
      tap(search => {
        if(!this.submitBtnText) return
        this.submitBtnText.innerHTML = `Buscar “${search}”`
      }),
      tap(search => search.length ? this.open() : this.close()),
      filter(Boolean),
      switchMap(search => fromFetch(`${this.apiUrl}?search=${search}`)),
      switchMap(response =>
        response.ok ?
          response.json() :
          throwError(
            ()=> ({ error: true, message: `Error ${response.status}` })
          )
      ),
      map(({ products }) => products),
      catchError(err => {
        console.error(err);
        return of({ error: true, message: err.message })
      })
    ).subscribe(this.renderProducts.bind(this))
  }

  onFormSubmit() {
    return fromEvent(this.form, 'submit').pipe(
      tap(event => event.preventDefault()),
      map(() => this.input.value.trim()),
      filter(Boolean)
    ).subscribe(this.gotoSearch.bind(this))
  }

  gotoSearch(search) {
    location.assign(`${location.origin}/collections/all?search=${search}`)
  }

  /**
   * @param {any[]} products
   */
  renderProducts(products) {
    this.predictiveSearchResults.innerHTML = ''
    this.items = products.map(product => {
      const item = document.createElement('a')
      item.classList.add('product')
      item.href = `/products/${product.handle}`
      item.innerHTML = `
        <div class="product_image">
          ${product.images[0] ? `
            <img src="${product.images[0]}&width=250">
          ` : `
            <img src="http://cdn.shopify.com/s/files/1/0552/2315/6798/t/10/assets/placeholder.jpg?v=75785057495450869431669680134">
          `}
        </div>
        <div class="product_content">
          <div class="product_info">
            <h3 class="product_title">${product.title}</h3>
            <p class="product_description">${product.description}</p>
            ${product.aplication ? `
              <p class="product_application">
                <strong>Aplicación:</strong>
                ${product.aplication}
              </p>
            ` : ''}
            ${product.unitsPerPackage ? `
              <p class="product_items">
                <strong>Items:</strong>
                ${product.unitsPerPackage}
              </p>
            ` : ''}
          </div>
        </div>
      `
      return item
    })
    this.predictiveSearchResults.append(...this.items)
  }

  open() {
    if(!this.rendering) return
    this.classList.remove('-hide')
    this.input.focus()
    document.documentElement.style.overflow = 'hidden'
    if (!this.overlayCreated) this.createOverlay()
  }

  close() {
    if(!this.rendering) return
    this.classList.add('-hide')
    document.documentElement.style.overflow = 'auto'
    this.input.value = ''
    this.removeOverlay()
  }

  createOverlay() {
    const overlay = document.createElement('div')
    overlay.classList.add('predictive-search-overlay')
    document.body.appendChild(overlay)
    overlay.addEventListener('click', this.close.bind(this))
    this.overlayCreated = true
  }

  removeOverlay() {
    const overlay = document.querySelector('.predictive-search-overlay')
    if (!overlay) return
    overlay.remove()
    overlay.removeEventListener('click', this.close.bind(this))
    this.overlayCreated = false
  }
}

customElements.define('predictive-search', PredictiveSearch)

class OpenSearch extends HTMLElement {
  constructor() {
    super()
    this.button = this.querySelector('button')
    this.searchElement = document.querySelector('predictive-search')
    this.button.addEventListener('click', this.open.bind(this))
  }

  open() {
    this.searchElement.open()
  }
}

customElements.define('open-search', OpenSearch)
