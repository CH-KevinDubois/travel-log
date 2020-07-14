import { GeoJsonLocation } from './geo-json-location';

export class Place {
    id: string;
    href: string;
    name: string;
    descripiton: string;
    location: GeoJsonLocation;
    tripHref: string;
    tripId: string;
    picureUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}