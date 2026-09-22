import type { HTMLAttributes, ReactNode } from 'react';

export type TruncateElement = 'span' | 'p' | 'div';

export interface TruncateProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * The semantic HTML element rendered for the text container.
   * @default 'span'
   */
  as?: TruncateElement;
  /**
   * Plain text to display. React elements are intentionally not accepted because
   * the measurement fallback truncates the underlying string safely.
   */
  children: string;
  /**
   * Maximum number of visible lines. Non-positive and fractional values fall
   * back to one line.
   * @default 1
   */
  lines?: number;
  /**
   * Custom content rendered at the truncation point. Supplying this enables the
   * DOM-measurement path so enough space is reserved for the custom content.
   * Omit it to use the browser's native ellipsis whenever possible.
   */
  ellipsis?: ReactNode;
}

export interface TruncationOptions {
  element: HTMLElement;
  textElement: HTMLSpanElement;
  ellipsisElement?: HTMLSpanElement;
  text: string;
  lines: number;
}
