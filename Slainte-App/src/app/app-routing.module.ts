import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    // loadChildren: () => import('./landingpage/landingpage.module').then( m => m.LandingpagePageModule)
    // loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)

  },
  {
    path: 'venuedetails',
    loadChildren: () => import('./venuedetails/venuedetails.module').then( m => m.VenuedetailsPageModule)

    // loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
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
    path: 'landingpage',
    loadChildren: () => import('./landingpage/landingpage.module').then( m => m.LandingpagePageModule)
  },
  {
    path: 'home-test',
    loadChildren: () => import('./home-test/home-test.module').then( m => m.HomeTestPageModule)

  },
  {
    path: 'enter-user-details',
    loadChildren: () => import('./enter-user-details/enter-user-details.module').then( m => m.EnterUserDetailsPageModule)
  },
  {
    path: 'enter-user-details/:uid',
    loadChildren: () => import('./enter-user-details/enter-user-details.module').then( m => m.EnterUserDetailsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
