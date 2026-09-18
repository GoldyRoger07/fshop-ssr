import { splitDuration } from './countdown';

describe('splitDuration', () => {
  it('splits milliseconds into hours, minutes and seconds', () => {
    expect(splitDuration((5 * 3600 + 7 * 60 + 9) * 1000 + 999)).toEqual({ hours: 5, minutes: 7, seconds: 9 });
  });

  it('never returns negative values', () => {
    expect(splitDuration(-5000)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
  });
});
