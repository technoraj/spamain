import { Component, OnInit } from '@angular/core';
import { Service } from '../../shared/models/Reservation';
import { ImageDetail } from '../../shared/models/ImageDetails';
import { SelectItem } from 'primeng/api/selectitem';
import { AdminService } from '../../shared/services/admin.service';
import { Guid } from 'guid-typescript';
import { isNullOrUndefined } from 'util';
import Swal from 'sweetalert2';
import { EnvironmentSettingService } from '../../shared/services/environment-setting.service';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  services: Service[] = [];
  viewServices: Service;
  addServices:Service;
  editServices:Service;

  addedDays:string[] =[];

  tableServices: Service[] = [];

  loading = false;
  headers:string[] = [];

  categorys = this.env.getSetting("productCategories");

  boolOption:SelectItem[];
  images:ImageDetail[]=[];

  constructor(private adminService:AdminService, private env:EnvironmentSettingService) { }

  ngOnInit() {
    this.boolOption = [{label: 'Active', value: true},{label: 'InActive', value: false}]; 
    this.loadData();  
  }

  loadData(){
    this.headers = ["Image","Produit","Catégorie","Prix","Statut"];
    this.loading = true; 
    this.adminService.getServices().subscribe((data) =>{ 
      this.services = data;
      this.adminService.getImage().subscribe((data) =>{
        this.images = data;
      });
      this.loading = false;
    });
  }

  addNewRow(){
      let service: Service =  {
        name:'',
        image_id:-1,
        service_Id: Guid.create().toString(),
        category:"",
        status: true,
        price:0,
        RowStatus:"ADDED",       
      };
      this.addServices = service;
  }

  myUploader(event, service:Service, fileUpload) {
     if (event.files.length === 0) {
      return;
    }
    let fileToUpload = <File>event.files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.adminService.uploadImage(formData).subscribe(x =>{
      if(!isNullOrUndefined(this.addServices)){
        this.addServices.image_id = x;
      }else if(!isNullOrUndefined(this.editServices)){
        this.editServices.image_id = x;
      }
      
     this.adminService.saveProductImageMapping(service.service_Id.toString(),x).subscribe(x =>{
        this.loadData();
     });
    });

    fileUpload.clear();
  }

  createImgPath(id:number){
    let image = this.images.find(x => x.image_Id == id); 
    if(image){
      image.docFile = image.docFile.replace(/\\/g, "/");
      return this.adminService.apiBaseUrl+image.docFile;
    } 
  }
  
  saveChanges(){
    Swal.fire({
        title: 'Voulez-vous enregistrer les modifications?',
        showCancelButton: true,
        confirmButtonText: `Save`,
      }).then((result) => {
        if (result.isConfirmed) {
          let changes = this.tableServices.find(x => !isNullOrUndefined(x.RowStatus));
          if(!isNullOrUndefined(changes)){
            this.adminService.saveProduct(this.tableServices).subscribe(x => { 
                if(x == "SUCCESS"){
                  this.loadData();
                  Swal.fire('Enregistré!', '', 'success'); 
                }
            });
          }else{
            Swal.fire('Aucun changement à enregistrer !!', '', 'info'); 
          }         
        } else if (result.isDenied) {
          Swal.fire('Les modifications ne sont pas enregistrées', '', 'info');
        }
      })
  }

  deleteRow(value:Service){
    this.tableServices = [];
    value.RowStatus = "DELETED";
    this.tableServices.push(value);
  }

  editChanges(value:Service){
    this.editServices = value;
  }

  clearChanges(){
    this.tableServices = [];
  }

  showFormula(value:Service){
    this.viewServices = value;
  }

  saveEditedRow(){
    this.tableServices = [];
    this.editServices.RowStatus = "UPDATED";
    this.tableServices.push(this.editServices);
    this.saveChanges();
  }

  saveAddedRow(){
    if(this.addServices.service_Id != "" && this.addServices.name != "", this.addServices.price != 0,this.addServices.category != ""){
      this.tableServices = [];
      this.tableServices.push(this.addServices);
      this.saveChanges();
    }else{
      Swal.fire('Entrez des données valides!', '', 'info');
    }
    
  }

}
