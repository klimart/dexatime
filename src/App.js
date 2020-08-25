import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './reducers';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskTable from './components/TaskTable';
import ClientForm from './components/ClientForm';

import { loadTasks } from './actions/task';

const App = () => {
    useEffect(() => {
        store.dispatch(loadTasks());
    }, []);

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
                                    component={TaskTable}
                                />
                                <Route
                                    exact
                                    path='/job'
                                    component={TaskTable}
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
