!function(){"use strict";var e,t={4496:function(e,t,s){var n=s(6536),r=s(4727),o=s(4978),i=s(3610),a=s(9878),c=s(2817),l=s(8515),d=s(6716),h=s(9127);class u extends HTMLElement{constructor(){super(),this.ENDPOINT="https://kat-manager.herokuapp.com/api/v1/products/collections",this.parts=this.querySelector(".parts")}connectedCallback(){this.collections$.subscribe(this.renderImages.bind(this))}get collections$(){return(0,n.U)(this.ENDPOINT).pipe((0,r.q)(1),(0,o.w)((e=>e.ok?e.json():(0,i._)((()=>({error:!0,message:`Error ${e.status}`}))))),(0,a.K)((e=>(console.error(e),(0,c.of)({error:!0,message:e.message})))),(0,l.d)(2))}getImageTag(e,t){const s=document.createElement("img");return s.src=e+"&width="+t,s}renderImages(e){if(e?.error)return;const t=e.map((e=>{const t=document.createElement("a");return t.classList.add("collection"),t.href="/collections/"+e.handle,t.append(this.getImageTag(e.image.src,100)),t.innerHTML+=e.title,t}));this.parts&&(this.parts.innerHTML="",this.parts.append(...t))}}customElements.define("parts-list",u);class p extends HTMLElement{constructor(){super(),this.ENDPOINT="https://kat-manager.herokuapp.com/api/v1/products/all",this.collectionElement=document.querySelector("parts-list"),this.mainElement=document.body.querySelector("main"),this.productsCount=document.querySelector("#products-count"),this.loading=!0,this.lastPage=!1,this.skip=0,this.searcher$=new d.x,this.handleInfiniteScroll=()=>{this.loading||this.lastPage||window.innerHeight+window.pageYOffset>=document.body.offsetHeight-300&&(this.loading=!0,this.insertSkeletons(10),this.skip+=10,this.searchNow())}}connectedCallback(){this.setSearcher(),this.searchNow(),window.addEventListener("scroll",this.handleInfiniteScroll.bind(this))}getCollectionHandle(){return location.pathname.replace("/collections/","")}objectToParams(e){return new URLSearchParams(e).toString()}paramsToObject(e){const t={};for(const[s,n]of e)t[s]=n;return t}setSearcher(){this.searcher$.pipe((0,h.U)((()=>this.getCollectionHandle())),(0,h.U)((e=>{const t=new URLSearchParams(location.search).entries();return{...this.paramsToObject(t),skip:this.skip,collection:e}})),(0,h.U)((e=>this.objectToParams(e))),(0,o.w)((e=>(0,n.U)(`${this.ENDPOINT}?${e}`))),(0,o.w)((e=>e.ok?e.json():(0,i._)((()=>({error:!0,message:`Error ${e.status}`}))))),(0,h.U)((({products:e,count:t})=>(this.productsCount&&(this.productsCount.innerText=t),e))),(0,a.K)((e=>(console.error(e),(0,c.of)({error:!0,message:e.message}))))).subscribe(this.renderProducts.bind(this))}searchNow(){this.loading=!0,this.searcher$.next("")}insertSkeletons(e){const t=[];for(let s=0;s<e;s++){const e=document.createElement("skeleton-load");e.classList.add("product","-skeleton"),t.push(e)}this.append(...t)}removeSkeletons(){this.querySelectorAll("skeleton-load").forEach((e=>e.remove()))}renderProducts(e){if(this.removeSkeletons(),!e.length)return this.insertNoneProduct(),void window.removeEventListener("scroll",this.handleInfiniteScroll.bind(this));this.loading=!1,this.classList.remove("-loading");const t=this.getProductsTags(e);this.drawProducts(t)}insertNoneProduct(){const e=document.createElement("h4");e.classList.add("no-products","c-heading","-h2"),e.innerText="No hay mas productos",this.append(e)}getProductsTags(e){return e.map((e=>{const t=document.createElement("a");return t.classList.add("product"),t.href="/products/"+e.handle,t.title=e.title,t.innerHTML=`\n        <div class="product_image">\n          ${e.images[0]?`\n            <img src="${e.images[0]}&width=250">\n          `:'\n            <img src="https://cdn.shopify.com/s/files/1/0552/2315/6798/files/Group_796.png?v=1664473928">\n          '}\n        </div>\n        <div class="product_content">\n          <div class="product_info">\n            <h3 class="product_title">${e.title}</h3>\n            <p class="product_description">${e.description}</p>\n            ${e.aplication?`\n              <p class="product_application">\n                <strong>Aplicación:</strong>\n                ${e.aplication}\n              </p>\n            `:""}\n            ${e.unitsPerPackage?`\n              <p class="product_items">\n                <svg xmlns="http://www.w3.org/2000/svg" width="20.001" height="14" viewBox="0 0 20.001 14">\n                  <path id="box-open" d="M13.262,38.964a1.515,1.515,0,0,1-1.294-.731L9.959,34.9,7.953,38.233a1.52,1.52,0,0,1-1.3.734,1.437,1.437,0,0,1-.416-.059L1.959,37.683v5.562a1,1,0,0,0,.756.969L9.471,45.9a2.031,2.031,0,0,0,.969,0L17.2,44.214a1,1,0,0,0,.756-.969V37.683L13.677,38.9A1.437,1.437,0,0,1,13.262,38.964Zm6.644-3.506L18.3,32.245a.51.51,0,0,0-.522-.278l-7.815,1,2.866,4.753a.514.514,0,0,0,.578.228l6.184-1.766a.515.515,0,0,0,.319-.722ZM1.621,32.245.012,35.458a.509.509,0,0,0,.316.719l6.184,1.766a.514.514,0,0,0,.578-.228l2.869-4.75-7.819-1a.511.511,0,0,0-.519.278Z" transform="translate(0.042 -31.963)" fill="#131d53"/>\n                </svg>\n                ${e.unitsPerPackage}\n              </p>\n            `:""}\n          </div>\n        </div>\n      `,t}))}drawProducts(e){this.append(...e)}}customElements.define("products-grid",p)}},s={};function n(e){var r=s[e];if(void 0!==r)return r.exports;var o=s[e]={exports:{}};return t[e].call(o.exports,o,o.exports,n),o.exports}n.m=t,e=[],n.O=function(t,s,r,o){if(!s){var i=1/0;for(d=0;d<e.length;d++){s=e[d][0],r=e[d][1],o=e[d][2];for(var a=!0,c=0;c<s.length;c++)(!1&o||i>=o)&&Object.keys(n.O).every((function(e){return n.O[e](s[c])}))?s.splice(c--,1):(a=!1,o<i&&(i=o));if(a){e.splice(d--,1);var l=r();void 0!==l&&(t=l)}}return t}o=o||0;for(var d=e.length;d>0&&e[d-1][2]>o;d--)e[d]=e[d-1];e[d]=[s,r,o]},n.d=function(e,t){for(var s in t)n.o(t,s)&&!n.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.j=1566,function(){var e={1566:0};n.O.j=function(t){return 0===e[t]};var t=function(t,s){var r,o,i=s[0],a=s[1],c=s[2],l=0;if(i.some((function(t){return 0!==e[t]}))){for(r in a)n.o(a,r)&&(n.m[r]=a[r]);if(c)var d=c(n)}for(t&&t(s);l<i.length;l++)o=i[l],n.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return n.O(d)},s=self.webpackChunkshopify_core=self.webpackChunkshopify_core||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))}();var r=n.O(void 0,[1216],(function(){return n(4496)}));r=n.O(r)}();