import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/index.scss';

/**
 * React component
 * 
 * @class Booky
 * @classdesc _base/Booky
 */
export default class Booky extends Component {
  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

Booky.propTypes = {
  'children': PropTypes.element
};
