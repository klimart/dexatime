import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MU_Alert from '@material-ui/lab/Alert';

/**
 * Alert types error, warning, info, success - match Material UI alert types.
 */
const Alert = ({ alerts }) => (
    <div className={alerts && alerts.length > 0  ? 'alerts-block has-alert' : 'alerts-block'}>
        {alerts &&
        alerts.length > 0 &&
        alerts.map(alert => (
            <div key={alert.id}
                className={`alert alert-${alert.alertType}`}>
                <MU_Alert severity={alert.alertType}>{alert.msg}</MU_Alert>
            </div>
        ))}
    </div>
);

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
