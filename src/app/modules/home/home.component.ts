import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth.service';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  @ViewChild('name') name: ElementRef;
  role: any;
  users: any = [];
  Admins: any = 'select';
  id: any = 0;
  order: any = [];
  grandTotal:any;
  max: boolean;
  product = [];
  subTotal = 0;
  bill_id: any = 5;
  products: any;
  searchTerm: any = new FormControl();
  IMEI: any = new FormControl();
  searchTermModel: any = new FormControl();
  qty: any = new FormControl();
  price: any;
  product_value: any;
  product_model: any;
  qty_value: any;
  prod_id: any;
  total: any = 0;
  shop: any;
  myDate = Date.now();
  i: any = 0;
  product_imei: any;
  noImei: any;
  gstin_no: any;
  user:any;
  CurrentProduct: any;
  Model: any;
  Brands: any;
  is_gst: number;
  payment_mode: any;
  discount: any;
  discounted_price: any;
  original_price: any;
  customer_name: any;
  customer_email: any;
  customer_phone: any;
  gst: any;
  cgst:any;
  sgst:any;
  emailError:any;
  nameError:any;
  phoneError:any;
  mmaximumCount: any
  currentCustomerName:any;
  currentCustomerPhone:any;
  dateTime:any;
  bill_type:any;
  type:any;
  exchange_price:any;
  remaining_balance:any;
  constructor(private apiService: ApiService,
    private authService: AuthService, private toast: ToastrService) { }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.cancelOrder();
    event.returnValue = false;
  }

  ngAfterViewInit() {
    document.getElementById('product_imei').focus();
  }
  ngOnInit() {
    this.type = "Percentage";
    this.bill_type = 'normal';
    this.qty_value = "1";
    this.remaining_balance = "0";
    this.payment_mode = "0";
    this.max = false;
    this.exchange_price = "0";
    this.emailError = false;
    this.phoneError = false;
    this.nameError = false;
    this.noImei = false;
    this.user = localStorage.getItem('email');
    this.role = localStorage.getItem('role');
    this.is_gst = (this.role === 'non_gst_admin') ? 0 : 1;
    // this.searchTerm.valueChanges.pipe(debounceTime(500)).subscribe(res => {
    this.getProduct();
    // });
    this.IMEI.valueChanges.pipe(debounceTime(500)).subscribe(res => {
      this.changeImei();
      });
    this.searchTermModel.valueChanges.pipe(debounceTime(500)).subscribe(res => {
      this.getModel();
    });
    this.getSettings();
  }
  change() {
    this.getModel();
  }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
  getSettings(){
    this.apiService.callPostApi('getSettingValue', {}).subscribe(res => {
    this.cgst = res.setting_name.minimum_cgst;
    this.sgst = res.setting_name.minimum_sgst;
    this.discount = res.setting_name.minimum_discount;
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
  changetype(e){
    if(e.target.id == 'Rupees'){
        this.type = "Rupees";
        this.changeTotal();
    }else{
        this.type = "Percentage";
        this.changeTotal();
    }
  }
  getProduct() {
    this.apiService.callPostApi('brand', { product_brand: this.product_value }).subscribe(res => {
      this.Brands = res.brands.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      this.mmaximumCount = res.brands.length

    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }


  getModel() {
    this.max = true;
    this.apiService.callPostApi('model/' + this.product_value, { product_model: this.product_model }).subscribe(res => {
      this.products = res.model.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }

  changePrice(value) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].product_model === value) {
        this.mmaximumCount = this.products[i].product_quantity;
        this.original_price = this.products[i].price;
        this.price = this.products[i].price;
        this.prod_id = this.products[i].id;
      }
    }
  }
changeBilltype(e){
  if(e.target.value === 'normal'){
    var result = window.confirm('This action will clear the orders you like to remove the added items?');
    debugger;
    if (result){
        this.i = 0;
        this.max = true;
        this.Model = '0';
        this.products = [];
        this.qty_value = '0';
        this.discounted_price = 0;
        this.original_price = '';
        this.product_imei = '';
        this.product=[];
        this.customer_name='';
        this.customer_email=''; 
        this.customer_phone='';
        this.payment_mode='';
        this.total = 0;
        this.exchange_price = 0;
        this.remaining_balance = 0;
        this.bill_type = 'normal';
    }else{
      this.bill_type = 'exchange';
      this.total = this.total + parseInt(this.exchange_price);
      // this.exchange_price = 0;
    }
  }
}

  changeExchange (value){
   setTimeout(() =>{
     if(parseInt(value) > 0 ){
      this.total = this.total - parseInt(this.exchange_price);
      this.remaining_balance = 0;
    }
      $('#exchange').prop('disabled',true);
    }, 500);
  }
  print() {
    const printContent = document.getElementById("componentID");
    printContent.style.display = 'block';
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
     WindowPrt.document.write('<style type="text/css">body { padding: 0; margin: 0; font-family: sans-serif; } h1, h2, h3, h4, h5, h6, ol { margin: 0; } * { box-sizing: border-box; } .invoice_container { color: #100a6c; position: relative; padding: 20px 0; } .invoice_container::before { content: "Nusaiba Mobiles"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, 50%) rotate(-35deg); font-size: 82px; font-weight: bold; color: #ccc; z-index: -1; opacity: 0.6; } .invoice_container header { text-align: center; border-bottom: 5px solid #100a6c; } .invoice_container header p { width: 375px; margin: 0 auto; font: 18px / 24px sans-serif; } .invoice_container header strong { display: block; } .invoice_wrapper { border: 1px solid #100a6c; margin: 40px 30px; } .invoice_wrapper div { padding: 15px 30px; border-bottom: 1px solid #100a6c; } table { width: 100%; border-collapse: collapse; } .tax_invoice table td { width: 300px; color: #100a6c; font: 16px / 20px sans-serif; } .tax_invoice h2 { font: 18px / 24px sans-serif; padding-left: 60px; margin-bottom: 10px; } .Receipent p { position: relative; height: 100px; } .bill-details { padding: 0 !important; } .bill-details table td, .bill-details table th { border-left: 1px solid #100a6c; color: #100a6c; text-align: center; } .bill-details table tbody tr:first-child { height: 150px; } .bill-details table tr td:nth-child(1), .bill-details table tr th:nth-child(1) { border-left: 0; } .bill-details table thead th { border-bottom: 1px solid #100a6c; padding: 15px 0; } .bill-details table tfoot td { border-top: 1px solid #100a6c; border-left: 0; padding: 15px 0; font-weight: bold; } .invoice_wrapper footer { padding: 50px 50px 5px; } .invoice_wrapper footer span:last-child { float: right; } .termsCondition { font: 500 14px / 22px monospace; }</style>');

    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    printContent.style.display = 'none';
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }
  validate(e){
    if(e.target.name =="customer_email"){
      setTimeout(() => {
        var x=e.target.value;  
        var atposition=x.indexOf("@");  
        var dotposition=x.lastIndexOf(".");  
        if (atposition<1 || dotposition<atposition+2 || dotposition+2>=x.length){  
          this.emailError = true;
          return false;  
          }else{
            this.emailError = false;
          }  
      }, 1000);
    }
    if(e.target.name =="customer_name"){
      setTimeout(() => {
        if(e.target.value.length < 3){
          this.nameError = true;
          return false;
        } else{
          this.nameError = false;
        }
        var regex = /^[a-zA-Z ]*$/;
       var ctrl =  e.target.value;

    if (regex.test(ctrl)) {
      this.nameError = false;
        return true;
    }
    else {
      this.nameError = true;
      return false;
    }
      },1000);
    }
    if(e.target.name=="customer_phone"){
      setTimeout (() => {
        var phoneno = /^\d{10}$/;
        if((e.target.value.match(phoneno))){
          this.phoneError = false;
            return true;
          }
          else{
            this.phoneError = true;
            return false;
           }
      },500);
    }
  }
  addProduct(event) {
    this.qty_value = event.target.value;
    if(this.product_imei ==''){
      this.toast.error("IMEI IS REQUIRED");
      return false;
    }
    if (parseInt(this.qty_value) > parseInt(this.mmaximumCount)) {
      this.toast.error("Maximum Quanitity Reached");
      return false;
    }
    if (event.keyCode == 13) {
      this.i += 1;
    }
    setTimeout(() => {
      if ((event.keyCode == 13 || event.keyCode == 9) && this.i === 1) {
        this.productAdd();

      }
      if (this.i === 2) {
        this.productAdd();
        this.placeOrder();
      }
    }, 500);
  }
  changeImei() {
    if(this.product_imei && this.product.some(el => el.product_imei === this.product_imei)){
      this.toast.error("Product already Added");
      return false;
    } 
    else{
      this.apiService.callGetApi('products/imei?product_imei=' + this.product_imei).subscribe(res => {
        if (res && res.response.length > 0) {
          this.noImei = false;
          document.getElementById('quantity').focus();
          this.products = res.response;

          this.product_value = res.response[0].brands.product_brand;
          this.Model = res.response[0].product_model;
          this.qty_value = 1;
          this.mmaximumCount = 1;
          this.original_price = res.response[0].price;
          this.price = res.response[0].price;
          this.subTotal = this.price;
          this.prod_id = res.response[0].id;
          this.max = false;
        } else {
          this.noImei = true;
          this.Model = '0';
          this.product_value = '';
          this.qty_value = '0';
          this.discounted_price = 0;
          this.original_price = '';
          return false;
        }
      }, error => {
        if (error.status === 401) {
          this.authService.logout();
        }
      });
    }
  }
  getSub(){
    return( this.discounted_price * this.qty_value) + ((this.discounted_price * this.qty_value) * ((parseInt(this.sgst) + parseInt(this.cgst)) /100)) ;
  }
  changeTotal(){
    var tot = 0;
      for (let i = 0; i < this.product.length; i++) {
        tot  +=  parseInt(this.product[i].total_amount);
      }
      this.qty_value = 1;
      this.changeDiscount(tot);
      if(this.is_gst == 1){
      this.total = (this.discounted_price * this.qty_value) + ((this.discounted_price * this.qty_value) * ((parseInt(this.sgst,10) + parseInt(this.cgst,10))/100));

      }else{
        this.total = (this.discounted_price * this.qty_value);
      }
  }
  changeDiscount(price) {
    if(this.type == "Percentage"){
      console.log(this.type);
      this.discounted_price = parseInt(price) - (parseInt(price) * (parseInt(this.discount) / 100));
    }else{
      this.discounted_price = parseInt(price) - parseInt(this.discount);
    }
  }
  productAdd() {
    if (this.qty_value == "" || this.product_value == "") {
      return false
    }
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === this.prod_id) {
        this.product.push({
          bill_id : Math.random().toString(36).substring(7),prod_id: this.products[i].id, subTotal: this.subTotal,product_type:this.products[i].product_type, product_imei: this.product_imei,
          product_brand: this.products[i].brands.product_brand, product_model: this.products[i].product_model + '-' + this.products[i].product_color, is_gst: this.is_gst, product_quantity: this.qty_value, original_price: this.original_price, price: this.products[i].price,
          user_id: localStorage.getItem('email'), total_amount: this.price, product_Imei: this.products[i].product_imei, payment_mode: this.payment_mode, discount: this.discount, discounted_price: this.discounted_price, gst: this.gst,
          exchange : this.exchange_price, cgst: parseInt(this.cgst),sgst: parseInt(this.sgst) 
        });
        this.changeTotal();
        this.i = 0;
        this.max = true;
        this.Model = '0';
        this.subTotal = 0;
        this.products = [];
        this.qty_value = '0';
        this.discounted_price = 0;
        this.original_price = '';
        this.product_imei = '';
        document.getElementById('product_imei').focus();
          $('select[name=bill_type]').prop('disabled',false);
      }
    }
    this.apiService.callPostApi('orederTracking',
      { user_id: localStorage.getItem('email'), order: this.product }).subscribe(res => {
      }, error => {
        if (error.status === 401) {
          this.authService.logout();
        }
      });
    this.product_value = '';
    this.qty_value = '';
    this.price = 0;
  }
  clearvalue() {
    this.product = [];
    this.total = 0;
    this.remaining_balance = 0;
  }
  placeOrder() {
    this.max = false;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.dateTime = date+' '+time;
    if (!this.customer_name || !this.customer_email || !this.customer_phone || !this.payment_mode) {
      this.toast.error(" All Fields are Required");
      return false;
    }
    if(this.payment_mode === '0'){
      this.toast.error("Payment Mode Required");
      return false;
    }
    if (this.product.length > 0 && this.mmaximumCount >= this.qty_value) {
      this.currentCustomerName = this.customer_name;
      this.currentCustomerPhone = this.customer_phone;
      for (let i = 0; i < this.product.length; i++) {
        this.product[i].cgst = this.cgst;
        this.product[i].sgst = this.sgst;
      }
      var bill_id  =  Math.random().toString(36).substring(7);
      this.apiService.callPostApi('confirmOrder', {
        user_id: localStorage.getItem('email'),
        product: this.product,
        shop_id: localStorage.getItem('shop'),
        customer_name: this.customer_name,
        customer_email: this.customer_email,
        customer_phone: this.customer_phone,
        payment_mode: this.payment_mode,
        total_amount: this.total,
        cgst: parseInt(this.cgst),
        sgst: parseInt(this.sgst) ,
        exchange:this.exchange_price,
        bill_id : bill_id
      }).subscribe(res => {
        this.bill_id = res.response;
        if (res.statusCode == 200) {
          this.toast.success("Order Placed Successfully");
          this.payment_mode = "0";
          this.exchange_price = 0;
          this.bill_type = "normal";
          setTimeout(() => {

            this.print();
            this.clearvalue();
            this.i = 0;
          }, 200);
          this.customer_name = this.customer_email = this.customer_phone = '';
        } else {
          this.toast.error(res.response);
        }
      }, error => {
        if (error.status === 401) {
          this.authService.logout();
        }
      });
    }
  }

  cancelOrder() {
    if (window.confirm('Are you sure you wish to cancel this order?')){
    this.i = 0;
    this.max = true;
    this.Model = '0';
    this.total = 0;
    this.products = [];
    this.qty_value = '0';
    this.discounted_price = 0;
    this.original_price = '';
    this.product_imei = '';
    this.product=[];
    this.customer_name='';
    this.customer_email=''; 
    this.customer_phone='';
    this.total = 0;
    this.payment_mode='';
    this.exchange_price = 0;
    this.remaining_balance = 0;
    this.bill_type = 'normal';
    }
  }
  removeProduct(i) {
    if (window.confirm('Are you sure you wish to remove this product?')) {
      this.product.splice(i, 1);
      this.total = 0;
      this.product.forEach((element,index) => {
        this.total += this.product[index].subTotal;
      });
      this.apiService.callPostApi('orederTracking',
        { user_id: localStorage.getItem('email'), order: this.product }).subscribe(res => {
        }, error => {
          if (error.status === 401) {
            this.authService.logout();
          }
        });
    }
  }
}