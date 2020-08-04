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
}
