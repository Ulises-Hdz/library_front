import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-home.component',
  templateUrl: './home.component.html',
})
export class HomePageComponent {

  authService = inject(AuthService);
}
