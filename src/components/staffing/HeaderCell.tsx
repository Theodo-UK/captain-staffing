import React from 'react';
import { Cell } from 'fixed-data-table';
import { addEllipsisToLongString } from '../../helpers/utils';
import { MAX_NAME_CHARS } from '../../constants/index';

type HeaderCellProps = {
  data: Array<any>,
  field?: string,
  rowIndex?: number,
  onClick?: (event: any) => void,
};

export default class HeaderCell extends React.Component<HeaderCellProps> {
  render() {
    const { rowIndex, field, data, ...props } = this.props;
    return (
      <div>
        {field !== 'name' ? (
          <Cell
            {...props}
            onClick={this.props.onClick?.bind(this, data[rowIndex])}
            className="clickable"
          >
            {data[rowIndex][field as keyof typeof data[0]]}
          </Cell>
        ) : (
          <Cell {...props}>
            <a
              href={`https://app.pickyourskills.com/profile/${data[rowIndex].id}`}
              className="pickYourSkillLink"
              rel="noopener noreferrer"
              target="_blank"
            >
              {addEllipsisToLongString(
                data[rowIndex][field as keyof typeof data[0]],
                MAX_NAME_CHARS
              )}
            </a>
          </Cell>
        )}
      </div>
    );
  }
}
