
//important necessary modules
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

    //go to link and get jobs
    return this.http.get('https://jsonblob.com/api/jsonBlob/1237818143224487936').pipe(
      catchError((error: any) => {
        console.error('Error fetching jobs:', error);
        console.log('Response body:', error.error); 
        throw error; 
      })
    );
  }

  //method to save the new job advert to the external json link
  saveJobAdvert(newJob: any): Observable<any> {
    // First, retrieve existing job adverts from the external link
    return this.http.get<any[]>('https://jsonblob.com/api/jsonBlob/1237818143224487936').pipe(
      switchMap((existingJobAdverts: any[]) => {
        // Add the new job advertisement to the existing list
        existingJobAdverts.push(newJob);
  
        // Convert the updated list to JSON format
        const jsonData = JSON.stringify(existingJobAdverts);
  
        // Set up HTTP headers
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };
  
        // Send the updated job adverts list back to the external link
        return this.http.put('https://jsonblob.com/api/jsonBlob/1237818143224487936', jsonData, httpOptions).pipe(
          catchError((error: any) => {
            console.error('Error saving job advert:', error);
            return throwError('Failed to save job advert');
          })
        );
      }),
      catchError((error: any) => {
        console.error('Error fetching existing job adverts:', error);
        return throwError('Failed to fetch existing job adverts');
      })
    );
  }
  
 

  //in order to populate the external json file without overriding all the content on it I had to first read in all the data on the json file add it into a new array and then send that array to the external link
  //to be then sent to the external link and update the external json link

 // Retrieve existing job titles from JSON Blob
  getExistingJobTitles(): Observable<string[]> {
  return this.http.get('https://jsonblob.com/api/jsonBlob/1238102250676412416').pipe(
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

      // Add the new job titles to the existing list
      const updatedJobTitles = existingJobTitles.concat(jobTitles);
      
      //ensure content is correctly formatted before sending to external link
      const jsonData = JSON.stringify({ jobTitles: updatedJobTitles });

      
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      //put the updated formatted data to the external link
      return this.http.put('https://jsonblob.com/api/jsonBlob/1238102250676412416', jsonData, httpOptions).pipe(
        catchError((error: any) => {
          console.error('Error saving job titles:', error);
          return throwError('Failed to save job titles');
        })
      );
    })
  );
}

//this function allows me to delete the current list of applications that are held on the external link by placing nothing in the file
deleteJobTitles(): Observable<any> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Send an empty object to clear the contents
  return this.http.put('https://jsonblob.com/api/jsonBlob/1238102250676412416', {}, httpOptions).pipe(
    catchError((error: any) => {
      console.error('Error clearing job titles:', error);
      return throwError('Failed to clear job titles');
    })
  );
}




}
//end of service