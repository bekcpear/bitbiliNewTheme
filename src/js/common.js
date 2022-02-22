/*
 * Author: @cwittlut <i@bitbili.net>
 * License: GPLv2
 * */

import {LitElement, html, css} from 'lit';

function lSGet(name) {
  return localStorage.getItem(name);
}
function lSSet(name, value) {
  return localStorage.setItem(name, value);
}
function lSRM(name) {
  return localStorage.removeItem(name);
}

function getCompSty(e, p) {
  return window.getComputedStyle(e, null).getPropertyValue(p);
}


/*
 *  Solve left-side table of contents
 */
var leftSide
var bodyCover
var toc
var header
var main
var footer
var sourceCodeCover
var lsName = 'hideLeftSide'
var lsLast = null
/*export class LeftSide extends LitElement {
  createRenderRoot() {
    return this;
  }
  render() {
    debugger;
    return toc.cloneNode(true);
  }
}*/
class BodyCover extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      z-index: 999;
      background-color: var(--bg-source-c);
    }
    a {
      display: block;
      background: transparent;
      color: transparent;
      width: 100%;
      height: 100%;
    }
  `;
  render() {
    return html`<a @click="${this._do}"></a>`;
  }
  _do() {
    this.style.display = 'none';
    handleLeftSide();
  }
}
var printing = false
var hasLeftSide = false
function handleLeftSide(manual) {
  //debugger;
  bodyCover.style.display = 'none'; // hidden the cover when toc entry been clicked
  var innerWidth = window.innerWidth;
  var sideWidth = getCompSty(leftSide, 'width');
  leftSide.style.transitionDuration = '0.3s';
  if ( !printing && (lSGet(lsName) == null || ( !lsLast && manual )) ) {
    if (innerWidth > 1100 ) {
      header.style.marginLeft = sideWidth;
      main.style.marginLeft = sideWidth;
      footer.style.marginLeft = sideWidth;

      header.style.width = 'calc(100% - ' + sideWidth + ')';
      main.style.width = 'calc(100% - ' + sideWidth + ')';
      footer.style.width = 'calc(100% - ' + sideWidth + ')';

      // these value are fixed
      header.style.paddingLeft = '0px';
      main.style.paddingLeft = '20px';
      footer.style.paddingLeft = '0px';

      leftSide.style.transform = 'translateX(0)';
      lsLast = true;
      return
    } else if ( manual ) {
      bodyCover.style.display = 'block';

      leftSide.style.transform = 'translateX(0)';
      lsLast = true;
      return
    }
  }
  header.style.marginLeft = null;
  main.style.marginLeft = null;
  footer.style.marginLeft = null;

  header.style.width = null;
  main.style.width = null;
  footer.style.width = null;

  header.style.paddingLeft = null;
  main.style.paddingLeft = null;
  footer.style.paddingLeft = null;

  leftSide.style.transform = 'translateX(-' + sideWidth + ')';
  lsLast = false;
}
class LeftSideBtn extends LitElement {
  createRenderRoot() {
    return this;
  }
  render() {
    return html`<button @click="${this._do}"></button>`;
  }
  _do(e) {
    if (window.innerWidth >= 1100) {
      if (lSGet(lsName) != null) {
        lSRM(lsName);
      } else {
        lSSet(lsName, true);
      }
    }
    handleLeftSide(true);
  }
}
function leftSideInit() {
  //customElements.define('left-side', LeftSide);
  leftSide.appendChild(toc.cloneNode(true));
  customElements.define('body-cover', BodyCover);
  customElements.define('left-side-button', LeftSideBtn);

  window.addEventListener('popstate', function (event) {
    handleLeftSide();
  });

  window.addEventListener('resize', function(event){
    handleLeftSide()
  });
  window.addEventListener("beforeprint", function(event) {
    printing = true;
    handleLeftSide();
  });
  window.addEventListener("afterprint", function(event) {
    printing = false;
    handleLeftSide();
  });
}

/*
 * rss button on index page
 * */
class RssBtn extends LitElement {
  static properties = {
    myHref: { type: String },
  };
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <a id="rss" href="${this.myHref}" @click="${this._do}"></a>
    `;
  }
  _do(e) {
    e.preventDefault();
  }
}
customElements.define('index-rss', RssBtn);

/*
 * pager
 * */
const sTL = '#index #title-list';
const sOP = '#index #pager older-page';
const sNP = '#index #pager newer-page';
var indexes = new Map();
async function pagingSolve(indexes, olderHref, newerHref) {
  document.querySelector(sTL).replaceWith(indexes);
  if (olderHref) {
    document.querySelector(sOP).setAttribute('myhref', olderHref);
    document.querySelector(sOP).removeAttribute('myclass');
  } else {
    document.querySelector(sOP).removeAttribute('myhref');
    document.querySelector(sOP).setAttribute('myclass', 'disabled-a');
  }
  if (newerHref) {
    document.querySelector(sNP).setAttribute('myhref', newerHref);
    document.querySelector(sNP).removeAttribute('myclass');
  } else {
    document.querySelector(sNP).removeAttribute('myhref');
    document.querySelector(sNP).setAttribute('myclass', 'disabled-a');
  }
}
async function paging(elem) {
  if (elem.myHref) {
    let v = indexes.get(elem.myHref);
    if (v) {
      pagingSolve(v.indexes, v.olderHref, v.newerHref);
      return;
    }
    let req = new Request(elem.myHref);
    fetch(req).then(function(res) {
      if (!res.ok) {
        console.error(res);
        return;
      }
      return res.text();
    }).then(function(txt){
      const d = new DOMParser().parseFromString(txt, "text/html");
      const l = d.querySelector(sTL);
      const olderHref = d.querySelector(sOP).getAttribute('myhref');
      const newerHref = d.querySelector(sNP).getAttribute('myhref');
      indexes.set(elem.myHref, {indexes: l, olderHref: olderHref, newerHref: newerHref});
      pagingSolve(l, olderHref, newerHref);
    }).catch(function(err){
      console.error(err);
    });
  }
}
class PagerNewer extends LitElement {
  static properties = {
    myHref: { type: String },
    myClass: { type: String },
  };
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <a id="newer-page" class="${this.myClass}" href="${this.myHref}" @click="${this._do}">
        <button></button>
      </a>
    `;
  }
  _do(e) {
    e.preventDefault();
    paging(this);
  }
}
class PagerOlder extends LitElement {
  static properties = {
    myHref: { type: String },
    myClass: { type: String },
  };
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <a id="older-page" class="${this.myClass}" href="${this.myHref}" @click="${this._do}">
        <button></button>
      </a>
    `;
  }
  _do(e) {
    e.preventDefault();
    paging(this);
  }
}
customElements.define('newer-page', PagerNewer);
customElements.define('older-page', PagerOlder);


/*
 * back to top/bottom button
 * */
class BackTop extends LitElement {
  createRenderRoot() {
    return this;
  }
  render() {
    return html`<button id="back-top" class="f-r" title="scroll to top/bottom" @click="${this._do}"></button>`;
  }
  _do(e) {
    let h = document.querySelector('body').scrollHeight;
    if (window.scrollY > 1000) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: h,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
}
customElements.define('back-top', BackTop);
const upIcon = 'url(/assets/icons/fa/solid/angle-up-solid.svg)';
let root = document.documentElement;
window.addEventListener("scroll", function(event) {
  if (window.scrollY > 1000) {
    root.style.setProperty('--bt-icon', upIcon);
  } else {
    root.style.removeProperty('--bt-icon');
  }
});

/*
 * day/night mode button
 * */
class DayNight extends LitElement {
  createRenderRoot() {
    return this;
  }
  render() {
    return html`<button id="color-mode" class="f-r" title="switch day/night mode" @click="${this._do}"></button>`;
  }
  _do(e) {
    let mode = lSGet('colorMode');
    if ( mode == null || mode == 'night') {
      mode = "day";
    } else {
      mode = "night";
    }
    if ( mode == null || mode == 'night') {
      document.querySelector('body').classList.remove('day');
    } else {
      document.querySelector('body').classList.add('day');
    }
    lSSet('colorMode', mode);
  }
}
customElements.define('color-mode', DayNight);

/*
 * shortcut info button
 * TODO
 * */
class ShortcutInfo extends LitElement {
  createRenderRoot() {
    return this;
  }
  render() {
    return html`<button id="help" class="f-r"
      title="shortcut help and other info (Not implemented yet!)"
      @click="${this._do}"></button>`;
  }
  _do(e) {
  }
}
customElements.define('shortcut-help', ShortcutInfo);

/*
 * search button
 * TODO, by a dynamic search engine for this static site
 * */
class Search extends LitElement {
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
    `;
  }
  _do(e) {
  }
}
customElements.define('search-box', Search);

/*
 * prepare source code cover
class SourceCodeCover extends LitElement {
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <div>
      </div>
    `;
  }
}
customElements.define('source-code-cover', SourceCodeCover);
 * */
class SourceCodeClose extends LitElement {
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <button @click="${this._do}"></button>
    `;
  }
  _do() {
    sourceCodeCover.style.removeProperty('transform');
  }
}
customElements.define('source-code-close', SourceCodeClose);


/*
 * show source code button
 * */
class SourceCode extends LitElement {
  static properties = {
    myHref: { type: String },
  };
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <a id="show-source-code" @click="${this._do}" class="hidden-print">
        <button><span>源码</span></button>
      </a>
    `;
  }
  _do(e) {
    e.preventDefault();
    sourceCodeCover.style.setProperty('transform', 'translateY(0)');
    const sourceCodeCoverC = sourceCodeCover.querySelector('div#source-code-container');
    if (!sourceCodeCoverC.querySelector('div.highlight')) {
      const myRequest = new Request(this.myHref);
      sourceCodeCoverC.innerHTML = '<pre>wait ...</pre>';
      fetch(myRequest).then(function(response) {
        if (!response.ok) {
          console.error(response);
          sourceCodeCoverC.innerHTML = `HTTP error! Status: ${ response.status }`;
          return;
        }
        return response.text();
      })
      .then(function(response) {
        sourceCodeCoverC.innerHTML = response;
      })
      .catch(function(response) {
        console.error(response);
        sourceCodeCoverC.innerHTML = response;
      });
    }
  }
}
customElements.define('source-code', SourceCode);


/*
 * loads
 * */
window.addEventListener('DOMContentLoaded', function(){
  leftSide = document.querySelector('left-side');
  bodyCover = document.querySelector('body-cover');
  toc = document.querySelector('#toc .toc');
  header = document.querySelector('header');
  main = document.querySelector('main');
  footer = document.querySelector('footer');
  sourceCodeCover = document.querySelector('#source-code-cover');
  /*
   * firefox does not support backdrop-filter,
   * so, set an non-transparent background for source-code-cover
   * */
  if (navigator.userAgent.indexOf("Firefox") != -1) {
    sourceCodeCover.style.backgroundColor = 'var(--bg)';
  }


  /*
   * do left-side
   * */
  if (toc != null && leftSide != null) {
    leftSideInit();

    let backRefs = document.querySelectorAll('a.toc-backref');
    for (let backRef of backRefs) {
      backRef.removeAttribute('href');
      backRef.style.textDecoration = 'none';
      backRef.style.color = 'var(--fg)';
      backRef.style.cursor = 'unset';
    }
    handleLeftSide()

    // observe section visibility and sticky toc
    let options = {
      root: null,
      rootMargin: '-60px 0px 0px 0px',
      threshold: 0
    }
    let sectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        const id = entry.target.getAttribute('id');
        if (entry.intersectionRatio > 0) {
          document.querySelector(`left-side a[href="#${id}"]`).classList.add('active');
        } else {
          // If intersectionRatio is 0, the target is out of view
          document.querySelector(`left-side a[href="#${id}"]`).classList.remove('active');
        }
      });
    },options);
    document.querySelectorAll('article #content div.section[id]').forEach(function(section) {
      sectionObserver.observe(section);
    });
  }

  /*
   remove external class for links pointing to this site
   * */
  document.querySelectorAll('a.external').forEach(function(link){
    let href = link.getAttribute('href');
    if (href != null && href.match(/^http[s]?:\/\/bitbili.net\/|^\//) != null) {
      link.classList.remove('external');
    }
  });
});
window.addEventListener('load', function(){
  document.querySelector('#source-code-cover').
    style.setProperty('transition', 'transform 0.2s');
});
