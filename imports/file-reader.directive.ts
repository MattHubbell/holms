import { Directive, EventEmitter } from '@angular/core';

@Directive({
    selector: 'interval-dir',
    outputs: ['everySecond', 'five5Secs: everyFiveSeconds']
  })
  export class IntervalDir {
    everySecond = new EventEmitter();
    five5Secs = new EventEmitter();
  
    constructor() {
      setInterval(() => this.everySecond.emit("event"), 1000);
      setInterval(() => this.five5Secs.emit("event"), 5000);
    }
  }
