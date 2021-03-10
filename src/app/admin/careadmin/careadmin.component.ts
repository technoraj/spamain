import { Component, OnInit } from '@angular/core';
import { Reservation, Center, Service } from '../../shared/models/Reservation';
import { SelectItem } from 'primeng/api/selectitem';
import { ImageDetail } from '../../shared/models/ImageDetails';
import { AdminService } from '../../shared/services/admin.service';
import Swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';
import { Users } from '../../shared/models/Users';

@Component({
  selector: 'careadmin',
  templateUrl: './careadmin.component.html',
  styleUrls: ['./careadmin.component.css']
})
export class CareadminComponent implements OnInit {

  reservations: Reservation[] = [];
  viewCare: any;

  users:Users[] = [];
  centers:Center[] =[];
  services:Service[] =[];

  loading = false;
  headers:string[] = [];
  viewHeaders:string[] = [];

  boolOption:SelectItem[];
  images:ImageDetail[]=[];
  deleteId:any;

  constructor(private adminService:AdminService) { }

  ngOnInit() {
    this.boolOption = [{label: 'Active', value: true},{label: 'InActive', value: false}]; 
    this.loadData();  
  }

  loadData(){
    this.headers = ["Full Name","Centre","Date","Téléphone","Info"];
    this.viewHeaders = ["Nom","Centre","Date","Téléphone","Service","Quantité","Prix"];
    this.loading = true; 
    this.adminService.getReserveCare().subscribe((data) =>{ 
      this.reservations = data;
      this.adminService.getImage().subscribe((data) =>{
        this.images = data;
        this.adminService.getCenters().subscribe((data) =>{
          this.centers = data;
          this.adminService.getUsers().subscribe((data) =>{
            this.users = data;
            this.adminService.getServices().subscribe((data) =>{
              this.services = data;  
              this.loading = false;
            });          
          });
        });
      });
      
    });
  }

  addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).setHours(date.getHours() + hours));
  }
  
  saveChanges(){
    if(!isNullOrUndefined(this.deleteId)){
      this.adminService.deleteReserveCare(this.deleteId).subscribe(x => { 
          if(x == "SUCCESS"){
            this.loadData();
            Swal.fire('Saved!', '', 'success'); 
          }
      });
    }else{
      Swal.fire('Aucun changement à enregistrers!!', '', 'error'); 
    } 
  }

  deleteRow(value:any){
    this.deleteId  = value;
  }

  showFormula(value:any){
    this.viewCare = value;
  }

}
