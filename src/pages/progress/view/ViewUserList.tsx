import { useAuth0 } from '@auth0/auth0-react';
import { Fragment, useCallback, useEffect } from 'react';
import { useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import {
  Segment,
  Placeholder,
  Header,
  Button,
  Input,
  Divider,
  Icon,
  Confirm,
  Grid,
} from 'semantic-ui-react';
import dateformat from 'dateformat';
import SegmentPlaceholder from 'src/library/components/shared/SegmentPlaceholder';
import {
  BULI,
  CreateBULIDto,
  PatchBULIDto,
} from 'src/library/entities/uli/BookUserListItem';
import { PopulatedBookUserList } from 'src/library/entities/userList/BookUserList';
import { truncateString } from 'src/library/utilities/bookPropertyHelpers';
import { appRoutes } from 'src/main/routes';
import * as userListApi from 'src/library/api/backend/userLists';
import * as buliApi from 'src/library/api/backend/buli';
import * as usersApi from 'src/library/api/backend/users';
import BreadcrumbWrapper from 'src/library/components/layout/BreadcrumbWrapper';
import { BookReadingStatus } from 'src/library/types/BookReadingStatus';
import ViewUserListBooks from './ViewUserListBooks';
import { BookListItem } from 'src/library/entities/listItem/BookListItem';
import { ItemMatch } from 'src/library/types/ItemMatch';
import { UserProfile } from 'src/library/entities/user/UserProfile';
import UserProfilePopup from 'src/library/components/users/UserProfilePopup';
import { showErrorToast } from 'src/library/components/layout/ToastifyWrapper';

type ViewUserListParams = { userListId: string };

const ViewUserList = () => {
  const auth = useAuth0();
  const history = useHistory();
  const { userListId } = useParams<ViewUserListParams>();
  const [userList, setUserList] = useState<PopulatedBookUserList | null>(null);
  const [userListLoading, setUserListLoading] = useState(true);

  const [deletionLoading, setDeletionLoading] = useState(false);
  const [deletionConfirmOpen, setDeletionConfirmOpen] = useState(false);

  const [visibleBuli, setVisibleBuli] = useState<BULI[]>([]);

  const [buliCreateLoading, setBuliCreateLoading] = useState<string | null>(
    null,
  );

  const [buliUpdateLoading, setBuliUpdateLoading] = useState<string | null>(
    null,
  );
  const [buliUpdates, setBuliUpdates] = useState<Record<string, PatchBULIDto>>(
    {},
  );

  const [noteUpdate, setNoteUpdate] = useState<string | null>(null); // set when loading user list
  const [noteUpdateLoading, setNoteUpdateLoading] = useState(false);

  const [ownerProfile, setOwnerProfile] = useState<UserProfile | null>(null);
  const [ownerProfileLoading, setOwnerProfileLoading] = useState(false);

  const getUserListData = useCallback(async () => {
    setUserListLoading(true);
    try {
      const data = await userListApi.getFullUserList(auth, userListId);
      setUserList(data);
      setVisibleBuli(data.userListItems);
      setNoteUpdate(data.notes);

      const defaultBuliUpdates: Record<string, PatchBULIDto> = {};
      data.userListItems.forEach(
        ({ id, notes, status, owned, rating, format }) =>
          (defaultBuliUpdates[id] = {
            notes,
            status,
            owned,
            rating,
            format,
          }),
      );
      setBuliUpdates(defaultBuliUpdates);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setUserListLoading(false);
    }
  }, [setUserListLoading, auth, userListId]);

  const getOwnerProfile = useCallback(async () => {
    setOwnerProfileLoading(true);
    try {
      const data = await usersApi.getUserProfile(auth, userList!.list!.ownerId);
      setOwnerProfile(data);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setOwnerProfileLoading(false);
    }
  }, [setOwnerProfileLoading, userList, setOwnerProfile, auth]);

  useEffect(() => {
    if (userList) {
      setVisibleBuli(userList.userListItems);
      setNoteUpdate(userList.notes);
      const itemUpdates: Record<string, PatchBULIDto> = {};
      userList.userListItems.forEach(
        ({ id, notes, status, owned, rating }) =>
          (itemUpdates[id] = {
            notes,
            status,
            owned,
            rating,
          }),
      );
      setBuliUpdates(itemUpdates);
    }
  }, [userList]);

  const handleUserListDeletion = useCallback(async () => {
    setDeletionConfirmOpen(false);
    setDeletionLoading(true);
    try {
      await userListApi.deleteUserList(auth, userListId);
      setDeletionLoading(false);
      history.push(appRoutes.progress.start.path);
    } catch (error) {
      showErrorToast(error.message);
      setDeletionLoading(false);
    }
  }, [auth, history, userListId]);

  const handleEditClick = useCallback(() => {
    if (
      userList &&
      userList.list &&
      auth.user &&
      auth.user.sub === userList.list.ownerId
    ) {
      history.push(appRoutes.lists.view.getDynamicPath!(userList.list.id));
    }
  }, [userList, auth, history]);

  const handleNoteChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNoteUpdate(e.target.value),
    [setNoteUpdate],
  );

  const handleNoteSave = useCallback(async () => {
    setNoteUpdateLoading(true);
    try {
      const update = { notes: noteUpdate || '' };
      await userListApi.updateUserList(auth, userListId, update);
      setUserList({
        ...(userList as PopulatedBookUserList),
        notes: update.notes,
      });
    } catch (error) {
      showErrorToast('There was an error updating your notes');
    } finally {
      setNoteUpdateLoading(false);
    }
  }, [userList, setNoteUpdateLoading, noteUpdate, auth, userListId]);

  const handleBuliUpdateSave = useCallback(
    async (buliId: string, updates: PatchBULIDto) => {
      if (userList && updates) {
        setBuliUpdates({ ...buliUpdates, [buliId]: updates });
        setBuliUpdateLoading(buliId);
        const updatedIndex = userList.userListItems.findIndex(
          item => item.id === buliId,
        );
        try {
          await buliApi.updateBuli(auth, buliId, updates);
          const updatedItems = userList.userListItems;
          updatedItems[updatedIndex] = {
            ...updatedItems[updatedIndex],
            ...updates,
          };
          setUserList({
            ...(userList as PopulatedBookUserList),
            userListItems: updatedItems,
          });
        } catch (error) {
          setBuliUpdates({
            ...buliUpdates,
            [buliId]: userList.userListItems[updatedIndex],
          });
          showErrorToast('There was an error updating the item');
        } finally {
          setBuliUpdateLoading(null);
        }
      }
    },
    [userList, buliUpdates, auth],
  );

  const handleBuliCreate = useCallback(
    async (data: Partial<CreateBULIDto>) => {
      const { bookListItem, status, owned, rating, notes } = data;
      if (
        userList &&
        bookListItem &&
        (!userList?.userListItems.some(
          item => item.bookListItem === bookListItem,
        ) ??
          false)
      ) {
        setBuliCreateLoading(bookListItem);
        try {
          const req: CreateBULIDto = {
            userList: userListId,
            bookListItem,
            status: status || BookReadingStatus.notStarted,
            owned: !!owned,
            rating,
            notes,
          };
          const result = await buliApi.createBuli(auth, req);
          if (result) {
            const newBuliState = [...userList.userListItems, result];
            setUserList({ ...userList, userListItems: newBuliState });
          }
        } catch (error) {
          showErrorToast('There was an error saving your progress');
        } finally {
          setBuliCreateLoading(null);
        }
      }
    },
    [userList, userListId, auth],
  );

  useEffect(() => {
    if (userListId) {
      getUserListData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (userList?.list?.ownerId && !ownerProfile) getOwnerProfile();
  }, [userList]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!userListId) {
    return <Redirect to={appRoutes.progress.start.path} />;
  } else if (userListLoading) {
    return (
      <Fragment>
        <Segment loading>
          <Placeholder>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder>
        </Segment>
      </Fragment>
    );
  } else if (userList) {
    const { list } = userList;
    const formatedUpdatedAt = dateformat(new Date(list.updatedAt), 'longDate');

    const hasEditListPermission = list.ownerId === auth.user.sub;

    const matchedItems: ItemMatch[] = (
      list.bookListItems as BookListItem[]
    ).map(item => ({
      book: item,
      userItem: visibleBuli.find(buli => buli.bookListItem === item.id) || null,
    }));

    const isOwnProfile =
      hasEditListPermission && auth.user.sub === ownerProfile?.authId;

    return (
      <Fragment>
        <BreadcrumbWrapper breadcrumbs={appRoutes.progress.view.breadcrumbs!} />
        <Segment>
          {hasEditListPermission && (
            <div>
              <Button
                icon="edit"
                content="Edit list"
                floated="right"
                compact
                onClick={handleEditClick}
              />
            </div>
          )}
          <Header
            as="h1"
            content={list.title}
            subheader={truncateString(list.description, 150)}
          />
          <Grid columns={2} stackable>
            <Grid.Row>
              <Grid.Column>
                {!ownerProfileLoading && !!ownerProfile && (
                  <>
                    <Header sub>By</Header>
                    <UserProfilePopup
                      profile={ownerProfile}
                      root={
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a>{isOwnProfile ? 'Me' : ownerProfile.username}</a>
                      }
                    />
                  </>
                )}
              </Grid.Column>
              <Grid.Column>
                <Header sub>Category</Header>
                <span>{list.category}</span>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header sub>Last updated</Header>
                <span>{formatedUpdatedAt}</span>
              </Grid.Column>
              <Grid.Column>
                <Header sub>Personal note</Header>
                <Input
                  value={noteUpdate}
                  onChange={handleNoteChange}
                  action={
                    <Button
                      color={
                        noteUpdate !== userList.notes ? 'green' : undefined
                      }
                      compact
                      content="Save"
                      onClick={handleNoteSave}
                      loading={noteUpdateLoading}
                    />
                  }
                  disabled={noteUpdateLoading}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider horizontal>
            <Header as="h4">
              <Icon name="book" />
              Books
            </Header>
          </Divider>
          <ViewUserListBooks
            items={matchedItems}
            createLoading={buliCreateLoading}
            updateLoading={buliUpdateLoading}
            updates={buliUpdates}
            onUpdatesSave={handleBuliUpdateSave}
            onCreate={handleBuliCreate}
            onUpdateChange={(buliId: string, updates: PatchBULIDto) =>
              setBuliUpdates({ ...buliUpdates, [buliId]: updates })
            }
          />
          <Grid textAlign="center">
            <Grid.Column>
              <Button
                icon="close"
                content="Remove progress"
                compact
                negative
                onClick={() => setDeletionConfirmOpen(true)}
                loading={deletionLoading}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        <Confirm
          open={deletionConfirmOpen}
          onCancel={() => setDeletionConfirmOpen(false)}
          onConfirm={handleUserListDeletion}
          cancelButton="Nevermind"
          confirmButton="Yes"
          content="Are you sure you want to remove your progress on this list?"
        />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <BreadcrumbWrapper breadcrumbs={appRoutes.progress.view.breadcrumbs!} />
      <SegmentPlaceholder
        iconName="search"
        text="That list progress could not be found"
        linkTo={appRoutes.progress.list.path}
        linkText="View lists"
      />
    </Fragment>
  );
};

export default ViewUserList;
