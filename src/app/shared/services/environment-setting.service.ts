import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentSettingService {

  constructor(@Optional() private http: HttpClient) {
  }

  private setting: any = {};
  private settingJsonUrl = './src/environments/environment.config.json';

  load() {
    return new Promise((resolve, reject) => {
      this.http.get(this.settingJsonUrl)
        .subscribe((response:any) => {
          this.setting = response;
          resolve(true);
        }), (error:any) => {
          console.log(error);
        }
    })
  }

  getSetting(key: string) {
    return this.setting[key];
  }
}
