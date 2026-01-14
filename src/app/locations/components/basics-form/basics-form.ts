import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common'; // Removed CommonModule

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-basics-form',
  standalone: true,
  imports: [
    // CommonModule, // Removed CommonModule
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './basics-form.html',
  styleUrls: ['./basics-form.css']
})
export class BasicsFormComponent {
  @Input() parentForm!: FormGroup;

  get formGroup(): FormGroup {
    return this.parentForm;
  }
}
