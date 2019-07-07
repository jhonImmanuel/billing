import { Component, OnInit ,Inject} from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { AuthService } from 'src/app/core/auth.service';
import { Router} from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

export interface DialogData {
  name: string;
  price: any;
  products:any;
}

@Component({
  selector: 'app-confirm-orders',
  templateUrl: './confirm-orders.component.html',
  styleUrls: ['./confirm-orders.component.scss']
})
export class ConfirmOrdersComponent implements OnInit {

  Orders: any = [];
  p: number = 1;
  dateRangeFilter: {start: '', end:''};
  product:any;
  total:any;
  orderType:any;
  filters:any = {range:{start:'',end:''},type:''};
  constructor(private apiService: ApiService,
    private authService: AuthService, public dialog: MatDialog, private router: Router,private toast: ToastrService) { }

  ngOnInit() {
    this.orderType = 'select';
    this.getOrders();
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
  changeDate(){
    if(this.dateRangeFilter && this.dateRangeFilter.start){
        var startdate = this.dateRangeFilter.start;
       this.filters.range.start = moment(this.dateRangeFilter.start).format('DD-MM-YYYY');
      this.filters.range.end = moment(this.dateRangeFilter.end).format('DD-MM-YYYY');
    }
  }
  filterRecords(){
  if(this.orderType == 'select'){
    this.toast.error("Please select Type");
    return true;
  }
this.apiService.callPostApi('filterOrders', {filters:this.filters}).subscribe(res => {        
this.Orders = res.products;
      }, error => {
        if(error.status === 401) {
          this.authService.logout();
        }
      }); 
  }
changeType(type){
  if(type === 'dropdown'){
  this.filters.type = this.orderType;
  }
}
reset(){
  this.getOrders();
  this.orderType = 'select';
}
openDialogOrders(i): void {
var billId = this.Orders[i].bill_id;
   this.apiService.callGetApi('getConfirmProducts/'+billId).subscribe(res => {
    this.product = res.products;
      const dialogRef = this.dialog.open(ConfirmOrdersDialog, {
        width: '1000px',
        data: { products: this.product, from: "AccessoriesView" }
      });
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }

  getOrders() {
  var type = this.router.url.replace('/','');
    if(localStorage.getItem('role') !== 'Super Admin') {
    this.apiService.callGetApi('getRecords?action=confirm_orders&type='+type+'&user_id=' + localStorage.getItem('email')).subscribe(res => {
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
@Component({
  selector: 'confirm-orders-dialog',
  templateUrl: 'confirm-orders-dialog.html',
})
export class ConfirmOrdersDialog {
  p2 = 1;
  total:any = 0;
  currentCustomerName:any;
  dateTime:any;
  currentCustomerPhone;any;
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ConfirmOrdersDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
    ngOnInit(){
 this.currentCustomerPhone = this.data.products[0].customer.phone;
 this.currentCustomerName = this.data.products[0].customer.name; 
 this.total = this.data.products[0].total_amount;
  // this.data.products.map((val) =>{
  //   this.total = this.total + parseInt(val.total_amount);
  // });
}
  onNoClick(): void {
    this.dialogRef.close();
  }
  printBill() {
    this.onNoClick();
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
  }
}