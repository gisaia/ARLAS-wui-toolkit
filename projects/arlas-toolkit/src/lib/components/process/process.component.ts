import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProcessService } from '../../services/process/process.service';
import { ProcessInput, Process, ProcessInputs, ProcessOutput, ProcessStatus } from '../../tools/process.interface';
import { Observable, Subject, Subscription, takeUntil, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';



@Component({
  selector: 'arlas-tool-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class ProcessComponent implements OnInit, OnDestroy {

  public formGroup: FormGroup = new FormGroup({});
  public controlsName: string[] = [];
  public inputs: ProcessInput[] = [];
  public process: Process = {};
  public formInputs: ProcessInputs = {};
  public nbProducts = 0;
  public matchingAdditionalParams = new Map<string, boolean>();
  public wktAoi = '';

  public isProcessing = false;
  public isProcessStarted = false;

  public ids: string[] = []; // List of product id to process
  public collection = ''; // Name of the collection of products

  public tooltipDelay = 2000;

  public executionObservable!: Observable<number>;
  public statusSub!: Subscription;
  public unsubscribeStatus = new Subject<boolean>();
  public statusResult: ProcessOutput = null;

  public useCrop = true;

  public constructor(
    private processService: ProcessService,
    private dialog: MatDialogRef<ProcessComponent>
  ) { }

  public ngOnInit(): void {
    const group: any = {};
    this.process = this.processService.getProcessDescription();
    this.formInputs = this.process.inputs;
    Object.keys(this.formInputs).forEach(inputKey => {
      if (this.matchingAdditionalParams.has(inputKey) && this.matchingAdditionalParams.get(inputKey)) {
        const matchingProp = this.process.additionalParameters.parameters.find(p => p.name === inputKey);
        this.formInputs[inputKey].schema = matchingProp.value.newSchema;
      }
      if (!!this.formInputs[inputKey].schema.enum) {
        if (this.formInputs[inputKey].schema.type === 'object') {
          this.formInputs[inputKey].schema.type = 'object_enum';
        } else {
          this.formInputs[inputKey].schema.type = 'enum';
        }
      }
      if (this.formInputs[inputKey].schema.type === 'array') {
        this.formInputs[inputKey].schema.items.type = 'enum';
      }
      group[inputKey] = this.getControl(this.formInputs[inputKey].schema);
      this.inputs.push(this.formInputs[inputKey]);
      this.controlsName.push(inputKey);
    });
    this.formGroup = new FormGroup(group);
  }

  public ngOnDestroy(): void {
    if (!!this.statusSub) {
      this.statusSub.unsubscribe();
    }
  }

  public submit() {
    this.isProcessing = true;
    this.isProcessStarted = true;
    const payload = this.formGroup.value;
    if( !this.useCrop){
      Object.keys(this.formInputs).forEach(inputKey => {
        if( this.formInputs[inputKey].schema.type === 'AOI'){
          payload[inputKey] = '';
        }
      });
    }
    this.processService.process(this.ids, payload, this.collection).subscribe({
      next: (result) => {
        this.statusResult = result;
        this.executionObservable = timer(0, 5000);
        this.statusSub = this.executionObservable.pipe(takeUntil(this.unsubscribeStatus)).subscribe(() => {
          this.getStatus(result.jobID);
        });
      },
      error: (err) => {
        this.isProcessing = false;
        console.error(err);
      }
    });
  }

  public toggleCrop(event: MatCheckboxChange) {
    this.useCrop = event.checked;
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
        this.isProcessing = false;
      }
    });
  }

  private getControl(input): AbstractControl {
    let defaultValue = '';
    if (!!input.default) {
      defaultValue = input.default;
    }
    if (input.type === 'AOI') {
      defaultValue = this.wktAoi;
    }
    return !!input.required ? new FormControl(defaultValue || '', Validators.required)
      : new FormControl(defaultValue || '');
  }

}
