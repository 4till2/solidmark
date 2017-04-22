import React, { PropTypes, Component } from 'react';
import Input from '../../atoms/input';
import './styles/m-search.scss';

/**
 * React component
 *
 * @class Search
 * @classdesc molecules/search/Search
 */
export default class Search extends Component {
  render() {
    const PROPS = this.props;
    const CLASS = 'm-search ' + PROPS.className;

    return (
      <div className={ CLASS }>
        <Input placeholder="Search booky..." focus={ PROPS.focus } />
      </div>
    );
  }
}

Search.propTypes = {
  'focus': PropTypes.bool,
  'className': PropTypes.string
};

Search.defaultProps = {
  'className': '',
  'focus': false
};
