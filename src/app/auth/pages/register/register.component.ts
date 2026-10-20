import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  fb = inject(FormBuilder);
  hasError = false;
  isPosting = false;
  router = inject(Router);

  authService = inject(AuthService);

  registerForm = this.fb.group({
    full_name: ['' , [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if( this.registerForm.invalid ) {
      this.hasError = true;
      setTimeout( () => {
        this.hasError = false;
      }, 2000)
      return ;
    }
    const {email = '' , password = '', full_name = ''} = this.registerForm.value;

    this.authService
    .register(email!, password!, full_name!)
    .subscribe((isAuthenticated) => {
      if( isAuthenticated) {
        this.router.navigateByUrl('/')
        return;
      }

      this.hasError = true;
      setTimeout( () => {
        this.hasError = false;
      }, 2000);
    })
  }

}
