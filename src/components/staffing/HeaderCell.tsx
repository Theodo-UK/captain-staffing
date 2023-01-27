import React from 'react'
import { Cell } from 'fixed-data-table'
import { addEllipsisToLongString } from '../../helpers/utils'
import { MAX_NAME_CHARS } from '../../constants'

interface HeaderCellProps {
  data: Array<any>
  field?: string
  rowIndex?: number
  onClick?(...args: unknown[]): unknown
}

export default class HeaderCell extends React.Component<HeaderCellProps> {
  render() {
    const { rowIndex, field, data, ...props } = this.props
    return (
      <div>
        {field !== 'name' ? (
          <Cell
            {...props}
            onClick={this.props.onClick.bind(this, data[rowIndex])}
            className="clickable"
          >
            {data[rowIndex][field]}
          </Cell>
        ) : (
          <Cell {...props}>
            <a
              href={`https://app.pickyourskills.com/profile/${data[rowIndex].id}`}
              className="pickYourSkillLink"
              rel="noopener noreferrer"
              target="_blank"
            >
              {addEllipsisToLongString(data[rowIndex][field], MAX_NAME_CHARS)}
            </a>
          </Cell>
        )}
      </div>
    )
  }
}
