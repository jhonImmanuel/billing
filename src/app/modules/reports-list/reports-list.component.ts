import { Component, OnInit,Inject } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { AuthService } from 'src/app/core/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog,
    private toast: ToastrService) { }

  ngOnInit() {
    this.apiService.callPostApi('getReports', {user_id: localStorage.getItem('email')}).subscribe(res => {
      this.Reports = res.report;
      
    });
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
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    printContent.style.display = 'none';
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
    },1000)
    
  }

}
