import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { UserService } from './user.service'; // À créer

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  countries = [
    { code: '+33', name: 'France' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+1', name: 'United States' },
    // ... ajouter d'autres pays
  ];

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/)]],
    confirmPassword: ['', Validators.required],
    userType: ['voyageur', Validators.required],
    phoneCountryCode: ['+33'],
    phoneNumber: [''],
    acceptTerms: [false, Validators.requiredTrue]
  }, {
    validators: this.passwordMatchValidator
  });

  passwordMatchValidator(form: any) {
    return form.get('password').value === form.get('confirmPassword').value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          // Rediriger vers la page de connexion avec un message
          this.router.navigate(['/login'], { queryParams: { message: response.message } });
        },
        error: (err) => {
          console.error('Registration failed', err);
          // Afficher l'erreur
        }
      });
    }
  }
}
