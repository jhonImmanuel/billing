import { Component, OnInit,Inject } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { AuthService } from 'src/app/core/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { Router} from '@angular/router';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  Reports: any;
  p: number = 1;
  report: any;
  total: any = 0;
  myDate : any;
  total_qty: any = 0;
  shop: any;
  user: any;
  gstin_no: any;
  counter:any;
  userName:any;
  Orders:any;
  users:any;
  Report:any;
  product:any;
  report_by:any;
  orderType:any;
  filters:any = {range:{start:'',end:''},type:''};
  dateRangeFilter: {start: '', end:''};
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router,   
    private toast: ToastrService) { }

  ngOnInit() {
        this.orderType = 'select';
        this.getReports();
  }
  
  getReports(){
     this.apiService.callPostApi('getReports', {user_id: localStorage.getItem('email')}).subscribe(res => {
      this.Reports = res.services;
    });
  }

  filterRecords(){
  if(this.orderType == 'select'){
    this.toast.error("Please select Type");
    return true;
  }
this.apiService.callPostApi('getReports', {filters:this.filters,user_id: localStorage.getItem('email')}).subscribe(res => {        
     this.Reports = res.services;
      }, error => {
        if(error.status === 401) {
          this.authService.logout();
        }
      }); 
  }


  changeDate(){
    if(this.dateRangeFilter && this.dateRangeFilter.start){
        var startdate = this.dateRangeFilter.start;
       this.filters.range.start = moment(this.dateRangeFilter.start).format('DD-MM-YYYY');
      this.filters.range.end = moment(this.dateRangeFilter.end).format('DD-MM-YYYY');
    }
  }

  changeType(type){
  if(type === 'dropdown'){
  this.filters.type = this.orderType;
  }
}
reset(){
  this.getReports();
  this.orderType = 'select';
}

  print(i) {
    this.Report = this.Reports[i];
      this.product=this.Report.product;
      this.report_by =this.Report.report_by;
      this.myDate =this.Report.created_at;
      this.total =this.Report.total;
      this.total_qty =this.Report.total_qty;
    setTimeout(() => {
      console.log(this.Report);
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

}
