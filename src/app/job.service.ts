import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JobService {

  // the following code fetches the data from the json file
  
  constructor(private http: HttpClient) { }

  getJobs(): Observable<any> {
    return this.http.get('assets/jobs.json');
  } 
}
