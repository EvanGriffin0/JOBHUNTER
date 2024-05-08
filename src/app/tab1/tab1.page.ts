import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service'; // Import the JobService 
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingController } from '@ionic/angular'; 




@Component({
  selector: 'tab1.page',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  
})

export class Tab1Page implements OnInit {
  jobs: any[] = [];
  currentJob: any;
 
  cvAvailable: boolean = true;

  constructor(private jobService: JobService, private router: Router, private loadingController: LoadingController) {}
  userLocation: string = '';

  imagePaths: string[] = ['./assets/stockImage1.jpg', './assets/stockImage2.jpg', './assets/stockImage3.jpg', './assets/stockImage4.jpg', './assets/stockImage5.jpg'];
  currentImagePathIndex: number = 0; // Variable to keep track of the current image index

  backgroundColors: string[] = ['lightblue', 'lightgreen', 'pink']; // Add more colors as needed
  currentBackgroundColorIndex: number = 0;

  ngOnInit() {
    this.getUserLocation();
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

  /**
   * Get the next job from the list of jobs.
   * If there are no more jobs, set the currentJob to null.
   */
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

  
  cycleImage(): void {
    // Increment the current image index
    this.currentImagePathIndex++;
    // If the index exceeds the length of the imagePaths array, reset it to 0
    if (this.currentImagePathIndex >= this.imagePaths.length) {
      this.currentImagePathIndex = 0;
    }
  }

  async handleApply(accepted: boolean): Promise<void> {
    if (accepted) {
      
      if (!this.cvAvailable) {
        // Redirect to CV setup page if CV is not available
        this.router.navigateByUrl('/tabs/tab2');
      } else {
        // Show loading bar while processing application
        const loading = await this.loadingController.create({
          message: 'Submitting application...'
        });
        await loading.present();
  
        // Simulate application submission (replace with actual logic)
        setTimeout(() => {
          // Dismiss loading bar
          loading.dismiss();
          this.getNextJob();
          this.cycleImage();
          this.changeBackgroundColor();
         
        }, 1000); // Adjust delay as needed
      }
    } else {
      // If rejected, proceed to the next job without any additional actions
      this.getNextJob();
      this.cycleImage();
      this.changeBackgroundColor();
    }
  }
  


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

//this is a method that gets the users curront co ordinates , if it fails it will return an error
  async getUserLocation(): Promise<void> {
    try {
      const position = await this.getCurrentPosition();
      const response = await this.getCityFromCoordinates(position.coords.latitude, position.coords.longitude);
      const city = this.extractCityFromResponse(response);
      this.userLocation = city;
    } catch (error) {
      console.error('Error getting user location:', error);
      this.userLocation = 'Location not available';
    }
  }
  
  // this method then takes the users latitude and longitude and sends it to googles api to get the city name
  async getCityFromCoordinates(latitude: number, longitude: number): Promise<any> {
    const apiKey = 'AIzaSyBtgI8XG8fDq7C7k5BBH314xK8Ex6XCs2M'; 
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    const response = await fetch(url);
    return await response.json();
  }
  

  //takes the response from googles api and if there is a city it returns it and  if not it displays city not found
  extractCityFromResponse(response: any): string {
    const results = response.results;
    if (results && results.length > 0) {

      for (const component of results[0].address_components) {
        if (component.types.includes('locality')) {
          return component.long_name;
        }
      }
    }
    return 'City not found ( you may not be within close distance to a city )';
  }

  //this method gets the users current location and returns it as a promise
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

}  
