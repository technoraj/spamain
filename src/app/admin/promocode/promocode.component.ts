import { Component, OnInit } from '@angular/core';
import { Promocode } from '../../shared/models/Reservation';
import { AdminService } from '../../shared/services/admin.service';
import { SelectItem } from 'primeng/api/selectitem';
import { ImageDetail } from '../../shared/models/ImageDetails';
import Swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.css']
})
export class PromocodeComponent implements OnInit {

  promocodes: Promocode[] = [];
  viewPromocode: Promocode;
  addPromocode: Promocode;
  editPromocode: Promocode;

  tablePromocodes: Promocode[] = [];

  loading = false;
  headers:string[] = [];

  boolOption:SelectItem[];
  images:ImageDetail[]=[];

  validTill:Date;

  constructor(private adminService:AdminService) {

  }

  ngOnInit() {
    this.boolOption = [{label: 'Active', value: 1},{label: 'InActive', value: 0}]; 
    this.loadData();  
  }

  loadData(){
    this.headers =  ["Code","Valable jusqu'au","Pourcentage de remise", "Nombre utilisé", "Statut"];
    this.loading = true; 
    this.adminService.getPromocode().subscribe((data) =>{
      this.promocodes = data;
      this.adminService.getImage().subscribe((data) =>{
        this.images = data;
      });
      this.loading = false;
    });
  }

  addNewRow(){
      let promocode: Promocode =  {
        code:'',
        promocode_Id: Guid.create().toString(),
        valid_Till: new Date(Date.now()),
        is_Active: 1,
        percentage_off:0,
        no_of_times_use:0,
        RowStatus:"ADDED"      
      };
      this.addPromocode = promocode;
  }

  saveChanges(){
    Swal.fire({
        title: 'Voulez-vous enregistrer les modifications?',
        showCancelButton: true,
        confirmButtonText: `Save`,
      }).then((result) => {
        if (result.isConfirmed) {
          let changes = this.tablePromocodes.find(x => !isNullOrUndefined(x.RowStatus));
          if(!isNullOrUndefined(changes)){
            this.adminService.savePromocode(this.tablePromocodes).subscribe(x => { 
                if(x == "SUCCESS"){
                  this.loadData();
                  Swal.fire('Enregistré!', '', 'success'); 
                }else{
                  Swal.fire("Erreur lors de l'enregistrement des données!", '', 'error'); 
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

  deleteRow(value:Promocode){
    this.tablePromocodes = [];
    value.RowStatus = "DELETED";
    this.tablePromocodes.push(value);
  }

  editChanges(value:Promocode){
    this.editPromocode = value;
    this.editPromocode.valid_Till = new Date(this.editPromocode.valid_Till);
  }

  clearChanges(){
    this.tablePromocodes = [];
  }

  showFormula(value:Promocode){
    this.viewPromocode = value;
  }

  saveEditedRow(){
    this.tablePromocodes = [];
    this.editPromocode.RowStatus = "UPDATED";
    this.tablePromocodes.push(this.editPromocode);
    this.saveChanges();
  }

  saveAddedRow(){
    if(this.addPromocode.code != "" && this.addPromocode.valid_Till != null, this.addPromocode.percentage_off != 0){
      this.tablePromocodes = [];
      this.tablePromocodes.push(this.addPromocode);
      this.saveChanges();
    }else{
      Swal.fire('Entrez des données valides!', '', 'info');
    }
    
  }

}
