import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { HomeComponent } from './modules/home/home.component';
import { AddUserComponent } from './modules/add-user/add-user.component';
import { AddProductComponent } from './modules/add-product/add-product.component';
import { AddShopComponent } from './modules/add-shop/add-shop.component';
import { UsersComponent } from './modules/users/users.component';
import { ProductsComponent } from './modules/products/products.component';
import { PendingOrdersComponent } from './modules/pending-orders/pending-orders.component';
import { ConfirmOrdersComponent } from './modules/confirm-orders/confirm-orders.component';
import { ShopsComponent } from './modules/shops/shops.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { OrderStatusComponent } from './modules/order-status/order-status.component';
import { GenerateReportComponent } from './modules/generate-report/generate-report.component';
import {AccessoriesListComponent} from './modules/accessories-list/accessories-list.component';
import { CustomerListComponent } from './modules/customer-list/customer-list.component';
import {SettingsComponent} from './modules/settings/settings.component';
import {BrandsListComponent} from './modules/brands-list/brands-list.component';
import {AddBrandsComponent} from './modules/add-brands/add-brands.component';
import {GenerateImeiComponent} from './modules/generate-imei/generate-imei.component';
import {ServiceAddComponent} from './modules/service-add/service-add.component';
import {ServiceListComponent} from './modules/service-list/service-list.component';
import {ReportsListComponent} from'./modules/reports-list/reports-list.component';
import {PushMailComponent} from'./modules/push-mail/push-mail.component';
import { OrderCategoryComponent } from './order-category/order-category.component';
import { AddingComponent } from './adding/adding.component';
import { ListingComponent } from './listing/listing.component';
import { ProductOrdersComponent } from './product-orders/product-orders.component';
import {ServiceOrdersComponent} from './modules/service-orders/service-orders.component';
import { ProductReportsComponent } from './modules/product-reports/product-reports.component';
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: DashboardComponent },
  // { path: 'order', component: HomeComponent },
  { path: 'order', component: OrderCategoryComponent },
  { path: 'product', component: HomeComponent },
  { path: 'adding', component: AddingComponent },
  { path: 'listing', component: ListingComponent },
  { path: 'productOrders', component: ProductOrdersComponent },
  { path: 'addUser', component: AddUserComponent },
  { path: 'addProduct', component: AddProductComponent },
  { path: 'addbrands', component: AddBrandsComponent },
  { path: 'addShop', component: AddShopComponent },
  { path: 'users', component: UsersComponent },
  { path: 'brands', component: BrandsListComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'pendingorders', component: PendingOrdersComponent },
  { path: 'confirmorders', component: ConfirmOrdersComponent },
  { path: 'confirmorderstoday', component: ConfirmOrdersComponent },
  { path: 'shops', component: ShopsComponent },
  { path: 'orderStatus/:order_type/:order_id', component: OrderStatusComponent},
  { path: 'getTodaysSell', component: GenerateReportComponent },
  { path: 'accessories', component: AccessoriesListComponent },
  {path: 'promotions',component:CustomerListComponent},
  {path : 'barcode', component:GenerateImeiComponent},
  {path : 'Settings', component:SettingsComponent},
  {path : 'service', component:ServiceAddComponent},
  {path : 'servicelist', component:ServiceListComponent},
  {path:'servicelisttoday',component:ServiceListComponent},
  {path : 'reportslist', component:ReportsListComponent},
  {path : 'mail', component:PushMailComponent},
  {path:'serviceorders',component:ServiceOrdersComponent},
  {path:'productreports',component:ProductReportsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
