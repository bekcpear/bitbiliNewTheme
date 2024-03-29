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
      animation: fade-out 100ms both;
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
    handleLeftSide();
  }
}
var printing = false
var hasLeftSide = false
var bodyCoverFadeOutTID
function handleLeftSide(manual) {
  // hidden the cover when toc entry been clicked
  if (!manual && bodyCover.style.display == 'block') {
    bodyCover.style.removeProperty('animation');
    clearTimeout(bodyCoverFadeOutTID);
    bodyCoverFadeOutTID = setTimeout(function() {
      bodyCover.style.removeProperty('display');
    }, 100);
  }

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
      bodyCover.style.animation = 'fade-in 100ms both';

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
var rssBthShowTID
function rssBthShowHeartIcon(ele) {
  rssBthShowTID = setTimeout(function() {
    ele.className = 'success';
    rssBthShowTID = setTimeout(function() {
      ele.className = 'hide';
      rssBthShowTID = setTimeout(function() {
        ele.innerText = '';
      }, 300);
    }, 2000);
  }, 80);
}
function rssBthShowDo(ele, t, s, r, i, l) {
  rssBthShowTID = setTimeout(function() {
    ele.innerText = r + t.charAt(i);
    if (i + 1 < l) {
      rssBthShowDo(ele, t, s, r + t.charAt(i), i + 1, l);
    } else if (s == true) {
      rssBthShowHeartIcon(ele);
    }
  }, 80);
}
function rssBthShow(ele, text, success) {
  let l = text.length;
  rssBthShowDo(ele, text, success, '', 0, l);
}
var rssBthTID
function rssBthFunc(link) {
  clearTimeout(rssBthShowTID);
  clearTimeout(rssBthTID);
  let rssBth = document.querySelector('.on-index a#rss');
  let rssBthSpan = rssBth.querySelector('span');
  rssBthSpan.className = ''
  rssBthSpan.innerText = '';
  rssBth.setAttribute('clicked', true);
  rssBthTID = setTimeout(function() {
    rssBth.removeAttribute('clicked');
    navigator.clipboard.writeText(link).then(function() {
      rssBthShow(rssBthSpan, '订阅链接已成功复制^ .^', true);
    }, function() {
      rssBthShow(rssBthSpan, '无权限复制订阅链接=. =', false);
    });
  }, 500);
}
class RssBtn extends LitElement {
  static properties = {
    myHref: { type: String },
  };
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <a id="rss" href="${this.myHref}" @click="${this._do}"><span></span></a>
    `;
  }
  _do(e) {
    e.preventDefault();
    rssBthFunc(this.myHref);
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
async function pagingSolve(indexes, olderHref, newerHref, stateUrl) {
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
  if (stateUrl != '') {
    history.pushState({'type': 'index', 'url': stateUrl}, '', stateUrl.replace(/\/index.html$/, ''));
  }
}
async function paging(elem) {
  if (elem.myHref) {
    let v = indexes.get(elem.myHref);
    if (v) {
      pagingSolve(v.indexes, v.olderHref, v.newerHref, elem.myHref);
      return;
    }
    let progressLine = document.querySelector('#pager-loading');
    if (progressLine != undefined) {
      progressLine.style.setProperty('display', 'initial');
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
      pagingSolve(l, olderHref, newerHref, elem.myHref);
      progressLine.style.removeProperty('display');
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
const upIcon = 'var(--bt-up-icon)';
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
 * some common styles
 */
var commonStyles = css`
:host {
  position: fixed;
  z-index: 2000;
  color: var(--fg-less);
  background-color: var(--bg-less-t);
  transition-property: background-color, color;
  transition-duration: 0.3s;
  font-family: monospace;
  box-sizing: border-box;
}`

/*
 * service worker message
 */
var swFetchDidFail = false;
var swHandlerDidCompleteStatus = 0;
var swNotificationDisplayed = false;
navigator.serviceWorker.addEventListener('message', async (event) => {
  if (event.data.type === 'FETCH_DID_FAIL') {
    swFetchDidFail = true;
  }
  if (event.data.type === 'HANDLER_DID_COMPLETE') {
    swHandlerDidCompleteStatus = event.data.status;
  }
  if ( swFetchDidFail && swHandlerDidCompleteStatus === 200 && ! swNotificationDisplayed ) {
    // carry on cache mode
    swNotificationDisplayed = true;
    // display notification
    class OfflineModeNotify extends LitElement {
      static styles = [
        commonStyles,
        css`
        :host {
          top: var(--sat);
          left: calc(50% - 90px);;
          font-size: 0.8em;
          line-height: 1em;
          font-family: monospace;
          width: 180px;
          padding: 0.5em 1em;
        }
        a {
          display: inline-block;
          margin-left: 1em;
          width: 1em;
          height: 1em;
          cursor: pointer;
        }
      `];
      render() {
        return html`
          <div><span>当前处于离线浏览状态<span><a @click="${this._do}">X</a></div>
        `;
      }
      _do() {
        this.style.display = 'none';
      }
    }
    customElements.define('sw-notify', OfflineModeNotify);
  }
});

/*
 * my custom notify if come from moego.me
 */

class DomainNotify extends LitElement {
  static styles = [
    commonStyles,
    css`
    :host {
      bottom: 0;
      left: 0;
      width: 100%;
      min-height: 300px;
      font-size: 1.5em;
      line-height: 1.5em;
      transform: translateY(100%);
      background-color: var(--bg-less);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    div {
      margin: 1em 2em;
      max-width: 1200px;
    }
    a {
      text-decoration: underline;
      cursor: pointer;
    }
  `];
  render() {
    return html`
      <div><span>您好，本站已于 2020 年第三季度切换域名至此，
          原 <s>moego.me</s> 早已停用且可能不定期失效，请尽快替换使用新域名 <b>bitbili.net</b> 访问 ;)<span>
      </div><div><a @click="${this._do}">已知悉</a></div>
    `;
  }
  _do() {
    this.style.removeProperty('transform');
    const url = new URL(window.location);
    url.searchParams.delete('from');
    history.replaceState({}, '', url);
  }
}

/*
 * pre copy function
 * */
var copyPreTID = new Map();
async function cleanCopyPreAttr(ele, attr) {
  clearTimeout(copyPreTID.get(ele));
  copyPreTID.set(ele, setTimeout(function() {
    ele.removeAttribute(attr);
    ele.parentNode.classList.remove('copying');
  }, 2000));
}
async function copyPre(e) {
  e.preventDefault();
  let ele = this;
  let pre = ele.previousSibling;
  if (pre.nodeName == 'PRE') {
    ele.parentNode.classList.add('copying');
    let t = pre.textContent;
    navigator.clipboard.writeText(t).then(function() {
      ele.setAttribute('copied', true);
      cleanCopyPreAttr(ele, 'copied');
    }, function() {
      ele.setAttribute('failed', true);
      cleanCopyPreAttr(ele, 'failed');
    });
  }
}


var searchParams = new URLSearchParams(new URL(document.URL).search);
/*
 * loads
 * */
window.addEventListener('DOMContentLoaded', function(){
  leftSide = document.querySelector('left-side');
  bodyCover = document.querySelector('body-cover');
  toc = document.querySelector('nav[role="doc-toc"]');
  header = document.querySelector('header');
  main = document.querySelector('main');
  footer = document.querySelector('footer');
  sourceCodeCover = document.querySelector('#source-code-cover');

  /*
   * firefox does not support backdrop-filter, (safari do?)
   * so, set an non-transparent background for source-code-cover
   * */
  let isFirefoxOrSafari = false;
  if (navigator.userAgentData) {
    let uab = navigator.userAgentData.brands;
    // currently not supported by firefox/safari,
    // but write a foreseeable code to try to prevent
    // the something error due to a latency of an update
    uab.every(function(b){
      if (b.brand.search(/safari|firefox/i) != -1) {
        isFirefoxOrSafari = true;
        return false;
      }
      return true;
    });
  } else {
    isFirefoxOrSafari = /^((?!chrome|android).)*(safari|firefox)/i.test(navigator.userAgent);
  }
  if (isFirefoxOrSafari && sourceCodeCover) {
    sourceCodeCover.style.backgroundColor = 'var(--bg)';
  }

  /*
   * load domain change notification if url params contains a 'from=moego'
   * here is the defination, actuall show will be triggered on 'load' event
   */
  if (searchParams.has('from') && searchParams.get('from') == "moego") {
    customElements.define('notify-box', DomainNotify);
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
    document.querySelectorAll('article #content section[id]').forEach(function(section) {
      sectionObserver.observe(section);
    });
  }

  /*
   * handle link elem
   * 1. remove external class for links pointing to this site
   * 2. add target='_blank' for real external link
   * 3. append an extra span elem to store link-href for printing
   * */
  document.querySelectorAll('a.external').forEach(function(link){
    let href = link.getAttribute('href');
    if (href != null) {
      if (link.text.search(/ftp|http|\//) != 0) {
        let extraHref = document.createElement('span');
        extraHref.appendChild(document.createTextNode('[' + href + ']'));
        extraHref.className = 'hidden-screen';
        link.appendChild(extraHref);
      }
      if (href.match(/^http[s]?:\/\/bitbili.net\/|^\//) != null) {
        link.classList.remove('external');
      } else {
        link.setAttribute('target', '_blank');
      }
    }
  });

  /*
   * add copy button to pre-elem
   * */
  let copyBtn = document.createElement('button');
  let copyBtnS = document.createElement('span');
  copyBtn.appendChild(copyBtnS);
  copyBtn.className = 'copy-button';
  document.querySelectorAll('pre').forEach(function(pre) {
    // I can't find a way to prevent button scrolling with pre-elem,
    // unless I make a wrap around the pre-elem
    if (pre.parentNode.nodeName != 'DIV' || pre.parentNode.className.indexOf('highlight') == -1) {
      let copyBtnP = document.createElement('div');
      copyBtnP.className = 'highlight';
      pre.parentNode.insertBefore(copyBtnP, pre);
      copyBtnP.appendChild(pre);
    }
    let c = copyBtn.cloneNode(true);
    c.addEventListener('click', copyPre);
    pre.parentNode.appendChild(c);
  });

  /*
   * record an initial history state for pager's js
   * */
  if (document.querySelector('#index #pager')) {
    const l = document.querySelector(sTL);
    const olderHref = document.querySelector(sOP).getAttribute('myhref');
    const newerHref = document.querySelector(sNP).getAttribute('myhref');
    indexes.set(document.URL, {indexes: l, olderHref: olderHref, newerHref: newerHref});
    history.replaceState({'type': 'index', 'url': document.URL}, '');
  }

  /*
   * update the version
   */
  let versionDiv = document.querySelector('#vernum');
  if (versionDiv) {
    fetch(new Request('/version')).then(function(res) {
      if (!res.ok) {
        versionDiv.innerHTML = 'error: ' + res.status;
        return;
      }
      return res.text();
    }).then(function(txt){
      versionDiv.innerHTML = txt;
    }).catch(function(err){
      console.error(err);
    });
  }

});
window.addEventListener('load', function(){
  if (sourceCodeCover) {
    sourceCodeCover.style.setProperty('transition', 'transform 0.2s');
  }

  /*
   * load domain change notification if url params contains a 'from=moego'
   * here is the trigger
   */
  if (searchParams.has('from') && searchParams.get('from') == "moego") {
    const notifyBox = document.querySelector('notify-box');
    notifyBox.style.setProperty('transition-property', 'background-color,color,transform');
    notifyBox.style.setProperty('transform', 'translateY(0)');
  }
});

window.addEventListener('popstate', function(e){
  if (e.state && e.state.type == 'index') {
    let v = indexes.get(e.state.url);
    /*
    if (!v && e.state.url.indexOf('index.html') == -1) {
      v = indexes.get(e.state.url.replace(/[\/]?$/, '/index.html'))
    }*/
    if (v) {
      pagingSolve(v.indexes, v.olderHref, v.newerHref, '');
    }
  }
});

/*
 * workaround for enabling the :active pseudo-elem of <button> on iOS safari
 */
root.addEventListener('touchstart', function(){}, {passive: true});
