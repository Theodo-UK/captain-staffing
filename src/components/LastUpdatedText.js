import React from 'react'

export default class LastUpdatedText extends React.Component {

  static propTypes = {
    lastUpdatedString: React.PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props)
    this.state = { timeDifferenceInMinutes: 0 }
  }


  getTimeDifference(lastUpdated) {
    const lastUpdatedTime = lastUpdated
    ? new Date(lastUpdated)
    : new Date(this.props.lastUpdatedString)
    const currentTime = new Date()
    const timeDifference = currentTime - lastUpdatedTime
    const timeDifferenceInMinutes = Math.floor(timeDifference / 60000)
    return timeDifferenceInMinutes
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ timeDifferenceInMinutes: this.getTimeDifference() })
    }, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.lastUpdatedString) {
      this.setState({
        timeDifferenceInMinutes: this.getTimeDifference(nextProps.lastUpdatedString),
      })
    }
  }

  render() {
    const { lastUpdatedString } = this.props

    if (!lastUpdatedString) {
      return null
    }


    return (
      <div>
        Last updated: {this.state.timeDifferenceInMinutes} minute{this.state.timeDifferenceInMinutes !== 1 ? 's' : ''} ago
      </div>
    )
  }
}
