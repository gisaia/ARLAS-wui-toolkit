import { describe, expect, it } from 'vitest';
import { CollectionChipColorPipe } from './collection-chip-color-pipe';

describe('CollectionChipColorPipe', () => {
  it('create an instance', () => {
    const pipe = new CollectionChipColorPipe();
    expect(pipe).toBeTruthy();
  });
});
