export class GeoJsonLocation {
    type: string;
    coordinates: number[];

    constructor(lng: number, lat: number){
        this.type="Point";
        this.coordinates = [lng, lat];

    }

    set lat(value: number){
        this.coordinates[1] = value;
    } 

    get lat(): number{
        return this.coordinates[1];
    }

    set lng(value: number){

        this.coordinates[0] = value;
    } 

    get lng(): number {
        return this.coordinates[0];
    }
}
