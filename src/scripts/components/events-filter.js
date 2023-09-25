const yearFilter = document.querySelector('#yearFilter')
const monthFilter = document.querySelector('#monthFilter')

const query = {
  month: null,
  year: null,
}

yearFilter.setAttribute('inderterminate', 'true')
monthFilter.setAttribute('inderterminate', 'true')

const getActualYear = () => {
  const date = new Date()
  return date.getFullYear()
}

const getListOfYears = (actual, total) => {
  const years = []
  for (let i = actual; i <= total; i++) {
    years.push(i)
  }
  return years
}

yearFilter.innerHTML += `
  ${getListOfYears(getActualYear(), getActualYear() + 10)
    .map(
      (year) => `
        <option value="${year}">${year}</option>`
    )
    .join('\n')}
`

yearFilter.value = null
monthFilter.value = null

const actualUrlQuery = () => {
  const url = new URL(window.location.href)
  const path = url.pathname.split('/')
  if (!path.includes('tagged')) {
    return {
      month: null,
      year: null,
    }
  }
  const last = path[path.length - 1]
  query['month'] = last.match(/[A-Za-z]+/) ? last.match(/[A-Za-z]+/)[0] : null
  query['year'] = last.match(/[0-9]+/) ? last.match(/[0-9]+/)[0] : null

  return query
}

if (actualUrlQuery().month) {
  monthFilter.value = actualUrlQuery().month
  monthFilter.removeAttribute('inderterminate')
}

if (actualUrlQuery().year) {
  yearFilter.value = actualUrlQuery().year
  yearFilter.removeAttribute('inderterminate')
}

const goToUrl = () => {
  const filters = Object.keys(query)
    .filter((key) => query[key] !== null)
    .map((key) => query[key])
    .join('+')
  const url = new URL(window.location.href)
  const path = url.pathname.split('/')
  if (!path.includes('tagged')) {
    path.push('tagged')
  } else {
    path.pop()
  }
  if (filters) {
    path.push(filters)
  } else {
    path.indexOf('tagged') !== -1 && path.pop()
  }
  location.href = path.join('/')
}

const setQuery = (name, value) => {
  query[name] = value
}

const onChange = (e) => {
  const { target } = e
  if (target.value !== null && target.value !== 'all') {
    target.removeAttribute('inderterminate')
    setQuery(target.name, target.value)
  } else {
    target.setAttribute('inderterminate', 'true')
    target.value = null
    setQuery(target.name, null)
  }
  goToUrl()
}

yearFilter.addEventListener('change', onChange)
monthFilter.addEventListener('change', onChange)
