import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProcessService } from '../../services/process/process.service';
import { ProcessInput, Process, ProcessInputs } from '../../tools/process.interface';



@Component({
  selector: 'arlas-tool-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class ProcessComponent implements OnInit {

  public formGroup: FormGroup = new FormGroup({});
  public controlsName: string[] = [];
  public inputs: ProcessInput[] = [];
  public process: Process = {};
  public formInputs: ProcessInputs = {};
  public nbProducts = 0;
  public matchingAdditionalParams = new Map<string, boolean>();
  public wktAoi = '';

  public tooltipDelay = 2000;

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

  public submit() {
    this.dialog.close({ payload: this.formGroup.value });
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
