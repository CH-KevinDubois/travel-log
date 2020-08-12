import { Trip } from './trip';
import { Place } from './place';

export class ActiveSelections {
    private _selectedTrip: Trip;
    private _isTripSelected: boolean;
    
    private _selectedPlace: Place;
    private _isPlaceSelected: boolean;

    constructor() {
        this._isPlaceSelected = false;
        this._isTripSelected = false;
        this._selectedTrip = null;
        this._selectedPlace = null;
        
    }

    public get selectedTrip() : Trip {
        return this._selectedTrip;
    }

    public set selectedTrip(v : Trip) {
        this._isTripSelected = true;
        this._selectedTrip = v;
        this.removeSelectedPlace();
    }
    
    public removeSelectedTrip(): void {
        this._selectedTrip = null;
        this._isTripSelected = false;
        this.removeSelectedPlace();
    }

    public isTripSelected(): Boolean {
        return this._isTripSelected;
    }

    public get selectedPlace() : Place {
        return this._selectedPlace;
    }

    public set selectedPlace(v : Place) {
        this._isPlaceSelected = true;
        this._selectedPlace = v;
    }
    
    public removeSelectedPlace(): void {
        this._selectedPlace = null;
        this._isPlaceSelected = false;
    }

    public isPlaceSelected(): Boolean {
        return this._isPlaceSelected;
    }

}
