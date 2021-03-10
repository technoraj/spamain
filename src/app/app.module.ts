import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { EnvironmentSettingService } from './shared/services/environment-setting.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { ReservationComponent } from './reservation/reservation.component';
import { ExponentialStrengthPipe,imageNameTrasnformPipe } from './shared/pipes/pipes';
import { showLablePipe } from './shared/pipes/showlable.pipe';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainBodyComponent } from './main-body/main-body.component';
import { PaymentComponent } from './payment/payment.component';
import { AdminComponent } from './admin/admin.component';


import { CalendarModule } from 'primeng/calendar';
import { ToastModule} from 'primeng/toast';
import { SliderModule} from 'primeng/slider';
import { MultiSelectModule} from 'primeng/multiselect';
import { ContextMenuModule} from 'primeng/contextmenu';
import { DialogModule} from 'primeng/dialog';
import { ButtonModule} from 'primeng/button';
import { DropdownModule} from 'primeng/dropdown';
import { ProgressBarModule} from 'primeng/progressbar';
import { InputTextModule} from 'primeng/inputtext';
import { ToolbarModule} from 'primeng/toolbar';
import { RatingModule} from 'primeng/rating';
import { RadioButtonModule} from 'primeng/radiobutton';
import { InputNumberModule} from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api'; 
import { FileUploadModule } from 'primeng/fileupload';
import { NgxPayPalModule } from 'ngx-paypal';

import { UsermanagementComponent } from './admin/usermanagement/usermanagement.component';
import { SummaryComponent } from './summary/summary.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { GiftCardPurchaseComponent } from './gift-card-purchase/gift-card-purchase.component';
import { OrderComponent } from './user-dashboard/order/order.component';
import { ProfileComponent } from './user-dashboard/profile/profile.component';
import { ReserveManageComponent } from './admin/reserve-manage/reserve-manage.component';
import { FormulasComponent } from './admin/formulas/formulas.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { AppInterceptor } from './app.interceptor';
import { CommonModule } from "@angular/common";
import { GiftcardComponent } from './admin/giftcard/giftcard.component';
import { ProductsComponent } from './admin/products/products.component';
import { CareadminComponent } from './admin/careadmin/careadmin.component';
import { PromocodeComponent } from './admin/promocode/promocode.component';
import { DatePipe } from '@angular/common';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './src/assets/i18n/', '.json');
}

export function initEnvironmentSetting(envSetting: EnvironmentSettingService) {
  return () => envSetting.load();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ReservationComponent,
    ExponentialStrengthPipe,
    imageNameTrasnformPipe,
    showLablePipe,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    HeaderComponent,
    FooterComponent,
    MainBodyComponent,
    PaymentComponent,
    AdminComponent,
    UsermanagementComponent,
    SummaryComponent,
    UserDashboardComponent,
    GiftCardPurchaseComponent,
    OrderComponent,
    ProfileComponent,
    ReserveManageComponent,
    FormulasComponent,
    GiftcardComponent,
    ProductsComponent,
    CareadminComponent,
    UsermanagementComponent,
    PromocodeComponent

  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ShowHidePasswordModule,
    CalendarModule,
		SliderModule,
		DialogModule,
		MultiSelectModule,
		ContextMenuModule,
		DropdownModule,
		ButtonModule,
		ToastModule,
    InputTextModule,
    ProgressBarModule,
    HttpClientModule,
    ToolbarModule,
    RatingModule,
    FormsModule,
    FileUploadModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    NgxPaginationModule,
    NgxPayPalModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    DatePipe,
    { provide: APP_INITIALIZER, useFactory: initEnvironmentSetting , deps: [EnvironmentSettingService], multi:true },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
