import React from 'react';
import ReactDOM from 'react-dom';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';
import App from './App';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';

init((sdk) => {
  ReactDOM.render(
    <React.StrictMode>
      <App sdk={sdk} />
    </React.StrictMode>,
    document.getElementById('root'),
  );
  (sdk as FieldExtensionSDK)?.window?.startAutoResizer();
});