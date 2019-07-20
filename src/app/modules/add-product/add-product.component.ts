import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { AuthService } from 'src/app/core/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { 
  Inject 
} from '@angular/core'; 
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import {
  MatDialog,
  MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material';

export interface DialogData {
  value:string;
}
declare var $: any;

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  
   product: any = {};
  constructor(private apiService: ApiService,
    private authService: AuthService,
    public dialog: MatDialog,
    private toast: ToastrService,
    private router: Router) { }
    brands:any;
  ngOnInit() {
    this.getBrands();
    this.product.product_brand = '0';
    this.product.product_type = '0';
  }
  getBrands() {
      this.apiService.callGetApi('getbrands').subscribe(res => {
        this.brands = res.response;
        }, error => {
            if(error.status === 401) {
                this.authService.logout();
              }
            });
          }
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
  onChanageQuantity(e){
    this.product.quantities = [];
    if(e.target.value > 15){
      this.toast.error('Quantity Should not be Greator than 15');
      return false;
    }
    else
    {
      var ary = [];
      for(var i = 0;i < e.target.value;i++){
        ary.push(i);
      }
      this.product.product_imei = [];
      this.product.quantities= ary;
    }
  }


  onSubmit(login) {
    this.product.role = 'Sub Admin';
    if(this.product.product_brand === "0" ){
        const string = 'All fields Are Required';
        this.toast.error(string);
        return true;
    }
    this.product.sku_id = Math.random().toString(36).substring(7);
    if(!(this.product.product_brand || this.product.product_model || this.product.product_color || this.product.sku_id  || this.product.product_type
      || this.product.product_color || this.product.our_price || this.product.product_quantity  || this.product.price) || this.product.product_type == "0"){
      const string = 'All fields Are Required';
      this.toast.error(string);
      return true;
    } else {
      this.apiService.callPostApi('addProduct', this.product).subscribe(res => {
        $('#product').focus();
        if(this.product.product_type == "phone"){
          this.toast.success('Phone added successfully');
          this.router.navigate(['/products']);
        }else{
          this.toast.success('Accessories added successfully');
          this.router.navigate(['/accessories']);
        }        
      }, error => {
        if(error.status === 401) {
          this.authService.logout();
        }
        if(error.status === 400) {
          this.toast.error(error.message);
        }
        if(error.status === 422){
          const serverError = JSON.parse(error._body);

          if (typeof serverError.errors === "object"){
            for(var key in serverError.errors) {
              serverError.errors[key] = this.toast.error(serverError.errors[key]);
            }
          }
          return false;
        }
      })
    }

  }
  openDialog(i): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog1, {
      width: '500px',
      data: {value:this.product.product_imei[i]}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog1 {

  constructor(
  public dialogRef: MatDialogRef<DialogOverviewExampleDialog1>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  elementType = 'img';
  value = '';
  format = 'CODE128';
  lineColor = '#000000';
  width = 2;
  height = 100;
  displayValue = true;
  fontOptions = '';
  font = 'monospace';
  textAlign = 'center';
  textPosition = 'bottom';
  textMargin = 2;
  fontSize = 20;
  background = '#ffffff';
  margin = 10;
  marginTop = 10;
  marginBottom = 10;
  marginLeft = 10;
  marginRight = 10;
  product :any ;
  get values(): string[] {
    //  this.value.split('\n');
    return this.value.split('\n');
  }
  ngOnInit() {
    this.value = this.data.value;
  }

  
  codeList: string[] = [
    '', 'CODE128',
    'CODE128A', 'CODE128B', 'CODE128C',
    'UPC', 'EAN8', 'EAN5', 'EAN2',
    'CODE39',
    'ITF14',
    'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110',
    'pharmacode',
    'codabar'
  ];
  onNoClick(): void {
    this.dialogRef.close();
  }
   printableImage(source) {
		return "<html><head><script>function step1(){\n" +
				"setTimeout('step2()', 10);}\n" +
				"function step2(){window.print();window.close()}\n" +
				"</scri" + "pt><style>.barcode_wrapper {max-width: 380px;border: 1px solid #000;text-align: center;padding: 10px;}</style> </head><body onload='step1()'>\n" +
				"<div class='barcode_wrapper'><div class='barcode'><img src='" + source + "' /></div></div></body></html>";
	}
	 print(from) {
    var div = document.getElementsByClassName('barcode');
    let source;
    if (typeof(div) != 'undefined' && div != null)
    {
      source= (div[0].children[0] as HTMLImageElement ).src;
    }
		let Pagelink = "about:blank";
		var pwa = window.open(Pagelink, "_new");
		pwa.document.open();
		pwa.document.write(this.printableImage(source));
		pwa.document.close();
	}
}