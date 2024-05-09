import { Component } from '@angular/core';
import { CvService } from '../cv.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private cvService:CvService) {}

  
}
