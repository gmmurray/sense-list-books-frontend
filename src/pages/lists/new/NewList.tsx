import { useState } from 'react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form, Header, Message, Segment } from 'semantic-ui-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { INewListInputs, newListSchema } from './schema';
import WrappedTextInput from 'src/library/components/form/WrappedTextInput';
import { getListTypeOptions, ListType } from 'src/library/types/ListType';
import WrappedCheckbox from 'src/library/components/form/WrappedCheckbox';
import WrappedSelect from 'src/library/components/form/WrappedSelect';
import * as listsApi from 'src/library/api/backend/lists';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';
import { appRoutes } from 'src/main/routes';
import { useAlert } from 'react-alert';
import BreadcrumbWrapper from 'src/library/components/layout/BreadcrumbWrapper';
import WrappedTextArea from 'src/library/components/form/WrappedTextArea';

import './style.scss';

const NewList = () => {
  const auth = useAuth0();
  const alert = useAlert();
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { handleSubmit, errors, control } = useForm<INewListInputs>({
    resolver: yupResolver(newListSchema),
  });

  const onSubmit = async (data: INewListInputs) => {
    setLoading(true);
    setSubmissionError(null);
    try {
      const result = await listsApi.createList(auth, data);
      if (result) {
        const { id } = result;
        alert.success('List successfully created');
        history.push(appRoutes.lists.view.getDynamicPath!(id));
      }
    } catch (error) {
      setSubmissionError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <BreadcrumbWrapper breadcrumbs={appRoutes.lists.new.breadcrumbs!} />
      <Header as="h1">Create your book list</Header>
      <Segment>
        <Form
          size="big"
          onSubmit={handleSubmit(onSubmit)}
          error={!!submissionError}
          loading={loading}
        >
          <Form.Group widths={2}>
            <WrappedTextInput
              name="title"
              control={control}
              defaultValue=""
              label="Title"
              placeholder="My reading list"
              error={errors.title?.message}
            />
            <WrappedTextInput
              name="category"
              control={control}
              defaultValue=""
              label="Category"
              placeholder="Fantasy"
              error={errors.category?.message}
            />
          </Form.Group>
          <WrappedTextArea
            name="description"
            control={control}
            defaultValue=""
            label="Description"
            placeholder="The best way to read these books!"
            error={errors.description?.message}
            fluid
          />
          <Form.Group widths={2}>
            <Form.Field error={errors.isPublic?.message}>
              <WrappedCheckbox
                name="isPublic"
                control={control}
                defaultValue={false}
                label="Public"
                toggle
              />
            </Form.Field>
            <WrappedSelect
              name="type"
              control={control}
              defaultValue={ListType.Book}
              label="Type"
              error={errors.type?.message}
              options={getListTypeOptions()}
              readOnly
              disabled
              className="list-type-field"
            />
          </Form.Group>
          <Button type="submit" primary>
            Save
          </Button>
          <Message error header="Error" content={submissionError} />
        </Form>
      </Segment>
    </Fragment>
  );
};

export default NewList;
