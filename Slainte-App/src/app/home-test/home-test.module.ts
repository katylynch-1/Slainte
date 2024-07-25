import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeTestPageRoutingModule } from './home-test-routing.module';

import { HomeTestPage } from './home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeTestPageRoutingModule
  ],
  declarations: [HomeTestPage]
})
export class HomeTestPageModule {}
