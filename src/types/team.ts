export interface Team {
  id: string;
  name: string;
  displayName: string;
  isPro: boolean;
  personal: boolean;
  expiredAt: string;
  usage: {
    keyTotal: number;
    projectTotal: number;
    translationTotal: number;
  };
  token: string;
}