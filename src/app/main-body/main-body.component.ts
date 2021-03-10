import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationType } from '../shared/models/Reservation';
import { SharedStoreService } from '../shared/services/shared-store.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-main-body',
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.css']
})
export class MainBodyComponent implements OnInit, AfterViewInit {
  public ReservationType = ReservationType;
  constructor(private router: Router, private sharedStoreService: SharedStoreService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    //this.animateCounter();
  }

  animateCounter() {
    // var number_animate = <any>$(".number-animate");
    // if (number_animate.length > 0) {
    //   number_animate.appear();
    //   $(document.body).on('appear', '.numeric-count', function () {
    //     number_animate.each(function () {
    //       ($(this) as any).animateNumbers($(this).attr("data-value"), true, parseInt($(this).attr("data-animation-duration"), 10));
    //     });
    //   });
    // }
  }

  



  setReservationType(type: ReservationType) {
    this.sharedStoreService.setReservationType(type);
    this.router.navigateByUrl('app-home/reservation');
  }

}
