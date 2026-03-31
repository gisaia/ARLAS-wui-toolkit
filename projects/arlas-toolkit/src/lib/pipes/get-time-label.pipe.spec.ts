import { describe, expect, it } from 'vitest';
import { GetTimeLabelPipe } from './get-time-label.pipe';

describe('GetTimeLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new GetTimeLabelPipe();
    expect(pipe).toBeTruthy();
  });
});
