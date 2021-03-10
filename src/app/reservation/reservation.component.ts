import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Center, Formula, FormulaModal, Reservation, ReservationResponse, ReservationType, ReserveServices, Service, Session, Summary } from '../shared/models/Reservation';
import { ReservationService } from '../shared/services/reservation.service';
import { SharedStoreService } from '../shared/services/shared-store.service';
import { DatePipe } from '@angular/common';
import { EnvironmentSettingService } from '../shared/services/environment-setting.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  public reservationDate: string = "";
  public centers: Center[] = [];
  masterSessions: Array<Session[]> = [];
  diffirentTypeSession: string[] = [];
  public paneFirst = true;
  public paneSecond = false;
  public formulas: Formula[] = [];
  public masterServices: Service[] = [];
  public services: Service[] = [];
  public summary: Summary = null;
  public selectedCategory: string = "Drinks";
  public dateError: boolean = false;
  public formulaError: boolean = false;
  public saveReservation: boolean = false;
  public ReservationType = ReservationType;
  public centerError: boolean = false;
  public careError: boolean = false;
  public openModal: boolean = false;
  public modalImagesData: any[] = [];
  public selectedRoomImages: any[] = [];
  public mainModalImage = "";
  constructor(private reservationService: ReservationService, private sharedStoreService: SharedStoreService, private datePipe: DatePipe, private settingService: EnvironmentSettingService) {
    this.reservationDate = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
    this.modalImagesData = this.settingService.getSetting("picsArt");
    this.summary = {
      selectedDate: this.reservationDate,
      selectedCenter: null,
      selectedSession: null,
      selectedFormula: null,
      selectedServices: [],
      reservationType: ReservationType.Appointment,
      totalAmount: 0
    }
    this.sharedStoreService.reservationObservable.subscribe(value => {
      this.summary.reservationType = value;
      this.summary = JSON.parse(JSON.stringify(this.summary));
      if (this.summary.reservationType == ReservationType.Care) {
        this.paneFirst = true;
        this.openModal = false;
        this.paneSecond = false;
        this.selectedCategory = "care";
        this.getServices();
      }
    });
  }

  ngOnInit(): void {

    this.getAllCenters();
    this.getAllReqImage();
    if (this.summary.reservationType == ReservationType.Care) {
      this.selectedCategory = "care";
      this.getServices();
    }
  }

  update(event) {
    this.reservationDate = event;
    this.summary.selectedDate = this.reservationDate;
    this.summary = JSON.parse(JSON.stringify(this.summary));
    if (this.summary.selectedCenter != null) {
      this.getSessions(this.summary.selectedCenter);
    }
  }


  getAllCenters() {
    this.summary = JSON.parse(JSON.stringify(this.summary));
    this.reservationService.getCenters().subscribe((data: Center[]) => {
      this.centers = data;
      this.centers.forEach(center => {
        let index = this.sharedStoreService.requiredImages.findIndex(x => x.image_Id == center.image_Id);
        if (index != -1) {
          center.image = this.sharedStoreService.requiredImages[index].docFile;
          center.imageNm = this.sharedStoreService.requiredImages[index].name;
        } else {
          center.imageNm = "";
          center.image = "";
        }
      })
    })
  }

  getSessions(center: Center) {
    if (this.summary.reservationType == ReservationType.Appointment) {
      this.summary.selectedDate = this.reservationDate;
      this.summary.selectedCenter = center;
      this.summary = JSON.parse(JSON.stringify(this.summary));
      this.masterSessions = [];
      this.summary.selectedSession = null;
      this.reservationService.getSessions(center.center_Id, this.summary.selectedDate).subscribe((data: Session[]) => {
        if (data.length > 0) {
          this.diffirentTypeSession = data.map(item => item.roomType).filter((value, index, self) => self.indexOf(value) === index);
          this.diffirentTypeSession.forEach(sessionType => {
            let tempData: Session[] = data.filter(x => x.roomType == sessionType);
            tempData.sort((a, b) => {
              let startTimeA = a.startTime;
              let startTimeB = b.startTime;
              if (new Date(startTimeA) > new Date(startTimeB))
                return 1
              else if (new Date(startTimeA) < new Date(startTimeB))
                return -1
              else
                return 0
            });
            if (new Date(this.reservationDate) < new Date((new Date()).toLocaleDateString())) {
              tempData.forEach(x => x.isAvailable = false)
            } else if (new Date(this.reservationDate).toLocaleDateString() == (new Date()).toLocaleDateString()) {
              tempData.forEach(x => {
                if (new Date(x.startTime).getHours() < (new Date()).getHours())
                  x.isAvailable = false;
              })
            }
            this.masterSessions.push(tempData);
          });
        }
      })
    } else {
      this.centerError = false;
      this.summary.selectedCenter = center;
      this.summary = JSON.parse(JSON.stringify(this.summary));
    }
  }

  selectTiming(session: Session) {
    if (this.reservationDate.trim() == "") {
      this.dateError = true;
    } else {
      this.dateError = false;
      this.summary.selectedDate = this.reservationDate;
      if (session.isAvailable && session.isBlocked == '0') {
        this.summary.selectedSession = session;
        this.getFormulas();
        this.getServices();
        this.getServiceCategory();
        this.paneFirst = false;
        this.paneSecond = true;
      }
      this.summary = JSON.parse(JSON.stringify(this.summary));
    }


  }
  public serviceCategories = [];
  getServiceCategory() {
    this.serviceCategories = this.reservationService.getServiceCategories();
  }
  getServices() {
    this.reservationService.getServices().subscribe((data: Service[]) => {
      this.masterServices = data.filter(x => x.status);
      this.masterServices.forEach(x => {
        x.count = 1;
        let index = this.sharedStoreService.requiredImages.findIndex(x => x.image_Id == x.image_Id);
        if (index != -1) {
          x.image = this.sharedStoreService.requiredImages[index].docFile;
          x.imageNm = this.sharedStoreService.requiredImages[index].name;
        } else {
          x.imageNm = "";
          x.image = "";
        }
      });
      this.services = this.masterServices.filter(x => x.category.toLowerCase() == this.selectedCategory.toLowerCase());
    })
  }

  changeService(service: Service) {
    let index = this.masterServices.findIndex(x => x.service_Id == service.service_Id);
    this.masterServices[index].count = service.count;
  }

  selectCategory(category) {
    this.selectedCategory = category;
    this.services = this.masterServices.filter(x => x.category.toLowerCase() == category.toLowerCase());
  }

  getFormulas() {
    this.summary.selectedFormula = null;
    this.summary.selectedDate = this.reservationDate;
    this.summary = JSON.parse(JSON.stringify(this.summary));
    this.formulas = [];
    let data: FormulaModal = {
      day: new Date(this.summary.selectedDate).getDay(),
      sessionData: this.summary.selectedSession
    }
    this.reservationService.getFormulas(data).subscribe((data: Formula[]) => {
      this.formulas = data.filter(x => x.status);
      this.formulas.forEach(formula => {
        let index = this.sharedStoreService.requiredImages.findIndex(x => x.image_Id == formula.image_Id);
        if (index != -1) {
          formula.imageNm = this.sharedStoreService.requiredImages[index].name;
          formula.image = this.sharedStoreService.requiredImages[index].docFile;
        } else {
          formula.imageNm = "";
          formula.image = "";
        }
      })
    })
  }

  selectFormula(formula: Formula) {
    this.formulaError = false;
    this.summary.selectedFormula = formula;
    this.summary = JSON.parse(JSON.stringify(this.summary));
  }

  moveToPreviousStep() {
    if (this.paneSecond) {
      this.paneFirst = true;
      this.paneSecond = false;
    }

  }

  makePayment() {
    if (this.summary.selectedFormula == null) {
      this.formulaError = true;
    } else {
      this.saveReservation = true;
    }
  }

  makeCarePayment() {
    if (this.summary.selectedCenter == null) {
      this.centerError = true;
      this.careError = false;
    } else if (this.summary.selectedServices.length == 0) {
      this.careError = true;
      this.centerError = false;
    } else {
      this.saveReservation = true;
    }
  }

  selectService(service: Service) {
    if (this.summary.selectedServices.findIndex(x => x.service_Id == service.service_Id) == -1) {
      this.summary.selectedServices.push(service);
      this.summary = JSON.parse(JSON.stringify(this.summary));
      this.careError = false;
    }
  }

  reduceServiceCount(service: Service) {
    if (service.count > 0) {
      service.count = service.count - 1;
      let _idx = this.summary.selectedServices.findIndex(x => x.service_Id == service.service_Id);
      if (_idx != -1) {
        this.summary.selectedServices[_idx].count -= 1;
        this.summary = JSON.parse(JSON.stringify(this.summary));
      }
    }

  }

  increaseSericeCount(service: Service) {
    service.count = service.count + 1;
    let idx = this.summary.selectedServices.findIndex(x => x.service_Id == service.service_Id);
    if (idx != -1) {
      this.summary.selectedServices[idx].count += 1;
      this.summary = JSON.parse(JSON.stringify(this.summary));
    }
  }


  createImgPath(id: number) {
    let image = this.sharedStoreService.requiredImages.find(x => x.image_Id == id);
    if (image) {
      image.docFile = image.docFile.replace(/\\/g, "/");
      return this.sharedStoreService.apiUrl + image.docFile;
    }
  }

  getAllReqImage() {
    this.sharedStoreService.getAllImages();
  }

  openModalBox(type) {
    this.openModal = true;
    this.selectedRoomImages = this.modalImagesData.filter(x => x.roomType.toLowerCase() == type.toLowerCase());
    if(this.selectedRoomImages.length > 0)
    this.mainModalImage = this.selectedRoomImages[0].images[0];
  }
}
