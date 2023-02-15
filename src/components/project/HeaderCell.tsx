import * as React from 'react';
import { Cell } from 'fixed-data-table';

interface HeaderCellProps {
  data: Array<any>;
  field?: string;
  rowIndex?: number;
  onClick?: React.MouseEventHandler<Cell>;
}

export default class HeaderCell extends React.Component<HeaderCellProps> {
  render() {
    const { rowIndex, field, data, ...props } = this.props;
    return (
      <div>
        <Cell
          {...props}
          onClick={this.props.onClick!.bind(this, data[rowIndex])}
          className="clickable"
        >
          {data[rowIndex][field!]}
        </Cell>
      </div>
    );
  }
}
