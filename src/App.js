import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './reducers';
import Alert from './components/Alert';
import Main from './components/Main';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Switch>
                    <section className='container'>
                        <Alert />
                        <Route
                            exact
                            path='/'
                            component={Main}
                        />
                    </section>
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;
