/**
 * paypal-button uses two inputs (totalSale, currencyType) and one output (statusUpdated).  
 * to use: <paypal-button [totalSale]="cost.value" [currencyType]="USD" (statusUpdated)="handleStatusUpdated($event)"></paypal-button> 
 * Include in your index.html:  <script src="https://www.paypalobjects.com/api/checkout.js"></script>
 * Include in your code: import { PaymentStatusReponses } from "./paypal-button";
 * Include in your modules.ts: import { PaypalButton } from "./paypal-button";
 */

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import { environment } from '../../environments/environment';

@Component({
    selector: 'paypal-button',
    template: `
      <div id="paypal-button-container"></div>
    `,
  })

  export class PaypalButton implements OnInit, OnChanges {

    @Input() formValid: boolean = true;
    @Input() totalSale: number = 0.0;
    @Input() currencyType: string = 'USD';
    @Output() statusUpdated: EventEmitter<PaymentData> = new EventEmitter<PaymentData>();

    private buttonActions: any;

    public ngOnInit(): void {
        (window as any).paypal.Button.render({

            env: 'sandbox', // Or 'sandbox',

            client: environment.paypalClient,
        
            commit: true, // Show a 'Pay Now' button

            validate: (actions) => {
                return this.onValidate(actions);
            },

            payment: (data, actions) => { 
                return this.payment(data, actions); 
            },

            onAuthorize: (data, actions) => {
                return this.onAuthorize(data, actions);                
            },

            onCancel: (data, actions) => {
                return this.onCancel(data, actions);
            },

            onError: (err) => {
                return this.onError(err);
            }

        }, '#paypal-button-container');
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (this.buttonActions) this.isValid();
    }

    public onValidate(actions): any {
        this.buttonActions = actions;
        return this.isValid();
    }

    public isValid(): any {
        if (!this.formValid) {
            return this.buttonActions.disable();
        } else {
            return (this.totalSale > 0.0) ? this.buttonActions.enable() : this.buttonActions.disable();
        }
    }

    public payment(data: any, actions: any): any {
        return actions.payment
        .create({
            payment: {
                transactions: [
                    {
                        amount: { total: this.totalSale, currency: this.currencyType }
                    }
                ]
            }
        })
        .catch(err => {
            this.statusUpdated.emit(new PaymentData(PaymentStatusReponses.paymentError, null));
        });
    }

    public onAuthorize(data: any, actions: any): any {
        return actions.payment.execute()
        .then((res) => {
            if (res.state == 'approved') {
                this.statusUpdated.emit(new PaymentData(PaymentStatusReponses.paymentApproved, res));
            }
            else {
                this.statusUpdated.emit(new PaymentData(PaymentStatusReponses.paymentFailed, res));
            }
        })
        .catch(err => {
            this.statusUpdated.emit(new PaymentData(PaymentStatusReponses.authorizationError, null));
        });
    }

    public onCancel(data: any, actions: any): any {
        this.statusUpdated.emit(new PaymentData(PaymentStatusReponses.paymentCancelled, null));
    }

    public onError(err: any): any {
        this.statusUpdated.emit(new PaymentData(PaymentStatusReponses.paypalError, null));
    }
}

export enum PaymentStatusReponses {
    paymentApproved = 0,
    paymentFailed = 1,
    paymentCancelled = 2,
    paymentError = 3,
    authorizationError = 4,
    paypalError = 5,
}

export class PaymentData {
    paymentStatus: PaymentStatusReponses;
    paymentToken: any;

    constructor(paymentStatus?: PaymentStatusReponses, paymentToken?: any) {
        this.paymentStatus = (paymentStatus) ? paymentStatus : 0;
        this.paymentToken = (paymentToken) ? paymentToken : null;
    }
}