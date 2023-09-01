export type TIpTypes = 'IPv4' | 'IPv6';

export interface IGetIpFlag {
  img: string;
  emoji: string;
  emoji_unicode: string;
}

export interface IGetIpConnection {
  asn: number;
  org: string;
  isp: string;
  domain: string;
}

export interface IGetIpTimezone {
  id: string;
  abbr: string;
  is_dst: boolean;
  offset: number;
  utc: string;
  current_time: string;
}

export interface IGetIpData {
  ip: string;
  success: boolean;
  message?: string;
  type: TIpTypes;
  continent: string;
  continent_code: string;
  country: string;
  country_code: string;
  region: string;
  region_code: string;
  city: string;
  latitude: number;
  longitude: number;
  is_eu: boolean;
  postal: string;
  calling_code: string;
  capital: string;
  borders: string;
  flag: IGetIpFlag;
  connection: IGetIpConnection;
  timezone: IGetIpTimezone;
}

export interface IGetTimezoneObject {
  countryCode: string;
  countryName: string;
  zoneName: string;
  gmtOffset: number;
  timestamp: number
}

export interface IGetTimezoneData {
  status: string,
  message?: string,
  zones: Array<IGetTimezoneObject>
}

