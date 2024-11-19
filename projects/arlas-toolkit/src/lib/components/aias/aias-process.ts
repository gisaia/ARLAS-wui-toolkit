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

import { Subject, Subscription, takeUntil, timer } from 'rxjs';
import { ProcessOutput, ProcessStatus } from '../../tools/process.interface';
import { ProcessService } from '../../services/process/process.service';

/** Base data communicated to an AIAS process dialog window */
export interface AiasProcessDialogData {
  nbProducts: number;
  itemDetail:  Map<string, any>;
  ids: string[] | null;
  collection: string;
}

/** Data for the AIAS Download */
export interface AiasDownloadDialogData extends AiasProcessDialogData {
  wktAoi: string | null;
}

/** Data for the AIAS Enrich */
export type AiasEnrichDialogData = AiasProcessDialogData;

export abstract class AiasProcess {
  public processStarted = false;
  public isProcessing = false;
  public hasError = false;

  public statusSub!: Subscription;
  public unsubscribeStatus = new Subject<boolean>();
  public statusResult: ProcessOutput = null;

  public constructor(
    protected processService: ProcessService,
    protected data: AiasProcessDialogData
  ) { }

  protected abstract preparePayload(): any;

  public submit(): void {
    this.isProcessing = true;
    this.processStarted = true;
    this.hasError = false;

    const payload = this.preparePayload();

    this.processService.process(this.data.ids, payload, this.data.collection).subscribe({
      next: (result) => {
        this.statusResult = result;
        const executionObservable = timer(0, 5000);
        this.statusSub = executionObservable.pipe(takeUntil(this.unsubscribeStatus)).subscribe(() => {
          this.getStatus(result.jobID);
        });
      },
      error: (err) => {
        this.isProcessing = false;
        this.hasError = true;
        console.error(err);
      }
    });
  }

  private getStatus(jobId) {
    this.processService.getJobStatus(jobId).subscribe({
      next: (job) => {
        this.statusResult = job;
        if (job.status !== ProcessStatus.accepted && job.status !== ProcessStatus.running) {
          this.unsubscribeStatus.next(true);
          this.isProcessing = false;
        }
      },
      error: (err) => {
        this.unsubscribeStatus.next(true);
        this.hasError = true;
        this.isProcessing = false;
      }
    });
  }
}
