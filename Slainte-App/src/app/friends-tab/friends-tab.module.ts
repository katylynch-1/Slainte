import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsTabPageRoutingModule } from './friends-tab-routing.module';

import { FriendsTabPage } from './friends-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendsTabPageRoutingModule
  ],
  declarations: [FriendsTabPage]
})
export class FriendsTabPageModule {}
