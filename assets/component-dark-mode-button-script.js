!function(){"use strict";var e,t={8723:function(e,t,r){var n=r(1476),o=function(e,t,r,n){var o,i=arguments.length,s=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,n);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(s=(i<3?o(s):i>3?o(t,r,s):o(t,r))||s);return i>3&&s&&Object.defineProperty(t,r,s),s};let i=class extends n.oi{constructor(){super(),this.isDark=!1}toggleMode(){this.isDark=!this.isDark,document.documentElement.classList.toggle("is-dark")}render(){return n.dy`
      <button @click=${this.toggleMode.bind(this)} class="c-button" type="button" aria-label="Toggle dark mode">
        ${this.isDark?n.dy`<slot name="moon"></slot>`:n.dy`<slot name="sun"></slot>`}
      </button>
    `}};i.styles=n.iv`
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
  `,o([(0,n.Cb)({type:Boolean})],i.prototype,"isDark",void 0),i=o([(0,n.Mo)("dark-mode-button")],i)}},r={};function n(e){var o=r[e];if(void 0!==o)return o.exports;var i=r[e]={exports:{}};return t[e].call(i.exports,i,i.exports,n),i.exports}n.m=t,e=[],n.O=function(t,r,o,i){if(!r){var s=1/0;for(l=0;l<e.length;l++){r=e[l][0],o=e[l][1],i=e[l][2];for(var c=!0,a=0;a<r.length;a++)(!1&i||s>=i)&&Object.keys(n.O).every((function(e){return n.O[e](r[a])}))?r.splice(a--,1):(c=!1,i<s&&(s=i));if(c){e.splice(l--,1);var u=o();void 0!==u&&(t=u)}}return t}i=i||0;for(var l=e.length;l>0&&e[l-1][2]>i;l--)e[l]=e[l-1];e[l]=[r,o,i]},n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.j=9337,function(){var e={9337:0};n.O.j=function(t){return 0===e[t]};var t=function(t,r){var o,i,s=r[0],c=r[1],a=r[2],u=0;if(s.some((function(t){return 0!==e[t]}))){for(o in c)n.o(c,o)&&(n.m[o]=c[o]);if(a)var l=a(n)}for(t&&t(r);u<s.length;u++)i=s[u],n.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return n.O(l)},r=self.webpackChunkshopify_core=self.webpackChunkshopify_core||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))}();var o=n.O(void 0,[1216],(function(){return n(8723)}));o=n.O(o)}();