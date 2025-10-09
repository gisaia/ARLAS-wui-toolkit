/*
 * Licensed to Gisaïa under one or more contributor
 * license agreements. See the NOTICE.txt file distributed with
 * this work for additional information regarding copyright
 * ownership. Gisaïa licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Filter } from 'arlas-api';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { PermissionDialogData } from './_interfaces';
import { PermissionsCreatorDialogComponent } from './permissions-creator-dialog/permissions-creator-dialog.component';

/** Creates an IAM permission based on the current filter of the main collection. */
@Component({
  selector: 'arlas-permissions-creator',
  templateUrl: './permissions-creator.component.html',
  styleUrls: ['./permissions-creator.component.scss']
})
export class PermissionsCreatorComponent implements OnInit {

  public show = false;

  private readonly destroyRef = inject(DestroyRef);

  public constructor(
    private readonly collaborativeSearchService: ArlasCollaborativesearchService,
    private readonly iamService: ArlasIamService,
    private readonly createPermissionDialog: MatDialog
  ) { }

  public ngOnInit(): void {
    this.show = this.hasCreationRight() && this.hasMainCollection();
    this.collaborativeSearchService.ongoingSubscribe
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.collaborativeSearchService.totalSubscribe === 0) {
          this.show = this.hasCreationRight() && this.hasMainCollection();
        }
      });
  }

  public createPermission() {
    // - What is the main collection
    const mainCollection = this.collaborativeSearchService.defaultCollection;
    // - What is my current org
    const currentOrgName = this.iamService.getOrganisation();
    const canCreatePermission = this.hasCreationRight();
    if (canCreatePermission) {
      // - Get filters of the main collection
      const filters: Filter[] = this.collaborativeSearchService.getFilters(mainCollection);
      // - Build the permission
      const partitionFilter = {};

      partitionFilter[mainCollection] = this.collaborativeSearchService.getFinalFilter(filters);
      const partitionFilterHeader = `h:partition-filter:${JSON.stringify(partitionFilter)}`;
      const permissionData: PermissionDialogData = {
        partitionFilterHeader,
        mainCollection,
        oid: this.getOrganisationId(currentOrgName)
      };
      // - open a dialog for description
      this.createPermissionDialog.open(PermissionsCreatorDialogComponent, {
        data: permissionData,
        disableClose: true,
        panelClass: 'arlas-permission-dialog'
      });
    } else {
      this.show = false;
    }
  }

  /** Checks if the current user is owner of the current organisation.
   * If it is the case, we continue
   * Otherwise, the creation of the permission is stopped.
   */
  private hasCreationRight() {
    const currentUser = this.iamService.user;
    const orgName = this.iamService.getOrganisation();
    if (!currentUser) {
      return false;
      // logout ?
    }
    const currentOrg = currentUser.organisations.find(o => o.name === orgName);
    if (!!currentOrg && currentOrg.isOwner) {
      return true;
    }
    return false;
  }

  private hasMainCollection(): boolean {
    return !!this.collaborativeSearchService.defaultCollection;
  }

  private getOrganisationId(orgName: string) {
    const currentUser = this.iamService.user;
    const currentOrg = currentUser.organisations.find(o => o.name === orgName);
    return currentOrg.id;
  }
}
