import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ReservationService } from '../shared/services/reservation.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  public paymentStatus: string = "";
  public menuItem = "order";
  constructor(private router: Router, private route: ActivatedRoute, private reservationService: ReservationService) {
    this.route.params.subscribe((param) => {
      let id = param['id'];
      let type = param['type'];
      if (id) {
        this.getPaymentStatus(id, type);
      }
    });
  }

  ngOnInit(): void {
  }

  getPaymentStatus(id, type) {
    this.reservationService.getPaymentResponse(id, type).subscribe(data => {
      this.paymentStatus = data.result["value"]["link"];
      if (this.paymentStatus == 'paid') {
        Swal.fire('', 'Le paiement a réussi', "success");
        this.router.navigateByUrl('app-home/user');
      } else if (this.paymentStatus == 'pending') {
        Swal.fire('', 'Votre paiement est en attente auprès de notre partenaire de paiement', "success");
        this.router.navigateByUrl('app-home/user');
      }
    })
  }

  logout() {
    sessionStorage.clear();
  }

}
