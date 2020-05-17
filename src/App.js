import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './reducers';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import ClientForm from './components/ClientForm';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <div className="main">
                    <Header />
                    <div className="main columns">
                        <Sidebar />
                        <div className="column content">
                            <Switch>
                                <Route
                                    path='/'
                                    component={TaskList}
                                />
                                <Route
                                    exact
                                    path='/job'
                                    component={TaskList}
                                />
                                <Route
                                    exact
                                    path='/client'
                                    component={ClientForm}
                                />
                            </Switch>
                        </div>
                    </div>
                </div>
            </Router>
        </Provider>
    );
};

export default App;
