import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-add-shop',
  templateUrl: './add-shop.component.html',
  styleUrls: ['./add-shop.component.scss']
})
export class AddShopComponent implements OnInit {

  shops: any = {};
  constructor(private apiService: ApiService,
    private toastr: ToastrService) { }

  ngOnInit() {
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
  onSubmit() {
    this.apiService.callPostApi('addShop', this.shops).subscribe(res => {
      $('#shop').focus();
      this.toastr.success('Shop added successfully');
    }, error => {
      if(error.status === 422) {
        const errors = JSON.parse(error._body);
        if(errors.errors.gstin_no) {
          this.toastr.error(errors.errors.gstin_no[0]);
        }
        if(errors.errors.shop_name) {
          this.toastr.error(errors.errors.shop_name[0]);
        }
      }
    });
  }
}
