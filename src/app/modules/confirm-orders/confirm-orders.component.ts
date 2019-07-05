import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-confirm-orders',
  templateUrl: './confirm-orders.component.html',
  styleUrls: ['./confirm-orders.component.scss']
})
export class ConfirmOrdersComponent implements OnInit {

  Orders: any = [];
  p: number = 1;
  dateTime:any;
  product:any;
  total:any;
  constructor(private apiService: ApiService,
    private authService: AuthService) { }

  ngOnInit() {
    this.getOrders();
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }

  printBill(index) {
    var billId = this.Orders[index].bill_id;
    this.apiService.callGetApi('getConfirmProducts/'+billId).subscribe(res => {
    this.product = res.products;
    this.total = res.products[0].amount;
    setTimeout(()=>{
      var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.dateTime = date+' '+time;
    const printContent = document.getElementById("componentID");
    printContent.style.display = 'block';
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    printContent.style.display = 'none';
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
    },500);
      }, error => {
        if(error.status === 401) {
          this.authService.logout();
        }
      });
  }


  getOrders() {
    if(localStorage.getItem('role') !== 'Super Admin') {
    this.apiService.callGetApi('getRecords?action=confirm_orders&user_id=' + localStorage.getItem('email')).subscribe(res => {
      this.Orders = res.response;
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
    });
    }
    if(localStorage.getItem('role') === 'Super Admin') {
      this.apiService.callGetApi('getRecords?action=confirm_orders&user_id=Super Admin').subscribe(res => {
        this.Orders = res.response;
      }, error => {
        if(error.status === 401) {
          this.authService.logout();
        }
      });
      }
  }
}
