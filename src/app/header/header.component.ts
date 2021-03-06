import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  badgeCount: number = 0;
  cart: any[] = [];
  tableNo: any;
  constructor(private router: Router, public commonService: CommonService) {

    this.commonService.changeCount(this.cart.length)
    this.commonService.responsetable.subscribe((res) => {
      this.tableNo = res;
    })

    this.tableNo = JSON.parse(localStorage.getItem('tableno') || '[]');
    this.commonService.getTableNum(this.tableNo)
  }

  ngOnInit() {
    this.commonService.responseCount.subscribe((res) => {
      console.log(res);
      this.badgeCount = res;
    })
  }

  menu() {
    this.router.navigateByUrl(`/menu/${this.tableNo}`);
  }

}
