import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { AwcColorGeneratorLoader, ColorGeneratorLoader, ColorGeneratorModule } from 'arlas-web-components';
import { beforeEach, describe, expect, it } from 'vitest';
import { TEST_CONTRIBUTOR_ID } from '../../../tests/arlas-config-service.mock';
import { MockArlasStartupService } from '../../../tests/arlas-startup-service.mock';
import { ArlasCollaborativesearchService } from '../../services/collaborative-search/arlas.collaborative-search.service';
import { ArlasCollectionService } from '../../services/collection/arlas-collection.service';
import { ArlasConfigurationUpdaterService } from '../../services/configuration-updater/configurationUpdater.service';
import { ArlasOverlayService } from '../../services/overlays/overlay.service';
import {
  ArlasConfigService,
  ArlasStartupService,
  CONFIG_UPDATER,
  FETCH_OPTIONS
} from '../../services/startup/startup.service';
import { GET_OPTIONS } from '../../tools/utils';
import { WidgetComponent } from './widget.component';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader }
        }),
        WidgetComponent,
        ColorGeneratorModule.forRoot({
          loader: {
            provide: ColorGeneratorLoader,
            useClass: AwcColorGeneratorLoader
          }
        }),
      ],
      providers: [
        ArlasCollaborativesearchService,
        ArlasConfigService,
        {
          provide: ArlasStartupService,
          useClass: MockArlasStartupService
        },
        ArlasOverlayService,
        { provide: CONFIG_UPDATER, useValue: {} },
        ArlasConfigurationUpdaterService,
        { provide: FETCH_OPTIONS, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        ArlasCollectionService,
        { provide: GET_OPTIONS, useValue: () => { } },
        OAuthService,
        OAuthLogger,
        DateTimeProvider,
        UrlHelperService,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('componentType', 'donut');
    fixture.componentRef.setInput('contributorId', TEST_CONTRIBUTOR_ID);
    fixture.componentRef.setInput('componentParams', {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
