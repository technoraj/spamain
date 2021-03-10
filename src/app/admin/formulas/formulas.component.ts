import { Component, OnInit } from '@angular/core';
import { Formula } from '../../shared/models/Reservation';
import { AdminService } from '../../shared/services/admin.service';
import Swal from "sweetalert2";
import { Guid } from "guid-typescript";
import { SelectItem } from 'primeng/api/selectitem';
import { isNullOrUndefined } from 'util';
import { days } from '../../shared/models/Days';
import { ImageDetail } from '../../shared/models/ImageDetails';

@Component({
  selector: 'formulas',
  templateUrl: './formulas.component.html',
  styleUrls: ['./formulas.component.css']
})
export class FormulasComponent implements OnInit {

  formulas: Formula[] = [];
  viewFormula: Formula;
  addFormula:Formula;
  editFormula:Formula;

  addedDays:string[] =[];

  tableFormulas: Formula[] = [];

  loading = false;
  days = days;
  headers:string[] = [];

  boolOption:SelectItem[];
  images:ImageDetail[]=[];

  startTime:string;
  endTime:string;

  constructor(private adminService:AdminService) { }

  ngOnInit() {
    this.boolOption = [{label: 'Active', value: true},{label: 'InActive', value: false}]; 
    this.loadData();  
  }

  loadData(){
    this.headers = ["Image","Formule","Prix","Statut","Jours actifs","Heure de début","Heure de fin"];
    this.loading = true; 
    this.adminService.getFormulas().subscribe((data) =>{ 
      this.formulas = data;
      this.adminService.getImage().subscribe((data) =>{
        this.images = data;
      });
      this.loading = false;
    });
  }

  addNewRow(){
      let formula: Formula =  {
        name:'',
        image_Id:-1,
        formula_Id: Guid.create().toString(),
        startTime: new Date().toTimeString().slice(0,5),
        endTime:this.addHoursToDate(new Date,2).toTimeString().slice(0,5),
        status: true,
        activeDays:"",
        price:0,
        RowStatus:"ADDED",       
      };
      this.startTime = formula.startTime;
      this.endTime = formula.endTime;
      this.addFormula = formula;
  }

  addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).setHours(date.getHours() + hours));
  }

  myUploader(event,formula:Formula,fileUpload) {
    if (event.files.length === 0) {
      return;
    }
    let fileToUpload = <File>event.files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.adminService.uploadImage(formData).subscribe(x =>{
      if(!isNullOrUndefined(this.addFormula)){
        this.addFormula.image_Id = x;
      }else if(!isNullOrUndefined(this.editFormula)){
        this.editFormula.image_Id = x;
      }
      
     this.adminService.saveFormulaImageMapping(formula.formula_Id.toString(),x).subscribe(x =>{
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
        confirmButtonText: `Enregistrée`,
      }).then((result) => {
        if (result.isConfirmed) {
          let changes = this.tableFormulas.find(x => !isNullOrUndefined(x.RowStatus));
          if(!isNullOrUndefined(changes)){
            this.adminService.saveFormulas(this.tableFormulas).subscribe(x => { 
                if(x == "SUCCESS"){
                  this.loadData();
                  Swal.fire('Enregistrée!', '', 'success'); 
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

  deleteRow(value:Formula){
    this.tableFormulas = [];
    value.RowStatus = "DELETED";
    this.tableFormulas.push(value);
  }

  editChanges(value:Formula){
    this.editFormula = value;
    this.startTime = new Date(this.editFormula.startTime).toTimeString().slice(0,5);
    this.endTime = new Date(this.editFormula.endTime).toTimeString().slice(0,5);
    this.addedDays = this.editFormula.activeDays.split(',');
  }

  clearChanges(){
    this.tableFormulas = [];
  }

  showFormula(value:Formula){
    this.viewFormula = value;
    this.addedDays = this.viewFormula.activeDays.split(',');
  }

  saveEditedRow(){
    var today = new Date();
    this.editFormula.activeDays = this.addedDays.join(',');
    this.editFormula.startTime = new Date().toISOString().substring(0,11)+this.startTime+new Date().toISOString().substring(16);
    this.editFormula.endTime = new Date().toISOString().substring(0,11)+this.endTime+new Date().toISOString().substring(16);
    this.addedDays = [];
    this.tableFormulas = [];
    this.editFormula.RowStatus = "UPDATED";
    this.tableFormulas.push(this.editFormula);
    this.saveChanges();
  }

  saveAddedRow(){
    var today = new Date();
    if(this.addFormula.formula_Id != "" && this.addFormula.name != "", this.addFormula.price != 0){
      this.addFormula.startTime = new Date().toISOString().substring(0,11)+this.startTime+new Date().toISOString().substring(16);
      this.addFormula.endTime = new Date().toISOString().substring(0,11)+this.endTime+new Date().toISOString().substring(16);
      this.addFormula.activeDays = this.addedDays.join(',');
      this.addedDays = [];
      this.tableFormulas = [];
      this.tableFormulas.push(this.addFormula);
      this.saveChanges();
    }else{
      Swal.fire('Entrez des données valides!', '', 'info');
    }
    
  }

}
