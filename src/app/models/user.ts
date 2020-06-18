export class User {
    id: string;
    href: string;
    name: string;
    tripsCount: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<User> = { }) {
        this.id = data.id;
        this.href = data.href;
        this.name = data.name;
        this.tripsCount = data.tripsCount;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}
