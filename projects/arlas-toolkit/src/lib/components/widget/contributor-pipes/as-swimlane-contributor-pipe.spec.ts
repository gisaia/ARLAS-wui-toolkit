import { describe, expect, it } from 'vitest';
import { AsSwimlaneContributorPipe } from './as-swimlane-contributor-pipe';

describe('AsSwimlaneContributorPipe', () => {
  it('create an instance', () => {
    const pipe = new AsSwimlaneContributorPipe();
    expect(pipe).toBeTruthy();
  });
});
