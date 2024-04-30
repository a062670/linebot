import { Injectable } from '@nestjs/common';
import { EarthquakeResult } from './earthquake.interface';

@Injectable()
export class EarthquakeService {
  async getEarthquakes() {
    try {
      const resp = await fetch(
        `https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=${process.env.OPENDATA_CWA_KEY}&limit=2`,
      );
      const data = await resp.json();
      return data.records.Earthquake.map((record: any) => ({
        image: record.ReportImageURI,
        link: record.Web,
      })) as EarthquakeResult[];
    } catch (error) {
      return [] as EarthquakeResult[];
    }
  }
}
export { EarthquakeResult };
