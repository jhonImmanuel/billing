import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { ApiService } from 'src/app/core/api.service';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-push-mail',
  templateUrl: './push-mail.component.html',
  styleUrls: ['./push-mail.component.scss']
})
export class PushMailComponent implements OnInit {
  searchable = 1;
  dropdownList = {name:'',value:null};
  selectedItems = [];
  dropdownSettings = {};
  dropdownSettings1 = {};
  selectedOptions = [];
  customer:any = {};
  filterCustomer; any= [];
  sendEmail:any ={email:'',messageBody:''};
  constructor(private apiService: ApiService,
    private authService: AuthService,private toast: ToastrService) { }
  public bankMultiFilterCtrl: FormControl = new FormControl();


  ngOnInit() {
  }
  
  send(){
    this.apiService.callPostApi('pushEmail', this.sendEmail).subscribe(res => {
      this.sendEmail ={email:'',messageBody:''};
      this.toast.success('Email send Successfully');
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
      if (error.status === 422) {
        const serverError = JSON.parse(error._body);
          if (typeof serverError.errors === "object"){
            for(var key in serverError.errors) {
              serverError.errors[key] = this.toast.error(serverError.errors[key]);
            }
          }
      }
    })
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
}
