import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import {Timestamp} from '@angular/fire/firestore';
@Pipe({
  name: 'displayDate'
})
export class DisplayDatePipe implements PipeTransform {
constructor(private date:DatePipe){

}

  transform(value: Timestamp| undefined): string {
    return this.date.transform(value?.toMillis(),'short') ?? '';
  }

}
