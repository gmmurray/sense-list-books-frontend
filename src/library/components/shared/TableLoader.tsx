import { FC } from 'react';
import { Dimmer, Loader, Table } from 'semantic-ui-react';

const DEFAULT_ROWS = 5;

type TableLoaderProps = {
  rows?: number;
  active?: boolean;
  inverted?: boolean;
  striped?: boolean;
};

const TableLoader: FC<TableLoaderProps> = ({
  rows = DEFAULT_ROWS,
  active = true,
  inverted = true,
  striped = true,
}) => {
  return (
    <Dimmer.Dimmable>
      <Dimmer active={active} inverted={inverted}>
        <Loader inverted={inverted} />
      </Dimmer>
      <Table striped={striped}>
        <Table.Body>
          {[...Array(rows)].map(() => (
            <Table.Row>
              <Table.Cell />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Dimmer.Dimmable>
  );
};

export default TableLoader;
