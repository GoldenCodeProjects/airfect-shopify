if (localStorage.getItem('visited')) {
  document
    .querySelector('.shopify-section.last-seen')
    .classList.remove('u-hide')

  const lastSeen = JSON.parse(
    localStorage.getItem('visited')
  ).last_seen.reverse()
  const urls = lastSeen.map(
    (item) => `${item.url}?section_id=individual-product`
  )

  Promise.all(urls.map((url) => fetch(url)))
    .then((responses) =>
      Promise.all(
        responses
          .filter((response) => response.ok)
          .map((response) => response.text())
      )
    )
    .then((data) =>
      data.map((item) =>
        new DOMParser()
          .parseFromString(item, 'text/html')
          .querySelector('.c-product-card')
      )
    )
    .then((productsTemplates) => {
      const container = document.getElementById('containerLastSeen')
      container.append(...productsTemplates)
    })
} else {
  document.querySelector('.shopify-section.last-seen').remove()
}
