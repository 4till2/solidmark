import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import P from '../../paragraph';
import Illustration from '../../illustration';

export default class SuccessIllustration extends Component {
  static propTypes = {
    message: PropTypes.string,
    className: PropTypes.string,
    illustration: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    children: PropTypes.node
  };

  state = {
    animate: false
  };

  componentDidMount() {
    window.setTimeout(this.animate, 100);
  }

  static defaultTypes = {
    width: '300',
    height: '300'
  };

  animate = () => {
    this.setState({
      animate: true
    });
  };

  render() {
    const {
      message,
      illustration,
      width,
      height,
      className,
      children
    } = this.props;
    const { animate } = this.state;

    return (
      <div
        role="alert"
        className={classNames('success-illustration', className)}
      >
        <Illustration
          name={illustration}
          width={width}
          height={height}
          className={classNames(
            'success-illustration__image',
            animate && 'success-illustration__image--animate'
          )}
        />
        <P
          className={classNames(
            'success-illustration__text',
            animate && 'success-illustration__text--animate'
          )}
        >
          {message ? <FormattedMessage id={message} /> : children}
        </P>
      </div>
    );
  }
}
