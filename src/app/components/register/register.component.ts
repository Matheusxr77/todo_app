import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  showPasswordReq = false;
  successMessage = '';

  passwordMinLength = false;
  passwordHasUpper = false;
  passwordHasLower = false;
  passwordHasNumber = false;
  passwordHasSpecial = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator.bind(this)
      ]]
    });
  }

  get f() { return this.registerForm.controls; }

  passwordValidator(control: any) {
    const value = control.value || '';
    this.passwordMinLength = value.length >= 8;
    this.passwordHasUpper = /[A-Z]/.test(value);
    this.passwordHasLower = /[a-z]/.test(value);
    this.passwordHasNumber = /\d/.test(value);
    this.passwordHasSpecial = /[^A-Za-z0-9]/.test(value);

    if (
      this.passwordMinLength &&
      this.passwordHasUpper &&
      this.passwordHasLower &&
      this.passwordHasNumber &&
      this.passwordHasSpecial
    ) {
      return null;
    }
    return { passwordInvalid: true };
  }

  onPasswordInput(event: any) {
    this.f['password'].updateValueAndValidity();
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    const { name, email, password } = this.registerForm.value;
    this.authService.register(name, email, password).subscribe({
      next: (res) => {
        this.successMessage = 'Usuário cadastrado com sucesso!';
        this.registerForm.reset();
        this.submitted = false;
        setTimeout(() => {
          this.successMessage = '';
        }, 3500);
      },
      error: (err) => {
        this.successMessage = 'Erro ao cadastrar: ' + (err.error?.error || 'Erro desconhecido');
        setTimeout(() => {
          this.successMessage = '';
        }, 3500);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}