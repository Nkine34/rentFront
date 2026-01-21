
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LocationStore } from '../../../rentals/state/location.store';

@Component({
    selector: 'app-checkout-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatDividerModule
    ],
    templateUrl: './checkout-page.component.html',
    styleUrls: ['./checkout-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutPageComponent implements OnInit {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    readonly store = inject(LocationStore);

    paymentForm: FormGroup;
    selectedPaymentMethod = signal<'card' | 'paypal' | 'apple'>('card');

    // Trip Details (Signals or simple values from QueryParams)
    startDate = signal<Date | null>(null);
    endDate = signal<Date | null>(null);
    guests = signal<number>(1);

    // Computed price details would go here

    constructor() {
        this.paymentForm = this.fb.group({
            cardName: ['', Validators.required],
            cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
            expiration: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]], // MM/YY
            cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            // Ensure location is loaded in store or fetch it
            // This assumes the store might already have it or we trigger a load
            // For now, we rely on the store having the data or the user coming from details
        }

        this.route.queryParams.subscribe(params => {
            if (params['start']) this.startDate.set(new Date(params['start']));
            if (params['end']) this.endDate.set(new Date(params['end']));
            if (params['guests']) this.guests.set(Number(params['guests']));
        });
    }

    selectPaymentMethod(method: 'card' | 'paypal' | 'apple'): void {
        this.selectedPaymentMethod.set(method);
    }

    onConfirmPayment(): void {
        if (this.paymentForm.valid || this.selectedPaymentMethod() !== 'card') {
            console.log('Payment Confirmed', this.paymentForm.value);
            // Implement actual payment logic here
            alert('Payment Successful! (Mock)');
            this.router.navigate(['/']);
        } else {
            this.paymentForm.markAllAsTouched();
        }
    }
}
