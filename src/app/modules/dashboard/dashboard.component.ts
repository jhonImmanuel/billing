import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import * as c3 from 'c3';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  counter: any;
  role: any;
  chartType:any;
  users: any = [];
  Admins: any = 'select';
  order: any = [];
  total: any = 0;
  interval: any;
  chartData:[];
  chartData1:[];
  chartDataService[];
  revenueData:[];
  totalRevenue:any;
  revenueData1:[];
  revenueDataService:[];
  totalRevenue1:any;
  totalRevenueService:any;
  opening_balance:any;
  xaxis:any;
  xaxis1:any;
  totalTransaction:any;
  mobiles_sold:any;
  accessories_sold:any;
  services_completed:any;
  mobile_sales:any;
  accessories_sales:any;
  services_sales:any;
  totalTransaction1:any;
  totalTransactionService:any;
  constructor(private apiService: ApiService,
    private authService: AuthService) { }

  ngOnInit() {
    this.chartType = 'month';
    this.getCounts();
    this.getSales();
    this.getTransactionData();
    this.getTransactionDataAccessories();
    this.getTransactionDataService();
    this.apiService.callPostApi('getSettingValue', { setting_name: 'opening_balance' }).subscribe(res => {
      this.opening_balance = res.opening_balance;
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
    this.role = localStorage.getItem('role');
    if (this.role === 'Super Admin') {
      this.getAdmins();
    }
    this.interval = setInterval(() => {
      if (this.Admins !== 'select' && this.Admins !== undefined && this.Admins !== '') {
        this.orderTrack();
      }
    }, 3000);
  }
  getSales(){
    this.apiService.callGetApi('getProducts/sales').subscribe(res => {
      this.mobiles_sold = res.productSales.mobile_count;
      this.accessories_sold = res.productSales.accesssories_count;
      this.services_completed = res.productSales.service_count;
      this.mobile_sales = res.productSales.mobile_sales;
      this.accessories_sales = res.productSales.accessories_sales;
      this.services_sales = res.productSales.service_sales;
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
  changeType(){
    this.getTransactionData();
    this.getTransactionDataAccessories();
    this.getTransactionDataService();
  }
  getTransactionData(){
    this.apiService.callPostApi('transactions/count', { type: this.chartType,product_type :'phone' }).subscribe(res => {
      this.chartData = res.totalTransaction;
      this.getRevenueData()
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }

  getRevenueData(){
    this.apiService.callPostApi('total/revenue', { type: this.chartType,product_type :'phone' }).subscribe(res => {
      this.revenueData = res.totalRevenue;
      this.xaxis = this.chartData.map(transaction => transaction['xaxis']);
      this.totalTransaction = this.chartData.map(transaction => transaction['transactions']);
      this.totalRevenue = this.revenueData && this.revenueData.map(price => price['totalRevenue']);
      this.generateChart(this.xaxis,this.totalTransaction,this.totalRevenue);
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
  getTransactionDataService(){
    this.apiService.callPostApi('transactions/count/service', { type: this.chartType,product_type :'service' }).subscribe(res => {
      this.chartDataService = res.totalTransaction;
      this.getRevenueDataService()
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
  getTransactionDataAccessories(){
    this.apiService.callPostApi('transactions/count', { type: this.chartType,product_type :'accessories' }).subscribe(res => {
      this.chartData1 = res.totalTransaction;
      this.getRevenueDataAccessories()
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }

   getRevenueDataService(){
    this.apiService.callPostApi('total/revenue/service', { type:this.chartType,product_type :'service' }).subscribe(res => {
      this.revenueDataService = res.totalRevenue;
      this.xaxis1 = this.chartDataService.map(transaction => transaction['xaxis']);
      this.totalTransactionService = this.chartDataService.map(transaction => transaction['transactions']);
      this.totalRevenueService = this.revenueDataService && this.revenueDataService.map(price => price['totalRevenue']);
      this.generateChartService(this.xaxis1,this.totalTransactionService,this.totalRevenueService);
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
  getRevenueDataAccessories(){
    this.apiService.callPostApi('total/revenue', { type:this.chartType,product_type :'accessories' }).subscribe(res => {
      this.revenueData1 = res.totalRevenue;
      this.xaxis1 = this.chartData1.map(transaction => transaction['xaxis']);
      this.totalTransaction1 = this.chartData1.map(transaction => transaction['transactions']);
      this.totalRevenue1 = this.revenueData1 && this.revenueData1.map(price => price['totalRevenue']);
      this.generateChartAccessories(this.xaxis1,this.totalTransaction1,this.totalRevenue1);
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
  generateChartAccessories(xaxis,data1,data2){
   xaxis.unshift("x");
   data1.unshift("Total Transaction");
   data2.unshift('Total Amount');
    let chart = c3.generate({
    bindto: '#accessories',
    axis: {
      x: {
        type: "category",
        padding: {
          left: 0,
          right: 0
        },
        label: {
          text: "",
          position: "outer-center"
        }
      },
      y: {
        label: {
          text: "",
          position: "outer-middle"
        }
      }
    },
    data: {
      x: "x",
      columns: [
        xaxis,
        data1,
        data2
      ],
      type: 'bar',
      },
      
      bar: {
        space: 0.25
    }
    });
    let accessories = c3.generate({
      bindto: '#accessories',
      axis: {
        x: {
          type: "category",
          padding: {
            left: 0,
            right: 0
          },
          label: {
            text: "",
            position: "outer-center"
          }
        },
        y: {
          label: {
            text: "",
            position: "outer-middle"
          }
        }
      },
      data: {
        x: "x",
        columns: [
          xaxis,
          data1,
          data2
        ],
        type: 'bar',
        },
        
        bar: {
          space: 0.25
      }
      });
  }
  generateChartService(xaxis,data1,data2){
   xaxis.unshift("x");
   data1.unshift("Total Transaction");
   data2.unshift('Total Amount');
    let chart = c3.generate({
    bindto: '#service',
    axis: {
      x: {
        type: "category",
        padding: {
          left: 0,
          right: 0
        },
        label: {
          text: "",
          position: "outer-center"
        }
      },
      y: {
        label: {
          text: "",
          position: "outer-middle"
        }
      }
    },
    data: {
      x: "x",
      columns: [
        xaxis,
        data1,
        data2
      ],
      type: 'bar',
      },
      
      bar: {
        space: 0.25
    }
    });
    let accessories = c3.generate({
      bindto: '#accessories',
      axis: {
        x: {
          type: "category",
          padding: {
            left: 0,
            right: 0
          },
          label: {
            text: "",
            position: "outer-center"
          }
        },
        y: {
          label: {
            text: "",
            position: "outer-middle"
          }
        }
      },
      data: {
        x: "x",
        columns: [
          xaxis,
          data1,
          data2
        ],
        type: 'bar',
        },
        
        bar: {
          space: 0.25
      }
      });
  }
  generateChart(xaxis,data1,data2){
   xaxis.unshift("x");
   data1.unshift("Total Transaction");
   data2.unshift('Total Amount');
    let chart = c3.generate({
    bindto: '#chart',
    axis: {
      x: {
        type: "category",
        padding: {
          left: 0,
          right: 0
        },
        label: {
          text: "",
          position: "outer-center"
        }
      },
      y: {
        label: {
          text: "",
          position: "outer-middle"
        }
      }
    },
    data: {
      x: "x",
      columns: [
        xaxis,
        data1,
        data2
      ],
      type: 'bar',
      },
      
      bar: {
        space: 0.25
    }
    });
    let accessories = c3.generate({
      bindto: '#accessories',
      axis: {
        x: {
          type: "category",
          padding: {
            left: 0,
            right: 0
          },
          label: {
            text: "",
            position: "outer-center"
          }
        },
        y: {
          label: {
            text: "",
            position: "outer-middle"
          }
        }
      },
      data: {
        x: "x",
        columns: [
          xaxis,
          data1,
          data2
        ],
        type: 'bar',
        },
        
        bar: {
          space: 0.25
      }
      });
  }

  ngAfterViewInit() {
   
}
  openMenu() {
    document.getElementsByTagName('html')[0].classList.toggle('nav-open');
  }
  getCounts() {
    this.apiService.callGetApi('dashboard/' + localStorage.getItem('email')).subscribe(res => {
      this.counter = res.response;
    });
  }
  getAdmins() {
    this.apiService.callGetApi('users').subscribe(res => {
      this.users = res.list;
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
  orderTrack() {
    this.apiService.callPostApi('orderTrackingForAdmin', { user_id: this.Admins }).subscribe(res => {
      this.order = res.orderTrack.reverse();
      this.total = 0;
      for (const order of this.order) {
        this.total += order.subTotal;
      }
    }, error => {
      if (error.status === 401) {
        this.authService.logout();
      }
    });
  }
  changeAdmins() {
    if(this.Admins === 'select') {
      clearInterval(this.interval);
    }
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
