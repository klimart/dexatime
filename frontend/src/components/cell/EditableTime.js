import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Editable from '@Client/components/cell/Editable';
import { setAlert } from '@Client/actions/alert';
import { convertTimeToSeconds } from '@Client/utils/timeFormatter';

const EditableTime = (props) => {
    const inputRef = useRef();
    const [inputWidth, setInputWidth] = useState('');

    let {
        inputTime,
        setNewTimeValue,
        name = '',
        setAlert,
        inProgress
    } = props;
    const [currentValue, setCurrentValue] = useState(inputTime);

    let buttonTabCode = 9,
        buttonEnterCode = 13,
        buttonCtrl = 17,
        buttonBackspaceCode = 8,
        buttonDeleteCode = 46,
        buttonHomeCode = 36,
        buttonEndCode = 35,
        buttonShiftCode = 16,
        arrowLeft = 37,
        arrowRight = 39,
        arrowUp = 38,
        arrowDown = 40,
        pageUp = 33,
        pageDown = 34,
        defaultMask = '00:00:00',
        defaultDigit = 0,
        delimiterSymbol = ':',
        currentInputValue,
        lastPosition,
        navKeyCodes = [
            arrowLeft, arrowRight, arrowUp, arrowDown,
            buttonTabCode, buttonEnterCode, buttonHomeCode, buttonEndCode,
            pageUp, pageDown, buttonShiftCode, buttonCtrl
        ];

    const formatValueMatchMask = (value) => {
        let maskDigitsNum = defaultMask.match(/\d/g).length;
        let valueDigitsNum = value.match(/\d/g).length;
        let delta = maskDigitsNum - valueDigitsNum;

        return delta > 0 ? `${defaultDigit}`.repeat(delta) + value : value;
    };

    const isNumeric = (value) => {
        let checkNumber = new RegExp("\\d");
        return checkNumber.test(value);
    };

    const displayCurrentValue = function () {
        inputRef.current.value = currentInputValue;
    };

    const processInputValue = (event) => {
        let element = inputRef.current;
        let value = element.value;
        let savedValue = value;
        let savedPosition = lastPosition;

        var isRangeSelection = false;
        if (element.selectionStart !== element.selectionEnd) {
            isRangeSelection = true;
        }

        let prevSymbol = value.substring(lastPosition - 1, lastPosition);
        let nextSymbol = value.substring(lastPosition, lastPosition + 1);
        let nextSymbolPos = lastPosition + 1;
        if (!isNumberInput(event) && event.key === nextSymbol) {
            lastPosition++;
        }

        let afterNextSymbol = parseInt(value.substring(lastPosition + 1, lastPosition + 2));
        let afterNextSymbolPos = lastPosition + 2;

        let newSymbol = parseInt(event.key);

        switch (true) {
            case event.keyCode === buttonDeleteCode:
                value = isNaN(nextSymbol)
                    ? value
                    : value.substring(0, lastPosition) + `${defaultDigit}` + value.substring(lastPosition + 1);
                break;

            case event.keyCode === buttonBackspaceCode:
                value = !prevSymbol.length || isNaN(prevSymbol) || lastPosition <= 0
                    ? value
                    : value.substring(0, lastPosition - 1) + `${defaultDigit}` + value.substring(lastPosition);

                lastPosition = lastPosition > 0 ? lastPosition - 1 : lastPosition;
                break;

            case event.key === delimiterSymbol && nextSymbol === delimiterSymbol:
                break;

            case Number.isNaN(newSymbol):
                setAlert(`Not allowed symbol "${event.key}". Please use numbers.`, 'warning', 2500);
                break;

            case isRangeSelection:
                let replacementFromMask = defaultMask.substring(element.selectionStart, element.selectionEnd);
                if (isNumeric(newSymbol)) {
                    value = value.substring(0, element.selectionStart)
                        + newSymbol
                        + replacementFromMask.substr(1)
                        + value.substring(element.selectionEnd);
                    lastPosition++;
                } else {
                    value = value.substring(0, element.selectionStart)
                        + replacementFromMask
                        + value.substring(element.selectionEnd);
                }

                break;

            case isNumeric(nextSymbol):
                value = value.substring(0, lastPosition) + newSymbol + value.substring(lastPosition + 1);
                lastPosition = nextSymbolPos;
                break;

            case isNumeric(afterNextSymbol):
                value = value.substring(0, afterNextSymbolPos - 1) + newSymbol + value.substring(afterNextSymbolPos);
                lastPosition = afterNextSymbolPos;
                break;
        }

        if (!validateNewValue(value)) {
            currentInputValue = savedValue;
            lastPosition = savedPosition;
            return;
        }

        currentInputValue = value;
    };

    // Limitation for seconds and minutes to be not more than 59
    const validateNewValue = (val) => {
        let valueParts = val.split(delimiterSymbol);

        let minutes = parseInt(valueParts[1]);
        if (minutes > 59) {
            setAlert(`${minutes} minutes - incorrect value. Maximum is 59`, 'warning', 2500);
            return false;
        }

        let seconds = parseInt(valueParts[2]);
        if (seconds > 59) {
            setAlert(`${seconds} seconds - incorrect value. Maximum is 59`, 'warning', 2500);
            return false;
        }

        return true;
    };

     /**
     * Save current cursor position in input.
     *
     * @param {HTMLElement} elem
     * @param {Event} event
     */
    const saveCurrentPosition = function (event) {
        let elem = inputRef.current;
        var position = event.target.selectionStart || elem.selectionStart;
        if (isNumeric(position)) {
            lastPosition = position;
        }
    };

    const isNumberInput = function (event) {
        let char = parseInt(event.key);

        return !isNaN(char) && char >= 0 && char <= 9;
    };

    const valueChangeInput = (event) => {
        return navKeyCodes.indexOf(event.keyCode) === -1;
    };

    const setCursorPosition = function (event) {
        let elem = inputRef.current;
        if (!event || ['keydown', 'click'].indexOf(event.type) === -1) {
            return;
        }

        /* Process arrow keys. */
        if (navKeyCodes.indexOf(event.keyCode) !== -1) {
            return;
        }

        /* Set cursor to calculated position */
        elem.setSelectionRange(lastPosition, lastPosition);
    };

    /** Input enter start point */
    const handleTimeInput = (event) => {
        if (valueChangeInput(event)) {
            event.preventDefault();
        } else {
            return;
        }

        saveCurrentPosition(event);
        let element = inputRef.current;

        /* Range selection case */
        if (event.type === 'click' && element.selectionStart !== element.selectionEnd) {
            return;
        }

        processInputValue(event);
        displayCurrentValue();
        setCursorPosition(event);
    };

    // Convert current time to seconds and save.
    const handleFocusOut = (event) => {
        let secondsValue = convertTimeToSeconds(event.target.value);
        setNewTimeValue(secondsValue);
    };

    return (
        <Editable
            text={inputTime}
            placeholder={inputTime}
            childRef={inputRef}
            type='input'
            setInputWidth={setInputWidth}
            isEditable={!inProgress}>
            <input
                ref={inputRef}
                type='text'
                name={name}
                className=''
                placeholder={currentValue}
                value={formatValueMatchMask(currentValue)}
                onKeyDown={handleTimeInput}
                onChange={e => {}}
                onFocusCapture={e => {setCurrentValue(inputTime)}}
                onBlur={handleFocusOut}
                style={{maxWidth: inputWidth ? inputWidth : 'auto', boxSizing: 'border-box', width: '100%'}}
            />
        </Editable>
    );
};

EditableTime.propTypes = {
    setAlert: PropTypes.func.isRequired,
    value: PropTypes.string,
    setNewTimeValue: PropTypes.func,
    name: PropTypes.string,
    inProgress: PropTypes.bool.isRequired
};

export default connect(null, {setAlert})(EditableTime);
