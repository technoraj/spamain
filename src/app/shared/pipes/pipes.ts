import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'dateToTime' })
export class ExponentialStrengthPipe implements PipeTransform {
    transform(value: string): string {
        if (value) {
            let hours = new Date(value).getHours().toString();
            hours = hours.length == 1 ? '0' + hours : hours;
            let minutes = new Date(value).getMinutes().toString();;
            minutes = minutes.length == 1 ? '0' + minutes : minutes;
            return hours + ':' + minutes
        } else {
            return ''
        }
    }
}

@Pipe({ name: 'imageNameTransform' })
export class imageNameTrasnformPipe implements PipeTransform {
    transform(value: string): string {
        if (value) {
            return value.split('.')[0]
        } else {
            return ''
        }
    }
}