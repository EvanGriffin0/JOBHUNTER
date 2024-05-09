
//import all necessary libraries
import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service'; 
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingController } from '@ionic/angular'; 
import { CvService } from '../cv.service';
import { HttpClient } from '@angular/common/http';
import { Tab3Page } from '../tab3/tab3.page';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'tab1.page',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  
})


export class Tab1Page implements OnInit {

  // Declare variables to hold the jobs and the current job
  jobs: any[] = [];
  currentJob: any;
  cvAvailable: boolean = false;

  // Define a constructor to inject dependencies
  constructor(private jobService: JobService,private AlertController: AlertController , private router: Router, private loadingController: LoadingController, private cvService: CvService, private http: HttpClient , ) {


    //used to change the boolean value of cvAvailable
    this.cvService.cvAvailable$.subscribe(cvAvailable => {
      this.cvAvailable = cvAvailable;
  });

  }

  //define the image and color paths to be used
  userLocation: string = '';

  imagePaths: string[] = ['./assets/stockImage1.jpg', './assets/stockImage2.jpg', './assets/stockImage3.jpg', './assets/stockImage4.jpg', './assets/stockImage5.jpg'];
  currentImagePathIndex: number = 0; // Variable to keep track of the current image index

  backgroundColors: string[] = ['#e0fbfc', '#ee6c4d','#F8B195','#355C7D','#6C5B7B']; 
  currentBackgroundColorIndex: number = 1;


  //method that runs on app start
  ngOnInit() {
    
    //get the users current locatiom
    this.getUserLocation();
    //call to the jobs service to get the jobs
    this.jobService.getJobs().subscribe(
      (jobs: any[]) => {
        this.jobs = jobs;
        this.getNextJob();
      },
      error => {
        console.error('Error fetching jobs:', error);
      }
    );
  }


//next method grabs the next job from the list of jobs in order to display the job later
  getNextJob(): void {

    if (this.jobs && this.jobs.length > 0) {
      // If there are still jobs in the list, get the next job
      this.currentJob = this.jobs.shift();
    } else {
      // If the list of jobs is empty, loop back to the beginning
      // by resetting the list of jobs to its original state
      this.jobService.getJobs().subscribe(
        (jobs: any[]) => {
          this.jobs = jobs;
          // Get the first job from the updated list
          this.currentJob = this.jobs.shift();
        },
        error => {
          console.error('Error fetching jobs:', error);
        }
      );
    }
  }

  //method that when called changes the image displayed on the front screen
  cycleImage(): void {
    // Increment the current image index
    this.currentImagePathIndex++;
    // If the index exceeds the length of the imagePaths array, reset it to 0
    if (this.currentImagePathIndex >= this.imagePaths.length) {
      this.currentImagePathIndex = 0;
    }
  }


  //this method handles the press of the apply and reject button
  async handleApply(accepted: boolean): Promise<void> {
    if (accepted) {

      //get the current job title
      const jobTitle = this.currentJob.title;

      //check if the user has made their cv , if not redirect and notify the user
      if (!this.cvAvailable) {

        const alert = this.AlertController.create({
          header: 'No Cv Saved!',
          message: 'You do not have a CV. Please go to the CV tab to create one.',
          buttons: ['OK']
        });

       (await alert).present();

        // Redirect to CV setup page if CV is not available       
        this.router.navigateByUrl(`/tabs/tab2`);

      } else {

        // Show loading bar while processing application
        const loading = await this.loadingController.create({
          message: 'Submitting application...'
        });
        await loading.present();
  
        // Save job titles to an array
        const jobTitles: string[] = [jobTitle];
  
        //pass array to service to save to external link
        this.jobService.saveJobTitles(jobTitles).subscribe(
          (response) => {
            console.log('Job titles saved successfully:', response);
  
            //dismiss the loading bar and call the necessary methods
            loading.dismiss();
            this.getNextJob();
            this.cycleImage();
            this.changeBackgroundColor();     
          },
          (error) => {
            console.error('Error saving job titles:', error);
            loading.dismiss();
          }
        );
      }
    } else {
      // If rejected, proceed to the next job without any additional actions
      this.getNextJob();
      this.cycleImage();
      this.changeBackgroundColor();
    }
  }

  //method used to change background color of the job card when called
  changeBackgroundColor(): void {
    // Increment the current background color index
    this.currentBackgroundColorIndex++;
    // If the index exceeds the length of the backgroundColors array, reset it to 0
    if (this.currentBackgroundColorIndex >= this.backgroundColors.length) {
      this.currentBackgroundColorIndex = 0;
    }
    // Set the new background color for the ion-card
    const cardElement = document.querySelector('.center-card-text') as HTMLElement;
    cardElement.style.backgroundColor = this.backgroundColors[this.currentBackgroundColorIndex];
  }


//the following methods are used to get the users current location
// they get the latitude and longitude of the user and then sends it to googles api to get the city name
// if there no city is found it displays city not found

//this is a method that gets the users curront co ordinates 
  async getUserLocation(): Promise<void> {
    try {
      //calls the method to get the users geolocation
      const position = await this.getCurrentPosition();
      //pass co ordinations to the method to get the city name
      const response = await this.getCityFromCoordinates(position.coords.latitude, position.coords.longitude);
      //get city name response 
      const city = this.extractCityFromResponse(response);
   
      //said the users location to that city
      this.userLocation = city;

    } catch (error) {
      console.error('Error getting user location:', error);
      this.userLocation = 'Location not available';
    }
  }
  
  // this method then takes the users latitude and longitude and sends it to googles api to get the city name
  async getCityFromCoordinates(latitude: number, longitude: number): Promise<any> {
    //my api key for googles api 
    const apiKey = 'AIzaSyBtgI8XG8fDq7C7k5BBH314xK8Ex6XCs2M'; 
    //the api url
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    const response = await fetch(url);
    return await response.json();
  }
  

  //takes the response from googles api and if there is a city it returns it and  if not it displays city not found
  extractCityFromResponse(response: any): string {
    const results = response.results;

    // Check if there are any results and if there are any address components
    if (results && results.length > 0) {

      for (const component of results[0].address_components) {
        if (component.types.includes('locality')) {
          return component.long_name;
        }
      }
    }
    return 'No City Found';
  }

  //this method gets the users current location and returns it as a promise
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

}  
