import { Component } from 'react';
import PropTypes from 'prop-types';



class TabItem extends Component {

}

TabItem.propTypes = {
  label: PropTypes.string.isRequired,
  default: PropTypes.bool
}

export default TabItem;