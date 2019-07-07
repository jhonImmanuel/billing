import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { AuthService } from 'src/app/core/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { 
  Inject 
} from '@angular/core'; 
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
} from '@angular/material';
declare var $: any;
@Component({
  selector: 'app-add-brands',
  templateUrl: './add-brands.component.html',
  styleUrls: ['./add-brands.component.scss']
})
export class AddBrandsComponent implements OnInit {

  product: any = {};
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog,
    private toast: ToastrService,
    private router: Router) { }

  ngOnInit() {
  }

  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }

  onSubmit(login) {
    this.product.role = 'Sub Admin';
    if(!(this.product.product_brand || this.product.product_code)){
      const string = 'All fields Are Required';
      this.toast.error(string);
      return true;
    } else {
      this.apiService.callPostApi('addBrand', this.product).subscribe(res => {
        $('#product').focus();
          this.toast.success('brand added successfully');
          this.router.navigate(['/brands']);
           
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
