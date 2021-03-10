import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GiftCard, GiftCardModal } from '../shared/models/Reservation';
import { ReservationService } from '../shared/services/reservation.service';
import { SharedStoreService } from '../shared/services/shared-store.service';

@Component({
  selector: 'app-gift-card-purchase',
  templateUrl: './gift-card-purchase.component.html',
  styleUrls: ['./gift-card-purchase.component.css']
})
export class GiftCardPurchaseComponent implements OnInit {
  public giftCardModel: GiftCardModal = null;
  public giftCards: GiftCard[] = [];
  constructor(private router: Router, private reservationService: ReservationService, private sharedStoreService: SharedStoreService) {
    this.giftCardModel = {
      comment: "",
      recipientName: "",
      giftCardId: "",
      price: 0,
      user_Id:'',
      paymentId:"",
      paymentType:""
    }
  }

  ngOnInit(): void {
    this.getGiftCards();
  }

  getGiftCards() {
    this.reservationService.getGiftCards().subscribe(data => {
      this.giftCards = data;
      this.giftCards.forEach(card => {
        let detail = card.detail ? ' / ' + card.detail : '';
        card.label = card.name + '- €' + card.price + detail;
      })
    })
  }

  buyGiftCard() {
    this.giftCardModel.price = this.giftCards.filter(x => x.giftCard_Id.toString() === this.giftCardModel.giftCardId)[0].price;
    this.giftCardModel.user_Id = sessionStorage.getItem("userId");
    this.sharedStoreService.giftCardData = this.giftCardModel;
    this.router.navigateByUrl('app-home/payment/giftCard');
  }

}
