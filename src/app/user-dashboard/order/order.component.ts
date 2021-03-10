import { Component, OnInit } from '@angular/core';
import { SharedStoreService } from '../../shared/services/shared-store.service';
import { AppointmentModal, GiftCardBought } from '../../shared/models/Reservation';
import { ReservationService } from '../../shared/services/reservation.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public giftCards: GiftCardBought[] = [];
  public selectGiftCard: GiftCardBought = null;
  public appointments: AppointmentModal[] = [];
  public cares: AppointmentModal[] = [];
  public selectedAppointment = null;
  public selectedCare = null;
  public appointmentPopUp: string = "none";
  public carePopUp: string = "none";
  public giftCardPopUp: string = "none";
  constructor(private reservationService: ReservationService, private sharedStoreService: SharedStoreService) {
    this.sharedStoreService.refreshObservable.subscribe(type => {
      if (type == 'reservation') {
        this.getAppointments();
      } else if (type == 'care') {
        this.getCares();
      }
    })
  }
  public typeOfTable = ['List of Appointment', 'List of Care', 'List of GiftCards'];
  ngOnInit(): void {
    this.getGiftCards();
    this.getAppointments();
    this.getCares();
  }

  getGiftCards() {
    let userId = sessionStorage.getItem("userId");
    this.reservationService.getUserGiftCards(userId).subscribe(data => {
      this.giftCards = data;
      this.giftCards.reverse();
    })
  }

  getAppointments() {
    let userId = sessionStorage.getItem("userId");
    this.reservationService.getUserAppointments(userId).subscribe(data => {
      this.appointments = data;
      this.appointments.sort((a, b) => {
        let dateA = a.date, dateB = b.date;
        if (dateA > dateB)
          return -1
        else if (dateB > dateA)
          return 1
        else
          return 0
      })
    })
  }

  getCares() {
    let userId = sessionStorage.getItem("userId");
    this.reservationService.getUserCares(userId).subscribe(data => {
      this.cares = data;
      this.cares.forEach(care => {
        care.services =care.service.map(x => x.name).join(', ');
      })
      this.cares.reverse();
    })
  }

  chooseGiftCard(card) {
    this.selectGiftCard = card;
    this.giftCardPopUp = 'block';
  }

  chooseAppointment(appointment) {
    this.selectedAppointment = appointment;
    this.appointmentPopUp = 'block';
  }


  chooseCare(care) {
    this.selectedCare = care;
    this.carePopUp = 'block';
  }

}
