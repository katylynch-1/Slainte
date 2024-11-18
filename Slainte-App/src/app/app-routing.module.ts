import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { NewChatComponent } from './new-chat/new-chat.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { ShareWithFriendsComponent } from './share-with-friends/share-with-friends.component';
import { SearchLocationComponent } from './search-location/search-location.component';

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
    path: 'chat/:recipientId', component: ChatComponent 
  },
  { 
    path: 'new-chat', component: NewChatComponent
  },
  { 
    path: 'share-with-friends', component: ShareWithFriendsComponent
  },
  {
    path: 'messages-tab',
    loadChildren: () => import('./messages-tab/messages-tab.module').then( m => m.MessagesTabPageModule)
  },
  {
    path: 'tag-search',
    loadChildren: () => import('./tag-search/tag-search.module').then( m => m.TagSearchPageModule)
  },
  {
    path: 'friends-tab',
    loadChildren: () => import('./friends-tab/friends-tab.module').then( m => m.FriendsTabPageModule)
  },
  {
    path: 'userprofile/:userId',
    component: UserprofileComponent
  },
  {
    path: 'search-location',
    component: SearchLocationComponent
  }  

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
