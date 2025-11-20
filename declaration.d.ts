declare module '*.svg' {
    const content: any;
    export default content;
  }
  
declare module '@env' {
  export const GOOGLE_MOBILE_ADS_UNIT_ID_BANNER_ANDROID: string;
  export const GOOGLE_MOBILE_ADS_UNIT_ID_BANNER_IOS: string;
  export const GOOGLE_MOBILE_ADS_UNIT_ID_INTERSTITIAL_ANDROID: string;
  export const GOOGLE_MOBILE_ADS_UNIT_ID_INTERSTITIAL_IOS: string;
  export const GOOGLE_MOBILE_ADS_UNIT_ID_NATIVE_ANDROID: string;
  export const GOOGLE_MOBILE_ADS_UNIT_ID_NATIVE_IOS: string;
}