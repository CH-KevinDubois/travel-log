import { GeoJsonLocation } from './geo-json-location';

export class PlaceRequest {
    name: String;
    description: string;
    location: GeoJsonLocation;
    tripHref?: String;
    tripId?: String;
    pictureUrl?: String;

    constructor(data: Partial<PlaceRequest> = { }) {
        this.name = data.name;
        this.description = data.description;
        this.location = data.location;
        this.tripHref = data.tripHref;
        this.tripId = data.tripId;
        this.pictureUrl = data.pictureUrl;
    }
}
