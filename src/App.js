import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@Client/reducers';
import Alert from '@Client/components/Alert';
import Header from '@Client/components/Header';
import Sidebar from '@Client/components/Sidebar';
import TaskTable from '@Client/components/TaskTable';
import ClientForm from '@Client/components/ClientForm';
import { loadTasksPartList } from '@Client/actions/task';

const App = () => {
    useEffect(() => {
        store.dispatch(loadTasksPartList());
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
                                    component={props => <TaskTable {...props} />}
                                />
                                <Route
                                    exact
                                    path='/job'
                                    component={props => <TaskTable {...props} />}
                                />
                                <Route
                                    exact
                                    path='/client'
                                    component={props => <ClientForm {...props} />}
                                />
                            </Switch>
                        </div>
                    </div>
                    <Alert />
                </div>
            </Router>
        </Provider>
    );
};

export default App;
