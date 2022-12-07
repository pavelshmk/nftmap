import "reflect-metadata";
import "babel-polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import Application from './Application';
import './sass/main.scss';
import 'react-toastify/scss/main.scss';

import './i18n';

ReactDOM.render(
    <Application />,
    document.getElementById('wrapper')
);
