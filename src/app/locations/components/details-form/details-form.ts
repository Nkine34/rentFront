import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common'; // Removed CommonModule

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-details-form',
  standalone: true,
  imports: [
    // CommonModule, // Removed CommonModule
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  templateUrl: './details-form.html',
  styleUrls: ['./details-form.css']
})
export class DetailsFormComponent {
  @Input() parentForm!: FormGroup;

  get formGroup(): FormGroup {
    return this.parentForm;
  }
}
