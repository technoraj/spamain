import { Component, OnInit } from '@angular/core';
import { Users } from '../shared/models/Users';
import swal from 'sweetalert2';
import { LoginService } from '../shared/services/login.service';
import { EncryptionService } from '../shared/services/encryption.service';
import { TranslateService } from '@ngx-translate/core';
import { EnvironmentSettingService } from '../shared/services/environment-setting.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user :Users = new Users();
  tmpPassword:string;
  confirmPassword: string;

  constructor( private loginservice: LoginService, private encrypt:EncryptionService,  private translate: TranslateService,
    private environment:EnvironmentSettingService, private router:Router) { 
      this.translate.use(this.environment.getSetting("language"));
    }

  ngOnInit(): void {
  }


  CreateAccount() {  //registering the user

    if (this.user.firstName == '' || this.user.lastName == '' || this.user.phone == undefined || this.user.email == '') {
      swal.fire('', 'Entrez les champs obligatoires', 'error');             //if any entry is empty then show the alert 
    }
    else if (!this.user.email.includes("@" && ".")) {
      swal.fire('', 'Entrez une adresse e-mail valide', 'error');               //if emailid does not contains @ and . then show the alert
    }
    else if (this.tmpPassword != this.confirmPassword) {
      swal.fire('', 'confirmer le mot de passe ne correspond pas au mot de passe', 'error')    //if confirm and password is not equal then show password does not match
    }

    else if (this.tmpPassword == this.confirmPassword) {
        this.user.password = this.encrypt.Encrypt(this.tmpPassword);
        this.loginservice.createAccount(this.user)
          .subscribe(data => {
            if (data == "success") {
                  swal.fire('', 'Votre compte a été créé', 'success');
                  this.router.navigateByUrl("/app-home/app-login");
                }
            else if(data == "exist"){
              swal.fire('', "l'email existe déjà", 'error')    //if enter id matches with the existing id in database 
            }else{
              swal.fire('', "Une erreur inconnue s'est produite", 'error') 
            }
          });
      }
    }
}
