import React from 'react'
import { getTimeDifference } from '../helpers/getTimeDifference'

export default class LastUpdatedText extends React.Component {

  static propTypes = {
    lastUpdatedString: React.PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props)
    this.state = { timeDifferenceInMinutes: 0 }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        timeDifferenceInMinutes: getTimeDifference(this.props.lastUpdatedString),
      })
    }, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.lastUpdatedString) {
      this.setState({
        timeDifferenceInMinutes: getTimeDifference(nextProps.lastUpdatedString),
      })
    }
  }

  render() {
    const { lastUpdatedString } = this.props

    if (!lastUpdatedString) {
      return null
    }

    const text = `Last updated: ${this.state.timeDifferenceInMinutes} minute${this.state.timeDifferenceInMinutes !== 1 ? 's' : ''} ago`


    return (
      <div>
        {text}
      </div>
    )
  }
}
