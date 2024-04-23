import React from "react";

export default class ReloadButton extends React.Component {
  // static propTypes = {
  //   reloadFunction: React.PropTypes.func.isRequired,
  //   syncStatus: React.PropTypes.bool,
  //   isRefreshRequired: React.PropTypes.bool,
  // };
  constructor(props) {
    super(props);
    this.state = { buttonPressed: false };
  }

  handleClick = () => {
    this.setState({ buttonPressed: true });
    this.props.reloadFunction();
    setTimeout(() => {
      this.setState({ buttonPressed: false });
    }, 10000);
  };

  render() {
    const { reloadFunction, syncStatus, isRefreshRequired } = this.props;

    if (!reloadFunction) {
      return null;
    }

    const buttonDisabled = syncStatus | this.state.buttonPressed;
    const activebuttonText = isRefreshRequired
      ? "Reload Page"
      : "Update Staffing";
    const buttonText = buttonDisabled ? "Updating..." : activebuttonText;

    return (
      <button
        onClick={this.handleClick}
        className="btn"
        disabled={buttonDisabled}
      >
        {buttonText}
      </button>
    );
  }
}
