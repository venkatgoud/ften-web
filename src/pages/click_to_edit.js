import React from "react"

export default class ClickToEdit extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      editEnabled: false
    }

    this.input = React.createRef();
    this.enableEditMode = this.enableEditMode.bind(this)
    this.disableEditMode = this.disableEditMode.bind(this)
  }

  enableEditMode = () => {
    this.setState({ editEnabled: true })
  }

  disableEditMode = () => {
    this.setState({ editEnabled: false })
  }

  onBlur = (e) => {
    this.disableEditMode()

    if (this.props.onEditEnd) {
      this.props.onEditEnd(this.input.current.value)
    }
  }

  handleEnterKey = (e) => {
    if (e.keyCode === 13 || e.charCode === 13) {
      this.disableEditMode()
    };

    if (this.props.onEditEnd) {
      this.props.onEditEnd(this.input.current.value)
    }
  }

  render() {
    let displayValue = (this.props.value && this.props.value.length > this.props.maxLength) ?
        this.props.value.substring(0,this.props.maxLength)+"..." : 
        this.props.value

    let element = this.state.editEnabled ?
      <input
        ref={this.input}
        className={this.props.inputClass}
        type="text"
        defaultValue={this.props.value}
        autoFocus
        onBlur={this.onBlur}
        onKeyPress={this.handleEnterKey} /> :
      <span className={this.props.textClass}>
        { displayValue} 
      </span>

    return <div className={this.props.containerClass} onClick={this.enableEditMode}>
      {element}
    </div>
  }
}
