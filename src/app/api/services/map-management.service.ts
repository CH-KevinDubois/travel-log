import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { GeoJsonLocation } from 'src/app/models/geo-json-location';

@Injectable({
  providedIn: 'root'
})
export class MapManagementService {

  private _clickedPointOnMapSubject = new Subject<GeoJsonLocation>(); 
  public clickedPointOnMap$ = this._clickedPointOnMapSubject.asObservable();

  private _focusSelectedPlaceSubject = new Subject<GeoJsonLocation>(); 
  public focusSelectedPlace$ = this._focusSelectedPlaceSubject.asObservable();

  private _setMapZoomSubject = new Subject<number>(); 
  public setMapZoom$ = this._setMapZoomSubject.asObservable();

  private _renderedCoordinatesSubject = new BehaviorSubject<GeoJsonLocation[]>([]);
  public renderedCoordinates$ = this._renderedCoordinatesSubject.asObservable();

  constructor() {
  }

  emitClickedPointOnMap(coordinate: GeoJsonLocation){
    this._clickedPointOnMapSubject.next(coordinate);
  }

  emitSelectedPlace(coordinate: GeoJsonLocation){
    this._focusSelectedPlaceSubject.next(coordinate);
  }

  emitSetMapZoom(zoom: number){
    this._setMapZoomSubject.next(zoom)
  }
  
  emitCoordinates(coordinates: GeoJsonLocation[]){
    this._renderedCoordinatesSubject.next(coordinates);
  }
}
