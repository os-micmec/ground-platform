/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnChanges {
  readonly nameControlKey = 'name';
  formGroup: FormGroup;

  @Input()
  name = '';

  constructor() {
    this.formGroup = new FormBuilder().group({
      [this.nameControlKey]: '',
    });
  }

  ngOnChanges(): void {
    this.formGroup.controls[this.nameControlKey].setValue(this.name);
  }

  toJobName(): string {
    return this.formGroup.controls[this.nameControlKey].value;
  }
}
