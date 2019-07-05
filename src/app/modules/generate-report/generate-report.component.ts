import { Component, OnInit,Inject } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { AuthService } from 'src/app/core/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';




export interface DialogData {
  name: string;
  price: any;
  products:any;
  users:any;
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
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog,
    private toast: ToastrService) { }

  ngOnInit() {
    this.shop = localStorage.getItem('shop');
    this.user = localStorage.getItem('email');
    this.getCounts();
    this.apiService.callPostApi('getTodayOrders', {shop: localStorage.getItem('email')}).subscribe(res => {
      this.report = res.response;
      for (const reportData of this.report) {
        this.total_qty += parseInt(reportData.qty);
        this.total += parseInt(reportData.price);
      }
    });
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }

  getCounts() {
    this.apiService.callGetApi('dashboard/' + localStorage.getItem('email')).subscribe(res => {
      this.counter = res.response;
    });
  }

  openDialogBrand(i){
    const dialogRef = this.dialog.open(GenerateReportDialog, {
      width: '1000px',
      data: { products: this.Orders}
    });
     dialogRef.afterClosed().subscribe(result => {
        this.users = dialogRef.componentInstance.user;
        this.print();
     });
  }
  print() {
    setTimeout(() => {
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
  users:any;
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
      this.dialogRef.close(this.users);
  }
}