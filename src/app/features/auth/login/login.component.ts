import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  errorMessage = signal<string | null>(null);
  private returnUrl: string = '/';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  ngOnInit(): void {
    // AJOUT DU LOG
    console.log('LoginComponent a été initialisé. La navigation est correcte.');

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.errorMessage.set(null);
    const { email, password } = this.loginForm.value;

    this.authService.loginWithPassword(email!, password!).subscribe({
      next: () => {
        // Rediriger vers le callback pour traiter les informations utilisateur
        this.router.navigate(['/callback'], {
          queryParams: { returnUrl: this.returnUrl }
        });
      },
      error: (err) => {
        this.errorMessage.set(err.message);
      }
    });
  }
}
