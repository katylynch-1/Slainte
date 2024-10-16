import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApivenuedetailsPage } from './apivenuedetails.page';

const routes: Routes = [
  {
    path: '',
    component: ApivenuedetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApivenuedetailsPageRoutingModule {}
