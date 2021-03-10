import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';
import { Guid } from 'guid-typescript';
import Swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';
import { Reservation, Center, Session, Formula, Service } from '../../shared/models/Reservation';
import { SelectItem } from 'primeng/api/selectitem';
import { Users } from '../../shared/models/Users';
import { showLablePipe } from '../../shared/pipes/showlable.pipe';

@Component({
  selector: 'reservemanage',
  templateUrl: './reserve-manage.component.html',
  styleUrls: ['./reserve-manage.component.css']
})
export class ReserveManageComponent implements OnInit {

  reservations: Reservation[] = [];
  searchReservations: Reservation[] =[];
  addReservation: Reservation;
  editReservation: Reservation;
  viewReservation: Reservation;


  reservation: Reservation;
  tableReservations: Reservation[] = [];
  loading = false;

  centers:Center[] = [];
  session:Session[] = [];
  formulas:Formula[] = [];
  service:Service[] = [];
  boolOption:SelectItem[];
  users:Users[] = [];

  headers:String[] = [];
  editHeaders:String[] = [];

  reserveDate:Date;
  editSession:any;


  pageSize = 5;

  constructor(private adminService:AdminService) { }

  ngOnInit() {
    this.boolOption = [{label: 'Active', value: true},{label: 'InActive', value: false}]; 
    this.loadData();  
  }

  loadData(){
    this.headers = ["Centre","Formule","Date","Carte cadeau","Code promo","Heure de début de la session","Heure de fin de session","Paiement total","Statut de paiement","Utilisateur"];
    this.editHeaders = ["Centre","Date","Session","Heure de début de la session","Heure de fin de session"];
    this.loading = true; 
    this.adminService.getUsers().subscribe((data) =>{ 
      this.users = data;    
    },() => {}, () => {
      this.adminService.getFormulas().subscribe((data) =>{ 
        this.formulas = data;
      },() => {}, () => {
          this.adminService.getCenters().subscribe((data) =>{ 
            this.centers = data;
          },() => {}, () => {
            this.adminService.getReservation().subscribe((data) =>{ 
              this.reservations = data;
              this.searchReservations = data;                   
          },() => {},() => {
            this.adminService.getSessions().subscribe((data) =>{ 
              this.session = data;
              this.loading = false;
            });   
          });
          });
        });  
      });

   
  }
  
  saveChanges(){
    Swal.fire({
        title: 'Voulez-vous enregistrer les modifications?',
        showCancelButton: true,
        confirmButtonText: `Save`,
      }).then((result) => {
        if (result.isConfirmed) {
          let changes = this.tableReservations.find(x => !isNullOrUndefined(x.RowStatus));
          if(!isNullOrUndefined(changes)){
            this.adminService.saveReservation(this.tableReservations).subscribe(x => { 
                if(x == "SUCCESS"){
                  this.loadData();
                  Swal.fire('Enregistré!', '', 'success'); 
                }
            });
          }else{
            Swal.fire('Aucun changement à enregistrer!!', '', 'info'); 
          }         
        } else if (result.isDenied) {
          Swal.fire('Aucun changement à enregistrer', '', 'info');
        }
      })
  }

  deleteRow(value:Reservation){
    this.tableReservations = [];
    value.RowStatus = "DELETED";
    this.tableReservations.push(value);
  }

  editChanges(value:Reservation){
    this.editReservation = value;
    this.editSession = this.session.filter(x => x.center_Id == this.editReservation.center_Id);
    this.reserveDate = new Date(this.editReservation.date);
  }

  clearChanges(){
    this.tableReservations = [];
  }

  showFormula(value:Reservation){
    this.viewReservation = value;
  }

  saveEditedRow(){
    this.tableReservations = [];
    this.editReservation.date = this.reserveDate.toDateString();
    this.editReservation.RowStatus = "UPDATED";
    this.tableReservations.push(this.editReservation);
    this.saveChanges();
  }

  saveAddedRow(){
    if(this.addReservation.reservation_Id != "" && this.addReservation.date != "", this.addReservation.center_Id != "",this.addReservation.formula_Id != ""){
      this.tableReservations = [];
      this.tableReservations.push(this.addReservation);
      this.saveChanges();
    }else{
      Swal.fire('Entrez des données valides!', '', 'info');
    }      
  }

  onChange(event:any){
    this.reserveDate =  new Date(event);
    let filterReservation = this.reservations.filter(x => new Date(x.date).getTime() == new Date(this.reserveDate.toISOString().substring(0,19)).getTime() && x.center_Id == this.editReservation.center_Id);
    this.editSession = this.session.filter(x => x.center_Id == this.editReservation.center_Id && !this.isSessionBlocked(filterReservation,x.session_Id));
  }

  isSessionBlocked(reservations:Reservation[], session_ID:any){
    let value = reservations.filter(x => x.session_Id == session_ID);
    if(value.length > 0){
      return true;
    }else{
      return false;
    }
  }

  search(){
    var input, filter, table, tr, td,td2, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td2 = tr[i].getElementsByTagName("td")[9];
      if (td2) {
        txtValue = td2.textContent || td2.innerText;
        if (txtValue.toUpperCase().includes(filter)) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }

}
