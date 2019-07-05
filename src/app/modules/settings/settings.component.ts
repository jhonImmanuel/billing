import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { FormControl } from '@angular/forms';
import { ApiService } from 'src/app/core/api.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private authService: AuthService,private apiService: ApiService,private toast: ToastrService) { }
  settings:any;
  ngOnInit() {
    this.getSettings();
  }
  getSettings(){
    this.apiService.callGetApi('settings').subscribe(res => {
          this.settings = res.result;

        }, error => {
            if(error.status === 401) {
                this.authService.logout();
              }
            });
  }
  saveSettings(){
    const obj = this.settings.map(obj1 =>{ 
      var rObj = {};
      rObj[obj1.setting_name] = obj1.setting_value;
      return rObj;
   });
   this.apiService.callPostApi('settings',
        { setting:this.settings }).subscribe(res => {
          if(res.statusCode == 200){
              this.getSettings();
              this.toast.success('Settings Updated Successfully');
          }
        }, error => {
          if (error.status === 401) {
            this.authService.logout();
          }
        });
  }
}
