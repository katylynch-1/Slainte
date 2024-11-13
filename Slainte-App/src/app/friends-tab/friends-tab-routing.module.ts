import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendsTabPage } from './friends-tab.page';

const routes: Routes = [
  {
    path: '',
    component: FriendsTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsTabPageRoutingModule {}
