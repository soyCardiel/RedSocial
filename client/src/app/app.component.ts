import { Component } from '@angular/core';
import * as $ from 'jquery';

console.log($.fn.jquery);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mySocialNetwork';
}
