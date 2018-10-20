import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PaymentStatusReponses } from "../shared/paypal-button";
import { MatSnackBar } from '@angular/material';
import * as f from '../shared/functions';

import { EmailService } from '../shared/email.service';
import { Setup } from '../admin/setup';
import { MembershipDues } from './membership-dues.model';
import { MembershipDuesService } from './membership-dues.service';
import { Member } from '../members';
import { TransactionCode } from '../admin/transaction-codes';
import { AppService } from '../app.service';
import { ModalMessageOk } from '../shared/modal/message-btn-ok';

@Component({
    selector: 'paypal-submit',
    templateUrl: './paypal.component.html',
    styleUrls: [ './paypal.component.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class PayPalSubmit {
    @Input() title:string;
    @Input() message:string;
    @Input() isValid:boolean;
    @Output() onClosing: EventEmitter<ConfirmResponses> = new EventEmitter<ConfirmResponses>();

    @Input() member: Member;
    @Input() model: MembershipDues;
    @Input() setup: Setup;
    @Input() transactionCodes: TransactionCode[];
    paymentId: string;

    closeResult: string;
    ConfirmResponses: typeof ConfirmResponses = ConfirmResponses;

    constructor(
        private membershipDuesService: MembershipDuesService,
        private emailService: EmailService,
        private appService: AppService,
        private modalService: NgbModal,
        public dialogRef: MatDialogRef<String>,
        private dialog: MatDialog, 
        public snackBar: MatSnackBar
    ) {}

    open(content: any) {
        if (!this.isValid) { return; }
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            this.onClosing.emit(result);
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            this.onClosing.emit(ConfirmResponses.cancel);
        });
    }

    onClose($event:any) {
        this.dialogRef.close();
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

    public handlePaypalSubmitted(resp:any, item:MembershipDues, isValid:boolean): void {
        if(!isValid) {
            return;
        }
        if (resp.paymentStatus != PaymentStatusReponses.paymentApproved) {
            alert(PaymentStatusReponses[resp.paymentStatus]);
            return;
        }

        this.model.comments = resp.paymentToken.id;
        this.membershipDuesService.postCashEntry(this.model, this.member, this.setup, this.transactionCodes);

        let message:string = this.sendAckowledgmentEmail();
        this.snackBar.open(message,'', {
            duration: 2000,
        });
        this.openMessageBox();
        this.onClose(ConfirmResponses.ok);          
    }
    
    openMessageBox() {
        const modalRef = this.dialog.open(ModalMessageOk);
        modalRef.componentInstance.title  = "Thank You!"
        modalRef.componentInstance.message = "Your payment has been received.  Look for an ackowledgement in your e-mail.";
        modalRef.componentInstance.isValid = true;
    }

    sendAckowledgmentEmail(): string {
        let emailMsg:string = '';
        this.emailService.sendMail(this.appService.userEmail, this.setup.holmsEmail,  this.setup.appSubTitle + ' - Dues Acknowledgment'
            , f.camelCase(this.member.memberName) + `,\r\n\r\n
               Thank you for your payment! \r\n\r\nYour PayPal Transaction ID is ` + this.paymentId + `\r\n\r\n
               Dues Paid                         $` + (this.model.duesAmount * this.model.duesQuantity) + `\r\n
               THFHS Foundation                  $` + this.model.foundation + `\r\n
               Hubbell Museum and Library        $` + this.model.museum_library + `\r\n
               Hubbell Family Scholarship Fund   $` + this.model.scholarship + `\r\n
               Total Paid ->                     $` + this.model.membershipTotal + `\r\n\r\n
               Paid through ->                   ` + this.member.lastDuesYear +  `\r\n
            `)
            .subscribe(
            message  => {
                emailMsg = message;
            },
            error =>  {
                emailMsg = error;
        });
        if (emailMsg.length>0) {
            emailMsg = "E-mail sent!"
        }
        return emailMsg;
    }
}

export enum ConfirmResponses {
    ok = 0,
    yes = 1,
    no = 2,
    cancel = 3,
}
