import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../shared/services/reservation.service';
import { Users } from '../../shared/models/Users';
import { LoginService } from '../../shared/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private loginService: LoginService, private reservationService: ReservationService) {
    this.userInfo = {
      firstName: '',
      lastName: '',
      email: '',
      phone: 0,
      address: '',
      city: '',
      RowStatus: '',
      dateOfBirth: new Date(),
      password: '',
      pincode: '',
      userRole: '',
      user_Id: ''
    }
  }
  public userInfo: Users = null;
  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile() {
    let userId = sessionStorage.getItem("userId");
    this.loginService.getUserByUserId(userId).subscribe(data => {
      this.userInfo = data;
    })
  }

  saveProfile() {
    this.reservationService.updateUserInfo(this.userInfo).subscribe(data => {
      if (data == 1) {
        Swal.fire('', 'Enregistré avec succès', "success");
      } else {
        Swal.fire('', 'Un problème est survenu', "error");
      }
    })
  }

}
