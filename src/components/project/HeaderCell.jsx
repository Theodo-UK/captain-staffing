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
    return null;
    const { rowIndex, field, data, ...props } = this.props;
    const noHyperLink =
      field !== "name" || data[rowIndex].project_id === "NO PROJECT ID";
    return (
      <div>
        {noHyperLink ? (
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
              href={`https://app.pickyourskills.com/projects/${data[rowIndex].project_id}`}
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
