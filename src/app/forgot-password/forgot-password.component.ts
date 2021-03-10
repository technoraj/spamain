import { Component, OnInit } from '@angular/core';
import { LoginService } from '../shared/services/login.service';
import swal from "sweetalert2";
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  email:string = "";
  tmpCode:string = "";
  codeSent:boolean = false;

  constructor(private loginService:LoginService,private router: Router) { }

  ngOnInit(): void {

  }

  generateEmail()
  {
    if (!this.email.includes("@" && ".")) {
      swal.fire('', 'Entrez une adresse e-mail valide', 'error');               //if emailid does not contains @ and . then show the alert
    }else{
    //this method will check wheather the user is register with the portal or not
    //if yes then the user will get an email has to Re-register itself through mail
    this.loginService.emailto(this.email).subscribe(data => {
       if(data == true) //if email is correct and register with AgProMa
       { 
        this.codeSent = true;
         swal.fire('Email envoyé!','Veuillez vérifier votre email et entrer le code de vérification','success')
       } 
       else{ //if email is not register with the AgProMa
         swal.fire('E-mail non enregistré!','Pardon! Email is not Register with us','error')
       }
     });
    }
    
  }

  checkTmpCode(){
    if (!this.email.includes("@" && ".")) {
      swal.fire('', 'Entrez une adresse e-mail valide', 'error');
    }else if(this.tmpCode == ''){
      swal.fire('', 'Entrez un code valide', 'error');
    }else{
      this.loginService.checkTmpCode(this.email,this.tmpCode).subscribe(data => {
        if(data == true) //if email is correct and register with AgProMa
        { 
         this.router.navigateByUrl('/app-home/app-change-password/'+this.tmpCode);
        } 
        else{ //if email is not register with the AgProMa
          swal.fire('Mauvais code!','Veuillez saisir le code correct ou le code est peut-être expiré','error');
        }
      });
    }
  }

}
