import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError,map ,switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient ) { }

  //get the  json file from the external link for all the job information
  getJobs(): Observable<any> {
    return this.http.get('https://jsonblob.com/api/jsonBlob/1237818143224487936').pipe(
      catchError((error: any) => {
        console.error('Error fetching jobs:', error);
        console.log('Response body:', error.error); 
        throw error; 
      })
    );
  }

  //in order to populate the external json file without overriding all the content on it I had to first read in all the data on the json file add it into a new array and then send that array to the external link
  //to be then sent to the external link and update the external json link

 // Retrieve existing job titles from JSON Blob
  getExistingJobTitles(): Observable<string[]> {
  return this.http.get('https://jsonblob.com/api/jsonBlob/1237820738575917056').pipe(
    catchError(error => {
      console.error('Error fetching existing job titles:', error);
      return throwError('Failed to retrieve existing job titles');
    }),
    map((data: any) => {
      const existingJobTitles: string[] = data.jobTitles || [];
      return existingJobTitles;
    })
  );
}

// Save job titles to JSON Blob by appending them to existing titles
saveJobTitles(jobTitles: string[]): Observable<any> {
  return this.getExistingJobTitles().pipe(
    switchMap(existingJobTitles => {
      const updatedJobTitles = existingJobTitles.concat(jobTitles);
      
      //ensure content is correctly formatted before sending to external link
      const jsonData = JSON.stringify({ jobTitles: updatedJobTitles });

      
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      return this.http.put('https://jsonblob.com/api/jsonBlob/1237820738575917056', jsonData, httpOptions).pipe(
        catchError((error: any) => {
          console.error('Error saving job titles:', error);
          return throwError('Failed to save job titles');
        })
      );
    })
  );
}

}//end of service