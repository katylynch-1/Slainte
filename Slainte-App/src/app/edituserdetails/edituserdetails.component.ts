import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';

// Define an interface for user preferences
interface UserPreferences {
  firstName: string;
  lastName: string;
  email: string;
  userBio: string;
  preferences: { [key: string]: boolean }; // Structure for preferences
}

@Component({
  selector: 'app-edituserdetails',
  templateUrl: './edituserdetails.component.html',
  styleUrls: ['./edituserdetails.component.scss'],
})
export class EdituserdetailsComponent  implements OnInit {

  editForm: FormGroup;
  userId: string;
  userData: UserPreferences | null = null; // User data with type

  atmosphereOptions = [
    { label: 'Alternative', controlName: 'alternative' },
    { label: 'Casual', controlName: 'casual' },
    { label: 'Cosy', controlName: 'cosy' },
    { label: 'Energetic', controlName: 'energetic' },
    { label: 'Fancy', controlName: 'fancy' },
    { label: 'LGBTQ+', controlName: 'lgbtq' },
    { label: 'Loud', controlName: 'loud' },
    { label: 'Relaxed', controlName: 'relaxed' },
    { label: 'Traditional', controlName: 'traditional' },
  ];

  drinksOptions = [
    { label: 'Cocktails', controlName: 'cocktails' },
    { label: 'Gin', controlName: 'gin' },
    { label: 'Good Guinness', controlName: 'goodGuinness' },
    { label: 'Non-Alcoholic', controlName: 'nonAlcoholic' },
    { label: 'Pints', controlName: 'pints' },
    { label: 'Whiskey', controlName: 'whiskey' },
    { label: 'Wine', controlName: 'wine' },
  ];

  musicOptions = [
    { label: 'Hip Hop', controlName: 'hipHop' },
    { label: 'House', controlName: 'house' },
    { label: 'Indie', controlName: 'indie' },
    { label: 'Jazz', controlName: 'jazz' },
    { label: 'Pop', controlName: 'pop' },
    { label: 'R&B', controlName: 'rAndB' },
    { label: 'Reggaeton', controlName: 'reggaeton' },
    { label: 'Rock', controlName: 'rock' },
    { label: 'Techno', controlName: 'techno' },
    { label: 'Trad', controlName: 'trad' },
  ];

  amenitiesOptions = [
    { label: 'Accessible', controlName: 'accessible' },
    { label: 'Beer Garden', controlName: 'beerGarden' },
    { label: 'Cloak Room', controlName: 'cloakRoom' },
    { label: 'Dance Floor', controlName: 'danceFloor' },
    { label: 'Outdoor Seats', controlName: 'outdoorSeats' },
    { label: 'Smoking Area', controlName: 'smokingArea' },
  ];

  entertainmentOptions = [
    { label: 'Comedy', controlName: 'comedy' },
    { label: 'DJ', controlName: 'dj' },
    { label: 'Festival', controlName: 'festival' },
    { label: 'Games', controlName: 'games' },
    { label: 'Karaoke', controlName: 'karaoke' },
    { label: 'Live Gigs', controlName: 'liveGig' },
    { label: 'Open Mic', controlName: 'openMic' },
    { label: 'Pub Quiz', controlName: 'pubQuiz' },
    { label: 'Raves', controlName: 'rave' },
    { label: 'Specialised Events', controlName: 'specialisedEvents' },
    { label: 'Sports', controlName: 'sports' },
  ];

  constructor(private modalController: ModalController, private authService: AuthenticationService, private toastCtrl: ToastController, private formBuilder: FormBuilder, private afs: AngularFirestore) { }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      userBio: ['', [Validators.required]],
      bars: [false], nightclubs: [false],  pubs: [false],  lateBars: [false],
      pints: [false], cocktails: [false], wine: [false], gin: [false], whiskey: [false], nonAlcoholic: [false], goodGuinness: [false],
      trad: [false], pop: [false], techno: [false], house: [false], rock: [false], indie: [false], hipHop: [false], reggaeton: [false], jazz: [false], rAndB: [false],
      energetic: [false], cosy: [false], alternative: [false], relaxed: [false], traditional: [false], fancy: [false], casual: [false], lgbtq: [false], loud: [false], 
      outdoorSeats: [false], accessible: [false], cloakRoom: [false], smokingArea: [false], beerGarden: [false], danceFloor: [false], 
      festival: [false], openMic: [false], pubQuiz: [false], rave: [false], liveGig: [false], dj: [false], karaoke: [false], comedy: [false], sports: [false], specialisedEvents: [false], games: [false] 
    });
  
    // Subscribe to the current user Observable
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userId = user.uid; // Get the user ID
  
        // Fetch user details from Firestore using the userId
        this.authService.getUserDetails(this.userId).subscribe(doc => {
          if (doc) {
            this.userData = doc; // Store the user data
            this.populateForm(); // Populate the form with existing data
          }
        });
      }
    });
  }
  
 // Populate the form with existing user data
 populateForm() {
  if (this.userData) {
    this.editForm.patchValue({
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      userBio: this.userData.userBio,
      ...this.userData.preferences, // Spread the preferences to fill in the form
    });
  }
}

toggleChip(controlName: string) {
  const currentValue = this.editForm.controls[controlName].value;
  this.editForm.controls[controlName].setValue(!currentValue); // Toggle the value
}

// Submit the form and update Firebase
async submitForm() {
  if (this.editForm.valid) {
    // Get the current form values
    const updatedData = { ...this.editForm.value };

    // Construct new preferences based on current form values
    const newPreferences: { [key: string]: boolean } = {};
    const allOptions = [
      ...this.atmosphereOptions,
      ...this.drinksOptions,
      ...this.musicOptions,
      ...this.amenitiesOptions,
      ...this.entertainmentOptions,
    ];

    // Collect preferences from the form
    allOptions.forEach((option) => {
      newPreferences[option.controlName] = this.editForm.controls[option.controlName].value;
    });

    try {
      // Fetch the existing user data
      const userDoc = await firstValueFrom(this.afs.collection('userDetails').doc(this.userId).get());
      if (userDoc.exists) {
        const existingData = userDoc.data() as UserPreferences;

        // Update the user document with the existing data and new preferences
        const updatedPreferences = { ...existingData.preferences, ...newPreferences }; // Merge existing and new preferences

        // Update Firestore only with the relevant fields
        await this.afs.collection('userDetails').doc(this.userId).update({
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          email: updatedData.email,
          userBio: updatedData.userBio,
          preferences: updatedPreferences // Update preferences directly
        });

        this.dismissModal(); // Close the modal after successful update
        this.showToast('User details updated successfully!'); // Show success message
      }
    } catch (error) {
      console.error('Error updating user details: ', error);
      this.showToast('Failed to update user details. Please try again.'); // Show error message
    }
  }
}

async showToast(message: string) {
  const toast = await this.toastCtrl.create({
    message,
    duration: 2000,
    position: 'top',
  });
  toast.present();
}

// Dismiss the modal
dismissModal() {
  this.modalController.dismiss();
}
}

