import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/api.service';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit {

  type: any;
  order_id: any;
  orderDetail: any;
  total: any = 0;
  constructor(private route: ActivatedRoute,
    private apiService: ApiService) {
    this.route.params.subscribe(res => {
      this.type = res.order_type;
      this.order_id = res.order_id;
      this.getOrderDetail();
    })
   }

  ngOnInit() {
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
  getOrderDetail() {
    this.apiService.callPostApi('getOrderDetails', {order_id: this.order_id, type: this.type}).subscribe(res => {
      this.orderDetail = res.response;
      for(const orderDetail of this.orderDetail) {
        this.total += parseInt(orderDetail.amount);
      }
    })
  }
}
