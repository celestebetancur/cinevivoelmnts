import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { createBrowserHistory } from 'history'


export const history = createBrowserHistory({
    basename: process.env.PUBLIC_URL
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
