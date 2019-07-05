import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { AuthService } from 'src/app/core/auth.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
export interface DialogData {
  username: string;
  password: any;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: any =[];
  p: number = 1;
  search: any = '';
  searchValue = new FormControl('');
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog,
    private toast: ToastrService) { }

  ngOnInit() {
    this.getuser();
    this.searchValue.valueChanges.pipe(debounceTime(500)).subscribe(res => {
      this.getSearchedUsers();
    });
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
  getuser() {
    this.apiService.callGetApi('users').subscribe(res => {
      this.users = res.list;
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
    });
  }
  getSearchedUsers() {
    this.apiService.callPostApi('search', {type: 'users', keyword: this.search}).subscribe(res => {
      this.users = res.response;
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
    });
  }
  removeUser(i) {
    this.apiService.callGetApi('delete?type=users&id=' + this.users[i].id ).subscribe(res => {
      this.users.splice(i, 1);
    }, error => {
      if(error.status === 401) {
        this.authService.logout();
      }
    });
  }
  openDialog(i): void {
    const dialogRef = this.dialog.open(Dialog, {
      width: '500px',
      data: {username: this.users[i].email}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        const password = result;
        this.apiService.callPostApi('updatePassword', {
          id: this.users[i].id,
          password: password
        }).subscribe(res => {
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
}


@Component({
  selector: 'dialog-dialog',
  templateUrl: 'dialog.html',
})
export class Dialog {

  constructor(
    public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}