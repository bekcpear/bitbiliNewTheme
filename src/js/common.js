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
var leftSideCover
var toc
var header
var main
var footer
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
export class LeftSideCover extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      width: 100%;
      height: 100%;
      display: none;
      z-index: 999;
      background-color: var(--bg);
      opacity: 0.8;
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
  var innerWidth = window.innerWidth;
  var sideWidth = getCompSty(leftSide, 'width');
  leftSideCover.style.display = 'none';
  leftSide.style.transition = 'transform 0.3s';
  if ( !printing && (lSGet(lsName) == null || ( !lsLast && manual )) ) {
    if (innerWidth > 1100 ) {
      header.style.marginLeft = 'calc(var(--sal) + ' + sideWidth + ')';
      main.style.marginLeft = 'calc(var(--sal) + ' + sideWidth + ')';
      footer.style.marginLeft = 'calc(var(--sal) + ' + sideWidth + ')';

      header.style.width = 'calc(100% - ' + sideWidth + '- var(--sal))';
      main.style.width = 'calc(100% - ' + sideWidth + '- var(--sal))';
      footer.style.width = 'calc(100% - ' + sideWidth + '- var(--sal))';

      // these value are fixed
      header.style.paddingLeft = '0px';
      main.style.paddingLeft = '20px';
      footer.style.paddingLeft = '0px';

      leftSide.style.transform = 'translateX(var(--sal))';
      lsLast = true;
      return
    } else if ( manual ) {
      leftSideCover.style.display = 'block';

      leftSide.style.transform = 'translateX(var(--sal))';
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
export class LeftSideBtn extends LitElement {
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
  var maxWidth = 350;

  leftSide.style.position = 'fixed';
  leftSide.style.zIndex = '1001';
  leftSide.style.height = '100%';
  leftSide.style.maxWidth = maxWidth + 'px';
  leftSide.style.backgroundColor = 'var(--bg)';
  leftSide.style.transform = 'translateX(-' + maxWidth + 'px)';

  header.style.transitionProperty = 'margin-left,width';
  main.style.transitionProperty = 'margin-left,width';
  footer.style.transitionProperty = 'margin-left,width';
  header.style.transitionDuration = '0.3s';
  main.style.transitionDuration = '0.3s';
  footer.style.transitionDuration = '0.3s';

  //customElements.define('left-side', LeftSide);
  leftSide.appendChild(toc.cloneNode(true));
  customElements.define('left-side-cover', LeftSideCover);
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
 * back to top/bottom button
 * */
export class BackTop extends LitElement {
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
const downIcon = 'url(/assets/icons/fa/solid/angle-down-solid.svg)';
let root = document.documentElement;
window.addEventListener("scroll", function(event) {
  if (window.scrollY > 1000) {
    root.style.setProperty('--bt-icon', upIcon);
  } else {
    root.style.setProperty('--bt-icon', downIcon);
  }
});

/*
 * day/night mode button
 * TODO
 * */
export class DayNight extends LitElement {
  createRenderRoot() {
    return this;
  }
  render() {
    return html`<button id="color-mode" class="f-r" title="switch day/night mode" @click="${this._do}"></button>`;
  }
  _do(e) {
  }
}
customElements.define('color-mode', DayNight);

/*
 * shortcut info button
 * TODO
 * */
export class ShortcutInfo extends LitElement {
  createRenderRoot() {
    return this;
  }
  render() {
    return html`<button id="help" class="f-r" title="shortcut help and other info" @click="${this._do}"></button>`;
  }
  _do(e) {
  }
}
customElements.define('shortcut-help', ShortcutInfo);

/*
 * search button
 * TODO, by a dynamic search engine for this static site
 * */
export class Search extends LitElement {
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
 * loads
 * */
window.addEventListener('DOMContentLoaded', function(){
  /*
   * do left-side
   * */
  leftSide = document.querySelector('left-side');
  leftSideCover = document.querySelector('left-side-cover');
  toc = document.querySelector('#toc .toc');
  header = document.querySelector('header');
  main = document.querySelector('main');
  footer = document.querySelector('footer');
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
//window.addEventListener('DOMContentLoaded', function(){
