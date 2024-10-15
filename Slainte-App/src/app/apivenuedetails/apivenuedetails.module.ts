import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApivenuedetailsPageRoutingModule } from './apivenuedetails-routing.module';

import { ApivenuedetailsPage } from './apivenuedetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApivenuedetailsPageRoutingModule
  ],
  declarations: [ApivenuedetailsPage]
})
export class ApivenuedetailsPageModule {}
