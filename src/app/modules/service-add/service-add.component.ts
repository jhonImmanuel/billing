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
  service:any = {};
  nameError:any;
  phoneError:any;
  priceError:any;
  modelError:any;
  descriptionError:any;
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog,
    private toast: ToastrService,
    private router: Router) { }
  ngOnInit() {  
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

    if(e.target.name =="model"){
      setTimeout(() => {
        if(e.target.value.length < 3){
          this.modelError = true;
          return false;
        } else{
          this.modelError = false;
        }
        var regex = /^[a-zA-Z ]*$/;
       var ctrl =  e.target.value;

    if (regex.test(ctrl)) {
      this.modelError = false;
        return true;
    }
    else {
      this.modelError = true;
      return false;
    }
      },1000);
    }

    if(e.target.name =="description"){
      setTimeout(() => {
        if(e.target.value.length < 150){
          this.descriptionError = true;
          return false;
        } else{
          this.descriptionError = false;
        }
        var regex = /^[a-zA-Z ]*$/;
       var ctrl =  e.target.value;

    if (regex.test(ctrl)) {
      this.descriptionError = false;
        return true;
    }
    else {
      this.descriptionError = true;
      return false;
    }
      },1000);
    }
    if(e.target.name=="price"){
      setTimeout (() => {
        var regex = /^(\$|)([1-9]\d{0,2}(\,\d{3})*|([1-9]\d*))(\.\d{2})?$/;
        if((e.target.value.match(regex))){
          this.priceError = false;
            return true;
          }
          else{
            this.priceError = true;
            return false;
           }
      },500);
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
    if((this.nameError || this.phoneError || this.modelError || this.descriptionError || this.priceError)){
      const string = 'All fields Are Required';
      this.toast.error(string);
      return true;
    } else {
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
}