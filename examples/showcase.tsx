import React from 'react';
import { createRoot } from 'react-dom/client';
import Truncate from '../src';

const english =
  'A lightweight component that keeps long product names tidy at every container width.';
const persian =
  'فروشگاه اینترنتی با یک عنوان طولانی برای نمایش رفتار صحیح برش متن در رابط راست به چپ';

function Demo(): JSX.Element {
  return (
    <main>
      <header>
        <span className="eyebrow">REACT COMPONENT</span>
        <h1>Text truncation that fits real layouts.</h1>
        <p>CSS-first · responsive · RTL-ready · custom ellipsis</p>
      </header>

      <section className="grid">
        <article className="card">
          <span className="label">ONE LINE</span>
          <Truncate className="sample">{english}</Truncate>
          <code>lines=1</code>
        </article>

        <article className="card">
          <span className="label">MULTILINE</span>
          <Truncate lines={2} className="sample multiline">
            {english}
          </Truncate>
          <code>lines=2</code>
        </article>

        <article className="card" dir="rtl" lang="fa">
          <span className="label">RTL / فارسی</span>
          <Truncate lines={2} className="sample multiline">
            {persian}
          </Truncate>
          <code>dir="rtl"</code>
        </article>

        <article className="card">
          <span className="label">FLEX ROW</span>
          <div className="row">
            <Truncate className="sample flexText">{english}</Truncate>
            <span className="badge">20% off</span>
          </div>
          <code>min-width: 0</code>
        </article>

        <article className="card wide">
          <span className="label">CUSTOM ELLIPSIS</span>
          <Truncate
            lines={2}
            className="sample multiline customSample"
            ellipsis={<button type="button">… Show more</button>}
          >
            {`${english} ${english}`}
          </Truncate>
          <code>ellipsis={'{<button />}'}</code>
        </article>
      </section>
    </main>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<Demo />);
}
