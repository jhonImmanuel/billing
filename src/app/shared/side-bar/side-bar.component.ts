import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  user: any;
  constructor(private authService: AuthService) {
    this.user = localStorage.getItem('role');
   }

  ngOnInit() {
  }
  logout() {
    this.authService.logout();
  }
}
