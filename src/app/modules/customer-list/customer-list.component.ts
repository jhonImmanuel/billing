import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { ApiService } from 'src/app/core/api.service';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  searchable = 1;
  dropdownList = {name:'',value:null};
  selectedItems = [];
  dropdownSettings = {};
  dropdownSettings1 = {};
  selectedOptions = [];
  customer:any = {};
  filterCustomer; any= [];
  sendSms:any ={phone:[],messageBody:''};
  constructor(private apiService: ApiService,
    private authService: AuthService,private toast: ToastrService) { }
  public bankMultiFilterCtrl: FormControl = new FormControl();


  ngOnInit() {
    this.getCustomers();
  }
  exportchange(e){
    this.sendSms.phone = this.selectedOptions.map((v)=>{return v.phone})
    console.log(this.sendSms);
  }
  send(){
    this.sendSms.messageBody = this.customer.messageBody;
    this.apiService.callPostApi('pushSms', this.sendSms).subscribe(res => {
      this.toast.success('Message send Successfully');
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
      if (error.status === 422) {
        const errors = JSON.parse(error._body);
        if(errors.errors.product_name) {
          this.toast.error(errors.errors.product_name[0]);
        }
        if(errors.errors.sku_id) {
          const string = errors.errors.sku_id[0].replace('sku id', 'product code');
          this.toast.error(string);
        }
        if(errors.errors.price) {
          this.toast.error(errors.errors.price[0]);
        }
      }
    })
  }
  getCustomers(){
  this.apiService.callGetApi('customers/list').subscribe(res => {
    this.dropdownSettings1 = res.list;
      this.customer = res.list;
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
    });
  }
}
