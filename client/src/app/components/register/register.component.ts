import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    providers: [UserService]
})

export class RegisterComponent implements OnInit {
    public title: string;
    public user: User;
    public status: string;
    public message: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ) {
        this.title = 'Registrate';
        this.user = new User('', '', '', '', '', '', 'ROLE_USER', '');
        this.status = ''
        this.message = ''
    }
    ngOnInit() {
        console.log('se cargo el componente register');
    }

    onSubmit(form) {
        this._userService.register(this.user).subscribe((res) => {
            if (res.user && res.user._id) {
                this.status = 'success';
                form.reset();
            } else {
                this.status = 'fail';
                this.message = res.message;
            }
        }, (error) => {
            console.log(error);
        });

        return false
    }
}