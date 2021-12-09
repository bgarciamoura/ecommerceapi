export default interface IUser {
    id: number;

    name: string;

    username: string;

    email: string;

    isAdmin: boolean;

    created_at: Date;

    updated_at: Date;
}
