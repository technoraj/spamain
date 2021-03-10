import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationType } from '../shared/models/Reservation';
import { SharedStoreService } from '../shared/services/shared-store.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public ReservationType = ReservationType;
  constructor(private router: Router, private sharedStoreService: SharedStoreService) { }

  ngOnInit(): void {
  }

  setReservationType(type: ReservationType) {
    this.sharedStoreService.setReservationType(type);
    this.router.navigateByUrl('app-home/reservation');
  }

}
