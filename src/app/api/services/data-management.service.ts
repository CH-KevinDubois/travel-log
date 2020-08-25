import { Injectable } from '@angular/core';
import { Trip } from 'src/app/models/trip';
import { Place } from 'src/app/models/place';
import { Subject, Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataManagementService {

    private _selectedTripSubject: Subject<Trip>;
    private _isTripSelectedSubject: BehaviorSubject<boolean>;
    
    private _selectedPlaceSubject: Subject<Place>;
    private _isPlaceSelectedSubject: BehaviorSubject<boolean>;

    private _tripListSubject: BehaviorSubject<Trip[]>;

    constructor() {
        this._isPlaceSelectedSubject = new BehaviorSubject<boolean>(false);
        this._isTripSelectedSubject = new BehaviorSubject<boolean>(false);
        this._selectedTripSubject = new Subject<Trip>();
        this._selectedPlaceSubject = new Subject<Place>();
        this._tripListSubject = new BehaviorSubject<Trip[]>([]);
        
    }

    public get selectedTrip$() : Observable<Trip> {
        return this._selectedTripSubject.asObservable();
    }

    public emitSelectedTrip(t : Trip) {
        this._isTripSelectedSubject.next(true);
        this._selectedTripSubject.next(t);
        this.removeSelectedPlace();
    }
    
    public removeSelectedTrip(): void {
        this._selectedTripSubject.next();
        this._isTripSelectedSubject.next(false);
        this.removeSelectedPlace();
    }

    public isTripSelected$(): Observable<Boolean> {
        return this._isTripSelectedSubject.asObservable();
    }

    public get selectedPlace$() : Observable<Place> {
        return this._selectedPlaceSubject.asObservable();
    }

    public emitSelectedPlace(p : Place) {
        this._isPlaceSelectedSubject.next(true);
        this._selectedPlaceSubject.next(p);
    }
    
    public removeSelectedPlace(): void {
        this._selectedPlaceSubject.next();
        this._isPlaceSelectedSubject.next(false);
    }

    public isPlaceSelected$(): Observable<boolean> {
        return this._isPlaceSelectedSubject.asObservable();
    }

    public get tripList$(): Observable<Trip[]> {
      return this._tripListSubject.asObservable();
    }

    public emitTripList(l: Trip[]) {
      this._tripListSubject.next(l);
    }

}
