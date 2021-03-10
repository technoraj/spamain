import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Promocode, Reservation, ReservationResponse, ReservationType, ReserveServices, Service, Summary } from '../shared/models/Reservation';
import { ReservationService } from '../shared/services/reservation.service';
import { SharedStoreService } from '../shared/services/shared-store.service';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnChanges {
  @Input() summaryData: Summary = null;
  @Input() saveReservation: boolean = false;
  public type: string = "";
  public reservationType = ReservationType;
  public promoCodes: Promocode[] = [];
  public enterCode: string = "";
  public isPromoApplied: number = 0;
  public isGiftcardApplied: number = 0;
  public codeError: boolean = false;
  @Output() selectedService = new EventEmitter<any>(null)
  constructor(private router: Router, private reservationService: ReservationService, private sharedStoreService: SharedStoreService) { }
  ngOnChanges(): void {
    if (this.summaryData != null) {
      this.type = this.summaryData.reservationType;
      this.applyCode();
    }
    if (this.saveReservation) {
      this.procedeToPayment();
      this.saveReservation = false;
    }
  }

  ngOnInit(): void {
    this.getPromoCodes();
  }

  getPromoCodes() {
    this.reservationService.getAllPromocodes().subscribe(data => {
      this.promoCodes = data;
    })
  }

  procedeToPayment() {
    let reserveServices: ReserveServices[] = [];
    this.summaryData.selectedServices.forEach(x => {
      let _reserveService: ReserveServices = {
        quantity: x.count,
        service_Id: x.service_Id
      };
      reserveServices.push(_reserveService);
    });
    let reservation: Reservation = {
      center_Id: this.summaryData.selectedCenter.center_Id,
      date: new Date(this.summaryData.selectedDate).toLocaleDateString(),
      formula_Id: this.summaryData.reservationType == ReservationType.Appointment ? this.summaryData.selectedFormula.formula_Id : '',
      isGiftApplied: this.isGiftcardApplied,
      isPromoApplied: this.isPromoApplied,
      session_Id: this.summaryData.reservationType == ReservationType.Appointment ? this.summaryData.selectedSession.session_Id : '',
      totalPayment: this.summaryData.totalAmount,
      user_Id: sessionStorage.getItem("userId"),
      gift_Cd: this.isGiftcardApplied == 1 ? this.enterCode : '',
      payment_Id: "",
      payment_Status: "",
      promoCode: this.isPromoApplied == 1 ? this.enterCode : '',
      services: reserveServices
    }
    this.sharedStoreService.reservationData = reservation;
    if (this.summaryData.reservationType == ReservationType.Appointment)
      this.router.navigateByUrl('app-home/payment/reservation');
    else if (this.summaryData.reservationType == ReservationType.Care)
      this.router.navigateByUrl('app-home/payment/care');
  }


  getTotal(): number {
    let count: number = 0;
    if (this.summaryData.selectedFormula)
      count += this.summaryData.selectedFormula.price;
    this.summaryData.selectedServices.forEach(x => {
      count += x.price * x.count
    });
    return count;

  }

  reduceServiceCount(service: Service) {
    if (service.count > 0) {
      service.count = service.count - 1;
      this.applyCode();
      this.selectedService.emit(service);
    }

  }

  increaseSericeCount(service: Service) {
    service.count = service.count + 1;
    this.applyCode();
    this.selectedService.emit(service);
  }

  removeSelectedService(service: Service) {
    let index = this.summaryData.selectedServices.findIndex(x => x.service_Id == service.service_Id);
    this.summaryData.selectedServices.splice(index, 1);
    this.applyCode();
  }

  applyCode() {
    if (this.enterCode.trim() != "") {
      let index = this.promoCodes.findIndex(x => x.code.toLowerCase() == this.enterCode.toLowerCase());
      if (index != -1) {
        if (this.promoCodes[index].is_Active == 1 && new Date(this.promoCodes[index].valid_Till) >= new Date()) {
          this.summaryData.totalAmount = this.getTotal() - ((this.getTotal() * this.promoCodes[index].percentage_off) / 100);
          if (this.summaryData.totalAmount < 0)
            this.summaryData.totalAmount = 0;
          this.isPromoApplied = 1;
          this.codeError = false;
        } else {
          //promo code is not active to apply
          this.isPromoApplied = 0;
          this.isGiftcardApplied = 0;
          this.summaryData.totalAmount = this.getTotal();
          this.codeError = true;
        }
      } else {
        //may be a gift card code
        //call api to check how much need to be reduce
        this.reservationService.checkGiftCode(this.enterCode).subscribe((response: number) => {
          if (response == 0) {
            this.isGiftcardApplied = 0;
            this.isPromoApplied = 0;
            this.codeError = true;
            this.summaryData.totalAmount = this.getTotal();
          } else {
            this.summaryData.totalAmount = this.getTotal() - response;
            if (this.summaryData.totalAmount < 0)
              this.summaryData.totalAmount = 0;
            this.isGiftcardApplied = 1;
            this.codeError = false;
          }
        })
      }
    } else {
      this.isGiftcardApplied = 0;
      this.isPromoApplied = 0;
      this.codeError = false;
      this.summaryData.totalAmount = this.getTotal();
    }
  }

  createImgPath(id: number) {
    let image = this.sharedStoreService.requiredImages.find(x => x.image_Id == id);
    if (image) {
      image.docFile = image.docFile.replace(/\\/g, "/");
      return this.sharedStoreService.apiUrl + image.docFile;
    }
  }

}
