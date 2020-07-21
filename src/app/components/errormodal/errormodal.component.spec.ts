import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrormodalComponent } from './errormodal.component';
import { ArlasCollaborativesearchService, ArlasConfigService, ArlasStartupService } from '../../services/startup/startup.service';
import { MatDialogModule } from '@angular/material';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';

describe('ErrormodalComponent', () => {
  let component: ErrormodalComponent;
  let fixture: ComponentFixture<ErrormodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrormodalComponent],
      providers: [ArlasCollaborativesearchService, ArlasConfigService,
        {
          provide: ArlasStartupService,
          useClass: ArlasStartupService,
          deps: [ArlasConfigurationUpdaterService]
        },
        {
          provide: ArlasConfigurationUpdaterService,
          useClass: ArlasConfigurationUpdaterService
        }
      ],
      imports: [MatDialogModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrormodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
