import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-generate-imei',
  templateUrl: './generate-imei.component.html',
  styleUrls: ['./generate-imei.component.scss']
})
export class GenerateImeiComponent implements OnInit {

  constructor(private toast: ToastrService) { }
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
    return this.value.split('\n');
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
  ngOnInit() {
    this.value = "";
  }

  printableImage(source) {
		return "<html><head><script>function step1(){\n" +
				"setTimeout('step2()', 10);}\n" +
				"function step2(){window.print();window.close()}\n" +
				"</scri" + "pt></head><body onload='step1()'>\n" +
				"<img src='" + source + "' /></body></html>";
	}
	 print(from) {
    if(this.value = ""){
      this.toast.error('Please Enter the Code to Generate');
    }
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
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
}