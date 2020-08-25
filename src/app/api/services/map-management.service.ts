import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { GeoJsonLocation } from 'src/app/models/geo-json-location';

@Injectable({
  providedIn: 'root'
})
export class MapManagementService {

  private _clickedPointOnMapSubject = new Subject<GeoJsonLocation>(); 
  public clickedPointOnMap$ = this._clickedPointOnMapSubject.asObservable();

  private _selectedPlaceSubject = new Subject<GeoJsonLocation>(); 
  public selectedPlace$ = this._selectedPlaceSubject.asObservable();

  private _coordinatesSubject = new BehaviorSubject<GeoJsonLocation[]>([]);
  public coordinates$ = this._coordinatesSubject.asObservable();

  constructor() {
  }

  emitClickedPointOnMap(coordinate: GeoJsonLocation){
    this._clickedPointOnMapSubject.next(coordinate);
  }

  emitSelectedPlace(coordinate: GeoJsonLocation){
    this._selectedPlaceSubject.next(coordinate);
  }
  
  emitCoordinates(coordinates: GeoJsonLocation[]){
    this._coordinatesSubject.next(coordinates);
  }
}
