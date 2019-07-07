import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { AuthService } from 'src/app/core/auth.service';
import { ToastrService } from 'ngx-toastr';

import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatDialog,
  MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material';import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-service-add',
  templateUrl: './service-add.component.html',
  styleUrls: ['./service-add.component.scss']
})
export class ServiceAddComponent implements OnInit {
  service:any = {charges:{chargesDescription:[],charges:[]}};
  nameError:any;
  phoneError:any;
  emailError:any;
  ChargesCount:any;
  descriptionError:any;
  cgst:any;
  sgst:any;
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog,
    private toast: ToastrService,
    private router: Router) { }
  ngOnInit() {
    this.service.count = 1;
   this.ChargesCount = [1]; 
   this.getSettings(); 
  }
  changeTotal(){
    var price = 0;
    for (var i = this.service.charges.charges.length - 1; i >= 0; i--) {
      price += parseInt(this.service.charges.charges[i]);
    }
    debugger;
    this.service.price = (price * ((parseInt(this.sgst,10) + parseInt(this.cgst,10))/100)) + price;
  }
  onChanageQuantity(e){
    this.ChargesCount = [];
    if(e.target.value > 15){
      this.toast.error('Quantity Should not be Greator than 15');
      return false;
    }
    else
    {
      var ary = [];
      for(var i = 0;i < e.target.value;i++){
        ary.push(i);
      }
      this.ChargesCount = ary;
    }
  }
getSettings(){
    this.apiService.callPostApi('getSettingValue', {}).subscribe(res => {
    this.cgst = res.setting_name.minimum_cgst;
    this.sgst = res.setting_name.minimum_sgst;
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
changecount(type){
  if(type == "add"){
     this.service.chargesDescription.push('');
    this.service.charges.push(0) 
  }else{
     this.service.chargesDescription.push('');
    this.service.charges.push(0) 
  }
}
  validate(e){
    if(e.target.name =="customerName"){
      setTimeout(() => {
        if(e.target.value.length < 3){
          this.nameError = true;
          return false;
        } else{
          this.nameError = false;
        }
        var regex = /^[a-zA-Z ]*$/;
       var ctrl =  e.target.value;

    if (regex.test(ctrl)) {
      this.nameError = false;
        return true;
    }
    else {
      this.nameError = true;
      return false;
    }
      },1000);
    }

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
    if(e.target.name=="mobile"){
      setTimeout (() => {
        var phoneno = /^\d{10}$/;
        if((e.target.value.match(phoneno))){
          this.phoneError = false;
            return true;
          }
          else{
            this.phoneError = true;
            return false;
           }
      },500);
    }
  }

  onSubmit() {
    if((this.nameError || this.phoneError || this.emailError || this.descriptionError)){
      const string = 'All fields Are Required';
      this.toast.error(string);
      return true;
    } else {
      this.service.cgst = this.cgst;
      this.service.sgst = this.sgst;
      this.apiService.callPostApi('addService',this.service).subscribe(res => {
        $('#name').focus();
          this.toast.success('Service Request added successfully');
          this.router.navigate(['/servicelist']);
           
      }, error => {
        if(error.status === 401) {
          this.authService.logout();
        }
        if(error.status === 422){
          const serverError = JSON.parse(error._body);

          if (typeof serverError.errors === "object"){
            for(var key in serverError.errors) {
              serverError.errors[key] = this.toast.error(serverError.errors[key]);
            }
          }
          return false;
        }
      })
    }
}
openMenu() {
  document.getElementsByTagName('html')[0].classList.toggle('nav-open');
}
}