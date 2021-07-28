import { FC, Fragment } from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { Item, Label, Button, Grid } from 'semantic-ui-react';
import {
  MediaQueryBreakpoints,
  MediaQueryParameters,
} from 'src/library/constants/mediaQueries';
import { BookListItem } from 'src/library/entities/listItem/BookListItem';
import {
  combineAuthors,
  truncateString,
} from 'src/library/utilities/bookPropertyHelpers';
import { useMediaQuery } from 'src/library/utilities/hooks/useMediaQuery';
import { removeHTMLTags } from 'src/library/utilities/stringHelpers';

import './style.scss';

type ListItemCardProps = {
  item: BookListItem;
  onDelete: (item: { id: string; title: string; authors: string }) => void;
  isSorting?: boolean;
  canEdit: boolean;
  ordinal: number;
};
type SortableListItemProps = {
  item: BookListItem;
  onDelete: (item: { id: string; title: string; authors: string }) => void;
  canEdit: boolean;
  ordinal: number;
};

export const ListItemCard: FC<ListItemCardProps> = ({
  item,
  onDelete,
  isSorting,
  canEdit,
  ordinal,
}) => {
  const isMobile = !useMediaQuery(
    MediaQueryBreakpoints.mobile,
    MediaQueryParameters.minWidth,
  );
  const {
    id,
    meta: { thumbnail_url, title, authors, description, pageCount },
  } = item;
  const combinedAuthors = combineAuthors(authors);
  const cleanedDescription = removeHTMLTags(description);
  const truncatedDescription = truncateString(cleanedDescription, 150);

  const contentColumnWidth = isMobile ? 16 : 11;

  return (
    <Grid as={Item} centered={isMobile} className="sortable-list-item">
      <Grid.Row columns={16}>
        {!isMobile && (
          <Grid.Column width={2}>
            <Label size="massive" circular content={ordinal + 1} />
          </Grid.Column>
        )}
        {!isSorting && (
          <Grid.Column width={3}>
            <Item.Image size="tiny" src={thumbnail_url} />
          </Grid.Column>
        )}
        <Grid.Column
          as={Item.Content}
          verticalAlign="top"
          width={contentColumnWidth}
        >
          <Item.Header as="h1">{title}</Item.Header>
          {!isSorting && (
            <Fragment>
              <Item.Meta>{combinedAuthors}</Item.Meta>
              <Item.Description>{truncatedDescription}</Item.Description>
              <Item.Extra>
                {pageCount && <Label>{`${pageCount} pages`}</Label>}
                {canEdit && (
                  <Button
                    as={Label}
                    color="red"
                    floated={isMobile ? undefined : 'right'}
                    icon="minus"
                    compact
                    onClick={() =>
                      onDelete({ id, title, authors: combinedAuthors })
                    }
                  />
                )}
              </Item.Extra>
            </Fragment>
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export const SortableListItem = SortableElement(
  ({ item, onDelete, canEdit, ordinal }: SortableListItemProps) => {
    return (
      <ListItemCard
        item={item}
        onDelete={onDelete}
        isSorting={true}
        canEdit={canEdit}
        ordinal={ordinal}
      />
    );
  },
);
