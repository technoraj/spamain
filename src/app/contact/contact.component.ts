import { Component, OnInit } from '@angular/core';
import { AdminService } from '../shared/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  name = "";
  email = "";
  subject = "";
  comment = "";

  constructor(private admiService:AdminService) {
  
  }

  save(){
    if(this.name!=""  && this.email!="" && this.subject!="" && this.comment!=""){
      this.admiService.addContact(this.name,this.email,this.subject,this.comment).subscribe(x =>{ 
        this.name = "";
        this.email = "";
        this.subject = "";
        this.comment = "";
        Swal.fire("Enregistré!","","success");
       });
    }  
  }

}
