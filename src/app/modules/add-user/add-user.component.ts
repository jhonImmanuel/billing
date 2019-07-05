import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { AuthService } from 'src/app/core/auth.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  user: any = {};
  shops: any = [];
  constructor(private apiService: ApiService,
    private authService: AuthService,
    private toast: ToastrService) {
      this.getShops();
     }

  ngOnInit() {
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
  getShops() {
    this.apiService.callGetApi('getRecords?action=shops' ).subscribe(res => {
      this.user.shop_id = '0';
      this.shops = res.response;
    });
  }
  onSubmit() {
    this.user.role = 'Sub Admin';
    this.apiService.callPostApi('addUser', this.user).subscribe(res => {
      $('#uname').focus();
      this.toast.success('successfully added');
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
    })
  }
}
