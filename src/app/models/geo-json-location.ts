export class GeoJsonLocation {
    type: string;
    coordinates: number[];

    constructor(x: number, y: number){
        this.type="Point";
        this.coordinates = [x, y];
    }
}
