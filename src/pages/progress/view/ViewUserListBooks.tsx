import { Fragment, useCallback } from 'react';
import { FC } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import SegmentPlaceholder from 'src/library/components/shared/SegmentPlaceholder';
import {
  CreateBULIDto,
  PatchBULIDto,
} from 'src/library/entities/uli/BookUserListItem';
import { BookFormatType } from 'src/library/types/BookFormatType';
import { BookReadingStatus } from 'src/library/types/BookReadingStatus';
import { ItemMatch } from 'src/library/types/ItemMatch';
import {
  combineAuthors,
  truncateString,
} from 'src/library/utilities/bookPropertyHelpers';
import {
  getListOwnedProgressValue,
  getListReadingProgressValue,
  getListRatingProgressValue,
  getProgressColor,
} from 'src/library/utilities/listProgress';
import { removeHTMLTags } from 'src/library/utilities/stringHelpers';
import BULICard from './BULICard';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import './styles.scss';

type ViewUserListBooksProps = {
  items: ItemMatch[];
  createLoading: string | null;
  updateLoading: string | null;
  updates: Record<string, PatchBULIDto>;
  onUpdatesSave: (buliId: string, updates: PatchBULIDto) => Promise<void>;
  onUpdateChange: (buliId: string, updates: PatchBULIDto) => void;
  onCreate: (data: Partial<CreateBULIDto>) => Promise<void>;
};

const ViewUserListBooks: FC<ViewUserListBooksProps> = ({
  items,
  createLoading,
  updateLoading,
  updates,
  onUpdatesSave,
  onUpdateChange,
  onCreate,
}) => {
  const handleStatusChange = useCallback(
    (value, buliId: string) => {
      onUpdatesSave(buliId, { status: value as BookReadingStatus });
    },
    [onUpdatesSave],
  );

  const handleOwnedChange = useCallback(
    (value, buliId: string) => {
      onUpdatesSave(buliId, { owned: value });
    },
    [onUpdatesSave],
  );

  const handleRatingChange = useCallback(
    (value, buliId: string) => {
      onUpdatesSave(buliId, { rating: value });
    },
    [onUpdatesSave],
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, buliId: string) => {
      onUpdateChange(buliId, { notes: e.target.value });
    },
    [onUpdateChange],
  );

  const handleNotesSave = useCallback(
    (buliId: string, updates: PatchBULIDto) => {
      onUpdatesSave(buliId, updates);
    },
    [onUpdatesSave],
  );

  const handleFormatChange = useCallback(
    (value, buliId: string) => {
      onUpdatesSave(buliId, {
        format: value as BookFormatType,
      });
    },
    [onUpdatesSave],
  );

  const userItems = items
    .filter(item => item.userItem !== null)
    .map(item => item.userItem!);
  const readingProgress = getListReadingProgressValue(userItems);
  const readingProgressText = `${Math.round(
    (readingProgress / items.length) * 100,
  )}%`;
  const ownedProgress = getListOwnedProgressValue(userItems);
  const ownedProgressText = `${ownedProgress}/${items.length}`;
  const ratingProgress = getListRatingProgressValue(userItems);
  const ratingProgressText = `${ratingProgress}/${items.length}`;

  if (items.length === 0) {
    return (
      <SegmentPlaceholder
        text="This list does not have any books yet"
        iconName="search"
        hideButton
      />
    );
  }

  return (
    <Fragment>
      <Grid columns={3} stackable textAlign="center">
        <Grid.Column textAlign="center" className="user-list-circular-progress">
          <CircularProgressbar
            value={readingProgress}
            text={readingProgressText}
            maxValue={items.length}
            styles={buildStyles({
              pathColor: getProgressColor(readingProgress, items.length),
              textColor: 'black',
            })}
          />
          <Header size="small" content="Reading progress" />
        </Grid.Column>
        <Grid.Column textAlign="center" className="user-list-circular-progress">
          <CircularProgressbar
            value={ownedProgress}
            text={ownedProgressText}
            maxValue={items.length}
            styles={buildStyles({
              pathColor: getProgressColor(ownedProgress, items.length),
              textColor: 'black',
            })}
          />
          <Header size="small" content="Books owned" />
        </Grid.Column>
        <Grid.Column textAlign="center" className="user-list-circular-progress">
          <CircularProgressbar
            value={ratingProgress}
            text={ratingProgressText}
            maxValue={items.length}
            styles={buildStyles({
              pathColor: getProgressColor(ratingProgress, items.length),
              textColor: 'black',
            })}
          />
          <Header size="small" content="Books rated" />
        </Grid.Column>
      </Grid>
      {items
        .sort((a, b) => a.book.ordinal - b.book.ordinal)
        .map(match => {
          const { book, userItem } = match;
          const {
            meta: { thumbnail_url, title, authors, description, pageCount },
          } = book;
          const combinedAuthors = combineAuthors(authors);
          const cleanedDescription = removeHTMLTags(description);
          const truncatedDescription = truncateString(cleanedDescription, 150);
          const showBookInfo = !!pageCount || truncatedDescription.length > 0;
          if (userItem) {
            const {
              id: userItemId,
              status,
              notes,
              owned,
              rating,
              format,
            } = userItem;
            const {
              status: updatesStatus,
              notes: updatesNotes,
              owned: updatesOwned,
              rating: updatesRating,
              format: updatesFormat,
            } = updates[userItemId];
            const isUpdating = updateLoading === userItemId;
            return (
              <BULICard
                key={`${userItemId}-card`}
                id={userItemId}
                status={status}
                notes={notes}
                owned={owned}
                rating={rating}
                format={format}
                updatesStatus={updatesStatus}
                updatesNotes={updatesNotes}
                updatesOwned={updatesOwned}
                updatesRating={updatesRating}
                updatesFormat={updatesFormat}
                onStatusChange={(e, { value }) =>
                  handleStatusChange(value, userItemId)
                }
                onNotesChange={(e: any) => handleNotesChange(e, userItemId)}
                onNotesSave={() =>
                  handleNotesSave(userItemId, {
                    notes: updates[userItemId].notes,
                  })
                }
                onOwnedChange={() =>
                  handleOwnedChange(!!!updates[userItemId].owned, userItem.id)
                }
                onRatingChange={(e, newRating) =>
                  handleRatingChange(newRating, userItemId)
                }
                onFormatChange={(e, { value }) =>
                  handleFormatChange(value, userItemId)
                }
                isUpdating={isUpdating}
                bookId={book.id}
                thumbnail={thumbnail_url}
                title={title}
                authors={combinedAuthors}
                description={truncatedDescription}
                pageCount={pageCount}
                showBookInfo={showBookInfo}
                onBULICreate={() =>
                  onCreate({
                    bookListItem: book.id,
                    status: BookReadingStatus.notStarted,
                    owned: false,
                    notes: '',
                    rating: null,
                  })
                }
              />
            );
          } else {
            return (
              <BULICard
                key={`${book.id}-card`}
                isUpdating={false}
                bookId={book.id}
                thumbnail={thumbnail_url}
                title={title}
                authors={combinedAuthors}
                description={truncatedDescription}
                pageCount={pageCount}
                showBookInfo={showBookInfo}
                onBULICreate={() =>
                  onCreate({
                    bookListItem: book.id,
                    status: BookReadingStatus.notStarted,
                    owned: false,
                    notes: '',
                    rating: null,
                  })
                }
                isCreating={createLoading !== null}
              />
            );
          }
        })}
    </Fragment>
  );
};

export default ViewUserListBooks;
