import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
});

export class loginComponent implements OnInit {
    public title: string;
    ngOnInit() {
        console.log('se cargo el componente');
    }

    constructor() {
        this.title = 'Inicio de sesion'
    }
}