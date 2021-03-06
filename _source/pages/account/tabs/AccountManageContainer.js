import { connect } from 'react-redux';

import { openModal } from '../../../_state/modal/actions';
import Component from './AccountManage';

const mapDispatchToProps = {
  openModal
};
const Container = connect(null, mapDispatchToProps)(Component);

export default Container;
