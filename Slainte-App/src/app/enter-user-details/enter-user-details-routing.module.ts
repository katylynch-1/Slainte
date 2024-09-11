import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnterUserDetailsPage } from './enter-user-details.page';

const routes: Routes = [
  {
    path: '',
    component: EnterUserDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterUserDetailsPageRoutingModule {}
