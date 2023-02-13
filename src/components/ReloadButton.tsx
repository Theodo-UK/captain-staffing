import React, { Component } from 'react';

interface ReloadButtonProps {
  reloadFunction: () => void;
  syncStatus?: boolean;
  isRefreshRequired?: boolean;
}

interface ReloadButtonState {
  buttonPressed: boolean;
}

export default class ReloadButton extends Component<ReloadButtonProps, ReloadButtonState> {
  state = {
    buttonPressed: false
  };

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

    const buttonDisabled = syncStatus || this.state.buttonPressed;
    const activeButtonText = isRefreshRequired ? 'Reload Page' : 'Update Staffing';
    const buttonText = buttonDisabled ? 'Updating...' : activeButtonText;

    return (
      <button onClick={this.handleClick} className="btn" disabled={buttonDisabled}>
        {buttonText}
      </button>
    );
  }
}




