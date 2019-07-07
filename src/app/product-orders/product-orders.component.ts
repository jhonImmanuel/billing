import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-orders',
  templateUrl: './product-orders.component.html',
  styleUrls: ['./product-orders.component.scss']
})
export class ProductOrdersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
}
