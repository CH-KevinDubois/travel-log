import { Component, OnInit, EventEmitter } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';


export interface Filter {
  name: string;
}

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  filters: Filter[] = [];
  onChange: EventEmitter<boolean>;

  constructor() {
    this.onChange = new EventEmitter();
  }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.filters.push({name: value.trim()});
      // Notify the new filter to the table
      this.onChange.emit();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(filter: Filter): void {
    const index = this.filters.indexOf(filter);

    if (index >= 0) {
      this.filters.splice(index, 1);
      // Notify the  to the table
      this.onChange.emit();
    }
  }

}
