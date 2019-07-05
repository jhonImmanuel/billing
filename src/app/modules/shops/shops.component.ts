import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { AuthService } from 'src/app/core/auth.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ToastrService } from 'ngx-toastr';

export interface DialogData {
  shop: string;
  gstin_no: any;
}


@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {

  shops: any =[];
  p: number = 1;
  search: any = '';
  searchValue = new FormControl('');
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog,
    private toast: ToastrService) { }

  ngOnInit() {
    this.getShops();
    // this.searchValue.valueChanges.pipe(debounceTime(500)).subscribe(res => {
    //   this.getSearchedShops();
    // });
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
  getShops() {
    this.apiService.callGetApi('getRecords?action=shops').subscribe(res => {
      this.shops = res.response;
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
    });
  }
  getSearchedShops() {
    this.apiService.callPostApi('search', {type: 'shops', keyword: this.search}).subscribe(res => {
      this.shops = res.response;
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
    });
  }
  removeShop(i) {
    this.apiService.callGetApi('delete?type=shops&id=' + this.shops[i].id ).subscribe(res => {
      this.shops.splice(i, 1);
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
    });
  }
  openDialog(i): void {
    const dialogRef = this.dialog.open(DialogOverviewDialog, {
      width: '500px',
      data: {shop: this.shops[i].shop_name, gstin_no: this.shops[i].gstin_no}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        const gst_no = result;
        console.log(gst_no);
        this.apiService.callPostApi('updateGSTIN', {
          id: this.shops[i].id,
          gstin_no: gst_no
        }).subscribe(res => {
          this.shops[i].gstin_no = gst_no;
          this.toast.success(res.message);
        }, error => {
          if (error.status === 422) {
            const errors = JSON.parse(error._body);
            if(errors.errors.gstin_no) {
              this.toast.error(errors.errors.gstin_no[0]);
            }
          }
        })
      }
    });
  }
}


@Component({
  selector: 'dialog-overview-dialog',
  templateUrl: 'dialog-overview-dialog.html',
})
export class DialogOverviewDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}