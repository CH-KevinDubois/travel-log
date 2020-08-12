import { GeoJsonLocation } from './geo-json-location';

export class Place {
    id: string;
    href: string;
    name: string;
    description: string;
    location: GeoJsonLocation;
    tripHref: string;
    tripId: string;
    pictureUrl?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<Place> = { }) {
        this.id = data.id;
        this.href = data.href;
        this.name = data.name;
        this.description = data.description;
        this.location = data.location;
        this.tripHref = data.tripHref;
        this.tripId = data.tripId;
        this.pictureUrl = data.pictureUrl;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        if(this.location === undefined){
            this.location = new GeoJsonLocation(-200, -200);
        }
    }
}
