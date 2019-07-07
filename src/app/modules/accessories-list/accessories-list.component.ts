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
}

@Component({
  selector: 'app-accessories-list',
  templateUrl: './accessories-list.component.html',
  styleUrls: ['./accessories-list.component.scss']
})
export class AccessoriesListComponent implements OnInit {
  searchValue = new FormControl('');
  search: any;
  AccessoriesView: any;
  Accessories: any = [];
  p: number = 1;
  constructor(private apiService: ApiService,
    private authService: AuthService, public dialog: MatDialog, private toast: ToastrService) { }

  ngOnInit() {
    this.getAccessories();
    this.searchValue.valueChanges.pipe(debounceTime(500)).subscribe(res => {
      this.getSearchedProducts();
    });
  }

  getSearchedProducts() {
    if (this.search) {
      this.apiService.callPostApi('search', { type: 'accessories', keyword: this.search }).subscribe(res => {
        this.Accessories = res.response;
      }, error => {
        if (error.status === 401) {
          this.authService.logout();
        }
      });
    }
  }
  getAccessories() {
    if (localStorage.getItem('role') !== 'Super Admin') {
      this.apiService.callGetApi('getRecords?action=accessories&user_id=' + localStorage.getItem('email')).subscribe(res => {
        this.Accessories = res.response;
      }, error => {
        if (error.status === 401) {
          this.authService.logout();
        }
      });
    }
    if (localStorage.getItem('role') === 'Super Admin') {
      this.apiService.callGetApi('getRecords?action=accessories&user_id=Super Admin').subscribe(res => {
        this.Accessories = res.response;
      }, error => {
        if (error.status === 401) {
          this.authService.logout();
        }
      });
    }
  }
  openDialogAccessories(i): void {
    this.apiService.callGetApi('getproducts/' + this.Accessories[i].sku_id + '').subscribe(res => {
      this.AccessoriesView = res.response;
      const dialogRef = this.dialog.open(AccessoriesDialog, {
        width: '1000px',
        data: { products: this.AccessoriesView, from: "AccessoriesView" }
      });
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
  openDialog(i): void {
    const dialogRef = this.dialog.open(AccessoriesDialog, {
      width: '500px',
      data: { name: this.Accessories[i].product_name, price: this.Accessories[i].price, from: "Accessories" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const price = result;
        console.log(price);
        this.apiService.callPostApi('editPrice', {
          sku_id: this.Accessories[i].sku_id,
          price: price
        }).subscribe(res => {
          this.Accessories[i].price = price;
          this.toast.success(res.message);
        }, error => {
          if (error.status === 422) {
            const errors = JSON.parse(error._body);
            if (errors.errors.price) {
              this.toast.error(errors.errors.price[0]);
            }
          }
        })
      }
    });
  }
  removeProduct(i) {
    if (window.confirm('Are you sure you wish to delete these products?')){
      this.apiService.callGetApi('delete?type=products&sku_id=' + this.Accessories[i].sku_id).subscribe(res => {
        this.Accessories.splice(i, 1);
      }, error => {
        if (error.status === 401) {
          this.authService.logout();
        }
      });
    }
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
}
@Component({
  selector: 'accessories-dialog',
  templateUrl: 'accessories-dialog.html',
})
export class AccessoriesDialog {
  p2 = 1;
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<AccessoriesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
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