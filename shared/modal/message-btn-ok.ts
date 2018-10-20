import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
    selector: 'message-btn-ok',
    templateUrl: './message-btn-ok.html',
    styleUrls: [ './message-btn-ok.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class ModalMessageOk {
    @Input() title:string;
    @Input() message:string;
    @Input() isValid:boolean;
    @Output() onClosing: EventEmitter<ConfirmResponses> = new EventEmitter<ConfirmResponses>();

    closeResult: string;
    ConfirmResponses: typeof ConfirmResponses = ConfirmResponses;

    constructor(
        private modalService: NgbModal,
        public dialogRef: MatDialogRef<String>
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
}

export enum ConfirmResponses {
    ok = 0,
    yes = 1,
    no = 2,
    cancel = 3,
}

@Component({
    selector: 'message-btn-ok-modal',
    template: '<a class="btn btn-default waves-effect" (click)="open()">{{buttonText}}<i class="fa fa-edit" aria-hidden="true"></i></a>'
})
export class MessageBtnOkComponent {

    @Input() title:string;
    @Input() message:string;
    @Input() isValid:boolean;
    @Output() onClosing: EventEmitter<ConfirmResponses> = new EventEmitter<ConfirmResponses>();

    constructor(private dialog: MatDialog) {}

    open() {
        const modalRef = this.dialog.open(ModalMessageOk);
        modalRef.componentInstance.title = this.title;
        modalRef.componentInstance.message = this.message;
        modalRef.componentInstance.onClosing = this.onClosing;
    }
}
