import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent  {

  fb = inject(FormBuilder);
  hasError = false;
  isPosting = false;
  router = inject(Router);

  authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if( this.loginForm.invalid ) {
      this.showError();
      return;
    }
    const {email = '' , password = ''} = this.loginForm.value;

    this.isPosting = true;
    this.authService
    .login(email!, password!)
    .pipe(finalize(() => (this.isPosting = false)))
    .subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/home')
        return;
      }

      this.showError();
    })
  }

  private showError() {
    this.hasError = true;
    setTimeout(() => (this.hasError = false), 2000);
  }
}
