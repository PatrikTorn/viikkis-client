import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import ScreenContainer from './containers/ScreenContainer'
import {Provider} from 'react-redux';
import store from './store';
import * as serviceWorker from './serviceWorker';
import 'react-toastify/dist/ReactToastify.css';
import './bootstrap.css';
import './index.css';

ReactDOM.render(<Provider store={store}><ScreenContainer /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
