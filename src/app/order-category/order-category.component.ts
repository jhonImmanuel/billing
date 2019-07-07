import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-category',
  templateUrl: './order-category.component.html',
  styleUrls: ['./order-category.component.scss']
})
export class OrderCategoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }

}
