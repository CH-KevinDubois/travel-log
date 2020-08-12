import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GeoJsonLocation } from 'src/app/models/geo-json-location';

@Injectable({
  providedIn: 'root'
})
export class StateManagementService {

  public clickedPointOnMapSubject: Subject<GeoJsonLocation>; 

  constructor() {
    this.clickedPointOnMapSubject = new  Subject<GeoJsonLocation>();
  }

  getClickedPointOnMapSubject(): Subject<GeoJsonLocation>{
    return this.clickedPointOnMapSubject;
  }
}
