import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service';


@Component({
  selector: 'app-tab3' ,
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page implements OnInit {

  jobApplications: { title: string, status: string, clicked: boolean }[] = [];
  jobTitles: string[] = [];

  

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.loadJobApplications();
  }

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
  

  getRandomStatus(): string {
    const statuses = ['accepted', 'interview', 'rejected'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
  }

handleButtonClick(index: number): void {
  if (this.jobApplications[index] && !this.jobApplications[index].clicked) {
    const randomStatus = this.getRandomStatus();
    this.jobApplications[index].status = randomStatus; // Update status
    this.jobApplications[index].clicked = true; // Mark as clicked
  }
}

getStatusColor(status: string | undefined): string {
  switch (status) {
    case "accepted":
      return 'balanced'; // Green color for accepted
    case "interview":
      return 'energized'; // Yellow color for interview
    case "rejected":
      return 'assertive'; // Red color for rejected
    default:
      return 'medium'; // Default color
  }
}

}
