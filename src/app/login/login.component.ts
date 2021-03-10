import { Component, OnInit } from '@angular/core';
import { IdPassword } from '../shared/models/IdPassword';
import { Router } from '@angular/router';
import { LoginService } from '../shared/services/login.service';
import { EncryptionService } from '../shared/services/encryption.service';
import { Credential } from '../shared/models/Credential';
import { TranslateService } from '@ngx-translate/core';
import { EnvironmentSettingService } from '../shared/services/environment-setting.service';
import Swal from 'sweetalert2';
import { SharedEventService } from '../shared/services/shared-event.service';
import { SharedStoreService } from '../shared/services/shared-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //local variable used in this component
  userdata: any;
  email: string = '';
  password: string = '';
  userCred: Credential = new Credential();
  tokenData: any;
  userId: number = 0;
  tokenExpiry: string;

  constructor(private router: Router, private loginservice: LoginService, private encrypt: EncryptionService, private translate: TranslateService,
    private environment: EnvironmentSettingService, private sharedService: SharedEventService, private sharedStoreService: SharedStoreService) {
    this.translate.use(this.environment.getSetting("language"));
  }

  ngOnInit() {

  }


  login() {
    //this method is used to verify user's credentials
    if (this.email == '' || this.password == '') //if username or password is empty
    {
      Swal.fire('', "Entrez les détails appropriés", "error");
    }

    else {
      this.sharedStoreService.userRole = null;
      let model: IdPassword = { email: this.encrypt.Encrypt(this.email), password: this.encrypt.Encrypt(this.password) }

      this.loginservice.check(model).subscribe(data => {
        if (data["status"] == "success") // if user is register with AgProMa
        {
          //call method for token generation
          this.userCred.userName = data["userName"];
          this.userCred.email = data["email"];
          this.userCred.userId = data["userId"];
          this.loginservice.getToken(this.userCred).subscribe(data => {
            this.tokenData = JSON.parse(data.toString())["token"];
            this.tokenExpiry = JSON.parse(data.toString())["expiration"];          
            sessionStorage.setItem("token", this.tokenData);
            sessionStorage.setItem("userId", this.userCred.userId);
            sessionStorage.setItem("username", this.userCred.userName);
            sessionStorage.setItem("tokenexpiry", this.tokenExpiry);
            this.sharedService.toggle(true);
            if (this.sharedStoreService.lastUrl) {
              this.router.navigateByUrl(this.sharedStoreService.lastUrl);
            } else {
              this.router.navigate(["app-home"]);
            }

            //if user's credentials are correct then user will br redirected to dashboard
          });
        }
        else if (data["status"] == "email") {
          this.sharedService.toggle(false);
          Swal.fire('', "Entrez un identifiant ou un mot de passe valide", "error");
        } else if (data["status"] == "exist") {
          this.sharedService.toggle(false);
          Swal.fire('', "Entrez un identifiant ou un mot de passe valide", "error");
        }
        else {
          this.sharedService.toggle(false);
          //if username or password is incorrect
          Swal.fire('', "Vous n'êtes pas inscrit", "error");
        }
      });
    }

  }

}
