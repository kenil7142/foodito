import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any = [];
  tableNo: any;
  dbnew: any;
  totalAmt: number=0;
  total: any = [];
  price:any = [];
  sum = [];
  qty:any;
msg:string = '';
  constructor(db: AngularFirestore, private router: Router ) {
    this.dbnew = db;
  }


  ngOnInit() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log(this.cart);
    if(this.cart.length ==  0){
      this.msg = 'Your Cart is Empty'
      console.log(this.msg)
    }
    this.tableNo = JSON.parse(localStorage.getItem('table') || '[]');
    console.log(this.tableNo);
    for(let i = 0;i<this.cart.length; i++){
      this.price.push(this.cart[i].qty*this.cart[i].price)
      this.totalAmt += this.price[i]
    }
    console.log(this.price)
    console.log(this.totalAmt)

   
   
  }



  PlaceOrder() {
    this.dbnew.collection('Orders').add({ table: this.tableNo, order: this.cart })
    console.log("added")

  }

  Plus(c:any){

    const cartItem = {

      "description": c.description,
      "foodId": c.foodId,
      "category": c.category,
      "foodName": c.foodName,
      "imageUrl": c.imageUrl,
      "isQuantitative": c.isQuantitative,
      "isSpecial": c.isSpecial,
      "isVeg": c.isVeg,
      "qty": this.qty,
      "price": parseInt(c.price),
      "total": this.total,
      "timing": c.timing
      
    };
    
    // localStorage.removeItem('cart');
    c.qty += 1

   
    console.log(c.qty)
    // for(let i = 0;i<this.cart.length; i++){

    //   this.price.push(this.cart[i].qty*this.cart[i].price)
    //   this.totalAmt += this.price[i]
    // }
  }

  Minus(c:any){
    c.qty -= 1
    if(c.qty <= 0)
    {
      
    }
  }

  item(c: any) {
    localStorage.removeItem("product");
    console.log(c)
    localStorage.setItem("product", JSON.stringify(c));
    JSON.parse(localStorage.getItem('product') || '[]');
    this.router.navigateByUrl('/food');
  }

}