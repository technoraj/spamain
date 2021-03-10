import { Component, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { SharedEventService } from '../shared/services/shared-event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userLogged:boolean;
  userName:string = "No User";
  expiryTime:string;
  constructor(private router: Router, private sharedService: SharedEventService) {
     sharedService.toggleService.subscribe((data:boolean) =>{
       if(data == true){
        this.login();
       }     
     });
     this.login(); 
  }
  
  login(){
    if(!isNullOrUndefined(sessionStorage.getItem("token")) && this.checkExpiryTime()){       
      this.userLogged = true;
      this.userName = sessionStorage.getItem("username");
     }else{
       this.userLogged = false;
       this.userName = "No User";
     }
  }
  checkExpiryTime(){
   this.expiryTime = sessionStorage.getItem("tokenexpiry");
   if(new Date(this.expiryTime) >= new Date()){
     return true;
   }else{
     return false;
   }
  }

  ngOnInit(): void {
  }

  logout(){
    sessionStorage.clear();
    location.reload();
  }

}
