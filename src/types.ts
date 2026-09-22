import type { HTMLAttributes, ReactNode } from 'react';

export type TruncateElement = 'span' | 'p' | 'div';

export interface TruncateProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The HTML element rendered by the component. */
  as?: TruncateElement;
  /** Plain text to truncate. */
  children: string;
  /** Maximum number of visible lines. Invalid values fall back to one line. */
  lines?: number;
  /** Content appended only when JavaScript truncation is required. */
  ellipsis?: ReactNode;
}

export interface TruncationOptions {
  element: HTMLElement;
  textElement: HTMLSpanElement;
  ellipsisElement?: HTMLSpanElement;
  text: string;
  lines: number;
}
