export class User {
    constructor(
        public _id: string,
        public name: string,
        public lastname: string,
        public nickname: string,
        public email: string,
        public password: string,
        public role: string,
        public image: string
    ) { }
}