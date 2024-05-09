//importing the neccessary modules

import { Component } from '@angular/core';
import { JobService } from '../job.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {


  //declare variables and arrays
  jobs: any[] = [];

  jobTitle: string = '';
  salary: string = '';
  yearsOfExperience: string = '';
  positionType: string = '';

  constructor(private jobService: JobService, private alertController: AlertController) {}


  //on initial load load the jobs from the database
  ngOnInit() {
    this.jobService.getJobs().subscribe(
      (jobs: any[]) => {
        this.jobs = jobs;
      },
      error => {
        console.error('Error fetching jobs:', error);
      }
    );
  }

  //method to add a new job advert to the database
  async addJobDetails(): Promise<void> {
    const newJob = {
      jobTitle: this.jobTitle,
      salary: this.salary,
      yearsOfExperience: this.yearsOfExperience,
      positionType: this.positionType
    };

    //check if the user has filled in all the required fields
    if(newJob.jobTitle === '' || newJob.salary === '' || newJob.yearsOfExperience === '' || newJob.positionType === '' ) {

    // Create an alert to notify the user if they did not fill in all the fields
      const alert = await this.alertController.create({
        header: 'Advertisemenet',
        message: 'Please fill in all the fields',
        buttons: ['OK']
      });

      // Present the alert
      (await alert).present();
      
    }
    else{

    // Add the new job details to the local array
    this.jobs.push(newJob);


    //inform user that the job has been upploaded to the database
    const alert = await this.alertController.create({
      header: 'Advertisement',
      message: 'Job Advertisement has been uploaded',
      buttons: ['OK']
    });

    // Present the alert
    await alert.present();
    // Save the new job advert to the external JSON link
    this.jobService.saveJobAdvert(newJob).subscribe(
      () => {
        // Handle success if needed
        console.log('Job advert saved successfully.');
      },
      error => {
        // Handle error if needed
        console.error('Error saving job advert:', error);
      }
    );
  }
}
}
