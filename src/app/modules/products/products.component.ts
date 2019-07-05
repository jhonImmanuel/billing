import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { ApiService } from 'src/app/core/api.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ToastrService } from 'ngx-toastr';

export interface DialogData {
  name: string;
  price: any;
  products:any;
  customer:any;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {


  products: any = [];
  p: number = 1;
  viewProducts : any;
  search: any = '';
  searchValue = new FormControl('');
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog,
    private toast: ToastrService) { }

  ngOnInit() {
    this.searchValue.valueChanges.pipe(debounceTime(500)).subscribe(res => {
      this.getSearchedProducts();
    });
    this.getProduct();
  }
  
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  } 
  getProduct() {
    this.apiService.callGetApi('getRecords?action=products').subscribe(res => {
      this.products = res.response;
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
    });
  }
  getSearchedProducts() {
    this.apiService.callPostApi('search', {type: 'products', keyword: this.search}).subscribe(res => {
      this.products = res.response;
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
    });
  }
  removeProduct(i) {
    if (window.confirm('Are you sure you wish to delete these products?')){
      this.apiService.callGetApi('delete?type=products&sku_id=' + this.products[i].sku_id ).subscribe(res => {
        this.products.splice(i, 1);
      }, error => {
        if(error.status === 401) {
          this.authService.logout();
        }
      });
   }
  }
  openDialog(i): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: {name: this.products[i].product_name, price: this.products[i].price,from:'editPrice'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        const price = result;
        console.log(price);
        this.apiService.callPostApi('editPrice', {
          sku_id: this.products[i].sku_id,
          price: price
        }).subscribe(res => {
          this.products[i].price = price;
          this.toast.success(res.message);
        }, error => {
          if (error.status === 422) {
            const errors = JSON.parse(error._body);
            if(errors.errors.price) {
              this.toast.error(errors.errors.price[0]);
            }
          }
        })
      }
    });
  }



  openDialogProducts(i): void {
    this.apiService.callGetApi('getproducts/'+ this.products[i].sku_id+ '').subscribe(res => {
      this.viewProducts = res.response;
      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '1000px',
      data: {products: this.viewProducts,from:"ViewProducts"}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getProduct();
    })
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
    });
    
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  p2: number = 1;
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  removeProduct(i) {
    if (window.confirm('Are you sure you wish to delete this product?')){
      this.apiService.callGetApi('delete?type=products&id=' + this.data.products[i].id ).subscribe(res => {
        this.data.products.splice(i, 1);
      }, error => {
        if(error.status === 401) {
          this.authService.logout();
        }
      });
   }
  } 
}