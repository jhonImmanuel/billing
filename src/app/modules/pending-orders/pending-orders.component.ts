import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { ApiService } from 'src/app/core/api.service';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.scss']
})
export class PendingOrdersComponent implements OnInit {

  pendingOrders: any = [];
  p: number = 1;
  constructor(private apiService: ApiService,
    private authService: AuthService) { }

  ngOnInit() {
    this.getPendingOrders();
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
  getPendingOrders() {
    if(localStorage.getItem('role') !== 'Super Admin') {
      this.apiService.callGetApi('getRecords?action=pending_orders&user_id=' + localStorage.getItem('email')).subscribe(res => {
        this.pendingOrders = res.response;
      }, error => {
        if(error.status === 401) {
          this.authService.logout();
        }
      });
    }
    if(localStorage.getItem('role') === 'Super Admin') {
      this.apiService.callGetApi('getRecords?action=pending_orders&user_id=Super Admin').subscribe(res => {
        this.pendingOrders = res.response;
      }, error => {
        if(error.status === 401) {
          this.authService.logout();
        }
      });
    }
  }
}
