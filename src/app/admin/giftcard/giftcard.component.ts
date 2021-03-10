import { Component, OnInit } from '@angular/core';
import { GiftCard } from '../../shared/models/Reservation';
import { ImageDetail } from '../../shared/models/ImageDetails';
import { SelectItem } from 'primeng/api/selectitem';
import { AdminService } from '../../shared/services/admin.service';
import Swal from 'sweetalert2';
import { Guid } from 'guid-typescript';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'giftcard',
  templateUrl: './giftcard.component.html',
  styleUrls: ['./giftcard.component.css']
})
export class GiftcardComponent implements OnInit {

  giftCards: GiftCard[] = [];
  viewGiftCard: GiftCard;
  addGiftCard: GiftCard;
  editGiftCard: GiftCard;

  tableGiftCard: GiftCard[] = [];

  loading = false;
  headers:string[] = [];

  boolOption:SelectItem[];
  images:ImageDetail[]=[];

  startDate:Date;
  endDate:Date;

  constructor(private adminService:AdminService) {

  }

  ngOnInit() {
    this.boolOption = [{label: 'Active', value: "1"},{label: 'InActive', value: "0"}]; 
    this.loadData();  
  }

  loadData(){
    this.headers = ["Image","Nom","Prix","Start Date","Date de fin","Détails","Statut"];
    this.loading = true; 
    this.adminService.getGiftCards().subscribe((data) =>{
      this.giftCards = data;
      this.adminService.getImage().subscribe((data) =>{
        this.images = data;
      });
      this.loading = false;
    });
  }

  addNewRow(){
      let giftCard: GiftCard =  {
        name:'',
        image_Id:-1,
        giftCard_Id: 0,
        startTime: new Date().toString(),
        endTime:this.addMonthToDate(new Date,1).toDateString(),
        status: "1",
        detail :"",
        price:0,
        RowStatus:"ADDED",       
      };
      this.startDate = new Date(giftCard.startTime);
      this.endDate = new Date(giftCard.endTime);
      this.addGiftCard = giftCard;
  }

  addMonthToDate(date: Date, day: number): Date {
    return new Date(new Date(date).setDate(date.getDay() + day));
  }

  uploadFile(event,giftCard:GiftCard,fileUpload){
    if (event.files.length === 0) {
      return;
    }
    let fileToUpload = <File>event.files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.adminService.uploadImage(formData).subscribe(x =>{
      if(!isNullOrUndefined(this.addGiftCard)){
        this.addGiftCard.image_Id = x;
      }else if(!isNullOrUndefined(this.editGiftCard)){
        this.editGiftCard.image_Id = x;
      }
      
     this.adminService.saveGiftCardImageMapping(giftCard.giftCard_Id.toString(),x).subscribe(x =>{
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
          let changes = this.tableGiftCard.find(x => !isNullOrUndefined(x.RowStatus));
          if(!isNullOrUndefined(changes)){
            this.adminService.SaveGiftCards(this.tableGiftCard).subscribe(x => { 
                if(x == "SUCCESS"){
                  this.loadData();
                  Swal.fire('Enregistrée!', '', 'success'); 
                }else{
                  Swal.fire('Error Saving Data!', '', 'error'); 
                }
            });
          }else{
            Swal.fire('Aucun changement à enregistrer !!', '', 'error'); 
          }         
        } else if (result.isDenied) {
          Swal.fire('Les modifications ne sont pas enregistrées', '', 'info');
        }
      })
  }

  deleteRow(value:GiftCard){
    this.tableGiftCard = [];
    value.RowStatus = "DELETED";
    this.tableGiftCard.push(value);
  }

  editChanges(value:GiftCard){
    this.editGiftCard = value;
    this.startDate = new Date( this.editGiftCard.startTime);
    this.endDate = new Date(this.editGiftCard.endTime);
  }

  clearChanges(){
    this.tableGiftCard = [];
  }

  showFormula(value:GiftCard){
    this.viewGiftCard = value;
  }

  saveEditedRow(){
    if(new Date(this.startDate).getTime() < new Date(this.endDate).getTime()){
    this.editGiftCard.startTime = this.startDate.toString();
    this.editGiftCard.endTime = this.endDate.toString();
    this.tableGiftCard = [];
    this.editGiftCard.RowStatus = "UPDATED";
    this.tableGiftCard.push(this.editGiftCard);
    this.saveChanges();
  }else{
    Swal.fire('Date de début inférieure à la date de fin !!', '', 'info');
  }
  }

  saveAddedRow(){
    if(this.addGiftCard.giftCard_Id != null && this.addGiftCard.name != "" && this.addGiftCard.price != 0){
      if(new Date(this.startDate).getTime() < new Date(this.endDate).getTime()){
        this.addGiftCard.startTime = this.startDate.toString();
        this.addGiftCard.endTime = this.endDate.toString();
        this.tableGiftCard = [];
        this.tableGiftCard.push(this.addGiftCard);
        this.saveChanges();
      }else{
        Swal.fire('Date de début inférieure à la date de fin !!', '', 'info');
      }
     
    }else{
      Swal.fire('Entrez des données valides!', '', 'info');
    }
    
  }
}
