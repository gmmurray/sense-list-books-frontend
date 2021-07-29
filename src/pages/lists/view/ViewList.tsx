import { useAuth0 } from '@auth0/auth0-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useForm } from 'react-hook-form';
import { Link, Redirect, useHistory, useParams } from 'react-router-dom';
import arrayMove from 'array-move';
import {
  Segment,
  Placeholder,
  Header,
  Button,
  Icon,
  Divider,
  Confirm,
} from 'semantic-ui-react';
import {
  deleteBookListItem,
  updateListItemOrdinals,
} from 'src/library/api/backend/listItems';
import * as listsApi from 'src/library/api/backend/lists';
import * as usersApi from 'src/library/api/backend/users';
import BreadcrumbWrapper from 'src/library/components/layout/BreadcrumbWrapper';
import { defaultErrorTimeout } from 'src/library/constants/alertOptions';
import { BookList } from 'src/library/entities/list/BookList';
import { BookListItem } from 'src/library/entities/listItem/BookListItem';
import { appRoutes } from 'src/main/routes';
import NewListItemModal from './modal/NewListItemModal';
import { editListSchema, IEditListInputs } from './schema';
import ViewListBooks from './books/ViewListBooks';
import ViewListForm from './ViewListForm';
import {
  ListItemOrdinalUpdate,
  UpdateListItemOrdinalsDto,
} from 'src/library/entities/listItem/ListItem';
import { onSortEndParams } from 'src/library/types/reactSortableHoc';
import { UserProfile } from 'src/library/entities/user/UserProfile';

type ViewListParams = {
  listId: string;
};

const ViewList = () => {
  const auth = useAuth0();
  const alert = useAlert();
  let history = useHistory();
  const { listId } = useParams<ViewListParams>();
  const [list, setList] = useState<BookList | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [formUpdateLoading, setFormUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditingOrdinals, setIsEditingOrdinals] = useState(false);
  const [itemDeletionLoading, setItemDeletionLoading] = useState(false);
  const [itemDeletionConfirmOpen, setItemDeletionConfirmOpen] = useState(false);
  const [itemToBeDeleted, setItemToBeDeleted] = useState<{
    id: string;
    title: string;
    authors: string;
  } | null>(null);
  const [itemOrdinalChanges, setItemOrdinalChanges] = useState<
    ListItemOrdinalUpdate[]
  >([]);
  const [ordinalChangesLoading, setOrdinalChangesLoading] = useState(false);

  const [listDeletionLoading, setListDeletionLoading] = useState(false);
  const [listDeletionConfirmOpen, setListDeletionConfirmOpen] = useState(false);

  const [ownerProfile, setOwnerProfile] = useState<UserProfile | null>(null);
  const [ownerProfileLoading, setOwnerProfileLoading] = useState(false);
  const [newItemOrdinal, setNewItemOrdinal] = useState(0);

  const { handleSubmit, errors, control, reset } = useForm<IEditListInputs>({
    resolver: yupResolver(editListSchema),
  });

  const getListData = useCallback(async () => {
    setListLoading(true);
    try {
      const data = await listsApi.getList(auth, listId);
      setList(data);
    } catch (error) {
      alert.error(error.message, defaultErrorTimeout);
    } finally {
      setListLoading(false);
    }
  }, [setListLoading, setList, alert, auth, listId]);

  const getOwnerProfile = useCallback(async () => {
    setOwnerProfileLoading(true);
    try {
      const data = await usersApi.getUserProfile(auth, list!.ownerId);
      setOwnerProfile(data);
    } catch (error) {
      alert.error(error.message, defaultErrorTimeout);
    } finally {
      setOwnerProfileLoading(false);
    }
  }, [setOwnerProfileLoading, list, setOwnerProfile, alert, auth]);

  const handleFormSubmit = useCallback(
    async (data: IEditListInputs) => {
      setFormUpdateLoading(true);
      setUpdateError(null);
      try {
        await listsApi.updateList(auth, listId, data);
        await getListData();
        setIsEditingForm(false);
        alert.success('List successfully saved');
      } catch (error) {
        setUpdateError('There was an error saving your changes.');
      } finally {
        setFormUpdateLoading(false);
      }
    },
    [getListData, setFormUpdateLoading, setUpdateError, alert, auth, listId],
  );

  const handleFormReset = useCallback(() => {
    reset();
    setIsEditingForm(false);
  }, [reset, setIsEditingForm]);

  const handleItemSubmission = useCallback(() => {
    handleFormReset();
    getListData();
  }, [handleFormReset, getListData]);

  const handleItemDeletionClick = useCallback(
    (item: { id: string; title: string; authors: string }) => {
      setItemDeletionConfirmOpen(true);
      setItemToBeDeleted(item);
    },
    [setItemDeletionConfirmOpen, setItemToBeDeleted],
  );

  const handleItemDeletion = useCallback(
    async (listItemId: string) => {
      setItemDeletionConfirmOpen(false);
      setItemDeletionLoading(true);
      try {
        await deleteBookListItem(auth, listItemId);
        await getListData();
      } catch (error) {
        alert.error(error.message, defaultErrorTimeout);
      } finally {
        setItemDeletionLoading(false);
        setItemToBeDeleted(null);
      }
    },
    [getListData, setItemDeletionLoading, auth, alert],
  );

  const handleListDeletionClick = useCallback(
    e => {
      e.preventDefault();
      setListDeletionConfirmOpen(true);
    },
    [setListDeletionConfirmOpen],
  );

  const handleListDeletion = useCallback(async () => {
    setListDeletionConfirmOpen(false);
    setListDeletionLoading(true);
    try {
      await listsApi.deleteList(auth, listId);
      setListDeletionLoading(false);
      history.push(appRoutes.progress.start.path);
    } catch (error) {
      alert.error(error.message, defaultErrorTimeout);
      setListDeletionLoading(false);
    }
  }, [alert, auth, history, listId]);

  const handleItemSort = useCallback(
    ({ oldIndex, newIndex }: onSortEndParams) => {
      if (list && list.bookListItems) {
        const bookListItems = arrayMove(
          list?.bookListItems as BookListItem[],
          oldIndex,
          newIndex,
        ).map((item, index) => ({ ...item, ordinal: index }));
        const updated = { ...list, bookListItems };
        setList(updated);
        setItemOrdinalChanges(
          bookListItems.map(({ id, ordinal }) => ({ listItemId: id, ordinal })),
        );
      }
    },
    [list, setList],
  );

  const handleSaveOrdinals = useCallback(async () => {
    if (list) {
      setOrdinalChangesLoading(true);
      try {
        const data: UpdateListItemOrdinalsDto = {
          listId: list.id,
          ordinalUpdates: itemOrdinalChanges,
        };
        await updateListItemOrdinals(auth, data);
        await getListData();
      } catch (error) {
        alert.error(error.messge, defaultErrorTimeout);
      } finally {
        setOrdinalChangesLoading(false);
        setItemOrdinalChanges([]);
        setIsEditingOrdinals(false);
      }
    }
  }, [
    alert,
    auth,
    getListData,
    itemOrdinalChanges,
    list,
    setItemOrdinalChanges,
    setOrdinalChangesLoading,
  ]);

  const handleCancelOrdinalUpdates = useCallback(() => {
    if (itemOrdinalChanges.length > 0) {
      getListData();
    }
    setItemOrdinalChanges([]);
    setIsEditingOrdinals(false);
  }, [getListData, setItemOrdinalChanges, itemOrdinalChanges]);

  useEffect(() => {
    if (listId) {
      getListData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (list?.ownerId && !ownerProfile) getOwnerProfile();
  }, [list]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (list) {
      const lastOrdinal = (list.bookListItems as BookListItem[]).sort(
        (a, b) => a.ordinal - b.ordinal,
      )[list.bookListItems.length - 1]?.ordinal;
      const newOrdinal = (lastOrdinal || -1) + 1;
      setNewItemOrdinal(newOrdinal);
    }
  }, [list]);

  const hasEditPermission = auth.user && auth.user.sub === list?.ownerId;
  const excludedBookIds =
    list && list.bookListItems
      ? (list?.bookListItems as BookListItem[]).map(book => book.volumeId)
      : [];

  if (!listId) {
    return <Redirect to={appRoutes.progress.start.path} />;
  } else if (listLoading) {
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
  } else if (list) {
    return (
      <Fragment>
        <BreadcrumbWrapper breadcrumbs={appRoutes.lists.view.breadcrumbs!} />
        <Segment
          color={isEditingForm ? 'green' : undefined}
          loading={listDeletionLoading}
        >
          {hasEditPermission && (
            <div>
              <Button
                icon={isEditingForm ? 'cancel' : 'edit'}
                content={isEditingForm ? 'Cancel' : 'Edit'}
                floated="right"
                compact
                onClick={
                  isEditingForm
                    ? () => handleFormReset()
                    : () => setIsEditingForm(true)
                }
              />
              <br />
            </div>
          )}
          <ViewListForm
            list={list}
            active={isEditingForm}
            loading={formUpdateLoading}
            error={updateError}
            formErrors={errors}
            formControl={control}
            ownerProfile={ownerProfile}
            ownerProfileLoading={ownerProfileLoading}
            userIsOwner={hasEditPermission}
            onSubmit={handleSubmit(handleFormSubmit)}
            onReset={handleFormReset}
            onDelete={handleListDeletionClick}
          />
          <Divider horizontal>
            <Header as="h4">
              <Icon name="book" />
              Books
            </Header>
          </Divider>
          <ViewListBooks
            items={list.bookListItems}
            ordinalChanges={itemOrdinalChanges}
            canEdit={hasEditPermission}
            listLoading={listLoading}
            active={isEditingOrdinals}
            deleteLoading={itemDeletionLoading}
            changesLoading={ordinalChangesLoading}
            onModalOpen={() => setModalOpen(true)}
            onActiveToggle={
              isEditingOrdinals
                ? () => setIsEditingOrdinals(false)
                : () => setIsEditingOrdinals(true)
            }
            onDelete={handleItemDeletionClick}
            onSortEnd={handleItemSort}
            onSave={handleSaveOrdinals}
            onReset={handleCancelOrdinalUpdates}
          />
        </Segment>
        <NewListItemModal
          open={modalOpen}
          onOpen={() => setModalOpen(true)}
          onClose={() => setModalOpen(false)}
          onModalSubmitted={handleItemSubmission}
          listId={listId}
          newOrdinal={newItemOrdinal}
          onNewOrdinalChange={(ordinal: number) => setNewItemOrdinal(ordinal)}
          excludedBookIds={excludedBookIds}
        />
        <Confirm
          open={itemDeletionConfirmOpen}
          onCancel={() => setItemDeletionConfirmOpen(false)}
          onConfirm={
            itemToBeDeleted
              ? () => handleItemDeletion(itemToBeDeleted.id)
              : undefined
          }
          cancelButton="Nevermind"
          confirmButton="Yes"
          header="Confirm"
          content={
            itemToBeDeleted
              ? `Are you sure you want to remove ${itemToBeDeleted.title}${
                  itemToBeDeleted.authors
                    ? ' by ' + itemToBeDeleted.authors
                    : ''
                }
                ? This will completely remove any progress associated with this book for you and any other users`
              : undefined
          }
        />
        <Confirm
          open={listDeletionConfirmOpen}
          onCancel={() => setListDeletionConfirmOpen(false)}
          onConfirm={() => handleListDeletion()}
          cancelButton="Nevermind"
          confirmButton="Yes"
          header="Confirm list delete"
          content="Are you sure you want to delete this list? This will also delete any progress you or anyone else has with it."
        />
      </Fragment>
    );
  }
  return (
    <Fragment>
      <BreadcrumbWrapper breadcrumbs={appRoutes.lists.view.breadcrumbs!} />
      <Segment placeholder>
        <Header icon>
          <Icon name="search" />
          That list could not be found
        </Header>
        <Button primary as={Link} to={appRoutes.progress.start.path}>
          View lists
        </Button>
      </Segment>
    </Fragment>
  );
};

export default ViewList;
