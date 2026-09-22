import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_ELLIPSIS,
  getTruncateStyle,
  measureTruncatedText,
  normalizeLines,
  splitGraphemes,
} from '../src/core/truncate';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('normalizeLines', () => {
  it.each([0, -1, 1.5, Number.NaN])(
    'falls back to one line for %s',
    (value) => {
      expect(normalizeLines(value)).toBe(1);
    },
  );

  it('keeps a positive integer', () => {
    expect(normalizeLines(3)).toBe(3);
  });
});

describe('splitGraphemes', () => {
  it('keeps an emoji family together', () => {
    expect(splitGraphemes('A👨‍👩‍👧‍👦B')).toEqual([
      'A',
      '👨‍👩‍👧‍👦',
      'B',
    ]);
  });
});

describe('getTruncateStyle', () => {
  it('uses native ellipsis for one line', () => {
    expect(getTruncateStyle(1, false)).toMatchObject({
      display: 'block',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    });
  });

  it('uses line clamp for multiple lines', () => {
    expect(getTruncateStyle(3, false)).toMatchObject({
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 3,
    });
  });

  it('lets consumer styles override defaults', () => {
    expect(getTruncateStyle(1, false, { display: 'inline-block' })).toMatchObject(
      {
        display: 'inline-block',
      },
    );
  });
});

describe('measureTruncatedText', () => {
  const createFixture = (customEllipsis = false) => {
    const element = document.createElement('span');
    const textElement = document.createElement('span');
    const ellipsisElement = customEllipsis
      ? document.createElement('span')
      : undefined;

    element.append(textElement);
    if (ellipsisElement) {
      ellipsisElement.textContent = DEFAULT_ELLIPSIS;
      ellipsisElement.hidden = true;
      element.append(ellipsisElement);
    }

    Object.defineProperty(element, 'clientWidth', {
      configurable: true,
      value: 60,
    });
    Object.defineProperty(element, 'scrollWidth', {
      configurable: true,
      get: () =>
        (textElement.textContent?.length ?? 0) * 10 +
        (ellipsisElement && !ellipsisElement.hidden ? 20 : 0),
    });

    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      lineHeight: 'normal',
      fontSize: '20px',
    } as CSSStyleDeclaration);

    return { element, textElement, ellipsisElement };
  };

  it('returns null when the text fits', () => {
    const fixture = createFixture();

    expect(
      measureTruncatedText({
        ...fixture,
        text: 'short',
        lines: 1,
      }),
    ).toBeNull();
  });

  it('reserves room for the default ellipsis', () => {
    const fixture = createFixture();

    expect(
      measureTruncatedText({
        ...fixture,
        text: 'abcdefghij',
        lines: 1,
      }),
    ).toBe('abcde');
  });

  it('reserves room for a custom ellipsis', () => {
    const fixture = createFixture(true);

    expect(
      measureTruncatedText({
        ...fixture,
        text: 'abcdefghij',
        lines: 1,
      }),
    ).toBe('abcd');
  });
});
