import React from "react";
import Select from 'react-select';

export default class Settings extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this)
  }

  onChange = (e) => {
    let { name, checked } = e.target;
    this.props.onTransChange(name, checked);
  }

  render() {
    return (
      <div className="settings">
        <div className="settings-close-btn">
          <span onClick={this.props.onClose}>x</span>
        </div>
        <h3>Settings</h3>
        <span>Theme</span>
        <Select
          className="settings-theme"
          value={this.props.theme}          
          onChange={this.props.changeTheme}
          options={this.props.themes}
        />
        <div>
          <br />
          <input
            type="checkbox" name="transDialog"
            defaultChecked={this.props.transDialog}             
            onClick={this.onChange} />
          <label>Transliterate Dialog</label>
          <br />
          <input
            type="checkbox" name="transAction"
            defaultChecked={this.props.transAction}             
            onClick={this.onChange} />
          <label>Transliterate Action</label>
        </div>
      </div>
    )
  }

}




