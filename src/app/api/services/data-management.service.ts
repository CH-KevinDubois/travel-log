import { Injectable } from '@angular/core';
import { Trip } from 'src/app/models/trip';
import { Place } from 'src/app/models/place';
import { Subject, Observable, BehaviorSubject, AsyncSubject } from 'rxjs';
import { MAT_HAMMER_OPTIONS } from '@angular/material/core';


@Injectable({
  providedIn: 'root'
})
export class DataManagementService {

    private _selectedTripSubject: Subject<Trip>;
    private _isTripSelectedSubject: BehaviorSubject<boolean>;
    
    private _selectedPlaceSubject: Subject<Place>;
    private _isPlaceSelectedSubject: BehaviorSubject<boolean>;

    private _tripListSubject: BehaviorSubject<Trip[]>;
    private _tripListReadySubject: AsyncSubject<boolean>;

    constructor() {
        this._isPlaceSelectedSubject = new BehaviorSubject<boolean>(false);
        this._isTripSelectedSubject = new BehaviorSubject<boolean>(false);
        this._selectedTripSubject = new Subject<Trip>();
        this._selectedPlaceSubject = new Subject<Place>();
        this._tripListSubject = new BehaviorSubject<Trip[]>([]);
        this._tripListReadySubject = new AsyncSubject<boolean>();
        
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
        this.removeSelectedPlace();
        this._isTripSelectedSubject.next(false);
        this._selectedTripSubject.next();   
    }

    public get isTripSelected$(): Observable<boolean> {
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
        this._isPlaceSelectedSubject.next(false);
        this._selectedPlaceSubject.next();
    }

    public get isPlaceSelected$(): Observable<boolean> {
        return this._isPlaceSelectedSubject.asObservable();
    }

    public get tripList$(): Observable<Trip[]> {
        return this._tripListSubject.asObservable();
    }

    public emitTripList(l: Trip[]) {
        this._tripListSubject.next(l);
        this._tripListReadySubject.next(true);
        this._tripListReadySubject.complete();
    }

    public get tripListReady$() {
        return this._tripListReadySubject.asObservable();
    }

}
