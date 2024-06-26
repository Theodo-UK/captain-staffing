import React from "react";
import { Cell } from "fixed-data-table-2";
import { addEllipsisToLongString } from "../../helpers/utils";
import { MAX_NAME_CHARS } from "../../constants";

export default class HeaderCell extends React.Component {
  // static propTypes = {
  //   data: React.PropTypes.array.isRequired,
  //   field: React.PropTypes.string,
  //   rowIndex: React.PropTypes.number,
  //   onClick: React.PropTypes.func,
  // };

  render() {
    const { rowIndex, field, data, ...props } = this.props;
    return (
      <div>
        {field !== "name" ? (
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
    );
  }
}
