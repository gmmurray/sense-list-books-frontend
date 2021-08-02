import { useCallback } from 'react';
import { Fragment } from 'react';
import { FC } from 'react';
import { Control, DeepMap, FieldError } from 'react-hook-form';
import { Button, Form, Message } from 'semantic-ui-react';
import WrappedCheckbox from 'src/library/components/form/WrappedCheckbox';
import WrappedTextArea from 'src/library/components/form/WrappedTextArea';
import WrappedTextInput from 'src/library/components/form/WrappedTextInput';
import UserProfilePopup from 'src/library/components/users/UserProfilePopup';
import { BookList } from 'src/library/entities/list/BookList';
import { UserProfile } from 'src/library/entities/user/UserProfile';
import { IEditListInputs } from './schema';

type ViewListFormProps = {
  list: BookList;
  active: boolean;
  loading: boolean;
  error: string | null;
  formErrors: DeepMap<IEditListInputs, FieldError>;
  formControl: Control<IEditListInputs>;
  ownerProfile: UserProfile | null;
  ownerProfileLoading: boolean;
  userIsOwner: boolean;
  onSubmit: any;
  onReset: any;
  onDelete: any;
};

const ViewListForm: FC<ViewListFormProps> = ({
  list,
  active,
  loading,
  error,
  formErrors,
  formControl,
  ownerProfile,
  ownerProfileLoading,
  userIsOwner,
  onSubmit,
  onReset,
  onDelete,
}) => {
  const renderOwnerLink = useCallback(() => {
    if (userIsOwner) return <>My list</>;

    return (
      <>
        List by{' '}
        <UserProfilePopup
          profile={ownerProfile}
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          root={<a>{ownerProfile?.username}</a>}
        />
      </>
    );
  }, [ownerProfile, userIsOwner]);

  return (
    <Form size="big" onSubmit={onSubmit} error={!!error} loading={loading}>
      {!ownerProfileLoading && (
        <div>
          <i>{renderOwnerLink()}</i>
        </div>
      )}
      <WrappedTextInput
        name="title"
        control={formControl}
        defaultValue={list.title}
        label="Title"
        placeholder="My reading list"
        error={formErrors.title?.message}
        readOnly={!active}
      />
      <WrappedTextInput
        name="category"
        control={formControl}
        defaultValue={list.category}
        label="Category"
        placeholder="Fantasy"
        error={formErrors.category?.message}
        readOnly={!active}
      />
      <WrappedTextArea
        name="description"
        control={formControl}
        defaultValue={list.description}
        label="Description"
        placeholder="The best way to read these books!"
        error={formErrors.description?.message}
        readOnly={!active}
      />
      <Form.Field error={formErrors.isPublic?.message}>
        <WrappedCheckbox
          name="isPublic"
          control={formControl}
          defaultValue={list.isPublic}
          label="Public"
          toggle
          readOnly={!active}
          disabled={!active}
        />
      </Form.Field>
      {active && (
        <Fragment>
          <Button type="submit" icon="check" content="Save" color="green" />
          <Button onClick={onReset} content="Reset" icon="redo" />
          <Button onClick={onDelete} content="Delete" negative icon="times" />
        </Fragment>
      )}
      <Message error header="Error" content={error} />
    </Form>
  );
};

export default ViewListForm;
