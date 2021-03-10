import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../shared/services/reservation.service';
import { SharedStoreService } from '../shared/services/shared-store.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { EnvironmentSettingService } from '../shared/services/environment-setting.service';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js/pure';
import { ReservationResponse } from '../shared/models/Reservation';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  public type: string = "";
  public paymentStatus: string = "";
  public payPalConfig?: IPayPalConfig;
  public currency: string = "EUR";
  public paypalKey: string;
  public purchase_units: any;
  public stripePublishKey:string = "";
  constructor(private router: Router, private route: ActivatedRoute, private reservationService: ReservationService,
    private sharedStoreService: SharedStoreService, private settingService: EnvironmentSettingService) {
    this.currency = this.settingService.getSetting("Currency");
    this.paypalKey = this.settingService.getSetting("paypalKey");
    this.stripePublishKey = this.settingService.getSetting("stripePublishKey");
    this.route.params.subscribe((param) =>
      this.type = param['type']
    );
  }

  ngOnInit(): void {
    this.initializePayment();
    this.initConfig();
  }

  initializePayment() {
    if (this.type == 'reservation') {
      if (this.sharedStoreService.reservationData != null) {
        this.preparePurchaseForReservationData();
        if (this.sharedStoreService.reservationData.totalPayment == 0 || this.sharedStoreService.userRole.toLowerCase() == 'admin') {
          this.sharedStoreService.processReservationWithoutPayment();
          if (this.sharedStoreService.userRole.toLowerCase() == 'admin') {
            this.router.navigateByUrl('app-home/app-admin/reservemanage');
          } else {
            this.router.navigateByUrl('app-home/user');
          }

        }
      } else {
        this.router.navigateByUrl('app-home/user');
      }

    }
    else if (this.type == 'care') {
      if (this.sharedStoreService.reservationData != null) {
        this.preparePurchaseForReservationData();
        if (this.sharedStoreService.reservationData.totalPayment == 0 || this.sharedStoreService.userRole.toLowerCase() == 'admin') {
          this.sharedStoreService.processCareWithoutPayment();
          if (this.sharedStoreService.userRole.toLowerCase() == 'admin') {
            this.router.navigateByUrl('app-home/app-admin/reservemanage');
          } else {
            this.router.navigateByUrl('app-home/user');
          }
        }
      } else {
        this.router.navigateByUrl('app-home/user');
      }
    }
    else if (this.type == 'giftCard') {
      this.preparePurchaseForGiftCardData();
      if (this.sharedStoreService.giftCardData == null) {
        this.router.navigateByUrl('app-home/user');
      }
    }
  }

  makeMolliePayment() {
    if (this.type == 'reservation')
      this.sharedStoreService.processReservation();
    else if (this.type == 'care')
      this.sharedStoreService.processCareReservation();
    else if (this.type == 'giftCard')
      this.sharedStoreService.processGiftCardPurchase();
  }

  async makeStripePayment() {
    const stripe = await loadStripe(this.stripePublishKey);
    if (this.type == 'reservation') {
      this.sharedStoreService.processReservationStripe().then((data: ReservationResponse) => {
        if (data.result["value"]["statusCode"] == 500) {
          Swal.fire('', data.result["value"]["responseMsg"], "error");
        } else {
          return stripe.redirectToCheckout({ sessionId: data.result["value"]["id"] });
        }
      }).then(result => {
        if (result.error) {
          Swal.fire('', result.error.message, 'error');
        }
      });
    } else if (this.type == 'care') {
      this.sharedStoreService.processCareReservationStripe().then((data: ReservationResponse) => {
        if (data.result["value"]["statusCode"] == 500) {
          Swal.fire('', data.result["value"]["responseMsg"], "error");
        } else {
          return stripe.redirectToCheckout({ sessionId: data.result["value"]["id"] });
        }
      }).then(result => {
        if (result.error) {
          Swal.fire('', result.error.message, 'error');
        }
      });
    } else if (this.type == 'giftCard') {
      this.sharedStoreService.processGiftCardPurchaseStripe().then((data: ReservationResponse) => {
        if (data.result["value"]["statusCode"] == 500) {
          Swal.fire('', data.result["value"]["responseMsg"], "error");
        } else {
          return stripe.redirectToCheckout({ sessionId: data.result["value"]["id"] });
        }
      }).then(result => {
        if (result.error) {
          Swal.fire('', result.error.message, 'error');
        }
      });
    }
    
  }

  initConfig() {
    this.payPalConfig = {
      currency: this.currency,
      clientId: this.paypalKey,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: this.settingService.getSetting("intent"),
        purchase_units: this.purchase_units
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {

      },
      onClientAuthorization: (data) => {
        if (data.status == "COMPLETED") {
          this.handlePaypalResponse(data.id);
        } else {
          Swal.fire("Oops! une erreur s'est produite. Si de l'argent est déduit, veuillez contacter le centre.", '', 'error');
        }

      },
      onCancel: (data, actions) => {
        Swal.fire('Transaction annulée, réessayer', '', 'info');
      },
      onError: err => {
        Swal.fire("Oops! une erreur s'est produite. Si de l'argent est déduit, veuillez contacter le centre.", '', 'error');
      }
    }
  }

  preparePurchaseForReservationData() {
    this.purchase_units = [
      {
        amount: {
          currency_code: this.currency,
          value: this.sharedStoreService.reservationData.totalPayment.toString(),
          breakdown: {
            item_total: {
              currency_code: this.currency,
              value: this.sharedStoreService.reservationData.totalPayment.toString()
            }
          }
        },
        items: [
          {
            name: this.sharedStoreService.reservationData.services.toString(),
            quantity: this.sharedStoreService.reservationData.services.length.toString(),
            unit_amount: {
              currency_code: this.currency,
              value: this.sharedStoreService.reservationData.totalPayment.toString(),
            },
          }
        ]
      }
    ];
  }

  preparePurchaseForGiftCardData() {
    this.purchase_units = [
      {
        amount: {
          currency_code: this.currency,
          value: this.sharedStoreService.giftCardData.price.toString(),
          breakdown: {
            item_total: {
              currency_code: this.currency,
              value: this.sharedStoreService.giftCardData.price.toString()
            }
          }
        },
        items: [
          {
            name: this.sharedStoreService.giftCardData.recipientName.toString(),
            quantity: "1",
            unit_amount: {
              currency_code: this.currency,
              value: this.sharedStoreService.giftCardData.price.toString(),
            },
          }
        ]
      }
    ];
  }

  handlePaypalResponse(id: string) {

    if (this.type == 'reservation') {
      this.sharedStoreService.reservationData.payment_Id = id;
      this.sharedStoreService.reservationData.payment_Status = "paid";
      this.sharedStoreService.reservationData.paymentType = "paypal";
      this.sharedStoreService.processReservationWithoutPayment();
    }

    else if (this.type == 'care') {
      this.sharedStoreService.reservationData.payment_Id = id;
      this.sharedStoreService.reservationData.payment_Status = "paid";
      this.sharedStoreService.reservationData.paymentType = "paypal";
      this.sharedStoreService.processCareWithoutPayment();
    }

    else if (this.type == 'giftCard') {
      this.sharedStoreService.giftCardData.paymentId = id;
      this.sharedStoreService.giftCardData.paymentType = "paypal";
      this.sharedStoreService.processGiftCardPurchasePaypal();
    }


    this.router.navigateByUrl('app-home/user');
  }

}
