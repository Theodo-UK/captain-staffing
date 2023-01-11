import React from 'react'
import { Cell } from 'fixed-data-table'

export default class HeaderCell extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    field: React.PropTypes.string,
    rowIndex: React.PropTypes.number,
    onClick: React.PropTypes.func,
  };

  render() {
    const addEllipsisToLongName = (name) => {
      return name.length > 21 ? `${name.slice(0, 21)}...` : name
    }

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
              {addEllipsisToLongName(data[rowIndex][field])}
            </a>
          </Cell>
        )}
      </div>
    )
  }
}
