import { GeoJsonLocation } from './geo-json-location';

export class PlaceRequest {
    name: string;
    description: string;
    location: GeoJsonLocation;
    tripHref?: string;
    tripId?: string;
    pictureUrl?: string;

    constructor(data: Partial<PlaceRequest> = { }) {
        this.name = data.name;
        this.description = data.description;
        this.location = data.location;
        this.tripHref = data.tripHref;
        this.tripId = data.tripId;
        this.pictureUrl = data.pictureUrl;

        if(this.location === undefined){
            this.location = new GeoJsonLocation(0,0);
        }
    }
}
