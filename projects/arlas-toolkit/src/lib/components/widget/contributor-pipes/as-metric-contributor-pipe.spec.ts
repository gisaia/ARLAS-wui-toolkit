import { describe, expect, it } from 'vitest';
import { AsMetricContributorPipe } from './as-metric-contributor-pipe';

describe('AsMetricContributorPipe', () => {
  it('create an instance', () => {
    const pipe = new AsMetricContributorPipe();
    expect(pipe).toBeTruthy();
  });
});
