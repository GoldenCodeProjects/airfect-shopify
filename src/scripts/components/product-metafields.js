import { applyBindings } from "knockout";
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError, of, throwError } from 'rxjs';

const ONEPRODUCTENDPOINT = 'https://kat-manager.herokuapp.com/api/v1/products/one/:id'

const getProductHandle = () => location.pathname.replace('/products/', '')
const getProductEndpoint = (endpoint, param, value) => endpoint.replace(param, value)

const productId = getProductHandle()
const endpoint = getProductEndpoint(ONEPRODUCTENDPOINT, ':id', productId)

fromFetch(endpoint).pipe(
  switchMap(response =>
    response.ok ?
      response.json() :
      throwError(() => ({ error: true, message: `Error ${response.status}` }))
  ),
  catchError(err => of({ error: true, message: err.message }))
).subscribe({
  next: data => {
    console.log(data)
    applyBindings(data)
  },
  error: error => {
    console.log(error)
  }
})
