import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiasResultComponent } from './aias-result.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

describe('AiasResultComponent', () => {
  let component: AiasResultComponent;
  let fixture: ComponentFixture<AiasResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        AiasResultComponent,
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(AiasResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
