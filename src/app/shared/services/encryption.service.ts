import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import { EnvironmentSettingService } from './environment-setting.service';

@Injectable({
  providedIn: 'root'
})

export class EncryptionService {

  private key = '';

  constructor(private environmentSetting:EnvironmentSettingService){
      this.key = this.environmentSetting.getSetting("key");
  }

  Encrypt(password: string): string {
    const text = password;
    const key = this.key;
    const useHashing = true;
    let hashkey = '';

    if (useHashing) {
      hashkey = crypto.SHA256(key).toString();
    }

    const options = {
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7
    };

    const textWordArray = crypto.enc.Utf8.parse(text);
    const keyHex = crypto.enc.Hex.parse(hashkey);
    const encrypted = crypto.AES.encrypt(textWordArray, keyHex, options);
    return encodeURIComponent(encrypted.toString());

  }
}
