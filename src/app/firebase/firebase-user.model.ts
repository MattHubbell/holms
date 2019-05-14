//import { MembershipUserType } from '../admin/membership-users/membership-user.model';
export enum MembershipUserType {
    New = 0,
    Member = 1,
    Treasurer = 2,
    Geneologist = 3,
    Administrator = 4
}  

export class FirebaseUser {
    id?: string;
    name?: string;
    email?: string;
    picture?: string;
    verified?: boolean;

    constructor(id?:string, name?: string, email?: string, picture?: string, verified?: boolean, userType?: MembershipUserType) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.verified = verified;
    }
}