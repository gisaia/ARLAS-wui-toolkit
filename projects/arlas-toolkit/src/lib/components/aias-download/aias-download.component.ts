import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProcessService } from '../../services/process/process.service';
import { ProcessInputs, ProcessOutput, ProcessProjection, ProcessStatus } from '../../tools/process.interface';
import { Subject, Subscription, takeUntil, timer } from 'rxjs';
import { AiasDownloadDialogData } from '../../tools/aias-download.interface';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import bboxPolygon from '@turf/bbox-polygon';
import booleanIntersects from '@turf/boolean-intersects';

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
    raw_archive: new FormControl<boolean>(true),
    crop_wkt: new FormControl<boolean | string>(false),
    target_projection: new FormControl<string>(marker('native')),
    target_format: new FormControl<string>('native')
  });

  public pictureFormats= [
    marker('native'),
    'Geotiff',
    'JPEG2000'
  ];
  public projections: ProcessProjection[] = [];


  public isProcessing = false;
  public processStarted = false;
  public hasError = false;
  public hasAoi = false;
  public displayAoiForms = false;
  public displayFormatFrom = false;
  public displayProjectionFrom = false;

  public tooltipDelay = 2000;

  public statusSub!: Subscription;
  public unsubscribeStatus = new Subject<boolean>();
  public statusResult: ProcessOutput = null;

  private _onDestroy$ = new Subject();

  public constructor(
    private processService: ProcessService,
    @Inject(MAT_DIALOG_DATA) protected data: AiasDownloadDialogData
  ) {
  }

  public ngOnInit(): void {
    if(this.data.nbProducts === 1){
      const processConfigFileInput= this.processService.getProcessinputs();
      this._initPictureFormatList();
      this._initProjectionList(processConfigFileInput);
    }
    this.hasAoi = this.data.wktAoi !== undefined && this.data.wktAoi !== null;
    this._listenFormsChanges();
  }

  public ngOnDestroy(): void {
    if (!!this.statusSub) {
      this.statusSub.unsubscribe();
    }
    this._onDestroy$.next(true);
    this._onDestroy$.complete();
  }

  private _initPictureFormatList(): void{
    const inputKey = 'properties.main_asset_format';
    if (this.data.itemDetail && this.data.itemDetail.has(inputKey)) {
      if (this.data.itemDetail.get(inputKey) === 'JPEG2000') {
        this.pictureFormats = ['JPEG2000'];
        this.formGroup.get('target_format').setValue('JPEG2000');
      } else if (this.data.itemDetail.get(inputKey).toLowerCase() === 'geotiff') {
        this.pictureFormats = this.pictureFormats.filter(format => format !== 'Geotiff');
      }
    }
  }

  private _initProjectionList(projection: ProcessInputs): void {
    const inputKey = 'target_projection';
    if (projection[inputKey]) {
      this.projections = (<ProcessProjection[]>projection[inputKey].schema.enum).filter(projection => {
        const geoJson = this.data.itemDetail.get('geometry');
        if(!projection.bbox || !geoJson) {
          return false;
        }
        const feature1 = bboxPolygon(projection.bbox);
        return booleanIntersects(feature1, geoJson);
      });
    }
    const native: ProcessProjection = {bbox: undefined, label: 'native', value: marker('native')};
    this.projections.unshift(native);
  }

  private _listenFormsChanges(): void{
    this.formGroup.get('raw_archive')
      .valueChanges
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(checked => {
        this.displayAoiForms = !checked && this.hasAoi;
        this.displayFormatFrom = !checked &&  this.hasOneItemToDownload();
        this.displayProjectionFrom = !checked &&  this.hasOneItemToDownload();
        this.formGroup.get('crop_wkt').setValue(false);
        if(checked){
          this.formGroup.get('target_format').setValue('native');
          this.formGroup.get('target_projection').setValue('native');
        }
      });

    this.formGroup.get('crop_wkt')
      .valueChanges
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(checked => {
        this.displayFormatFrom = !this.downloadAllElements() &&  this.hasOneItemToDownload();
        this.displayProjectionFrom =  !this.downloadAllElements() && !checked &&  this.hasOneItemToDownload();
        if(checked){
          this.formGroup.get('target_projection').setValue('native');
        }
      });
  }

  public hasOneItemToDownload(): boolean{
    return this.data.nbProducts === 1;
  }

  public downloadAllElements(): boolean {
    return this.formGroup.get('raw_archive').value;
  }

  public submit(): void {
    this.isProcessing = true;
    this.processStarted = true;
    this.hasError = false;
    const payload = this.formGroup.value;
    payload['crop_wkt'] = '';
    if(this.formGroup.get('crop_wkt') && this.hasAoi){
      payload['crop_wkt'] = this.data.wktAoi;
    }

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
