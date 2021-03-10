import { Injectable } from '@angular/core';
import { IdPassword } from '../models/IdPassword';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentSettingService } from './environment-setting.service';
import { Credential } from '../models/Credential';
import { Users } from '../models/Users';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiBaseUrl = this.environmentSetting.getSetting("apiEndPoint");
  private authenticationUrl = this.environmentSetting.getSetting("authenticationEndPoint");
  //local variable used in login service
  errorMsg : any;

 constructor(private http: HttpClient, private router : Router, private environmentSetting: EnvironmentSettingService) { }

  //method to get header
  getHeader(){
    let token = sessionStorage.getItem("token");
    let header = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return header;
  }

//check details of a particular user by emailid and password
 check(userData:IdPassword){
  let options = {
    headers: this.getHeader()
  }
  return this.http.post(this.apiBaseUrl+'api/Login/check', userData, options);
}

 //this method is used to get the token
 getToken(auth:Credential)
 {
   let options = { headers: this.getHeader() };
   return this.http.post(this.authenticationUrl+'api/TokenGeneration/createtoken', auth, options);
 }

 //this method is used to get the token
 createAccount(user:Users)
 {
   let options = { headers: this.getHeader() };
   return this.http.post(this.apiBaseUrl+'api/Login',user,options);
 }

 emailto(email:string){
  let options = { headers: this.getHeader() };
  return this.http.post(this.apiBaseUrl+'api/ForgotPassword?email='+email,null,options);
 }

 checkTmpCode(email,code){
  let options = { headers: this.getHeader() };
  return this.http.post(this.apiBaseUrl+'api/ForgotPassword/CheckTmpPassword?email='+email+'&code='+code,null,options);
 }

 getUserByCode(code:string){
  let options = { headers: this.getHeader() };
  return this.http.post(this.apiBaseUrl+'api/ForgotPassword/GetUserByCode?code='+code,null,options);
 }

 updatePassword(users:Users){
  let options = { headers: this.getHeader() };
  return this.http.put(this.apiBaseUrl+'api/Login/UpdatePassword',users,options);
 }

 getUserByUserId(user_Id:string){
  let options = { headers: this.getHeader() };
  return this.http.post<Users>(this.apiBaseUrl+'api/Login/GetUserByUserId?userId='+user_Id,null,options);
 }


   
}
