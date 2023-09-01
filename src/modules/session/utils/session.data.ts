import { IGetIpData } from '../../meta/meta.types';
import { Timezone } from '../../meta/models/timezone.model';
import { Profile } from '../../profile/profile.model';

export interface ISessionData {
  userAgent: string;
  timezone: Timezone | null;
  profile: Profile;
  loginIpDetail: IGetIpData;
  timezoneSelectedByUser: boolean;
  uuid: string;
}

export type TJsonSessionData = Pick<ISessionData, 'timezoneSelectedByUser' | 'timezone' | 'profile'>;

export class SessionData implements ISessionData {
  userAgent: string;
  loginIpDetail: IGetIpData;
  timezone: Timezone;
  profile: Profile;
  timezoneSelectedByUser: boolean;
  uuid: string;

  constructor(props: ISessionData) {
    this.userAgent = props.userAgent;
    this.loginIpDetail = props.loginIpDetail;
    this.profile = props.profile;
    this.timezone = props.timezone;
    this.timezoneSelectedByUser = props.timezoneSelectedByUser;
  }

  private isEqualTimezone(newTimezone: string) {
    return this.timezone.zoneName === newTimezone;
  }
  
  isEqualUserAgent(userAgent: string){
    return this.userAgent === userAgent;
  }

  timezoneNeedUpdate(newTimezone: string): boolean {
    return !this.timezoneSelectedByUser && !this.isEqualTimezone(newTimezone);
  }

  toJSON(): string {
    const data: TJsonSessionData = {
      timezone: this.timezone,
      profile: this.profile,
      timezoneSelectedByUser: this.timezoneSelectedByUser,
    };
    return JSON.stringify(data);
  }
}
