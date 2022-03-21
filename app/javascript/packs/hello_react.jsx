// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from './MainPage'
import DashboardPage from './DashboardPage';
import 'antd/dist/antd.css';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Router>
      <Routes>
        <Route exact path="/" element={<MainPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
    </Routes>
    </Router>,
    document.body.appendChild(document.createElement('div')),
  )
})
