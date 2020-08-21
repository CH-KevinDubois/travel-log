import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { GeoJsonLocation } from 'src/app/models/geo-json-location';

@Injectable({
  providedIn: 'root'
})
export class StateManagementService {

  public clickedPointOnMapSubject: Subject<GeoJsonLocation>; 

  private _coordinatesSubject = new BehaviorSubject<GeoJsonLocation[]>([]);
  public coordinates$ = this._coordinatesSubject.asObservable();

  constructor() {
    this.clickedPointOnMapSubject = new  Subject<GeoJsonLocation>();
  }

  getClickedPointOnMapSubject(): Subject<GeoJsonLocation>{
    return this.clickedPointOnMapSubject;
  }

  emitCoordinates(coordinates: GeoJsonLocation[]){
    this._coordinatesSubject.next(coordinates);
  }
}
