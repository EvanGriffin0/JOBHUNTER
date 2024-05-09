
//importing the neccessary modules
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

  // method Takes the users input and saves it to a JSON file
  async saveToJson() {
    // Get the input values from the HTML elements
    const firstName = (document.querySelector('ion-input[placeholder="Enter your first name"]') as HTMLIonInputElement).value;
    const lastName = (document.querySelector('ion-input[placeholder="Enter your last name"]') as HTMLIonInputElement).value;
    const previousJob = (document.querySelector('ion-input[placeholder="Enter your previous job"]') as HTMLIonInputElement).value;
    const yearsOfExperience = (document.querySelector('ion-input[placeholder="Enter years of experience"]') as HTMLIonInputElement).value;
    const workType = (document.querySelector('ion-select') as HTMLIonSelectElement).value;

    //check if the inputs are blank
    if(firstName === '' || lastName === '' || previousJob === '' || yearsOfExperience === '' || workType === '') {

      
//if they are notify the user that they need to fill in all the fields
      const alert = await this.alertController.create({
        header: 'Your Cv',
        message: 'Please fill in all the fields',
        buttons: ['OK']
      });

      // Present the alert
      (await alert).present();
      
    }
    else{

      // Create a object with the input values
      const userData = {
        firstName: firstName,
        lastName: lastName,
        previousJob: previousJob,
        yearsOfExperience: yearsOfExperience,
        workType: workType
      };

      // Convert the  object to JSON format
      const jsonData = JSON.stringify(userData);

      // Save the JSON data
      localStorage.setItem('user_data', jsonData);

      //alert the user that the cv has been saved
      const alert = await this.alertController.create({
        header: 'Your Cv',
        message: 'Cv has been saved successfully',
        buttons: ['OK']
      });

      // Present the alert
      (await alert).present();

      //update the boolean in tab 1 to allow the user to apply to jobs
      this.cvService.updateCvAvailable(true);
          }
  }

  //this method Gets the saved JSON data and displays it to the user 
  async viewJson() {

    // Retrieve the JSON data from localStorage
    const jsonData = localStorage.getItem('user_data');

    if (jsonData) {
      // Parse the JSON data
      const userData = JSON.parse(jsonData);

      // Create the message to display in the card
        const message = `
        First Name: ${userData.firstName}\n
        Last Name: ${userData.lastName}\n
        Previous Job: ${userData.previousJob}\n
        Years of Experience: ${userData.yearsOfExperience}\n
        Work Type: ${userData.workType}\n
        `;

      // Create the alert with the card message
      const alert = await this.alertController.create({
        header: 'Your Cv',
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