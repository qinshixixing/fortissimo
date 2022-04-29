export function detectIE(): boolean {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return Boolean(parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10));
  }

  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf('rv:');
    return Boolean(parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10));
  }

  const edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return Boolean(parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10));
  }

  // other browser
  return false;
}

export function getIEVersion(): number {
  const userAgent = navigator.userAgent;
  const isIE = userAgent.includes('compatible') && userAgent.includes('MSIE');
  const isEdge = userAgent.includes('Edge') && !isIE;
  const isIE11 = userAgent.includes('Trident') && userAgent.includes('rv:11.0');
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    const fIEVersion = parseFloat(RegExp.$1);
    if ([7, 8, 9, 10].includes(fIEVersion)) return fIEVersion;
    else return 6;
  } else if (isEdge) {
    return -1;
  } else if (isIE11) {
    return 11;
  } else {
    return -1;
  }
}

export function getBrowserType(): string {
  const reIE = new RegExp(/(trident).+rv[:\s]([\w.]+).+like\sgecko/i);
  const reWechat = new RegExp(/wechat/i);
  const userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
  const isWeixin = reWechat.test(userAgent); // 判断是否是微信
  const isIE11 = reIE.test(userAgent); // 判断是否 IE11
  const isOpera = userAgent.indexOf('Opera') > -1; // 判断是否Opera浏览器
  const isEdge = userAgent.indexOf('Edge') > -1; // 判断是否IE的Edge浏览器
  const isFF = userAgent.indexOf('Firefox') > -1; // 判断是否Firefox浏览器
  const isSafari =
    userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1; // 判断是否Safari浏览器
  const isChrome =
    userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1; // 判断Chrome浏览器

  if (isWeixin) {
    return 'wechat';
  }
  if (isIE11) {
    return 'IE11';
  }
  if (isOpera) {
    return 'Opera';
  }
  if (isFF) {
    return 'FF';
  }
  if (isSafari) {
    return 'Safari';
  }
  if (isEdge) {
    return 'Edge';
  }
  if (isChrome) {
    return 'Chrome';
  }
  return '';
}
