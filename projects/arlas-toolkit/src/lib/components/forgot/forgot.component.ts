import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';

@Component({
  selector: 'arlas-tool-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  public forgotForm: FormGroup;
  public validated = false;

  public constructor(
    private formBuilder: FormBuilder,
    private iamService: ArlasIamService,
  ) { }

  public ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    });
  }

  public onSubmit(formDirective: FormGroupDirective) {
    this.validated = false;
    this.iamService.forgot(this.forgotForm.get('email').value).subscribe({
      next: () => {
        formDirective.resetForm();
        this.forgotForm.reset();
        this.validated = true;
      },
      error: err => {
        this.forgotForm.setErrors({
          notExist: true
        });
      }
    });
  }

}
