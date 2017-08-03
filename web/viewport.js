var _baseFontSize = 100; //基础fontSize, 默认100px;
var _fontscale = 1; //有的业务希望能放大一定比例的字体;
var win = window;
var doc = win.document;
// 如果小于768认为是手机模式，开启高清方案
if (doc.documentElement.clientWidth < 768) {
  var ua = navigator.userAgent;
  var matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
  var UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
  var isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >=
    80;
  var isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
  var dpr = win.devicePixelRatio || 1;
  if (!isIos && !(matches && matches[1] > 534) && !isUCHd) {
    // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
    dpr = 1;
  }
  var scale = 1 / dpr;
  var metaEl = doc.querySelector('meta[name="viewport"]');
  if (!metaEl) {
    metaEl = doc.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    doc.head.appendChild(metaEl);
  }
  metaEl.setAttribute('content',
    `width=device-width,user-scalable=no,initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale}`
  );
  doc.documentElement.style.fontSize =
    `${_baseFontSize / 2 * dpr * _fontscale}px`;
  // 高清模式需要设置rem是两倍大小
  setTimeout(function(){
    var sp1 = doc.getElementById('sp-loading');
    if (sp1) {
      sp1.style.fontSize = (parseFloat(sp1.style.fontSize.replace('rem', '')) * 2) +
        'rem';
    }
    var spSvg = doc.getElementById('sp-svg');
    if (spSvg) {
      spSvg.style.width = (parseFloat(spSvg.style.width.replace('rem', '')) * 2) +
        'rem';
      spSvg.style.height = (parseFloat(spSvg.style.height.replace('rem', '')) * 2) +
        'rem';
    }
    var spItem = doc.getElementById('sp-item');
    if (spItem) {
      spSvg.style.height = (parseFloat(spSvg.style.height.replace('rem', '')) * 2) +
        'rem';
    }
    var spText = doc.getElementById('sp-text');
    if (spText) {
      spText.style.marginBottom = (parseFloat(spText.style.marginBottom.replace(
          'rem', '')) *
        2) + 'rem';
    }
  },0);

}
