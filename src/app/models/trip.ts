import { User } from './user';

export class Trip {
    id: string;
    href: string;
    title: string;
    description: string;
    placesCount: number;
    userId: string;
    userRef: string;
    createdAt: Date;
    updateAt: Date;
    user?: User;
}
