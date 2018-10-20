/*
    To use jQuery:
    typings install dt~jquery --global --save
*/
//var $:any = require("jquery");
declare var jquery:any;
declare var $ :any;


export class JQueryService {

    cloneObject(object:any) {
        return $.extend(true, {}, object);
    }
}