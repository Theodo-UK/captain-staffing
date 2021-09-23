import React from 'react'
import { Cell } from 'fixed-data-table'

export default class HeaderCell extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    field: React.PropTypes.string,
    rowIndex: React.PropTypes.number,
    onClick: React.PropTypes.func,
    type: React.PropTypes.string,
  }

  render() {
    const { rowIndex, field, data, type, ...props } = this.props
    if (field !== 'name') {
      return (
        <Cell
          {...props}
          onClick={this.props.onClick.bind(this, data[rowIndex], type)}
          className="clickable"
        >
          { data[rowIndex][field] }
        </Cell>
      )
    }
    return (
      <Cell
        {...props}
      >
        <a href={`https://app.pickyourskills.com/profile/${data[rowIndex].id}`}> { data[rowIndex][field] }</a>
      </Cell>
    )
  }
}
