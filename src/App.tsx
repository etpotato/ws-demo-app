import React from 'react';

import { TradesContextProvider } from './hooks/Context';

import TopList from './components/TopList/TopList';
import ChartList from './components/ChartList/ChartList';
import Controls from './components/Controls/Controls';

export default function App() {
  return (
    <TradesContextProvider>
      <header className="mb-3 py-1 box">
        <div className="container">
          <TopList/>
        </div>
      </header>
      <main className="container">
        <h1 className="box p-3 mb-3 rounded text-shadow-secondary">Cryptocurrency trades</h1>
          <div className="row g-3">
            <section className="col col-lg-3">
              <div className="position-sticky top-1 box rounded p-3">
                <h2 className="pb-3 text-shadow-primary">Currencies list</h2>
                <Controls/>
              </div>
            </section>
            <section className="col col-lg-9">
              <h2 className="visually-hidden">Charts</h2>
              <ChartList/>
            </section>
          </div>
      </main>
      <footer className="box py-2">
        <div className="container text-center">
          <a className="text-shadow-secondary" href="mailto:mareev.pv@gmail.com">mareev.pv@gmail.com</a>
        </div>
      </footer>
    </TradesContextProvider>
  );
}
