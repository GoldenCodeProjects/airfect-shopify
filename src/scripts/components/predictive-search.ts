import { debounceTime, filter, fromEvent, map, mergeMap, switchMap, throwError } from "rxjs";

declare global {
  interface Window {
    routes: any;
  }
}

class PredictiveSearch extends HTMLElement {
  private overlayCreated = false;

  private input: HTMLInputElement = this.querySelector('input[type="search"]');
  private closeBtn: HTMLButtonElement = this.querySelector('button[close]');
  private resultsWrapper: HTMLElement = this.querySelector('#results-wrapper');

  private routes = window.routes;

  private form: HTMLFormElement = this.querySelector('form');

  constructor() {
    super();
  }

  connectedCallback() {
    this.closeBtn.addEventListener('click', this.close.bind(this))
    this.setSearcher();
    this.desactivateForm();
  }

  desactivateForm() {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
    })
  }

  private setSearcher() {
    const event$ = fromEvent(this.input, 'input');
    event$.pipe(
      debounceTime(250),
      map((event: any) => event.target.value.trim()),
      filter((value: string) => value.length > 0),
      switchMap((value: string) => {
        const url = `${this.routes.predictiveSearch}?q=${value}&resources[type]=product,collection,article&resources[limit]=10&section_id=predictive-search`;
        return fetch(url)
      }),
      mergeMap(async (response) => {
        if (!response.ok) {
          const error = new Error(String(response.status));
          this.close();
          return throwError(() => error);
        }
        return await response.text();
      }),
      map((text: string) =>
        new DOMParser().parseFromString(
          text, 'text/html'
        ).querySelector(
          '#predictive-search-results'
        ).innerHTML
      )
    ).subscribe({
      next: (result) => {
        this.resultsWrapper.innerHTML = result
      },
      error: (error) => {
        console.error(error)
      }
    });
  }

  public open() {
    this.classList.add('-active');
    this.input.focus();
    document.documentElement.style.overflow = 'hidden';
    if (!this.overlayCreated) this.createOverlay();
  }

  public close() {
    this.classList.remove('-active');
    document.documentElement.style.overflow = 'auto';
    this.input.value = '';
    this.resultsWrapper.innerHTML = '';
    this.removeOverlay();
  }

  private createOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add('predictive-search-overlay');
    document.body.appendChild(overlay);
    overlay.addEventListener('click', this.close.bind(this));
    this.overlayCreated = true;
  }

  private removeOverlay() {
    const overlay = document.querySelector('.predictive-search-overlay');
    if (overlay) overlay.remove();
    overlay.removeEventListener('click', this.close.bind(this));
    this.overlayCreated = false;
  }
}
customElements.define('predictive-search', PredictiveSearch)


class OpenSearch extends HTMLElement {
  button: HTMLButtonElement = this.querySelector('button');
  search: PredictiveSearch = document.querySelector('predictive-search');

  constructor() {
    super();
    this.button.addEventListener('click', this.open.bind(this));
  }

  open() {
    this.search.open();
  }
}
customElements.define('open-search', OpenSearch);
