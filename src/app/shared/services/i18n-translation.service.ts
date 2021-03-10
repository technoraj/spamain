import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnvironmentSettingService } from './environment-setting.service';

@Injectable({
  providedIn: 'root'
})
export class I18nTranslationService {

  language: string = '' ;

  constructor(private translateService: TranslateService, private environmentSetting: EnvironmentSettingService) {
    this.language = this.environmentSetting.getSetting("language");
  }

  translatefromconfig() {
    if (this.language === null || this.language === undefined || this.language === '') {
      this.translateService.setDefaultLang('en-GB');
    } else {
      localStorage.setItem("Language", this.language);
      this.translateService.use(this.language);
    }
  }


  translate(Lang: any) {
    localStorage.setItem("Language", Lang);
    this.translateService.use(Lang);
  }
}
