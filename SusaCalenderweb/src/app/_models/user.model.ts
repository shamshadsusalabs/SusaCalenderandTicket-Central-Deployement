export class User{
    _id: string;
    userName: string;
    password: string;
    isVerified: boolean;
    email: string;


    constructor(user){
        this._id = user._id;
        this.userName = user.userName;
        this.password = user.password;
        this.isVerified = user.isVerified;
        this.email = user.email;
    }
}
