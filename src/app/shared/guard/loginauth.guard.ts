import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { SharedStoreService } from '../services/shared-store.service';

@Injectable({
  providedIn: 'root'
})
export class LoginauthGuard implements CanActivate {
 
expiryTime:string;
constructor(private router:Router,private sharedStoreService:SharedStoreService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.login()) {
        this.sharedStoreService.lastUrl = route['_routerState'].url;
        this.router.navigate(['/app-home/app-login']);
        return false;
      }
      return true;
  }

  login():boolean{
    if(!isNullOrUndefined(sessionStorage.getItem("token")) && !isNullOrUndefined(sessionStorage.getItem("userId"))  && this.checkExpiryTime()){       
       return true;
     }else{
       return false;
     }
  }

  checkExpiryTime(){
    this.expiryTime = sessionStorage.getItem("tokenexpiry");
    if(new Date(this.expiryTime) >= new Date()){
      return true;
    }else{
      return false;
    }
   }
  
}
