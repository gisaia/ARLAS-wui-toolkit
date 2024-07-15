import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProcessService } from '../../services/process/process.service';
import {
  Process,
  ProcessInput,
  ProcessInputs,
  ProcessOutput,
  ProcessStatus,
  Projection
} from '../../tools/process.interface';
import { Observable, Subject, Subscription, takeUntil, timer } from 'rxjs';
import booleanContains from '@turf/boolean-contains';
import { Geometry } from "@turf/helpers";


@Component({
  selector: 'arlas-aias-download',
  templateUrl: './aias-download.component.html',
  styleUrls: ['./aias-download.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class AiasDownloadComponent implements OnInit, OnDestroy {

  public formGroup: FormGroup = new FormGroup({
    row_archive: new FormControl<boolean>(true),
    crop_wkt: new FormControl<boolean | string>(false),
    target_projection: new FormControl<string>('native'),
    target_format: new FormControl<string>('native', Validators.required),
  });
  public controlsName: string[] = [];
  public inputs:   Map<string, ProcessInput> = new Map<string, ProcessInput>();
  public process: Process = {};
  public formInputs: ProcessInputs = {};
  public nbProducts = 0;
  public itemDetail = new Map<string, any>();
  public wktAoi = '';

  public isProcessing = false;
  public isProcessStarted = false;
  public hasError = false;
  public hasAoi = false;
  public displayAoiForms = false;
  public displayFormatFrom = false;
  public displayProjectionFrom = false;
  public hasJpegFormat = false;

  public ids: string[] = []; // List of product id to process
  public collection = ''; // Name of the collection of products

  public tooltipDelay = 2000;

  public executionObservable!: Observable<number>;
  public statusSub!: Subscription;
  public unsubscribeStatus = new Subject<boolean>();
  public statusResult: ProcessOutput = null;


  public constructor(
    private processService: ProcessService,
    private dialog: MatDialogRef<AiasDownloadComponent>
  ) { }

  public ngOnInit(): void {
    if(this.nbProducts === 1){
      this.process = this.processService.getProcessDescription();
      this.formInputs = this.process.inputs;
      Object.keys(this.formInputs).forEach(inputKey => {
        if (this.itemDetail.has(inputKey) && this.itemDetail.get(inputKey)) {
          if(inputKey === 'target_format') {
            (<string[]>this.formInputs[inputKey].schema.enum).unshift('native');
            if(this.itemDetail.get(inputKey) === 'JPEG2000'){
              this.hasJpegFormat = true;
            } else if(this.itemDetail.get(inputKey) === 'Geotiff') {
              this.formInputs[inputKey].schema.enum =  (<string[]>this.formInputs[inputKey].schema.enum).filter(v => v !== 'geotiff');
            }
          }

          if(inputKey === 'target_projection') {
            this.formInputs[inputKey].schema.enum = (<Projection[]>this.formInputs[inputKey].schema.enum).filter(projection => {
              booleanContains(projection.bbox as unknown as Geometry, this.itemDetail.get(inputKey));
            });
            (<Projection[]>this.formInputs[inputKey].schema.enum).unshift({label:'native', value: 'native'} as unknown  as Projection);
          }
        }
        this.inputs.set(inputKey, this.formInputs[inputKey]);
      });
    }
    this.hasAoi = this.wktAoi !== undefined && this.wktAoi !== null;
    this._listenFormsChanges();
  }

  public ngOnDestroy(): void {
    if (!!this.statusSub) {
      this.statusSub.unsubscribe();
    }
  }

  private _listenFormsChanges(){
    this.formGroup.valueChanges.subscribe(s => console.error(s))
    this.formGroup.get('row_archive')
      .valueChanges
      .subscribe(checked => {
        this.displayAoiForms = !checked && this.hasAoi;
        this.displayFormatFrom = !checked && !this.hasJpegFormat &&  this.hasOneItemToDownload();
        this.displayProjectionFrom = !checked &&  this.hasOneItemToDownload();
        this.formGroup.get('crop_wkt').setValue(false);
    });

    this.formGroup.get('crop_wkt')
      .valueChanges
      .subscribe(checked => {
         this.displayFormatFrom = !this.downloadAllElements() &&
          !checked && !this.hasJpegFormat &&  this.hasOneItemToDownload();
        this.displayProjectionFrom =  !this.downloadAllElements() && !checked &&  this.hasOneItemToDownload();
      });
  }

  public hasOneItemToDownload():boolean{
    return this.nbProducts === 1;
  }

  public downloadAllElements():boolean {
    return this.formGroup.get('row_archive').value;
  }

  public submit() {
    this.isProcessing = true;
    this.isProcessStarted = true;
    this.hasError = false;
    const payload = this.formGroup.value;
    payload['crop_wkt'] = '';
    if(this.formGroup.get('crop_wkt') && this.hasAoi){
      payload['crop_wkt'] = this.wktAoi;
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
