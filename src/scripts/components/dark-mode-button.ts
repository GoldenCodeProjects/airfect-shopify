import { LitElement, customElement, html, property, css } from 'lit-element';

@customElement('dark-mode-button')
export class DarkModeButton extends LitElement {
  @property({ type: Boolean }) isDark = false;

  static styles = css`
    button {
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2.5rem;
      padding: 0.25rem;
      width: 2.5rem;
    }
  `;

  constructor() {
    super();
  }

  toggleMode() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('is-dark');
  }

  render() {
    return html`
      <button @click=${this.toggleMode.bind(this)} class="c-button" type="button" aria-label="Toggle dark mode">
        ${this.isDark ?
          html`<slot name="moon"></slot>` :
          html`<slot name="sun"></slot>`
        }
      </button>
    `;
  }
}
