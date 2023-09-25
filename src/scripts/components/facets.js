import 'dile-checkbox/dile-checkbox.js'
import 'paper-range-slider/paper-range-slider'
import '@mat3e-ux/stars'
import { debounce } from './../utils/debounce'

const addListeners = () => {
  // Change inputs on checkbox change
  document.querySelectorAll('dile-checkbox[data-target]').forEach((checkbox) =>
    checkbox.addEventListener('dile-checkbox-changed', (event) => {
      const checkbox = document.getElementById(event.target.dataset.target)
      checkbox.checked = event.detail
    })
  )

  // Update inputs on change slider
  document
    .querySelector('paper-range-slider')
    .addEventListener('updateValues', (customEvent) => {
      const slider = customEvent.detail.this
      document.getElementById(slider.dataset.inputMin).value = slider.valueMin
      document.getElementById(slider.dataset.inputMax).value = slider.valueMax
    })
}

class FacetFiltersForm extends HTMLElement {
  constructor() {
    super()
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this)

    this.debouncedOnSubmit = debounce((event) => {
      event.preventDefault()
      this.onSubmitHandler(event)
    }, 500)

    const typeOfInputs = [
      'submit',
      'change',
      'input',
      'dile-checkbox-changed',
      'updateValues',
    ]
    typeOfInputs.forEach((type) =>
      this.querySelector('form').addEventListener(
        type,
        this.debouncedOnSubmit.bind(this)
      )
    )

    const facetWrapper = this.querySelector('#FacetsWrapperDesktop')
    if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape)

    const screen = matchMedia('(max-width: 993px)')
    screen.onchange = (event) => {
      if (event.matches) {
        document.getElementById('FacetFiltersForm').classList.add('-mobile')
      } else {
        document.getElementById('FacetFiltersForm').classList.remove('-mobile')
      }
    }

    if (document.documentElement.clientWidth <= 993) {
      document.getElementById('FacetFiltersForm').classList.add('-mobile')
    }
  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state
        ? event.state.searchParams
        : FacetFiltersForm.searchParamsInitial
      if (searchParams === FacetFiltersForm.searchParamsPrev) return
      FacetFiltersForm.renderPage(searchParams, null, false)
    }
    window.addEventListener('popstate', onHistoryChange)
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable)
    })
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    FacetFiltersForm.searchParamsPrev = searchParams
    const sections = FacetFiltersForm.getSections()
    const countContainer = document.getElementById('ProductCount')
    const countContainerDesktop = document.getElementById('ProductCountDesktop')
    document.getElementById('products-grid').classList.add('-loading')
    if (countContainer) {
      countContainer.classList.add('-loading')
    }
    if (countContainerDesktop) {
      countContainerDesktop.classList.add('-loading')
    }

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`
      const filterDataUrl = (element) => element.url === url

      FacetFiltersForm.filterData.some(filterDataUrl)
        ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event)
        : FacetFiltersForm.renderSectionFromFetch(url, event)
    })

    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams)
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText
        FacetFiltersForm.filterData = [
          ...FacetFiltersForm.filterData,
          { html, url },
        ]
        FacetFiltersForm.renderFilters(html, event)
        FacetFiltersForm.renderProductGridContainer(html)
        FacetFiltersForm.renderProductCount(html)
        document.getElementById('products-grid').classList.remove('-loading')
      })
  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html
    FacetFiltersForm.renderFilters(html, event)
    FacetFiltersForm.renderProductGridContainer(html)
    FacetFiltersForm.renderProductCount(html)
    document.getElementById('products-grid').classList.remove('-loading')
  }

  static renderProductGridContainer(html) {
    document.getElementById('products-grid').innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('products-grid').innerHTML
  }

  static renderProductCount(html) {
    const count = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('ProductCount').innerHTML
    const container = document.getElementById('ProductCount')
    const containerDesktop = document.getElementById('ProductCountDesktop')
    container.innerHTML = count
    container.classList.remove('-loading')
    if (containerDesktop) {
      containerDesktop.innerHTML = count
      containerDesktop.classList.remove(-'loading')
    }
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html')

    const facetDetailsElements = parsedHTML.querySelectorAll(
      '#FacetFiltersForm .filter-group[input-type]'
    )

    const matchesIndex = (element) => {
      const jsFilter = event
        ? event.target.closest('.filter-group[input-type]')
        : undefined
      return jsFilter ? element.dataset.index === jsFilter.dataset.index : false
    }

    const facetsToRender = Array.from(facetDetailsElements).filter(
      (element) => !matchesIndex(element)
    )

    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex)

    facetsToRender.forEach((element) => {
      document.querySelector(
        `.filter-group[data-index="${element.dataset.index}"]`
      ).innerHTML = element.innerHTML
    })

    FacetFiltersForm.renderActiveFacets(parsedHTML)
    FacetFiltersForm.renderAdditionalElements(parsedHTML)
    addListeners()

    if (countsToRender)
      FacetFiltersForm.renderCounts(
        countsToRender,
        event.target.closest('.filter-group[input-type]')
      )
  }

  static renderActiveFacets(html) {
    const activeFacetElementSelectors = [
      '.active-filters',
      '.active-filters-mobile',
    ]

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector)
      if (!activeFacetsElement) return
      document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML
    })

    FacetFiltersForm.toggleActiveFacets(false)
  }

  static renderAdditionalElements(html) {
    const elementSelectors = ['.sorting']

    elementSelectors.forEach((selector) => {
      if (!html.querySelector(selector)) return
      document.querySelector(selector).innerHTML =
        html.querySelector(selector).innerHTML
    })

    //document.getElementById('FacetFiltersFormMobile').closest('menu-drawer').bindEvents();
  }

  static renderCounts(source, target) {
    const targetElements = target.querySelectorAll(
      '.filter-group_summary-selected, .group-display_header'
    )
    const sourceElements = source.querySelectorAll(
      '.filter-group_summary-selected, .group-display_header'
    )

    if (!targetElements || !sourceElements) return

    Array.from(targetElements).forEach((element, index) => {
      element.outerHTML = sourceElements[index].outerHTML
    })
  }

  static updateURLHash(searchParams) {
    history.pushState(
      { searchParams },
      '',
      `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`
    )
  }

  static getSections() {
    return [
      {
        section: document.getElementById('products-grid').dataset.id,
      },
    ]
  }

  onSubmitHandler(event) {
    const formData = new FormData(event.target.closest('form'))
    const searchParams = new URLSearchParams(formData).toString()
    FacetFiltersForm.renderPage(searchParams, event)
  }

  onActiveFilterClick(event) {
    event.preventDefault()
    FacetFiltersForm.toggleActiveFacets()
    const url =
      event.currentTarget.href.indexOf('?') == -1
        ? ''
        : event.currentTarget.href.slice(
            event.currentTarget.href.indexOf('?') + 1
          )
    FacetFiltersForm.renderPage(url)
  }
}

FacetFiltersForm.filterData = []
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1)
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1)
customElements.define('facet-filters-form', FacetFiltersForm)
FacetFiltersForm.setListeners()
addListeners()

class openFilter extends HTMLElement {
  constructor() {
    super()
    this.button = this.querySelector('button')
    this.form = document.querySelector('facet-filters-form')
    this.button.addEventListener('click', this.open.bind(this))
  }

  open(event) {
    event.preventDefault()
    this.form.querySelector('form').classList.toggle('-open')
  }
}

customElements.define('open-filter', openFilter)

class FacetRemove extends HTMLElement {
  constructor() {
    super()
    this.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault()
      const form =
        this.closest('facet-filters-form') ||
        document.querySelector('facet-filters-form')
      form.onActiveFilterClick(event)
    })
  }
}

customElements.define('facet-remove', FacetRemove)

class ViewType extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          gap: 0.5rem;
          position: relative;
          width: fit-content;
          height: auto;
          --color-btn-bg: rgba(0, 0, 0, 1);
          --color-btn-text: rgba(255, 255, 255, 1);
        }
        :host([hidden]) {
          display: none;
        }
      </style>
      <slot></slot>
    `
    this.buttons = this.querySelectorAll('button')
    this.buttons.forEach((button) =>
      button.addEventListener('click', this.onButtonClick.bind(this, button))
    )
  }

  onButtonClick(button, event) {
    event.preventDefault()
    this.buttons.forEach((button) => button.classList.remove('-active'))
    button.classList.add('-active')
    /** @type {string} */
    const viewType = button.dataset.viewType
    this.changeGridType(viewType)
    this.saveViewType(viewType)
  }

  getViewType() {
    return localStorage.getItem('viewType') || 'grid'
  }

  saveViewType(viewType) {
    localStorage.setItem('viewType', viewType)
  }

  changeGridType(gridType) {
    if (gridType === 'grid') {
      this.setGridType()
    } else {
      this.setListType()
    }
  }

  setGridType() {
    document.querySelector('#products-grid').classList.add('-grid')
    document.querySelector('#products-grid').classList.remove('-list')
  }

  setListType() {
    document.querySelector('#products-grid').classList.remove('-grid')
    document.querySelector('#products-grid').classList.add('-list')
  }

  connectedCallback() {
    const actualType = this.getViewType()
    this.changeGridType(actualType)
    this.buttons.forEach(
      (button) =>
        button.dataset.viewType === actualType &&
        button.classList.add('-active')
    )
  }
}

customElements.define('view-type', ViewType)
