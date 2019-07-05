import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/core/auth.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  Services:any = [];
  p = 1;
  searchValue = new FormControl('');
  constructor(private apiService: ApiService,
    private authService: AuthService, private toast: ToastrService) { }

  ngOnInit() {
    this.getServices();
    this.searchValue.valueChanges.pipe(debounceTime(500)).subscribe(res => {
      this.getSearchedService();
    });
  }
  getSearchedService(){
    this.apiService.callPostApi('search',{type:'service',keyword:this.searchValue}).subscribe(res =>{
      this.Services = res.response;
    }, error => {
      if(error.status === 401){
        this.authService.logout();
      }
    })
  }
  changeStatus(i){
    var service_id = this.Services[i].id;
    this.apiService.callGetApi('updateStatus/' + service_id).subscribe(res => {
      this.Services = res.response;
      this.getServices();
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
  getServices(){
      this.apiService.callGetApi('getRecords?action=getServices&user_id=' + localStorage.getItem('email')).subscribe(res => {
        this.Services = res.response;
      }, error => {
        if (error.status === 401) {
          this.authService.logout();
        }
      });
  }
}
