import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeTestPage } from './home-test.page';

const routes: Routes = [
  {
    path: '',
    component: HomeTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTestPageRoutingModule {}
