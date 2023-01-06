import React from 'react'
import { Cell } from 'fixed-data-table'

export default class UserCell extends React.Component {

  static propTypes = {
    data: React.PropTypes.array.isRequired,
    field: React.PropTypes.string,
    rowIndex: React.PropTypes.number,
    onClick: React.PropTypes.func,
  }

  render() {
    const { rowIndex, field, data, ...props } = this.props
    return (
      <Cell {...props}>
        <a
          href={`https://app.pickyourskills.com/profile/${data[rowIndex].userId}`}
          className="pickYourSkillLink"
          rel="noopener noreferrer"
          target="_blank"
        >
          {data[rowIndex][field]}
        </a>
      </Cell>
    )
  }
}
