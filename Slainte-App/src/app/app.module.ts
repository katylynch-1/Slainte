import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { ChatComponent } from './chat/chat.component';
import { EdituserdetailsComponent } from './edituserdetails/edituserdetails.component';
import { NewChatComponent } from './new-chat/new-chat.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';  // Add this for Realtime Database (compat)
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { ShareWithFriendsComponent } from './share-with-friends/share-with-friends.component';
import { SearchLocationComponent } from './search-location/search-location.component';


@NgModule({
  declarations: [AppComponent, FilterModalComponent, EdituserdetailsComponent, ChatComponent, NewChatComponent, UserprofileComponent, ShareWithFriendsComponent, SearchLocationComponent],
  imports: [BrowserModule, IonicModule.forRoot({mode: 'ios'}), AppRoutingModule, FormsModule, AngularFireModule.initializeApp(environment.firebase), AngularFireAuthModule, AngularFirestoreModule, AngularFireDatabaseModule, ReactiveFormsModule, AngularFireMessagingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
              { provide: FIREBASE_OPTIONS, useValue: environment.firebase},
              provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
