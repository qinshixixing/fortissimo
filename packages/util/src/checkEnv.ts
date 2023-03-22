export interface CheckEnv {
  isIos: boolean;
  isAndroid: boolean;
  isWechat: boolean;
  isMobile: boolean;
  isWin: boolean;
}

export function checkEnv(userAgent?: string, platform?: string): CheckEnv {
  if (!userAgent) userAgent = window.navigator.userAgent;
  if (!platform) platform = window.navigator.platform;
  userAgent = userAgent.toLowerCase();
  platform = platform.toLowerCase();
  return {
    isIos: /(iphone|ipad|ipod|ios|mac)/i.test(userAgent),
    isAndroid: userAgent.includes('android'),
    isWechat: userAgent.includes('micromessenger'),
    isMobile: /(iphone|ipod|webos|android|blackberry)/i.test(userAgent),
    isWin: platform.startsWith('win')
  };
}
