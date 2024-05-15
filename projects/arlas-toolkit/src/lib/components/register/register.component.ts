import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';

@Component({
  selector: 'arlas-tool-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public signUpForm: FormGroup;
  public validated = false;
  public displayForm = true;

  public constructor(
    private formBuilder: FormBuilder,
    private iamService: ArlasIamService,
  ) { }

  public ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    });
  }

  public onSubmit(formDirective: FormGroupDirective) {
    this.validated = false;
    this.iamService.signUp(this.signUpForm.get('email').value).subscribe({
      next: () => {
        formDirective.resetForm();
        this.signUpForm.reset();
        this.displayForm = false;
        this.validated = true;
      },
      error: err => {
        this.displayForm = false;
        this.signUpForm.setErrors({
          alreadyExist: true
        });
      }
    });
  }

}
