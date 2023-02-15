import React from 'react';
import { Cell } from 'fixed-data-table';

interface UserCellProps {
  data: Array<any>;
  field: string;
  rowIndex?: number;
  onClick?: React.MouseEventHandler<Cell>;
}

export default class UserCell extends React.Component<UserCellProps> {
  render() {
    const { rowIndex, field, data, ...props } = this.props;
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
    );
  }
}
