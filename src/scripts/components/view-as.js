class ViewAs extends HTMLElement {
  constructor() {
    super()
    this.productsGrid = document.querySelector('products-grid')
    this.listBtn = this.querySelector('button[view="list"]')
    this.gridBtn = this.querySelector('button[view="grid"]')
    this.types = {
      box: '-box',
      list: '-list'
    }
  }

  connectedCallback() {
    if(this.savedType === '-box') this.setViewTypeAsBox()
    this.setListeners()
  }

  get savedType() {
    return localStorage.getItem('view-as') ?? '-list'
  }

  setListeners() {
    this.listBtn.addEventListener('click', this.setViewTypeAsList.bind(this))
    this.gridBtn.addEventListener('click', this.setViewTypeAsBox.bind(this))
  }

  setViewTypeAsList() {
    this.productsGrid.classList.remove(this.types.box)
    localStorage.setItem('view-as', this.types.list)
  }

  setViewTypeAsBox() {
    this.productsGrid.classList.add(this.types.box)
    localStorage.setItem('view-as', this.types.box)
  }
}

if(!customElements.get('view-as')) {
  customElements.define('view-as', ViewAs)
}
