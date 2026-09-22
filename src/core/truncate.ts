import type { CSSProperties } from 'react';
import type { TruncationOptions } from '../types';

export const DEFAULT_ELLIPSIS = '…';

const LAYOUT_TOLERANCE = 0.5;

export const normalizeLines = (lines: number): number =>
  Number.isInteger(lines) && lines > 0 ? lines : 1;

export const supportsLineClamp = (): boolean =>
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  CSS.supports('-webkit-line-clamp', '1');

export const splitGraphemes = (text: string): string[] => {
  if (typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: 'grapheme',
    });

    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }

  return Array.from(text);
};

const findLongestFittingText = (
  text: string,
  fits: (candidate: string) => boolean,
): string => {
  const graphemes = splitGraphemes(text);
  let start = 0;
  let end = graphemes.length;
  let result = '';

  while (start <= end) {
    const middle = Math.floor((start + end) / 2);
    const candidate = graphemes.slice(0, middle).join('');

    if (fits(candidate)) {
      result = candidate;
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }

  return result;
};

const getLineHeight = (element: HTMLElement): number => {
  const computedStyle = window.getComputedStyle(element);
  const lineHeight = Number.parseFloat(computedStyle.lineHeight);

  if (Number.isFinite(lineHeight) && lineHeight > 0) {
    return lineHeight;
  }

  const fontSize = Number.parseFloat(computedStyle.fontSize);
  return Number.isFinite(fontSize) && fontSize > 0 ? fontSize * 1.2 : 19.2;
};

export const measureTruncatedText = ({
  element,
  textElement,
  ellipsisElement,
  text,
  lines,
}: TruncationOptions): string | null => {
  if (element.clientWidth <= 0) {
    return null;
  }

  const maxHeight = getLineHeight(element) * lines;
  const hasCustomEllipsis = ellipsisElement !== undefined;
  const originalText = textElement.textContent;
  const originalEllipsisHidden = ellipsisElement?.hidden;

  const isOverflowing = (): boolean =>
    lines === 1
      ? element.scrollWidth > element.clientWidth + LAYOUT_TOLERANCE
      : element.scrollHeight > maxHeight + LAYOUT_TOLERANCE;

  textElement.textContent = text;

  if (ellipsisElement) {
    ellipsisElement.hidden = true;
  }

  if (!isOverflowing()) {
    textElement.textContent = originalText;
    if (ellipsisElement && originalEllipsisHidden !== undefined) {
      ellipsisElement.hidden = originalEllipsisHidden;
    }
    return null;
  }

  if (ellipsisElement) {
    ellipsisElement.hidden = false;
  }

  try {
    return findLongestFittingText(text, (candidate) => {
      textElement.textContent = hasCustomEllipsis
        ? candidate
        : `${candidate}${DEFAULT_ELLIPSIS}`;

      return !isOverflowing();
    });
  } finally {
    textElement.textContent = originalText;
    if (ellipsisElement && originalEllipsisHidden !== undefined) {
      ellipsisElement.hidden = originalEllipsisHidden;
    }
  }
};

export const getTruncateStyle = (
  lines: number,
  hasCustomEllipsis: boolean,
  style?: CSSProperties,
): CSSProperties => {
  const baseStyle: CSSProperties = {
    display: 'block',
    overflow: 'hidden',
    minWidth: 0,
  };

  if (lines === 1) {
    return {
      ...baseStyle,
      whiteSpace: 'nowrap',
      textOverflow: hasCustomEllipsis ? 'clip' : 'ellipsis',
      ...style,
    };
  }

  if (!hasCustomEllipsis) {
    return {
      ...baseStyle,
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: lines,
      ...style,
    };
  }

  return {
    ...baseStyle,
    ...style,
  };
};
