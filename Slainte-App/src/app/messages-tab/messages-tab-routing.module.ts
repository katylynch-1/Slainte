import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessagesTabPage } from './messages-tab.page';

const routes: Routes = [
  {
    path: '',
    component: MessagesTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagesTabPageRoutingModule {}
