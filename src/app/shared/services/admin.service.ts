import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentSettingService } from './environment-setting.service';
import { Observable } from 'rxjs';
import { Users } from '../models/Users';
import { GiftCard, Promocode } from '../models/Reservation';
import { Reservation, Formula, Center, Service,Session } from '../models/Reservation';
import { IOptions } from 'minimatch';
import { ImageDetail } from '../models/ImageDetails';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  apiBaseUrl = this.environmentSetting.getSetting("apiEndPoint");
  authenticationUrl = this.environmentSetting.getSetting("authenticationEndPoint");
  
  constructor(private http: HttpClient, private environmentSetting:EnvironmentSettingService) { }

  //method to get header
  getHeader(){
    let token = sessionStorage.getItem("token");
    let header = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return header;
  }
  //this method is used to get the token
  getUsers():Observable<Users[]>
 {
   let options = { headers: this.getHeader() };
   return this.http.get<Users[]>(this.apiBaseUrl+'api/Login', options);
 }

  saveChanges(users:any){
  let options = { headers: this.getHeader() };
  return this.http.post(this.apiBaseUrl+'api/Admin/SaveChanges',users, options);
  }

  getGiftCards(){
    let options = { headers: this.getHeader() };
    return this.http.get<GiftCard[]>(this.apiBaseUrl + '/api/Admin/GetGiftCards', options);
  }
  saveReservation(reserve:any){
    let options = { headers: this.getHeader() };
    return this.http.post(this.apiBaseUrl+'api/Admin/SaveReservation',reserve, options);
  }

  getFormulas(){
    let options = { headers: this.getHeader() };
    return this.http.get<Formula[]>(this.apiBaseUrl+'api/Admin/GetFormulas', options);
  }

  getReservation(){
    let options = { headers: this.getHeader() };
    return this.http.get<Reservation[]>(this.apiBaseUrl+'api/Admin/GetReservation', options);
  }

  getServices(){
    let options = { headers: this.getHeader() };
    return this.http.get<Service[]>(this.apiBaseUrl+'api/Admin/GetServices', options);
  }

  getSessions(){
    let options = { headers: this.getHeader() };
    return this.http.get<Session[]>(this.apiBaseUrl+'api/Admin/GetSessions', options);
  }

  getCenters(){
    let options = { headers: this.getHeader() };
    return this.http.get<Center[]>(this.apiBaseUrl+'api/Admin/GetCenters', options);
  }

  saveImage(image:ImageDetail){
    let options = { headers: this.getHeader() };
    return this.http.post<number>(this.apiBaseUrl+'api/Image/SaveImage',image, options);
  }

  uploadImage(image:FormData){
    let token = sessionStorage.getItem("token");
    let headers = new HttpHeaders();
    headers.append("content-type","application/octet-stream");
    headers.append("Authorization", "Bearer " + token);

    return this.http.post<number>(this.apiBaseUrl+'api/Image/Upload', image, {headers: headers});
  }

  getImage(){
    let options = { headers: this.getHeader() };
    return this.http.get<ImageDetail[]>(this.apiBaseUrl+'api/Image/GetImage', options);
  }

  saveFormulas(formu:any){
    let options = { headers: this.getHeader() };
    return this.http.post(this.apiBaseUrl+'api/Admin/SaveFormulas',formu, options);
  }

  saveProduct(formu:any){
    let options = { headers: this.getHeader() };
    return this.http.post(this.apiBaseUrl+'api/Admin/SaveProducts',formu, options);
  }

  SaveGiftCards(formu:any){
    let options = { headers: this.getHeader() };
    return this.http.post(this.apiBaseUrl+'api/Admin/SaveGiftCards',formu, options);
  }

  saveFormulaImageMapping(id:string, imageId:number){
   let imageView = {
      EntityId : id,
      ImageId : imageId,
      EntityType : "FORMULAS"
    }
    let options = { headers: this.getHeader() };
    return this.http.post(this.apiBaseUrl+'api/Admin/SaveImageMapping', imageView, options);
  }

  saveProductImageMapping(id:string, imageId:number){
    let imageView = {
       EntityId : id,
       ImageId : imageId,
       EntityType : "PRODUCTS"
     }
     let options = { headers: this.getHeader() };
     return this.http.post(this.apiBaseUrl+'api/Admin/SaveImageMapping', imageView, options);
   }

   saveGiftCardImageMapping(id:string, imageId:number){
    let imageView = {
       EntityId : id,
       ImageId : imageId,
       EntityType : "GIFTCARDS"
     }
     let options = { headers: this.getHeader() };
     return this.http.post(this.apiBaseUrl+'api/Admin/SaveImageMapping', imageView, options);
   }

   getReserveCare(){
    let options = { headers: this.getHeader() };
    return this.http.get<Reservation[]>(this.apiBaseUrl+'api/Reservation/GetReserveCare', options);
   }

   deleteReserveCare(id:any){
    let options = { headers: this.getHeader() };
    return this.http.delete(this.apiBaseUrl+'api/Admin/DeleteCare/'+id, options);
   }

   addContact(name, email, subject, comment){
    let contact = {
      name : name,
      email : email,
      subject : subject,
      comment: comment
    }
    
    let options = { headers: this.getHeader() };
    return this.http.post(this.apiBaseUrl+'api/Admin/SaveContact', contact, options);
   }

   getAdminDashboard(){
    let options = { headers: this.getHeader() };
    return this.http.get(this.apiBaseUrl+'api/Admin/GetAdminDashBoard', options);
   }

   savePromocode(formu:any){
    let options = { headers: this.getHeader() };
    return this.http.post(this.apiBaseUrl+'api/Admin/SavePromocode',formu, options);
  }

   getPromocode(){
    let options = { headers: this.getHeader() };
    return this.http.get<Promocode[]>(this.apiBaseUrl+'api/Admin/GetPromocode', options);
  }

}
