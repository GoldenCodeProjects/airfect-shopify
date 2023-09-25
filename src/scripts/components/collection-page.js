import { fromFetch } from 'rxjs/fetch';
import { switchMap, of, catchError, shareReplay, throwError, map, take, Subject, tap } from 'rxjs';

class AutoPartsList extends HTMLElement {

  ENDPOINT = 'https://kat-manager.herokuapp.com/api/v1/products/collections'
  parts = this.querySelector('.parts')

  constructor() {
    super()
  }

  connectedCallback() {
    this.collections$.subscribe(this.renderImages.bind(this));
  }

  get collections$() {
    return fromFetch(this.ENDPOINT).pipe(
      take(1),
      switchMap(response =>
        response.ok ?
          response.json() :
          throwError(
            ()=> ({ error: true, message: `Error ${response.status}` })
          )
      ),
      catchError(err => {
        console.error(err);
        return of({ error: true, message: err.message })
      }),
      shareReplay(2)
    );
  }

  getImageTag(src, width) {
    const img = document.createElement('img')
    img.src = src + '&width=' + width
    return img
  }

  renderImages(collections) {
    if(collections?.error) return
    const links = collections.map(collection => {
      const link = document.createElement('a')
      link.classList.add('collection')
      link.href = '/collections/' + collection.handle
      link.append(this.getImageTag(collection.image.src, 100))
      link.innerHTML += collection.title
      return link
    })

    if(!this.parts) return
    this.parts.innerHTML = ''
    this.parts.append(...links)
  }
}

customElements.define('parts-list', AutoPartsList)


class ProductsGrid extends HTMLElement {
  ENDPOINT = 'https://kat-manager.herokuapp.com/api/v1/products/all'

  /** @type {AutoPartsList | null} */
  collectionElement = document.querySelector('parts-list')
  mainElement = document.body.querySelector('main')

  productsCount = document.querySelector('#products-count')

  loading = true;
  lastPage = false;
  skip = 0

  searcher$ = new Subject()

  constructor() {
    super()
  }

  connectedCallback() {
    this.setSearcher()
    this.searchNow()
    window.addEventListener("scroll", this.handleInfiniteScroll.bind(this))
  }

  getCollectionHandle() {
    return location.pathname.replace('/collections/', '')
  }

  objectToParams(params) {
    return new URLSearchParams(params).toString()
  }

  paramsToObject(entries) {
    const result = {}
    for(const [key, value] of entries) {
      result[key] = value;
    }
    return result;
  }

  setSearcher() {
    this.searcher$.pipe(
      map(() => this.getCollectionHandle()),
      map(collectionTag => {
        const entries = new URLSearchParams(location.search).entries();
        const params = this.paramsToObject(entries);
        return { ...params, skip: this.skip, collection: collectionTag }
      }),
      map(object => this.objectToParams(object)),
      switchMap(queryParams => fromFetch(`${this.ENDPOINT}?${queryParams}`)),
      switchMap(response =>
        response.ok ?
          response.json() :
          throwError(
            ()=> ({ error: true, message: `Error ${response.status}` })
          )
      ),
      map(({ products, count }) => {
        if(this.productsCount) this.productsCount['innerText'] = count
        return products
      }),
      catchError(err => {
        console.error(err);
        return of({ error: true, message: err.message })
      })
    ).subscribe(this.renderProducts.bind(this));
  }

  searchNow() {
    this.loading = true;
    this.searcher$.next('');
  }

  handleInfiniteScroll = () => {
    if(this.loading || this.lastPage) return
    const endOfPage = (window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 300);
    if (!endOfPage) return

    this.loading = true;
    this.insertSkeletons(10)
    this.skip += 10;
    this.searchNow()
  }

  insertSkeletons(quantity) {
    const skeletons = [];
    for (let index = 0; index < quantity; index++) {
      const skeleton = document.createElement('skeleton-load')
      skeleton.classList.add('product', '-skeleton')
      skeletons.push(skeleton)
    }
    this.append(...skeletons);
  }

  removeSkeletons() {
    this.querySelectorAll('skeleton-load').forEach(skeleton => skeleton.remove());
  }

  renderProducts(products) {
    this.removeSkeletons()
    if(!products.length) {
      this.insertNoneProduct()
      window.removeEventListener('scroll', this.handleInfiniteScroll.bind(this))
      return
    }

    this.loading = false
    this.classList.remove('-loading')

    const items = this.getProductsTags(products)
    this.drawProducts(items)
  }

  insertNoneProduct() {
    const header = document.createElement('h4')
    header.classList.add('no-products', 'c-heading', '-h2')
    header.innerText = 'No hay mas productos'
    this.append(header);
  }

  getProductsTags(products) {
    return products.map(product => {
      const link = document.createElement('a')
      link.classList.add('product')
      link.href = '/products/' + product.handle
      link.title = product.title
      link.innerHTML = `
        <div class="product_image">
          ${product.images[0] ? `
            <img src="${product.images[0]}&width=250">
          ` : `
            <img src="https://cdn.shopify.com/s/files/1/0552/2315/6798/files/Group_796.png?v=1664473928">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20.001" height="14" viewBox="0 0 20.001 14">
                  <path id="box-open" d="M13.262,38.964a1.515,1.515,0,0,1-1.294-.731L9.959,34.9,7.953,38.233a1.52,1.52,0,0,1-1.3.734,1.437,1.437,0,0,1-.416-.059L1.959,37.683v5.562a1,1,0,0,0,.756.969L9.471,45.9a2.031,2.031,0,0,0,.969,0L17.2,44.214a1,1,0,0,0,.756-.969V37.683L13.677,38.9A1.437,1.437,0,0,1,13.262,38.964Zm6.644-3.506L18.3,32.245a.51.51,0,0,0-.522-.278l-7.815,1,2.866,4.753a.514.514,0,0,0,.578.228l6.184-1.766a.515.515,0,0,0,.319-.722ZM1.621,32.245.012,35.458a.509.509,0,0,0,.316.719l6.184,1.766a.514.514,0,0,0,.578-.228l2.869-4.75-7.819-1a.511.511,0,0,0-.519.278Z" transform="translate(0.042 -31.963)" fill="#131d53"/>
                </svg>
                ${product.unitsPerPackage}
              </p>
            ` : ''}
          </div>
        </div>
      `
      return link
    })
  }

  drawProducts(items) {
    this.append(...items)
  }
}

customElements.define('products-grid', ProductsGrid)
