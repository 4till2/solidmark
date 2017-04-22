import React, { PropTypes, Component } from 'react';
import './styles/a-checkbox.scss';

/**
 * React component
 * 
 * @class Checkbox
 * @classdesc atoms/checkbox/Checkbox
 */
export default class Checkbox extends Component {
  render() {
    const PROPS = this.props;
    const CLASS = 'a-checkbox ' + PROPS.className;
    const BOX_CLASS = PROPS.checked ? 'a-checkbox__icon a-checkbox__icon--checked' : 'a-checkbox__icon';

    return (
      <div className={ CLASS } onClick={ PROPS.onCheckboxClick } >
        <span className="a-checkbox__box">
          <svg className={ BOX_CLASS }>
            <use xlinkHref="images/symbol-defs.svg#icon-check" />
          </svg>
        </span>
        <label className="a-checkbox__label">{ PROPS.label }</label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  'checked': PropTypes.bool.isRequired,
  'label': PropTypes.string,
  'className': PropTypes.string,
  'onCheckboxClick': PropTypes.func.isRequired
};

Checkbox.defaultProps = {
  'label': '',
  'className': ''
};
