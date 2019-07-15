import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-orders',
  templateUrl: './service-orders.component.html',
  styleUrls: ['./service-orders.component.scss']
})
export class ServiceOrdersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
}
