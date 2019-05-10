import React from "react";
import Select from 'react-select';

export default (props) => (
  <div className="settings">
    <div className="settings-close-btn">
      <span onClick={props.onClose}>x</span>
    </div>
    <h3>Settings</h3>
    <span>Theme</span>
    <Select
      className="settings-theme"
      value={props.theme}
      onChange={props.changeTheme}
      options={props.themes}
    />
  </div>
)
