import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { UserListComponent } from './user-list/user-list.component'; 


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)

  },
  {
    path: 'venuedetails',
    loadChildren: () => import('./venuedetails/venuedetails.module').then( m => m.VenuedetailsPageModule)
  },
  {
    path: 'venuedetails/:place_id',
    loadChildren: () => import('./venuedetails/venuedetails.module').then( m => m.VenuedetailsPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'edit-user/:userID',
    loadChildren: () => import('./edit-user/edit-user.module').then( m => m.EditUserPageModule)
  },
  {
    path: 'user-details',
    loadChildren: () => import('./user-details/user-details.module').then( m => m.UserDetailsPageModule)
  },
  {
    path: 'user-details/:userID',
    loadChildren: () => import('./user-details/user-details.module').then( m => m.UserDetailsPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'apivenuedetails',
    loadChildren: () => import('./apivenuedetails/apivenuedetails.module').then( m => m.ApivenuedetailsPageModule)
  },
  {
    path: 'apivenuedetails/:place_id',
    loadChildren: () => import('./apivenuedetails/apivenuedetails.module').then( m => m.ApivenuedetailsPageModule)
  },

  { 
    path: '', redirectTo: 'user-list', pathMatch: 'full' 
  },
  { 
    path: 'user-list', component: UserListComponent 
  },
  { 
    path: 'chat/:chatId', component: ChatComponent 
  },
  {
    path: 'messages-tab',
    loadChildren: () => import('./messages-tab/messages-tab.module').then( m => m.MessagesTabPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
