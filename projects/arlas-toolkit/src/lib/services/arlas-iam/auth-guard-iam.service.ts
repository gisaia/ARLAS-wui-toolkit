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

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import { catchError, mergeMap } from 'rxjs/operators';
import { ArlasIamService } from './arlas-iam.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardIamService {

  public constructor(
    private router: Router,
    private arlasIamService: ArlasIamService,
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!!this.arlasIamService.user) {
      // If arlasIamService has a user no need to try to refresh
      // Usefull to not call refresh too many times in app navigation
      return of(true);
    } else {
      return this.arlasIamService.refresh().pipe(map(loginData => {
        if (!!loginData) {
          this.arlasIamService.setHeadersFromAccesstoken(loginData.access_token);
          return true;
        } else {
          return false;
        }
      }),
      catchError(() => this.arlasIamService.logoutWithoutRedirection$().pipe(mergeMap(() => {
        this.router.navigate(['/login']);
        return of(false);
      }))));
    }
  }
}
