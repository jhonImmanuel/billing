import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule, MatInputModule, MatDialogModule } from '@angular/material';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './modules/login/login.component';
import { HomeComponent } from './modules/home/home.component';
import { AddProductComponent ,DialogOverviewExampleDialog1} from './modules/add-product/add-product.component';
import { AddUserComponent } from './modules/add-user/add-user.component';
import { RouterModule } from '@angular/router';
import { AutoCompleteModule } from 'ng4-auto-complete';
import { AddShopComponent } from './modules/add-shop/add-shop.component';
import { ProductsComponent, DialogOverviewExampleDialog } from './modules/products/products.component';
import { PendingOrdersComponent } from './modules/pending-orders/pending-orders.component';
import { ConfirmOrdersComponent,ConfirmOrdersDialog } from './modules/confirm-orders/confirm-orders.component';
import { UsersComponent, Dialog } from './modules/users/users.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { ShopsComponent, DialogOverviewDialog } from './modules/shops/shops.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { OrderStatusComponent } from './modules/order-status/order-status.component';
import { GenerateReportComponent,GenerateReportDialog } from './modules/generate-report/generate-report.component';
import { BarcodeComponent } from './barcode/barcode.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { AccessoriesListComponent,AccessoriesDialog } from './modules/accessories-list/accessories-list.component';
import { CustomerListComponent } from './modules/customer-list/customer-list.component';
import {SuiModule} from 'ng2-semantic-ui';
import { SettingsComponent } from './modules/settings/settings.component';
import { BrandsListComponent,BrandDialog } from './modules/brands-list/brands-list.component';
import { AddBrandsComponent } from './modules/add-brands/add-brands.component';
import { GenerateImeiComponent } from './modules/generate-imei/generate-imei.component';
import { ServiceAddComponent } from './modules/service-add/service-add.component';
import { ServiceListComponent,ServiceDialog } from './modules/service-list/service-list.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ReportsListComponent } from './modules/reports-list/reports-list.component';
import { PushMailComponent } from './modules/push-mail/push-mail.component';
import { OrderCategoryComponent } from './order-category/order-category.component';
import { AddingComponent } from './adding/adding.component';
import { ListingComponent } from './listing/listing.component';
import { ProductOrdersComponent } from './product-orders/product-orders.component';
import { ServiceOrdersComponent } from './modules/service-orders/service-orders.component';
import { ProductReportsComponent } from './modules/product-reports/product-reports.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AddProductComponent,
    AddUserComponent,
    AddShopComponent,
    ProductsComponent,
    DialogOverviewExampleDialog,
    DialogOverviewExampleDialog1,
    ServiceDialog,
    BrandDialog,
    PendingOrdersComponent,
    ConfirmOrdersComponent,
    ConfirmOrdersDialog,
    UsersComponent,
    Dialog,
    AccessoriesDialog,
    ShopsComponent,
    DialogOverviewDialog,
    DashboardComponent,
    OrderStatusComponent,
    GenerateReportComponent,
    BarcodeComponent,
    AccessoriesListComponent,
    CustomerListComponent,
    SettingsComponent,
    BrandsListComponent,
    AddBrandsComponent,
    GenerateImeiComponent,
    ServiceAddComponent,
    ServiceListComponent,
    GenerateReportDialog,
    ReportsListComponent,
    PushMailComponent,
    OrderCategoryComponent,
    AddingComponent,
    ListingComponent,
    ProductOrdersComponent,
    ServiceOrdersComponent,
    ProductReportsComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    RouterModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AutoCompleteModule,
    MatAutocompleteModule,
    MatInputModule,
    NgxPaginationModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    SharedModule,
    NgxBarcodeModule,
    SuiModule,
    NgxDaterangepickerMd.forRoot()

  ],
  entryComponents: [DialogOverviewExampleDialog,DialogOverviewExampleDialog1, DialogOverviewDialog, Dialog,AccessoriesDialog, BrandDialog,GenerateReportDialog,ConfirmOrdersDialog,ServiceDialog],
  exports: [
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
