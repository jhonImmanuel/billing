import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adding',
  templateUrl: './adding.component.html',
  styleUrls: ['./adding.component.scss']
})
export class AddingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
}
