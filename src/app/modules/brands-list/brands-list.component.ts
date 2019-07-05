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
  brands:any;
}
 
@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.scss']
})
export class BrandsListComponent implements OnInit {
  searchValue = new FormControl('');
  search: any;
  BrandsView: any;
  Brands: any = [];
  p: number = 1;
  constructor(private apiService: ApiService,
    private authService: AuthService, public dialog: MatDialog, private toast: ToastrService) { }

  ngOnInit() {
    this.getBrands();
    this.searchValue.valueChanges.pipe(debounceTime(500)).subscribe(res => {
      this.getSearchedProducts();
    });
  }

  getSearchedProducts() {
    if (this.search!=undefined) {
      this.apiService.callPostApi('search', { type: 'Brands', keyword: this.search }).subscribe(res => {
        this.Brands = res.response;
      }, error => {
        if (error.status === 401) {
          this.authService.logout();
        }
      });
    }
  }
  getBrands() {
    if (localStorage.getItem('role') !== 'Super Admin') {
      this.apiService.callGetApi('getRecords?action=brands&user_id=' + localStorage.getItem('email')).subscribe(res => {
        this.Brands = res.response;
      }, error => {
        if (error.status === 401) {
          this.authService.logout();
        }
      });
    }
    if (localStorage.getItem('role') === 'Super Admin') {
      this.apiService.callGetApi('getRecords?action=brands&user_id=Super Admin').subscribe(res => {
        this.Brands = res.response;
      }, error => {
        if (error.status === 401) {
          this.authService.logout();
        }
      });
    }
  }  
  openDialogBrand(i){
    const dialogRef = this.dialog.open(BrandDialog, {
      width: '1000px',
      data: {brands:this.Brands[i]}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getBrands();
    })
  }
  removeProduct(i) {
    if (window.confirm('Are you sure you wish to delete these brands?')){
      this.apiService.callGetApi('delete?type=Brands&id=' + this.Brands[i].id).subscribe(res => {
        this.Brands.splice(i, 1);
      }, error => {
        if (error.status === 401) {
          this.authService.logout();
        }
      });
    }
  }
}
@Component({
  selector: 'brand-dialog',
  templateUrl: 'brand-dialog.html',
})
export class BrandDialog {
  p2 = 1;
  brands:any;
  constructor(private apiService: ApiService,
    private authService: AuthService,
    private toast: ToastrService,
    public dialogRef: MatDialogRef<BrandDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    ngOnInit(){
      this.brands = this.data && this.data.brands;
      console.log(this.brands);
    }
  onNoClick(): void {
    this.dialogRef.close();
  }
  saveBrand(){
    this.apiService.callPostApi('addBrand', { product_brand:this.brands.product_brand,product_code:this.brands.product_code,id:this.brands.id,is_edited:true}).subscribe(res => {
      this.toast.success("Brand Updated Successfully");
      this.dialogRef.close();
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
  removeProduct(i) {
    if (window.confirm('Are you sure you wish to delete this product?')){
    this.apiService.callGetApi('delete?type=products&id=' + this.data.products[i].id).subscribe(res => {
      this.data.products.splice(i, 1);
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
  }
}