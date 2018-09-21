import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    public title: string;
    ngOnInit() {
        console.log('se cargo el componente login');
    }

    constructor() {
        this.title = 'Inicio de sesion'
    }
}