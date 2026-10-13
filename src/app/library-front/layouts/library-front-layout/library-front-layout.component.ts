import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SliderNavbarComponent } from '../../components/slider-navbar/slider-navbar.component';

@Component({
  selector: 'app-library-front-layout',
  templateUrl: './library-front-layout.component.html',
  imports: [RouterOutlet, SliderNavbarComponent]
})
export class LibraryFrontLayoutComponent  {}
