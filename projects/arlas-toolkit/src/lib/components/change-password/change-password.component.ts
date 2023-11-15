import { Component, OnInit } from '@angular/core';
import { ConfirmedValidator } from '../../tools/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArlasIamService } from '../../services/arlas-iam/arlas-iam.service';

@Component({
  selector: 'arlas-tool-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public changeForm: FormGroup;
  public validated = false;

  public constructor(
    private formBuilder: FormBuilder,
    private iamService: ArlasIamService,
  ) { }

  public ngOnInit(): void {
    this.changeForm = this.formBuilder.group({
      old_password: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator('password', 'confirm_password')
    });
  }

  public submit(): void {
    this.validated = false;
    this.iamService.change(this.changeForm.get('old_password').value, this.changeForm.get('password').value).subscribe({
      next: () => {
        this.validated = true;
        this.changeForm.reset();
      },
      error: err => {
        this.changeForm.setErrors({
          wrong: true
        });
        console.error(err);
      }
    });
  }

}
