import { Component } from '@angular/core';
import { I18nTranslationService } from './shared/services/i18n-translation.service';
import { SharedStoreService } from './shared/services/shared-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'belgiumSpaApp';
  constructor(private i18nTranslateService: I18nTranslationService, private sharedStoreService: SharedStoreService) {
    i18nTranslateService.translatefromconfig();
    this.getAllReqImage();
  }
  getAllReqImage() {
    this.sharedStoreService.getAllImages();
  }
}
