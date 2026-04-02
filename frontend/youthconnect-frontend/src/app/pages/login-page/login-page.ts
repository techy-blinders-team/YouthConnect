import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  formBuilder = inject(FormBuilder);
  loginForm: FormGroup;

  constructor () {
    this.loginForm = this.formBuilder.group ({
      email: ['', {
        validators: [Validators.required, Validators.maxLength(10)],
        updateOn: 'change'
      }],

      password: ['', {
        validators: [Validators.required],
        updateOn: 'change'
      }],
    });
  }

  loginValidation () {
    console.log(this.loginForm.value);
    this.loginForm.reset();
  }

  get emailControl () {
    return this.loginForm.get ('email');
  }

  get passwordControl () {
    return this.loginForm.get ('password');
  }
}
