/**
 * Copyright 2020 Google LLC
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

import { Map } from 'immutable';
import { Field } from './field.model';
import { Option } from '../task/option.model';

export class Task {
  constructor(readonly id: string, readonly fields: Map<string, Field>) {}

  /**
   * For MULTIPLE_CHOICE fields, returns the option with the specified id.
   * Throws an Error if called for other field types.
   */
  getMultipleChoiceFieldOption(fieldId: string, optionId: string): Option {
    const field = this.fields.get(fieldId);
    if (!field) {
      throw Error(`Field ${fieldId} not found in task ${this.id}.`);
    }
    return field.getMultipleChoiceOption(optionId);
  }
}
