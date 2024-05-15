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
  public displayForm = true;

  public constructor(
    private formBuilder: FormBuilder,
    private iamService: ArlasIamService
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
        this.validated = true;
        formDirective.resetForm();
        this.forgotForm.reset();
        this.displayForm  = false;
      },
      error: err => {
        // API respond with error (but the resquest is OK)
        this.validated = true;
      }
    });
  }

}
