export interface PhoneEnv {
  isIos: boolean;
  isAndroid: boolean;
  isWechat: boolean;
}

export function checkPhoneEnv(userAgent?: string): PhoneEnv {
  if (!userAgent) userAgent = window.navigator.userAgent;
  userAgent = userAgent.toLowerCase();
  return {
    isIos: /(iphone|ipad|ipod|ios|mac)/i.test(userAgent),
    isAndroid: userAgent.includes('android'),
    isWechat: userAgent.includes('micromessenger')
  };
}
