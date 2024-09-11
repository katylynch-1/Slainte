import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnterUserDetailsPageRoutingModule } from './enter-user-details-routing.module';

import { EnterUserDetailsPage } from './enter-user-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnterUserDetailsPageRoutingModule
  ],
  declarations: [EnterUserDetailsPage]
})
export class EnterUserDetailsPageModule {}
