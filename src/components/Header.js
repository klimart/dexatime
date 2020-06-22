import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addTask } from '../actions/task';

const Header = ({addTask}) => {
    return (
        <div className="header">
            <button onClick={addTask}>Add Task</button>
        </div>
    );
};

Header.propTypes = {
    addTask: PropTypes.func.isRequired
}

export default connect(null, { addTask })(Header);
