import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CvService } from '../cv.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  constructor(private alertController: AlertController,private cvService: CvService) {}

  // Takes the users input and saves it to a JSON file
  saveToJson() {
    // Get the input values from the HTML elements
    const firstName = (document.querySelector('ion-input[placeholder="Enter your first name"]') as HTMLIonInputElement).value;
    const lastName = (document.querySelector('ion-input[placeholder="Enter your last name"]') as HTMLIonInputElement).value;
    const previousJob = (document.querySelector('ion-input[placeholder="Enter your previous job"]') as HTMLIonInputElement).value;
    const yearsOfExperience = (document.querySelector('ion-input[placeholder="Enter years of experience"]') as HTMLIonInputElement).value;
    const workType = (document.querySelector('ion-select') as HTMLIonSelectElement).value;

    // Create a JavaScript object with the input values
    const userData = {
      firstName: firstName,
      lastName: lastName,
      previousJob: previousJob,
      yearsOfExperience: yearsOfExperience,
      workType: workType
    };

    // Convert the JavaScript object to JSON format
    const jsonData = JSON.stringify(userData);

    // Save the JSON data
    localStorage.setItem('user_data', jsonData);
    alert("Cv has been saved successfully");
    this.cvService.updateCvAvailable(true);
  }

  // Gets the saved JSON data  and displays it to the user
  // Gets the saved JSON data from localStorage and displays it to the user in a card
  async viewJson() {
    // Retrieve the JSON data from localStorage
    const jsonData = localStorage.getItem('user_data');

    if (jsonData) {
      // Parse the JSON data
      const userData = JSON.parse(jsonData);

      // Create the message to display in the card
      const message = `
            First Name:${userData.firstName}
            Last Name:${userData.lastName}
            Previous Job:${userData.previousJob}
            Years of Experience: ${userData.yearsOfExperience}
            Work Type:${userData.workType}
      `;

      // Create the alert with the card message
      const alert = await this.alertController.create({
        header: 'View JSON Data',
        message: message,
        buttons: ['OK']
      });

      // Present the alert
      await alert.present();
    } else {
      // If no data is found, display an alert
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No saved data found.',
        buttons: ['OK']
      });

      // Present the alert
      await alert.present();
    }
  }
}