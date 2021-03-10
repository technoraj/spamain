import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { GiftCardModal, Reservation, ReservationResponse, ReservationType } from '../models/Reservation';
import { ReservationService } from './reservation.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImageDetail } from '../models/ImageDetails';
import { EnvironmentSettingService } from './environment-setting.service';

@Injectable({
  providedIn: 'root'
})
export class SharedStoreService {
  public reservationData: Reservation = null;
  public giftCardData: GiftCardModal = null;
  public typeOfReservation = new BehaviorSubject(ReservationType.Appointment);
  reservationObservable = this.typeOfReservation.asObservable();
  public refreshData = new BehaviorSubject("");
  refreshObservable = this.refreshData.asObservable();
  lastUrl: string = "";
  public userRole = "";
  public apiUrl = "";
  public options = {};
  public requiredImages: ImageDetail[] = [];
  constructor(private reservationService: ReservationService, private http: HttpClient, private environmentSetting: EnvironmentSettingService) {
    this.apiUrl = this.environmentSetting.getSetting("apiEndPoint");
    this.options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }

  processReservation() {
    if (this.reservationData) {
      this.reservationData.user_Id = sessionStorage.getItem("userId");
      this.reservationData.paymentType = "mollie";
      this.reservationService.createReservation(this.reservationData).subscribe((data: ReservationResponse) => {
        this.reservationData = null;
        if (data.result["value"]["statusCode"] == 500) {
          //show msg in sweet alert
          Swal.fire('', data.result["value"]["responseMsg"], "error");
        } else {
          window.location.href = data.result["value"]["link"];
        }
      });
    }
  }

  processReservationStripe() {
    return new Promise((res, rej) => {
      if (this.reservationData) {
        this.reservationData.user_Id = sessionStorage.getItem("userId");
        this.reservationData.paymentType = "stripe";
        this.reservationService.createReservation(this.reservationData).subscribe((data: ReservationResponse) => {
          this.reservationData = null;
          res(data);
        });
      }
    });
  }

  processReservationWithoutPayment() {
    if (this.reservationData) {
      this.reservationData.user_Id = sessionStorage.getItem("userId");
      this.reservationData.paymentType = "";
      this.reservationService.createReservationWithoutPayment(this.reservationData).subscribe((data: ReservationResponse) => {
        this.reservationData = null;
        if (data["value"]["statusCode"] == 500) {
          //show msg in sweet alert
          Swal.fire('', data.result["value"]["responseMsg"], "error");
        } else {
          Swal.fire('', 'Your Appointment booked', "success");
          this.refreshData.next('reservation');
        }
      });
    }
  }

  processCareReservation() {
    if (this.reservationData) {
      this.reservationData.user_Id = sessionStorage.getItem("userId");
      this.reservationData.formula_Id = "";
      this.reservationData.session_Id = "";
      this.reservationData.paymentType = "mollie";
      this.reservationService.createCareReservation(this.reservationData).subscribe((data: ReservationResponse) => {
        this.reservationData = null;
        if (data.result["value"]["statusCode"] == 500) {
          //show msg in sweet alert
          Swal.fire('', data.result["value"]["responseMsg"], "error");
        } else {
          window.location.href = data.result["value"]["link"];
        }
      });
    }
  }

  processCareReservationStripe() {
    return new Promise((res, rej) => {
      if (this.reservationData) {
        this.reservationData.user_Id = sessionStorage.getItem("userId");
        this.reservationData.formula_Id = "";
        this.reservationData.session_Id = "";
        this.reservationData.paymentType = "stripe";
        this.reservationService.createCareReservation(this.reservationData).subscribe((data: ReservationResponse) => {
          this.reservationData = null;
          res(data);
        });
      }
    });
  }

  processCareWithoutPayment() {
    if (this.reservationData) {
      this.reservationData.user_Id = sessionStorage.getItem("userId");
      this.reservationData.formula_Id = "";
      this.reservationData.session_Id = "";
      this.reservationData.paymentType = "";
      this.reservationService.createCareReservationWithoutPayment(this.reservationData).subscribe((data: ReservationResponse) => {
        this.reservationData = null;
        if (data["value"]["statusCode"] == 500) {
          //show msg in sweet alert
          Swal.fire('', data.result["value"]["responseMsg"], "error");
        } else {
          Swal.fire('', 'Your Care booked', "success");
          this.refreshData.next('care');
        }
      });
    }
  }

  processGiftCardPurchase() {
    if (this.giftCardData) {
      this.giftCardData.user_Id = sessionStorage.getItem("userId");
      this.giftCardData.paymentType = "mollie";
      this.reservationService.purchaseGiftCard(this.giftCardData).subscribe((data: ReservationResponse) => {
        this.giftCardData = null;
        if (data.result["value"]["statusCode"] == 500) {
          //show msg in sweet alert
          Swal.fire('', data.result["value"]["responseMsg"], "error");
        } else {
          window.location.href = data.result["value"]["link"];
        }
      });
    }
  }

  processGiftCardPurchaseStripe() {
    return new Promise((res, rej) => {
      if (this.giftCardData) {
        this.giftCardData.user_Id = sessionStorage.getItem("userId");
        this.giftCardData.paymentType = "stripe";
        this.reservationService.purchaseGiftCard(this.giftCardData).subscribe((data: ReservationResponse) => {
          this.reservationData = null;
          res(data);
        });
      }
    });
  }

  processGiftCardPurchasePaypal() {
    if (this.giftCardData) {
      this.giftCardData.user_Id = sessionStorage.getItem("userId");
      this.reservationService.PurchaseGiftCardPaypal(this.giftCardData).subscribe((data: ReservationResponse) => {
        this.giftCardData = null;
        if (data.result["value"]["statusCode"] == 500) {
          //show msg in sweet alert
          Swal.fire('', data.result["value"]["responseMsg"], "error");
        }
      });
    }
  }

  setReservationType(type) {
    this.typeOfReservation.next(type);
  }

  getAllImages() {
    return this.http.get<ImageDetail[]>(this.apiUrl + 'api/Image/GetImage', this.options).subscribe(data => {
      this.requiredImages = data;
    })
  }

}
