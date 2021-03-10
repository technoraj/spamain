import { Component, OnInit } from '@angular/core';
import { Users } from '../../shared/models/Users';
import Swal from "sweetalert2";
import { AdminService } from '../../shared/services/admin.service';
import { isNullOrUndefined } from 'util';
import { SelectItem } from 'primeng/api/primeng-api';
import { Guid } from "guid-typescript";

@Component({
  selector: 'usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css']
})
export class UsermanagementComponent implements OnInit {

  users: Users[] = [];
  user: Users;

  selectedUsers: Users[] = [];

  tableUsersData: Users[] = [];
  roleOptions: SelectItem[];

  headers:string[] =[];

  constructor(private adminService:AdminService) { }

  ngOnInit() {
    this.headers = ["Nom et prénom","Email","Téléphone","Rôle","Statut"];
    this.roleOptions = [{label: 'Admin', value: 'ADMIN'},{label: 'employee', value: 'EMPLOYEE'},{label: 'Customer', value: 'CUSTOMER'}];
    this.loadData();     
  }

  loadData(){
    this.adminService.getUsers().subscribe((data) =>{ 
        this.users = data;
        this.tableUsersData = data;
    });
  }

  addNewRow(){
      let user = new Users();
      user.RowStatus = "ADDED";
      user.firstName = null;
      user.lastName = null;
      user.email = null;
      user.dateOfBirth = null;
      user.address = null;
      user.city = null;
      user.pincode = null;
      user.phone = null;
      user.userRole = null;
      user.user_Id = Guid.create().toString();
      this.users = [user,...this.users];
  }

}
