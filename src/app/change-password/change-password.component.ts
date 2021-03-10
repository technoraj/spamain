import { Component, OnInit } from '@angular/core';
import { LoginService } from '../shared/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../shared/services/encryption.service';
import swal from "sweetalert2";
import { Users } from '../shared/models/Users';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  tmpPasswordChangeCode:string = '';
  userId:string = '';
  password:string = '';
  confirmpassword:string = '';
  users:Users = new Users();

  constructor(private loginService:LoginService, private route: ActivatedRoute, private encrypt:EncryptionService,private router:Router) { 
    this.route.params.subscribe((param) =>
      this.tmpPasswordChangeCode = param['id']
    );
    this.loginService.getUserByCode(this.tmpPasswordChangeCode).subscribe(data =>{ 
      this.userId = data.toString();
    });
  }

  ngOnInit(): void {
  }

  resetPassword(){
    if(this.password==this.confirmpassword){
      this.users.password = this.encrypt.Encrypt(this.password);
      this.users.user_Id = this.userId;
      this.loginService.updatePassword(this.users).subscribe();;             //updating the password by calling the update
        swal.fire('',"Mot de passe mis à jour avec succès","success");           //password function ofbRegisterwithnew password service 
        this.router.navigateByUrl('/app-home/app-login');                 //navigate to the signup page
    }else
      {
        swal.fire('',"Le mot de passe ne correspond pas au mot de passe de confirmation","error");  //showing message if password does not match
      }
  }
}
