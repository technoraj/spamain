import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MainBodyComponent } from './main-body/main-body.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AdminComponent } from './admin/admin.component';
import { UsermanagementComponent } from './admin/usermanagement/usermanagement.component';
import { LoginauthGuard } from './shared/guard/loginauth.guard';
import { PaymentComponent } from './payment/payment.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { GiftCardPurchaseComponent } from './gift-card-purchase/gift-card-purchase.component';
import { ProfileComponent } from './user-dashboard/profile/profile.component';
import { OrderComponent } from './user-dashboard/order/order.component';
import { ReserveManageComponent } from './admin/reserve-manage/reserve-manage.component';
import { FormulasComponent } from './admin/formulas/formulas.component';
import { ProductsComponent } from './admin/products/products.component';
import { GiftcardComponent } from './admin/giftcard/giftcard.component';
import { CareadminComponent } from './admin/careadmin/careadmin.component';
import { ContactComponent } from './contact/contact.component';
import { AdminGuard } from './shared/guard/admin.guard';
import { PromocodeComponent } from './admin/promocode/promocode.component';

const routes: Routes = [
  { path: "", redirectTo: 'app-home', pathMatch: "full" },
  {
    path: 'app-home', component: HomeComponent,
    children: [
      { path: "", redirectTo: 'app-main-body', pathMatch: "full" },
      { path: 'app-main-body', component: MainBodyComponent },
      { path: 'app-login', component: LoginComponent },
      { path: 'app-register', component: RegisterComponent },
      { path: 'app-forgot-password', component: ForgotPasswordComponent },
      { path: 'app-change-password/:id', component: ChangePasswordComponent },
      { path: 'payment/:type', component: PaymentComponent, canActivate: [LoginauthGuard] },
      { path: 'reservation', component: ReservationComponent },
      { path: 'user/:type/:id', component: UserDashboardComponent, canActivate: [LoginauthGuard] },
      { path: 'contact', component: ContactComponent},
      {
        path: 'user', component: UserDashboardComponent, canActivate: [LoginauthGuard],
        children: [
          { path: "", redirectTo: 'order', pathMatch: "full" },
          { path: 'profile', component: ProfileComponent },
          { path: 'order', component: OrderComponent }
        ]
      },
      { path: 'gift-card', component: GiftCardPurchaseComponent },
      {
        path: 'app-admin', component: AdminComponent,
        children: [
            { path: 'usermanagement', component: UsermanagementComponent, canActivate: [LoginauthGuard,AdminGuard] },
            { path: 'reservemanage', component: ReserveManageComponent, canActivate: [LoginauthGuard,AdminGuard] },
            { path: 'formulas', component: FormulasComponent, canActivate: [LoginauthGuard,AdminGuard] },
            { path: 'products', component: ProductsComponent, canActivate: [LoginauthGuard,AdminGuard] },
            { path: 'giftcard', component: GiftcardComponent, canActivate: [LoginauthGuard,AdminGuard] },
            { path: 'careadmin', component: CareadminComponent, canActivate: [LoginauthGuard,AdminGuard] },
            { path: 'promocode', component: PromocodeComponent, canActivate: [LoginauthGuard,AdminGuard] }
        ]
      }
    ]
  },
  { path: "**", redirectTo: 'app-home', pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
