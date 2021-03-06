import { connect } from 'react-redux';
import Component from './Icon';

export const mapStateToProps = (state) => ({
  darkMode: state.user.settings.darkMode
});

const Container = connect(mapStateToProps)(Component);

export default Container;
