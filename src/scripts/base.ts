import '@fortawesome/fontawesome-free/js/all.js'
import './components/modal'

declare global {
  interface Window {
    Shopify: any
  }
}

console.log('Hello from Theme Layout 👋.')

window.onload = () => {
  const cartElement = document.querySelector('cart-component') as any
  const hashUrl = window.location.hash

  switch (hashUrl) {
    case '#cart':
      cartElement.open()
      break
    case '#checkout':
      cartElement.openCheckout()
      break
    default:
      break
  }

  document.querySelector('component-loader').classList.remove('loading')
}

const fields = document.querySelectorAll('.c-field');
fields.forEach(field => {
  const label = field.querySelector('.c-field_label') as HTMLLabelElement;
  const input = field.querySelector(`#${label.getAttribute('for')}`) as HTMLInputElement;
  field.addEventListener('click', () => {
    input && input.focus();
  });
});

/*
 * Shopify Common JS
 *
 */
class CountryProvinceSelector {
  countryEl
  provinceEl
  provinceContainer

  constructor(
    country_domid,
    province_domid,
    options
  ) {
    this.countryEl = document.getElementById(country_domid)
    this.provinceEl = document.getElementById(province_domid)
    this.provinceContainer = document.getElementById(
      options['hideElement'] || province_domid
    )

    window.Shopify.addListener(
      this.countryEl,
      'change',
      window.Shopify.bind(this.countryHandler, this)
    )

    this.initCountry();
    this.initProvince();
  }

  initCountry() {
    var value = this.countryEl.getAttribute('data-default')
    window.Shopify.setSelectorByValue(this.countryEl, value)
    this.countryHandler()
  }

  initProvince() {
    var value = this.provinceEl.getAttribute('data-default')
    if (value && this.provinceEl.options.length > 0) {
      window.Shopify.setSelectorByValue(this.provinceEl, value)
    }
  }

  countryHandler(e?: Event) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex]
    var raw = opt.getAttribute('data-provinces')
    var provinces = JSON.parse(raw)

    this.clearOptions(this.provinceEl)
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none'
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option') as any
        opt.value = provinces[i][0]
        opt.innerHTML = provinces[i][1]
        this.provinceEl.appendChild(opt)
      }

      this.provinceContainer.style.display = ''
    }
  }

  clearOptions(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild)
    }
  }

  setOptions(selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option')
      opt.value = values[i]
      opt.innerHTML = values[i]
      selector.appendChild(opt)
    }
  }
}

class Shopify {
  CountryProvinceSelector = CountryProvinceSelector

  constructor() {
  }

  bind(fn, scope) {
    return function () {
      return fn.apply(scope, arguments)
    }
  }

  setSelectorByValue(selector, value) {
    for (var i = 0, count = selector.options.length; i < count; i++) {
      var option = selector.options[i]
      if (value == option.value || value == option.innerHTML) {
        selector.selectedIndex = i
        return i
      }
    }
  }

  addListener(target, eventName, callback) {
    target.addEventListener
      ? target.addEventListener(eventName, callback, false)
      : target.attachEvent('on' + eventName, callback)
  }

  postLink(path, options, cb) {
    options = options || {}
    var method = options['method'] || 'post'
    var params = options['parameters'] || {}

    var form = document.createElement('form')
    form.setAttribute('method', method)
    form.setAttribute('action', path)

    for (var key in params) {
      var hiddenField = document.createElement('input')
      hiddenField.setAttribute('type', 'hidden')
      hiddenField.setAttribute('name', key)
      hiddenField.setAttribute('value', params[key])
      form.appendChild(hiddenField)
    }
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)

    if (cb) {
      cb()
    }
  }
}

window.Shopify = new Shopify()

// Policies
const policy_container = document.querySelector('.shopify-policy__container')
if (policy_container) {
  policy_container.querySelectorAll('table').forEach((table) => {
    const newTable = document.createElement('div')
    newTable.classList.add('responsive-table')
    table.append((document.createElement('caption').innerText = '-»'))
    newTable.innerHTML = table.outerHTML
    table.parentNode.replaceChild(newTable, table)
  })
}
