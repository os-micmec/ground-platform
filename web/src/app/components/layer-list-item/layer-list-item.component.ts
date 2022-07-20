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

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DialogService } from '../../services/dialog/dialog.service';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { Layer } from '../../shared/models/layer.model';
import { getPinImageSource } from '../map/ground-pin';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { DataStoreService } from '../../services/data-store/data-store.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { SurveyService } from '../../services/survey/survey.service';

@Component({
  selector: 'ground-layer-list-item',
  templateUrl: './layer-list-item.component.html',
  styleUrls: ['./layer-list-item.component.scss'],
})
export class LayerListItemComponent implements OnInit, OnDestroy {
  @Input() layer?: Layer;
  @Input() actionsType: LayerListItemActionsType =
    LayerListItemActionsType.MENU;
  surveyId?: string | null;
  loiId?: string | null;
  layerPinUrl: SafeUrl;
  readonly lang: string;
  readonly layerListItemActionsType = LayerListItemActionsType;
  subscription: Subscription = new Subscription();

  constructor(
    private sanitizer: DomSanitizer,
    private dialogService: DialogService,
    private importDialog: MatDialog,
    private dataStoreService: DataStoreService,
    private navigationService: NavigationService,
    readonly surveyService: SurveyService
  ) {
    // TODO: Make dynamic to support i18n.
    this.lang = 'en';
    this.layerPinUrl = sanitizer.bypassSecurityTrustUrl(getPinImageSource());
  }

  ngOnInit() {
    this.layerPinUrl = this.sanitizer.bypassSecurityTrustUrl(
      getPinImageSource(this.layer?.color)
    );
    this.subscription.add(
      this.navigationService.getLocationOfInterestId$().subscribe(id => {
        this.loiId = id;
      })
    );
    this.subscription.add(
      this.navigationService.getSurveyId$().subscribe(id => {
        this.surveyId = id;
      })
    );
  }

  ngOnChanges() {
    this.layerPinUrl = this.sanitizer.bypassSecurityTrustUrl(
      getPinImageSource(this.layer?.color)
    );
  }

  onCustomizeLayer() {
    if (this.layer?.id) {
      this.navigationService.customizeLayer(this.layer?.id);
    }
  }

  onGoBackClick() {
    this.navigationService.clearLocationOfInterestId();
  }

  onDeleteLayer() {
    this.dialogService
      .openConfirmationDialog(
        'Warning',
        'Are you sure you wish to delete this layer? Any associated data ' +
          'including all lois and observations in this layer will be ' +
          'lost. This cannot be undone.'
      )
      .afterClosed()
      .subscribe(async dialogResult => {
        if (dialogResult) {
          await this.deleteLayer();
        }
      });
  }

  async deleteLayer() {
    await this.dataStoreService.deleteLayer(this.surveyId!, this.layer!.id);
    this.onClose();
  }

  onClose() {
    return this.navigationService.selectSurvey(this.surveyId!);
  }

  onImportLocationsOfInterest() {
    if (!this.surveyId || !this.layer?.id) {
      return;
    }
    this.importDialog.open(ImportDialogComponent, {
      data: { surveyId: this.surveyId, layerId: this.layer?.id },
      width: '350px',
      maxHeight: '800px',
    });
  }

  getDownloadCsvUrl() {
    return (
      `${environment.cloudFunctionsUrl}/exportCsv?` +
      `survey=${this.surveyId}&layer=${this.layer?.id}`
    );
  }

  onLayerListSelect(): void | undefined {
    if (!this.layer?.id) {
      return;
    }
    this.navigationService.showLocationOfInterestList(this.layer.id);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

export enum LayerListItemActionsType {
  MENU = 1,
  BACK = 2,
}
