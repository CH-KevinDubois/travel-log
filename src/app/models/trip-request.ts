import { PartialObject } from 'lodash';

export class TripRequest {
    title: string;
    description: string;

    constructor(data: Partial<TripRequest> = { }) {
        this.title = data.title;
        this.description = data.description;        
    }
}
