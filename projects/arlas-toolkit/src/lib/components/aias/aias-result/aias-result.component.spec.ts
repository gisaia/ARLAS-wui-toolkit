import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AiasResultComponent } from './aias-result.component';

describe('AiasResultComponent', () => {
  let component: AiasResultComponent;
  let fixture: ComponentFixture<AiasResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AiasResultComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
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
