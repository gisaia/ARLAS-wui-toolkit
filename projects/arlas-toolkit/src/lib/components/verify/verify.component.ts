import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';
import { ConfirmedValidator } from '../../tools/utils';

@Component({
  selector: 'arlas-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  public validateForm: FormGroup;
  public validated = false;

  public userId = null;
  public token = null;

  public constructor(
    private formBuilder: FormBuilder,
    private iamService: ArlasIamService,
    private route: ActivatedRoute,
  ) { }

  public ngOnInit(): void {
    this.validateForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator('password', 'confirm_password')
    });

    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      this.token = params.get('token');
    });
  }

  public onSubmit(formDirective: FormGroupDirective): void {
    this.validated = false;
    this.iamService.verify(this.userId, this.token, this.validateForm.get('password').value).subscribe({
      next: () => {
        formDirective.resetForm();
        this.validateForm.reset();
        this.validated = true;
      },
      error: err => {
        if( err.statusText === 'Not Found'){
          this.validateForm.setErrors({
            unknowUser: true
          });
        }
        if (err.statusText === 'Bad Request'){
          this.validateForm.setErrors({
            alreadyVerified: true
          });
        }
      }
    });
  }
}
