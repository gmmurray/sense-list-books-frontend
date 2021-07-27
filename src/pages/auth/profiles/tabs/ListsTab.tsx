import { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Header, Popup, Segment, Table } from 'semantic-ui-react';
import SegmentPlaceholder from 'src/library/components/shared/SegmentPlaceholder';
import TableLoader from 'src/library/components/shared/TableLoader';
import { BookList } from 'src/library/entities/list/BookList';
import { DataTotalResponse } from 'src/library/types/responseWrappers';
import { formatShortDate } from 'src/library/utilities/dateFormat';
import { appRoutes } from 'src/main/routes';

import './styles.scss';

const DESCRIPTION_MAX_LENGTH = 30;

type ListsTabProps = {
  data?: DataTotalResponse<BookList> | null;
  loading: boolean;
};

const ListsTab: FC<ListsTabProps> = ({ data, loading }) => {
  let history = useHistory();

  const handleRowClick = useCallback(
    (listId: string) => {
      history.push(appRoutes.lists.view.getDynamicPath!(listId));
    },
    [history],
  );

  if (loading) {
    return <TableLoader />;
  } else if (!data) {
    return (
      <SegmentPlaceholder
        text="No lists found for this user"
        iconName="times circle"
        basic={true}
      />
    );
  }

  const { data: items = new Array<BookList>(), total = 0 } = data;

  return (
    <Segment basic>
      <Header size="medium" content="Lists" />
      <Table striped stackable compact selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell content="Title" />
            <Table.HeaderCell content="Category" />
            <Table.HeaderCell content="Description" />
            <Table.HeaderCell content="Last updated" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map(({ id, title, category, description, updatedAt }) => {
            const isTruncated = description.length > DESCRIPTION_MAX_LENGTH;
            const truncatedDescription = isTruncated
              ? `${description.substring(0, DESCRIPTION_MAX_LENGTH)}...`
              : description;
            return (
              <Table.Row
                key={id}
                onClick={() => handleRowClick(id)}
                className="list-table-cell"
              >
                <Table.Cell content={title} collapsing />
                <Table.Cell content={category} />
                <Popup
                  disabled={!isTruncated}
                  content={description}
                  trigger={<Table.Cell content={truncatedDescription} />}
                />
                <Table.Cell content={formatShortDate(updatedAt)} />
              </Table.Row>
            );
          })}
        </Table.Body>
        {total !== 0 && (
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={4}>{total} list(s)</Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        )}
      </Table>
    </Segment>
  );
};

export default ListsTab;
