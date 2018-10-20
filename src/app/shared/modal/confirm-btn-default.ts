import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'confirm-button-default',
    templateUrl: './confirm-btn-default.html'
})
export class ModalConfirmDefault {
  @Input() message:string;
  @Input() isValid:boolean;
  @Output() onClosing: EventEmitter<ConfirmResponses> = new EventEmitter<ConfirmResponses>();

  closeResult: string;
  ConfirmResponses: typeof ConfirmResponses = ConfirmResponses;

  constructor(private modalService: NgbModal) {}

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