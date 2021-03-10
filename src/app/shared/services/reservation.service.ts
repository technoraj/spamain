import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppointmentModal, Center, Formula, GiftCard, GiftCardBought, GiftCardModal, Promocode, Reservation, ReservationResponse, Service, Session } from '../models/Reservation';
import { Users } from '../models/Users';
import { EnvironmentSettingService } from './environment-setting.service';
@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  public apiUrl = "";
  public serviceCategories = [];
  public options = {};
  constructor(private http: HttpClient, private environmentSetting: EnvironmentSettingService) {
    this.apiUrl = this.environmentSetting.getSetting("apiEndPoint");
    this.serviceCategories = this.environmentSetting.getSetting("productCategories");
  }

  getServiceCategories() {
    return this.serviceCategories;
  }
  createReservation(reservation: Reservation) {
    let token = sessionStorage.getItem("token");
    if (!token) {
      token = "";
    }
    let option = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) };
    let port = location.port ? ':' + location.port : '';
    let hostUrl = location.hostname + port;
    return this.http.post<ReservationResponse>(this.apiUrl + 'api/Reservation/Create/' + location.protocol + '/' + hostUrl, reservation, option)
  }

  createReservationWithoutPayment(reservation: Reservation) {
    let token = sessionStorage.getItem("token");
    if (!token) {
      token = "";
    }
    let option = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) };
    return this.http.post<ReservationResponse>(this.apiUrl + 'api/Reservation/CreateWithoutPayment', reservation, option)
  }

  createCareReservation(reservation: Reservation) {
    let token = sessionStorage.getItem("token");
    if (!token) {
      token = "";
    }
    let port = location.port ? ':' + location.port : '';
    let hostUrl = location.hostname + port;
    let option = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) };
    return this.http.post<ReservationResponse>(this.apiUrl + 'api/Reservation/Care/' + location.protocol + '/' + hostUrl, reservation, option)
  }

  createCareReservationWithoutPayment(reservation: Reservation) {
    let token = sessionStorage.getItem("token");
    if (!token) {
      token = "";
    }
    let option = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) };
    return this.http.post<ReservationResponse>(this.apiUrl + 'api/Reservation/CareWithoutPayment', reservation, option)
  }

  purchaseGiftCard(giftCard: GiftCardModal) {
    let token = sessionStorage.getItem("token");
    if (!token) {
      token = "";
    }
    let port = location.port ? ':' + location.port : '';
    let hostUrl = location.hostname + port;
    let option = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) };
    return this.http.post<ReservationResponse>(this.apiUrl + 'api/Reservation/GiftCard/' + location.protocol + '/' + hostUrl, giftCard, option)
  }

  PurchaseGiftCardPaypal(giftCard: GiftCardModal){
    let token = sessionStorage.getItem("token");
    if (!token) {
      token = "";
    }
    let port = location.port ? ':' + location.port : '';
    let hostUrl = location.hostname + port;
    let option = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) };
    return this.http.post<ReservationResponse>(this.apiUrl + 'api/Reservation/PurchaseGiftCardPaypal', giftCard, option);
  }

  getPaymentResponse(id, type) {
    let token = sessionStorage.getItem("token");
    if (!token) {
      token = "";
    }
    let option = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) };
    let url = this.apiUrl + 'api/Reservation/GetPaymentStatus/' + id + '/' + type;
    return this.http.get<ReservationResponse>(url, option)
  }

  getCenters(): any {
    return this.http.get<Center[]>(this.apiUrl + 'api/Centers', this.options)
  }

  getSessions(centerId: string, date: string): any {
    let body = {
      SelectedDate: date
    }
    return this.http.post<Session[]>(this.apiUrl + 'api/Centers/Sessions/' + centerId, body, this.options)
  }

  getAllPromocodes() {
    return this.http.get<Promocode[]>(this.apiUrl + 'api/Reservation/GetAllPromos', this.options);
  }

  getFormulas(data): any {
    return this.http.post<Formula[]>(this.apiUrl + 'api/Centers/GetFormula', data, this.options)
  }

  getServices(): any {
    return this.http.get<Service[]>(this.apiUrl + 'api/Centers/Services', this.options)
  }

  checkGiftCode(code: String) {
    let token = sessionStorage.getItem("token");
    if (!token) {
      token = "";
    }
    return this.http.get(this.apiUrl + 'api/Reservation/CheckGiftCode/' + code, this.options);
  }

  getUserGiftCards(userId: string) {
    let token = sessionStorage.getItem("token");
    if (!token) {
      token = "";
    }
    let option = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) };
    return this.http.get<GiftCardBought[]>(this.apiUrl + '/api/Reservation/GetUserGiftcards/' + userId, option);
  }

  getUserAppointments(userId: string) {
    let token = sessionStorage.getItem("token");
    if (!token) {
      token = "";
    }
    let option = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) };
    return this.http.get<AppointmentModal[]>(this.apiUrl + '/api/Reservation/GetUserAppointments/' + userId, option);
  }

  getUserCares(userId: string) {
    let token = sessionStorage.getItem("token");
    if (!token) {
      token = "";
    }
    let option = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) };
    return this.http.get<AppointmentModal[]>(this.apiUrl + '/api/Reservation/GetUserCare/' + userId, option);
  }

  updateUserInfo(user: Users) {
    let token = sessionStorage.getItem("token");
    if (!token) {
      token = "";
    }
    let option = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) };
    return this.http.post<number>(this.apiUrl + 'api/Reservation/UpdateUser', user, option)
  }

  getGiftCards(){
    return this.http.get<GiftCard[]>(this.apiUrl + '/api/Centers/GetGiftCards', this.options);
  }
}
