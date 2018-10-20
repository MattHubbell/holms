import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'confirm-button-primary',
    templateUrl: './confirm-btn-primary.html'
})
export class ModalConfirmPrimary {
  @Input() buttonText:string;
  @Input() message:string;
  @Output() onClosing: EventEmitter<ConfirmResponses> = new EventEmitter<ConfirmResponses>();

  closeResult: string;
  ConfirmResponses: typeof ConfirmResponses = ConfirmResponses;

  constructor(private modalService: NgbModal) {}

  open(content: any) {
    this.modalService.open(content).result.then((result) => {
        this.onClosing.emit(result);
    }, () => {
        this.onClosing.emit(ConfirmResponses.cancel);
    });
  }
}

export enum ConfirmResponses {
    ok = 0,
    yes = 1,
    no = 2,
    cancel = 3,
}