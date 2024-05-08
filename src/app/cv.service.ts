// cv.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CvService {

  // Define a BehaviorSubject to hold the cvAvailable state
  private cvAvailableSubject = new BehaviorSubject<boolean>(false);

  // Observable to listen for changes to cvAvailable
  cvAvailable$ = this.cvAvailableSubject.asObservable();

  constructor() { }

  // Method to update cvAvailable
  updateCvAvailable(cvAvailable: boolean): void {
    this.cvAvailableSubject.next(cvAvailable);
  }
}
