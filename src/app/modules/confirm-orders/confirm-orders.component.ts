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
        width: '100%',
        height: '100%',
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
  styleUrls: ['./confirm-orders.component.scss']
})
export class ConfirmOrdersDialog {
  p2 = 1;
  total:any = 0;
  currentCustomerName:any;
  dateTime:any;
  cgst:any;
  sgst:any;
  discount:any;
  user:any;
  created_at:any;
  order_amount:any;
  currentCustomerPhone;any;
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ConfirmOrdersDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
    ngOnInit(){
 this.currentCustomerPhone = this.data.products[0].customer.phone;
 this.currentCustomerName = this.data.products[0].customer.name; 
 this.total = this.data.products[0].total_amount;
 this.sgst = this.data.products[0].sgst;
 this.cgst = this.data.products[0].cgst;
 this.discount = this.data.products[0].discount;
 this.order_amount = this.data.products[0].order_amount;
 this.created_at = this.data.products[0].created_at;
 this.user = this.data.products[0].user_id;
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
    WindowPrt.document.createElement("body");
    WindowPrt.document.write('<style type="text/css">body { padding: 0; margin: 0; font-family: sans-serif; } h1, h2, h3, h4, h5, h6, ol { margin: 0; } * { box-sizing: border-box; } .invoice_container { color: #100a6c; position: relative; padding: 20px 0; } .invoice_container::before { content: "Nusaiba Mobiles"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, 50%) rotate(-35deg); font-size: 82px; font-weight: bold; color: #ccc; z-index: -1; opacity: 0.6; } .invoice_container header { text-align: center; border-bottom: 5px solid #100a6c; } .invoice_container header p { width: 375px; margin: 0 auto; font: 18px / 24px sans-serif; } .invoice_container header strong { display: block; } .invoice_wrapper { border: 1px solid #100a6c; margin: 40px 30px; } .invoice_wrapper div { padding: 15px 30px; border-bottom: 1px solid #100a6c; } table { width: 100%; border-collapse: collapse; } .tax_invoice table td { width: 300px; color: #100a6c; font: 16px / 20px sans-serif; } .tax_invoice h2 { font: 18px / 24px sans-serif; padding-left: 60px; margin-bottom: 10px; } .Receipent p { position: relative; height: 100px; } .bill-details { padding: 0 !important; } .bill-details table td, .bill-details table th { border-left: 1px solid #100a6c; color: #100a6c; text-align: center; } .bill-details table tbody tr:first-child { height: 150px; } .bill-details table tr td:nth-child(1), .bill-details table tr th:nth-child(1) { border-left: 0; } .bill-details table thead th { border-bottom: 1px solid #100a6c; padding: 15px 0; } .bill-details table tfoot td { border-top: 1px solid #100a6c; border-left: 0; padding: 15px 0; font-weight: bold; } .invoice_wrapper footer { padding: 50px 50px 5px; } .invoice_wrapper footer span:last-child { float: right; } .termsCondition { font: 500 14px / 22px monospace; }</style>');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    printContent.style.display = 'none';
    console.log(WindowPrt.document);
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }
}