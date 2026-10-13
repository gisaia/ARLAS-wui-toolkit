import { Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetTimeLabelPipe } from './get-time-label.pipe';

describe('GetTimeLabelPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader } })
      ],
    });
  });

  it('create an instance', () => {
    runInInjectionContext(TestBed.inject(Injector), () => {
      const pipe = new GetTimeLabelPipe();
      expect(pipe).toBeTruthy();
    });
  });
});
