import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { snapshotChanges } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import * as moment from 'moment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  cart: any = [];
  tableno: any;
  initial: any = [];
  menu: any = [];
  detail: any = [];
  veg: any = [];
  nVeg: any = [];
  cate: any = [];
  qty: number = 1;
  uniq: any = [];
  total: any = 0;
  constructor(private route: ActivatedRoute, db: AngularFirestore, private router: Router) {

    db.collection('FoodsCollection').valueChanges().subscribe((res) => {
      this.initial = res
   console.log(typeof(this.initial))
      var Hour = parseInt(moment().format('h'));
      var format = moment().format('a');
      if (Hour > 6 && Hour < 12) {
        this.menu = [];
        for (var i = 0; i < this.initial.length; i++) {
          if (this.initial[i]['isAvailable'] == true && this.initial[i]['Morning'] == true) {
            this.menu.push(this.initial[i]);
          }
        }
      }
      
     
      if (Hour == 12 && format =='pm' || Hour >= 1 && format == 'pm' || format == 'pm' &&  Hour < 6 ) {
        this.menu = [];
        for (var i = 0; i < this.initial.length; i++) {
          if (this.initial[i]['isAvailable'] == true && this.initial[i]['Afternoon'] == true) {
            this.menu.push(this.initial[i]);
          }
        }
      }

      if (Hour >= 6 && format == 'pm' || format == 'pm' &&  Hour < 12 ) {
        this.menu = [];
        for (var i = 0; i < this.initial.length; i++) {
          if (this.initial[i]['isAvailable'] == true && this.initial[i]['Evening'] == true) {
            this.menu.push(this.initial[i]);
          }
        }
      }

      if (Hour == 12 && format =='am' || Hour >= 1 && format == 'am' || format == 'am' &&  Hour < 6 ) {
        this.menu = [];
        for (var i = 0; i < this.initial.length; i++) {
          if (this.initial[i]['isAvailable'] == true && this.initial[i]['Night'] == true) {
            this.menu.push(this.initial[i]);
          }
        }
      }


      this.nVeg = [];
      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isVeg'] == false) {
          this.nVeg.push(this.menu[i]);
        }
      }
      // console.log("Non - veg", this.nVeg);

      this.veg = [];
      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isVeg'] == true) {
          this.veg.push(this.menu[i]);
        }
      }
      // console.log("veg", this.veg);

      this.detail = [];
      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isSpecial'] == true) {
          this.detail.push(this.menu[i]);
        }
      }
      console.log("spe", this.detail);
      // console.log("particular pID",this.menu.filter())
    });

    const cate = db.collection('Categories').valueChanges().subscribe((res) => {
      this.cate = res;



      for (var i = 0; i < this.cate.length; i++) {
        if (this.cate[i]['isSpecial'] == this.menu) {
          this.detail.push(this.menu[i]);
        }
      }

      // console.log("particular pID",this.menu.filter())
    });
  }

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.tableno = res['userid'];
      console.log(this.tableno)
      localStorage.setItem("table", JSON.stringify(this.tableno));
    })
  }

  Add_Item(m: any) {

    const cartItem = {

      "foodId":m.foodId,
      "foodName": m.foodName,
      "qty": this.qty,
      "imageUrl": m.imageUrl,
      "price": parseInt(m.price),
      "Ingredients": m.Ingredients,


    };
    var flag = false;
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    for (var i = 0; i < this.cart.length; i++) {
      this.uniq = this.cart[i]
      if (this.uniq.foodId == m.foodId) {
        localStorage.removeItem('cart');

        console.log(this.uniq)
        console.log("cart2", (this.cart));
        this.qty = this.cart[this.cart.indexOf(this.uniq)].qty += 1
        this.total = this.qty * this.cart[this.cart.indexOf(this.uniq)].price
        console.log(this.total)
        console.log("cart3", (this.qty * m.price));
        console.log("cart3", (this.cart));
        // this.uniq.qty = this.uniq.qty+1
        localStorage.setItem("cart", JSON.stringify(this.cart));

        flag = true
        break

      }
      else {
        console.log("not same")

      }

    }
    if (!flag) {
      this.cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      console.log("cart", this.cart);
    }

   
  }


  toggle = true;
  category(c:any){
  this.toggle = !this.toggle;
console.log(c.categoryName)
   var id = c.categoryName
   this.menu = [];
        for (var i = 0; i < this.initial.length; i++) {
           
          for(var y=0; y< this.initial[i]['category'].length; y++){
     

          if (this.initial[i]['category'][y] == id) {
            this.menu.push(this.initial[i]);
          }
        }
        
        }
  }

  Veg() {
    this.menu = this.veg;
  }

  NonVeg() {
    this.menu = this.nVeg;
  }

  item(m: any) {
    localStorage.removeItem("product");
    console.log(m)
    localStorage.setItem("product", JSON.stringify(m));
    JSON.parse(localStorage.getItem('product') || '[]');
    this.router.navigateByUrl('/food');
  }




}