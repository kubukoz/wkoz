import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

import './style/reset.css'
import './style/app.scss'

import 'font-awesome/css/font-awesome.css'
import 'bootstrap-css-only/css/bootstrap.css'


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
