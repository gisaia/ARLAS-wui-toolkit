import { describe, expect, it } from 'vitest';
import { AsTreeContributorPipe } from './as-tree-contributor-pipe';

describe('AsTreeContributorPipe', () => {
  it('create an instance', () => {
    const pipe = new AsTreeContributorPipe();
    expect(pipe).toBeTruthy();
  });
});
