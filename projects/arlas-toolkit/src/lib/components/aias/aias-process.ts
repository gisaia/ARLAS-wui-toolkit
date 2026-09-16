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

import { signal, WritableSignal } from '@angular/core';
import { DEFAULT_TASK_RETRIEVAL_INTERVAL } from 'arlas-web-components';
import { finalize, Subject, Subscription, takeUntil, timer } from 'rxjs';
import { ProcessService } from '../../services/process/process.service';
import { ProcessFieldOption, ProcessOutput, ProcessStatus } from '../../tools/process.interface';

/** Base data communicated to an AIAS process dialog window */
export interface AiasProcessDialogData {
  /** Number of items to process */
  nbProducts: number;
  /** Name of the field containing the id */
  idFieldName: string;
  /** Ids of the items to process */
  ids: string[];
  /** Name of the collection of items */
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
  public statusResult: ProcessOutput | null = null;

  /** Options for each configured form control in the process inputs */
  public options: Record<string, WritableSignal<ProcessFieldOption[]>> = {};
  /** Tracks how many options are currently loading to display a loading bar to the user */
  public optionsLoading = signal(0);

  public constructor(
    protected readonly processService: ProcessService,
    protected readonly data: AiasProcessDialogData,
    private readonly processName: string
  ) {
    const validatedProcessOptions = this.processService.getValidOptions(this.data.idFieldName,
      this.data.ids, this.data.collection, processName);

    validatedProcessOptions.forEach((options, fieldName) => {
      options.forEach(opt => {
        this.optionsLoading.update(v => v + 1);

        opt.valid$
          .pipe(finalize(() => this.optionsLoading.update(v => v - 1)))
          .subscribe(valid => {
            if (valid) {
              this.options[fieldName] ??= signal([]);
              this.options[fieldName].update(v => {
                v.push({ label: opt.label, value: opt.value });
                return v;
              });
            }
          });
      });
    });
  }

  protected abstract preparePayload(): any;

  public submit(): void {
    this.isProcessing = true;
    this.processStarted = true;
    this.hasError = false;

    try {
      const payload = this.preparePayload();

      this.processService.process(this.processName, this.data.ids, payload, this.data.collection).subscribe({
        next: (result) => {
          this.statusResult = result;

          // Convert time to milliseconds
          result.created *= 1000;
          result.started *= 1000;
          result.finished *= 1000;
          result.updated *= 1000;

          const executionObservable = timer(0, DEFAULT_TASK_RETRIEVAL_INTERVAL);
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
    } catch (e) {
      console.error(e);
      this.isProcessing = false;
      this.hasError = true;
    }
  }

  private getStatus(jobId: string) {
    this.processService.getJobStatus(this.processName, jobId).subscribe({
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
