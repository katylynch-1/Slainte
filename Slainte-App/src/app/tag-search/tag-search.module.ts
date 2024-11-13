import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagSearchPageRoutingModule } from './tag-search-routing.module';

import { TagSearchPage } from './tag-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagSearchPageRoutingModule
  ],
  declarations: [TagSearchPage]
})
export class TagSearchPageModule {}
