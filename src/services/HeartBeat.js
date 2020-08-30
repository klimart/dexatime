import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateTask } from '../actions/task';

const HeartBeat = ({activeTaskId, inProgress, updateTask}) => {
    useEffect(() => {
        debugger;

        let interval = null;
        if (inProgress && activeTaskId) {
            interval = setInterval(() => {
                updateTask({
                    id: activeTaskId,
                    params: {}
                });
            }, 250);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [inProgress, activeTaskId]);

    return null;
};

HeartBeat.propTypes = {
    activeTaskId: PropTypes.number.isRequired,
    inProgress: PropTypes.bool.isRequired,
    updateTask: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    activeTaskId: parseInt(state.task.activeTaskId),
    inProgress: state.task.inProgress
});

export default connect(mapStateToProps, { updateTask })(HeartBeat);
