import React from "react";

import PropTypes from 'prop-types';
import loadScript from 'load-script';
import MenuItem from "./menu_item.js";

const DROPBOX_SDK_URL = 'https://www.dropbox.com/static/api/2/dropins.js';
const SCRIPT_ID = 'dropboxjs';

let scriptLoadingStarted = false;

export default class DropboxChooser extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    appKey: PropTypes.string.isRequired,
    success: PropTypes.func.isRequired,
    cancel: PropTypes.func,
    linkType: PropTypes.oneOf(['preview', 'direct']),
    multiselect: PropTypes.bool,
    folderselect: PropTypes.bool,
    extensions: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool
  };

  static defaultProps = {
    cancel: () => { },
    linkType: 'direct',
    multiselect: false,
    folderselect: false,
    disabled: false
  };

  constructor(props) {
    super(props);
    this.onChoose = this.onChoose.bind(this)
  }

  componentDidMount() {
    if (!this.isDropboxReady() && !scriptLoadingStarted) {
      scriptLoadingStarted = true;

      loadScript(DROPBOX_SDK_URL, {
        attrs: {
          id: SCRIPT_ID,
          'data-app-key': this.props.appKey
        }
      })
    }
  }

  isDropboxReady() {
    return !!window.Dropbox;
  }

  onChoose() {
    if (!this.isDropboxReady() || this.props.disabled) {
      return null;
    }

    const {
      success,
      cancel,
      linkType,
      multiSelect,
      folderselect,
      extensions
    } = this.props;

    window.Dropbox.choose({
      success,
      cancel,
      linkType,
      multiSelect,
      folderselect,
      extensions
    });
  }

  render() {
    return <MenuItem
      className="menu-item"
      onClick={this.onChoose}
      src="gfx/icons/dropbox-open-icon.svg" alt="Dropbox" />
  }
}