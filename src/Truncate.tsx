import React, {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DEFAULT_ELLIPSIS,
  getTruncateStyle,
  measureTruncatedText,
  normalizeLines,
  supportsLineClamp,
} from './core/truncate';
import type { TruncateProps } from './types';

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

const assignRef = (
  forwardedRef: React.ForwardedRef<HTMLElement>,
  element: HTMLElement | null,
): void => {
  if (typeof forwardedRef === 'function') {
    forwardedRef(element);
  } else if (forwardedRef) {
    forwardedRef.current = element;
  }
};

export const Truncate = forwardRef<HTMLElement, TruncateProps>(
  (
    {
      as: Component = 'span',
      children,
      ellipsis,
      lines = 1,
      style,
      ...rest
    },
    forwardedRef,
  ) => {
    const elementRef = useRef<HTMLElement | null>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const ellipsisRef = useRef<HTMLSpanElement>(null);
    const [measuredText, setMeasuredText] = useState<string | null>(null);

    const validLines = normalizeLines(lines);
    const hasCustomEllipsis = ellipsis !== undefined;
    const needsMeasurement =
      hasCustomEllipsis ||
      (validLines > 1 && !supportsLineClamp());

    const setElementRef = useCallback(
      (element: HTMLElement | null) => {
        elementRef.current = element;
        assignRef(forwardedRef, element);
      },
      [forwardedRef],
    );

    const measure = useCallback(() => {
      const element = elementRef.current;
      const textElement = textRef.current;
      const ellipsisElement = ellipsisRef.current ?? undefined;

      if (
        !needsMeasurement ||
        !element ||
        !textElement ||
        (hasCustomEllipsis && !ellipsisElement)
      ) {
        setMeasuredText(null);
        return;
      }

      const nextText = measureTruncatedText({
        element,
        textElement,
        ellipsisElement,
        text: children,
        lines: validLines,
      });

      setMeasuredText((currentText) =>
        currentText === nextText ? currentText : nextText,
      );
    }, [children, hasCustomEllipsis, needsMeasurement, validLines]);

    useIsomorphicLayoutEffect(() => {
      measure();

      const element = elementRef.current;
      if (!element || !needsMeasurement) {
        return undefined;
      }

      let active = true;
      const handleResize = (): void => {
        if (active) {
          measure();
        }
      };

      const observer =
        typeof ResizeObserver === 'function'
          ? new ResizeObserver(handleResize)
          : undefined;

      if (observer) {
        observer.observe(element);
      } else {
        window.addEventListener('resize', handleResize);
      }

      document.fonts?.ready.then(handleResize).catch(() => undefined);

      return () => {
        active = false;
        observer?.disconnect();
        window.removeEventListener('resize', handleResize);
      };
    }, [ellipsis, measure, needsMeasurement]);

    const truncateStyle = useMemo(
      () => getTruncateStyle(validLines, hasCustomEllipsis, style),
      [hasCustomEllipsis, style, validLines],
    );

    const displayedText =
      !needsMeasurement || measuredText === null
        ? children
        : hasCustomEllipsis
          ? measuredText
          : `${measuredText}${DEFAULT_ELLIPSIS}`;

    return (
      <Component {...rest} ref={setElementRef} style={truncateStyle}>
        <span ref={textRef}>{displayedText}</span>
        {hasCustomEllipsis && (
          <span ref={ellipsisRef} hidden={measuredText === null}>
            {ellipsis}
          </span>
        )}
      </Component>
    );
  },
);

Truncate.displayName = 'Truncate';

export default Truncate;
