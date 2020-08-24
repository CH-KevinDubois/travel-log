export class GeoJsonLocation {
    type: string;
    private _lat: number;
    private _lng: number;

    constructor(lng: number, lat: number){
        this.type="Point";
        this.coordinates = [lng, lat];
        this._lng = lng;
        this._lat = lat;
    }

    set coordinates(lngLat: number[]){
        this._lng = lngLat[0];
        this._lat = lngLat[1];
    }

    get coordinates(): number[] {
        return [this._lng, this._lat];
    }

    set lat(value: number){
        this._lat = value;
    } 

    get lat(): number{
        return this._lat;
    }

    set lng(value: number){
        this._lng = value;
    } 

    get lng(): number {
        return this._lng;
    }
}
