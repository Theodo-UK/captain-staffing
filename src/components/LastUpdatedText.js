import React from 'react'
import { getTimeDifference } from '../helpers/getTimeDifference'

export default class LastUpdatedText extends React.Component {

  static propTypes = {
    lastUpdatedString: React.PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props)
    this.state = { timeDifferenceInMinutes: 0, timeDifferenceInHours: 0 }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const timeDifference = getTimeDifference(this.props.lastUpdatedString)
      this.setState({
        timeDifferenceInMinutes: timeDifference.minutes,
        timeDifferenceInHours: timeDifference.hours,
      })
    }, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.lastUpdatedString) {
      const timeDifference = getTimeDifference(this.props.lastUpdatedString)
      this.setState({
        timeDifferenceInMinutes: timeDifference.minutes,
        timeDifferenceInHours: timeDifference.hours,
      })
    }
  }

  render() {
    const { lastUpdatedString } = this.props

    if (!lastUpdatedString) {
      return null
    }

    const hoursPostfix = this.state.timeDifferenceInHours !== 1 ? 's' : ''
    const minutesPostfix = this.state.timeDifferenceInMinutes !== 1 ? 's' : ''

    const hoursText = this.state.timeDifferenceInHours > 0 ? `${this.state.timeDifferenceInHours} hour${hoursPostfix} ` : ''


    return (
      <div>
        Last updated: {hoursText}{this.state.timeDifferenceInMinutes} minute{minutesPostfix} ago
      </div>
    )
  }
}
