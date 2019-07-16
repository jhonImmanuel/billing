import { Component, OnInit,Inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ApiService } from 'src/app/core/api.service';
import { AuthService } from 'src/app/core/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';


export interface DialogData {
  name: string;
  price: any;
  products:any;
  users:any;
  openning_balance:string;
}
 

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss']
})
export class GenerateReportComponent implements OnInit {

  report: any;
  total: any = 0;
  myDate = Date.now();
  total_qty: any = 0;
  shop: any;
  user: any;
  gstin_no: any;
  counter:any;
  userName:any;
  Orders:any;
  users:any;
  openning_balance:any;
  grand_total:any;
  mobile_sales:any;
  accessories_sales:any;
  services_sales:any;
  services_completed:any;
  reportsDate:any;
  orderType:any;
  dateRangeFilter: {start: '', end:''};
  filters:any = {range:{start:'',end:''},type:''};
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog,
    private toast: ToastrService) {
      // this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
     }

  ngOnInit() {
    this.orderType = 'select';
    this.shop = localStorage.getItem('shop');
    this.user = localStorage.getItem('email');
    this.reportsDate = "today";
    // this.getCounts();
    this.getAllReports();
    this.apiService.callPostApi('getTodayOrders', {shop: localStorage.getItem('email')}).subscribe(res => {
      this.report = res.response;
      for (const reportData of this.report) {
        this.total_qty += parseInt(reportData.qty);
        this.total += parseInt(reportData.price);
      }
      this.openning_balance = res.openning_balance.length != 0 ? res.openning_balance[0].openning_balance 
      :0;
      this.grand_total = parseInt(this.total) + parseInt(this.openning_balance);

    });
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }

  ConvertString(value){
    return parseInt(value)
    }

    getAllReports() {
      this.apiService.callGetApi('getProducts/sales').subscribe(res => {
        // this.mobiles_sold = res.productSales.mobile_count;
        // this.accessories_sold = res.productSales.accesssories_count;
        this.services_completed = res.productSales.service_count;
        this.mobile_sales = res.productSales.mobile_sales;
        this.accessories_sales = res.productSales.accessories_sales;
        this.services_sales = res.productSales.service_sales;
      });
      this.apiService.callGetApi('dashboard/' + localStorage.getItem('email')).subscribe(res => {
        this.counter = res.response;
      });
    }


  filterRecords(){
    if(this.orderType == 'select'){
      this.toast.error("Please select Type");
      return true;
    }
  this.apiService.callPostApi('filterReports', {filters:this.filters}).subscribe(res => {
    console.log(res.response);  
    this.counter = res.response;
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

  changeDate(){
    if(this.dateRangeFilter && this.dateRangeFilter.start){
        var startdate = this.dateRangeFilter.start;
       this.filters.range.start = moment(this.dateRangeFilter.start).format('DD-MM-YYYY');
      this.filters.range.end = moment(this.dateRangeFilter.end).format('DD-MM-YYYY');
    }
  }

  reset(){
    this.getAllReports();
    this.orderType = 'select';
  }

  openDialogBrand(i){
    const dialogRef = this.dialog.open(GenerateReportDialog, {
      width: '1000px',
      data: { products: this.Orders}
    });
     dialogRef.afterClosed().subscribe(result => {
        this.users = dialogRef.componentInstance.user;
        var click  = dialogRef.componentInstance.click;
        if(this.users && click){
          this.print();
          this.apiService.callPostApi('savereports', {user_id: localStorage.getItem('email'),total_qty :this.total_qty,total:this.total,report_by: dialogRef.componentInstance.user ,product:this.report,openning_balance:dialogRef.componentInstance.openning_balance}).subscribe(res => {
            this.toast.success('Report Generated Successfully');
          });
        }
      }
      );
  }
  print() {
    setTimeout(() => {
    const printContent = document.getElementById("componentID");
    printContent.style.display = 'block';
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write('<style type="text/css"> body { padding: 0; margin: 0; font-family: sans-serif; } h1, h2, h3, h4, h5, h6, ol { margin: 0; } * { box-sizing: border-box; } .invoice_container { color: #100a6c; position: relative; padding: 20px 0; } .invoice_container::before { content: "Nusaiba Mobiles"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, 50%) rotate(-35deg); font-size: 82px; font-weight: bold; color: #ccc; z-index: -1; opacity: 0.6; } .invoice_container header { text-align: center; border-bottom: 5px solid #100a6c; } .invoice_container header img { max-width: 300px; } .invoice_container header p { width: 410px; margin: 0 auto; font: 18px / 24px sans-serif; } .invoice_container header strong { display: block; } .invoice_wrapper { border: 1px solid #100a6c; margin: 40px 30px; } .invoice_wrapper div { padding: 15px 30px; } .reports { padding: 0px !important; } .reports div { border: 0; padding: 10px 0px; } .reports span { font: bold 18px sans-serif; } table { width: 100%; border-collapse: collapse; } .tax_invoice h2 { font: 18px / 24px sans-serif; padding-left: 60px; margin-bottom: 10px; } .sale-details { padding: 0 !important; } .sale-details table { border: 1px solid #100a6c; border-width: 1px 0px 1px 0px; margin-bottom: 30px; } .sale-details table td, .sale-details table th { border-left: 1px solid #100a6c; color: #100a6c; text-align: center; } .sale-details table tbody tr:first-child { height: 150px; } .sale-details table tr td:nth-child(1), .sale-details table tr th:nth-child(1) { border-left: 0; } .sale-details table thead th { border-bottom: 1px solid #100a6c; padding: 15px 0; } .invoice_wrapper footer { padding: 50px 50px 5px; text-align: right; } .Gtotal{ text-align: right; padding: 0 50px; font-weight: bold; } </style>');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    printContent.style.display = 'none';
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
    },1000)
    
  }
  RemoveRecords() {
    this.apiService.callPostApi('deleteRecord', {shop: localStorage.getItem('email')}).subscribe(res => {
      this.toast.success(res.message);
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
}
@Component({
  selector: 'generate-report-dialog',
  templateUrl: 'generate-report-dialog.html',
})
export class GenerateReportDialog {
  p2 = 1;
  user:any;
  openning_balance:any;
  users:any;
  click:boolean = false;
  constructor(private apiService: ApiService,
    private authService: AuthService,
    private toast: ToastrService,
    public dialogRef: MatDialogRef<GenerateReportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    ngOnInit(){
     }
  onNoClick(): void {
    this.dialogRef.close(this.users);
  }
  saveBrand(){
    this.click = true;
      this.dialogRef.close(this.users);
  }
}