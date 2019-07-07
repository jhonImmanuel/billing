import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/core/auth.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

export interface DialogData {
  name: string;
  price: any;
  products:any;
  email:any;
}

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  Services:any = [];
  p = 1;
  dateTime:any;
  products:any;
  chargesDescription:any;
  charges:any;
  searchValue = new FormControl('');
  constructor(private apiService: ApiService,
    private authService: AuthService,public dialog: MatDialog, private toast: ToastrService) { }

  ngOnInit() {
    this.getServices();
    this.searchValue.valueChanges.pipe(debounceTime(500)).subscribe(res => {
      this.getSearchedService();
    });
  }
  getSearchedService(){
    this.apiService.callPostApi('search',{type:'service',keyword:this.searchValue}).subscribe(res =>{
      this.Services = res.response;
      this.products = this.Services;
    }, error => {
      if(error.status === 401){
        this.authService.logout();
      }
    })
  }
  changeStatus(i){
    var service_id = this.Services[i].id;
    this.apiService.callGetApi('updateStatus/' + service_id).subscribe(res => {
      this.Services = res.response;
      this.getServices();
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
  print(i){
    this.products = this.Services[i];
    var charges = this.Services[i] && this.Services[i].charges ? this.Services[i].charges : [];
    if(charges && charges.chargesDescription && charges.chargesDescription){
      this.charges = charges.charges;
      this.chargesDescription = charges.chargesDescription
    }
    setTimeout(() => {
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
    },150);
  }
   opnDialog(i): void {
    const dialogRef = this.dialog.open(ServiceDialog, {
      width: '500px',
      data: { service: this.Services[i],email:this.Services[i].email}
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
  getServices(){
      this.apiService.callGetApi('getRecords?action=getServices&user_id=' + localStorage.getItem('email')).subscribe(res => {
        this.Services = res.response;
      }, error => {
        if (error.status === 401) {
          this.authService.logout();
        }
      });
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
}
@Component({
  selector: 'service-dialog',
  templateUrl: 'service-dialog.html',
})
export class ServiceDialog {
  p2 = 1;
  email:any;
  subject:any;
  body:any;
  emailError:any;
  subError:any;
  bodyError:any;
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ServiceDialog>,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  ngOnInit(){
    this.emailError = false;
    this.subError = false;
    this.bodyError = false;
    this.email = this.data.email;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  validate(e){
    if(e.target.name =="email"){
      setTimeout(() => {
         var x=e.target.value;  
        var atposition=x.indexOf("@");  
        var dotposition=x.lastIndexOf(".");  
        if (atposition<1 || dotposition<atposition+2 || dotposition+2>=x.length){  
          this.emailError = true;
          return false;  
          }else{
            this.emailError = false;
          }  
      },1000);
    }
    if(e.target.name == "subject"){
        setTimeout(() => {
          if(e.target.value.length < 14){
            this.subError = true;
          }else{
            this.subError = false;
          }
        });
    }
    if(e.target.name == "body"){
        setTimeout(() => {
          if(e.target.value.length < 50){
            this.bodyError = true;
          }else{
            this.bodyError = false;
          }
        });
    }
  }
  sendEmail() {
    debugger;
    if(this.email =='' || this.subject == undefined || this.body == undefined || this.emailError == true || this.bodyError == true || this.subError == true ){
      this.toast.error('Please fill the details');
      // dialogRef.disableClose = true;
      return true;
    }
    this.apiService.callPostApi('sendServiceEmail',{subject:this.subject,messageBody:this.body,email:this.email}).subscribe(res =>{
      this.toast.success("Email sent successfully");
      this.onNoClick();
    }, error => {
      this.toast.error("Something went wrong");
      if(error.status === 401){
        this.authService.logout();
      }
    })
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
}