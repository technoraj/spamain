import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedEventService {
  private _toggle = new Subject();
  toggleService = this._toggle.asObservable();

  toggle(todo:boolean) {
    this._toggle.next(todo);
  }
}
