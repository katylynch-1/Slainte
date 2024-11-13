import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { VenuesComponent } from '../venues/venues.component';
import { VenuesForUserComponent } from '../venues-for-user/venues-for-user.component'; // Import the component
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { ConnectComponent } from '../connect/connect.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    
  ],
  declarations: [Tab1Page, VenuesComponent, VenuesForUserComponent, ConnectComponent]
})
export class Tab1PageModule {}
