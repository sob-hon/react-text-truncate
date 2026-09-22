import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Truncate from '../src/Truncate';

describe('Truncate', () => {
  it('renders a span by default with one-line truncation styles', () => {
    render(<Truncate data-testid="truncate">Long text</Truncate>);

    const element = screen.getByTestId('truncate');
    expect(element.tagName).toBe('SPAN');
    expect(element).toHaveTextContent('Long text');
    expect(element).toHaveStyle({
      display: 'block',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    });
  });

  it('supports a semantic element and native attributes', () => {
    render(
      <Truncate as="p" className="summary" data-testid="truncate">
        Summary
      </Truncate>,
    );

    const element = screen.getByTestId('truncate');
    expect(element.tagName).toBe('P');
    expect(element).toHaveClass('summary');
  });

  it('inherits writing direction and allows an explicit RTL direction', () => {
    render(
      <Truncate dir="rtl" lang="fa" data-testid="truncate">
        فروشگاه اینترنتی با یک نام طولانی
      </Truncate>,
    );

    const element = screen.getByTestId('truncate');
    expect(element).toHaveAttribute('dir', 'rtl');
    expect(element).toHaveAttribute('lang', 'fa');
  });

  it('applies multi-line CSS clamping', () => {
    render(
      <Truncate lines={3} data-testid="truncate">
        Long text
      </Truncate>,
    );

    const element = screen.getByTestId('truncate');
    expect(element.style.display).toBe('-webkit-box');
    expect(element.style.getPropertyValue('-webkit-line-clamp')).toBe('3');
  });

  it('forwards its element ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Truncate ref={ref}>Text</Truncate>);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
