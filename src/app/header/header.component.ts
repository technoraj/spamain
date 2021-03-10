import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { LoginService } from '../shared/services/login.service';
import { SharedStoreService } from '../shared/services/shared-store.service';
import { ReservationType } from '../shared/models/Reservation';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges {
  public ReservationType = ReservationType;
  userRole: string = "";
  @Input() userLogged: boolean;
  @Input() userName: string = "No User";
  constructor(private router: Router, private loginService: LoginService, private sharedStoreService: SharedStoreService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getUserRole();
  }

  setReservationType(type: ReservationType) {
    this.sharedStoreService.setReservationType(type);
    this.router.navigateByUrl('app-home/reservation');
  }

  toggle() {
    let element = document.getElementById('navbarDropdown');
    if (element.classList.contains('show')) {
      element.classList.remove('show');
    } else {
      element.classList.add('show');
    }

  }

  getUserRole() {
    let user_Id = sessionStorage.getItem("userId");
    let token = sessionStorage.getItem("token");
    if(user_Id != null && token != null){
      let user = this.loginService.getUserByUserId(user_Id).subscribe(x => {
        this.userRole = x.userRole;
        this.sharedStoreService.userRole = this.userRole;
      });
    }
  }

  logout() {
    sessionStorage.clear();
    location.reload();
  }

}
