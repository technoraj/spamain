import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ReservationType } from '../shared/models/Reservation';
import { AdminService } from '../shared/services/admin.service';
import { SharedStoreService } from '../shared/services/shared-store.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  
  showAdminDetail:boolean = false;
  adminInfo:any;
  public menuItem;

  constructor(private router:Router, private adminService:AdminService,private sharedStoreService:SharedStoreService) { 
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) { 
        this.checkAdminPage();
        this.getUserRole();
      }
    });
   
  }

  ngOnInit(): void {
    
  }

  checkAdminPage(){
    
    if(this.router.url == "/app-home/app-admin"){  
      this.adminService.getAdminDashboard().subscribe((data) =>{
        this.adminInfo = data;
        this.showAdminDetail = true;
        this.sharedStoreService.setReservationType(ReservationType.Appointment)
      });
    }else{
      this.showAdminDetail = false;
    }
  }

  getUserRole() {
      if(this.sharedStoreService.userRole != "ADMIN"){
          this.router.navigate(["app-home"]);
      }
    }

  logout(){
    sessionStorage.clear();
    location.reload();
  }

}
