import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  user: any = {};
  constructor(private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router) { 
      if(localStorage.getItem('token')) {
        this.router.navigate(['home']);
      }
      document.getElementsByTagName('body')[0].style.backgroundImage = 'url(assets/img/back.jpg)';
    }

  ngOnInit() {
  }
  onSubmit() {
    this.apiService.callPostApi('login', this.user).subscribe(res => {
      this.toastr.success('Logged In Successfully');
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.user[0].role);
      localStorage.setItem('email', res.user[0].email);
      this.router.navigate(['home']);
    },error =>{
      this.toastr.error('Invalid crediantials');
    })
  }
  ngOnDestroy() {
    document.getElementsByTagName('body')[0].style.backgroundImage = 'url()';
  }
}
