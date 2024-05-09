
//importing the neccessary modules
import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service';
import { CvService } from '../cv.service';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-tab3' ,
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page implements OnInit {


  //declare arrays and variables
  jobApplications: { title: string, status: string, clicked: boolean }[] = [];
  jobTitles: string[] = [];

  backgroundColor: string = "success";

  constructor(private jobService: JobService, private CvService: CvService,private AlerController:AlertController) {}

  //load the job applications on initial load
  ngOnInit() {
    this.loadJobApplications();
  }

  //Method to load the job titles from the database
  loadJobApplications() {
    this.jobService.getExistingJobTitles().subscribe(
      (applications: any[]) => {
        // Log each application object to inspect its structure
        
        applications.forEach((app, index) => {
          this.jobTitles.push(app);
        });
  
        console.log(this.jobTitles);
      },
      error => {
        console.error('Error loading job applications:', error);
      }
    );
  }
  
  //returns a random number between 0 and 3
  getRandomStatus(): number {
    return Math.floor(Math.random() * 3);
  }

//call the service to delete all the job titles on the external link
deleteApplications(): void {

  //calls method from service file
  this.jobService.deleteJobTitles().subscribe(
    () => {
      // Handle success
      console.log('Job titles deleted successfully.');
      //reload the pagfe tyo display the deletion
      window.location.reload();
      this.CvService.updateCvAvailable(true);
    },
    (error) => {
      // Handle error
      console.error('Failed to delete job titles:', error);
    }
  );
  //UPDATES the boolean to true 

  this.CvService.updateCvAvailable(true);

}

}
