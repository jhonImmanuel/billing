import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }
  logout() {
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('shop');
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
