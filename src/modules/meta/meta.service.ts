import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { META_CRON_ENUM } from './meta.constants';
import { IGetIpData, IGetTimezoneData } from './meta.types';
import { Timezone, TTimezoneModel } from './models/timezone.model';

@Injectable()
export class MetaService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Timezone.name) private readonly timezone: TTimezoneModel,
    private readonly configService: ConfigService,
  ) {
  }
  
  async getInfoByIp(ip: string): Promise<IGetIpData> {
    const res = await this.httpService.axiosRef.get(`https://ipwho.is/${ip}?lang=ru`);
    
    return res.data;
  }
  
  @Cron(CronExpression.EVERY_6_MONTHS, { name: META_CRON_ENUM.UPDATE_TIMEZONE_IN_DB, utcOffset: 0 })
  private async updateTimezonesInDB() {
    try {
      const res = await this.httpService.axiosRef.get<IGetTimezoneData>(
        `http://api.timezonedb.com/v2.1/list-time-zone?key=${this.configService.get('TIMEZONE_API_KEY')}&format=json`,
      );
      
      if (res.statusText === 'OK') {
        const includes: Array<Timezone> = await this.timezone.find().lean();
        
        const hash = includes.reduce((acc, value) => {
          acc[value.zoneName] = value;
          return acc;
        }, {});
        
        const forUpdate = res.data.zones.filter((item) => {
          return !hash[item.zoneName];
        });
        
        console.log('Добавляемые timezone объекты: ', forUpdate);
        
        if (forUpdate.length) {
          await this.timezone.insertMany(forUpdate);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  async getTimezoneByZoneName(timezone: string | null): Promise<Timezone | null> {
    const zoneName = timezone ?? dayjs.tz.guess();
    
    return this.timezone.findOne({ zoneName }).lean();
  }
}