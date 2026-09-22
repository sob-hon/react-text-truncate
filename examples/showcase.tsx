import React from 'react';
import { createRoot } from 'react-dom/client';
import Truncate from '../src';

const english =
  'A lightweight component that keeps long texts tidy at every container width.';
const persian =
  'یک کامپوننت سبک که متن‌های طولانی را در هر عرضی مرتب و خوانا نگه می‌دارد.';

const LanguageLabel = ({ children }: { children: string }): JSX.Element => (
  <span className="languageLabel">{children}</span>
);

function Demo(): JSX.Element {
  return (
    <main>
      <header>
        <span className="eyebrow">REACT COMPONENT · کامپوننت ری‌اکت</span>
        <h1>Text truncation that fits real layouts.</h1>
        <p>CSS-first · responsive · RTL-ready · custom ellipsis</p>
      </header>

      <section className="grid">
        <article className="card">
          <span className="label">ONE LINE · یک خط</span>
          <div className="languageRow">
            <LanguageLabel>EN</LanguageLabel>
            <Truncate className="sample">{english}</Truncate>
          </div>
          <div className="languageRow" dir="rtl" lang="fa">
            <LanguageLabel>FA</LanguageLabel>
            <Truncate className="sample">{persian}</Truncate>
          </div>
          <code>lines=1</code>
        </article>

        <article className="card">
          <span className="label">MULTILINE · چند خط</span>
          <div className="languageRow alignStart">
            <LanguageLabel>EN</LanguageLabel>
            <Truncate lines={2} className="sample multiline">
              {`${english} ${english}`}
            </Truncate>
          </div>
          <div className="languageRow alignStart" dir="rtl" lang="fa">
            <LanguageLabel>FA</LanguageLabel>
            <Truncate lines={2} className="sample multiline">
              {`${persian} ${persian}`}
            </Truncate>
          </div>
          <code>lines=2</code>
        </article>

        <article className="card">
          <span className="label">FLEX ROW · ردیف فلکس</span>
          <div className="languageRow">
            <LanguageLabel>EN</LanguageLabel>
            <div className="row">
              <Truncate className="sample flexText">{english}</Truncate>
              <span className="badge">20% off</span>
            </div>
          </div>
          <div className="languageRow" dir="rtl" lang="fa">
            <LanguageLabel>FA</LanguageLabel>
            <div className="row">
              <Truncate className="sample flexText">{persian}</Truncate>
              <span className="badge">۲۰٪ تخفیف</span>
            </div>
          </div>
          <code>min-width: 0</code>
        </article>

        <article className="card">
          <span className="label">CUSTOM ELLIPSIS · ادامه مطلب</span>
          <div className="languageRow alignStart">
            <LanguageLabel>EN</LanguageLabel>
            <Truncate
              lines={2}
              className="sample multiline customSample"
              ellipsis={<button type="button">… Show more</button>}
            >
              {`${english} ${english}`}
            </Truncate>
          </div>
          <div className="languageRow alignStart" dir="rtl" lang="fa">
            <LanguageLabel>FA</LanguageLabel>
            <Truncate
              lines={2}
              className="sample multiline customSample"
              ellipsis={<button type="button">… بیشتر</button>}
            >
              {`${persian} ${persian}`}
            </Truncate>
          </div>
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
