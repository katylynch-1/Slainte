import { Component, OnInit } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor() {}

  ngOnInit() {
    this.requestPermission();
    this.listenForNotifications();
  }

  async requestPermission(){
    const result = await PushNotifications.requestPermissions();
    if (result.receive === 'granted') {
      PushNotifications.register();
    }

    PushNotifications.addListener('registration', (token) => {
      console.log('FCM Token:', token.value)
    });
  }

  listenForNotifications(){
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received:', notification);
    });
  }
}
