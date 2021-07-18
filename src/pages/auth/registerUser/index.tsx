import { useAuth0 } from '@auth0/auth0-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { LocationState } from 'history';
import { FC, Fragment, useState } from 'react';
import { useAlert } from 'react-alert';
import { useForm } from 'react-hook-form';
import { Redirect, RouteComponentProps, useHistory } from 'react-router-dom';
import { Button, Form, Header, Message, Segment } from 'semantic-ui-react';
import * as userApi from 'src/library/api/backend/users';
import WrappedTextInput from 'src/library/components/form/WrappedTextInput';
import { useAppContext } from 'src/main/context/appContext';
import { appRoutes } from 'src/main/routes';
import { IRegisterInputs, registerSchema } from './formSchema';

const RegisterUser: FC<RouteComponentProps<{}, any, LocationState | any>> = ({
  location,
}) => {
  const auth = useAuth0();
  const alert = useAlert();
  const { isUserRegistered } = useAppContext() || {};
  let history = useHistory();

  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { handleSubmit, errors, control } = useForm<IRegisterInputs>({
    resolver: yupResolver(registerSchema),
  });

  const redirectPath = location?.state?.previous ?? appRoutes.home.index.path;

  const onSubmit = async (data: IRegisterInputs) => {
    setLoading(true);
    setSubmissionError(null);
    try {
      const dto = { ...data, authId: auth.user.sub };
      await userApi.registerUser(auth, dto);

      alert.success('Successfully registered!');
      history.push(redirectPath);
      window.location.reload();
    } catch (error) {
      setSubmissionError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isUserRegistered) {
    return <Redirect to={redirectPath} />;
  }

  if (!auth.isAuthenticated || !auth.user) {
    return <Redirect to={redirectPath} />;
  }

  return (
    <Fragment>
      <Header as="h1">
        Before you can get started, please complete your registration
      </Header>
      <Segment>
        <Form
          size="big"
          onSubmit={handleSubmit(onSubmit)}
          error={!!submissionError}
          loading={loading}
        >
          <WrappedTextInput
            name="username"
            control={control}
            defaultValue=""
            label="Username"
            placeholder="quirky-username"
            error={errors.username?.message}
          />
          <Button type="submit" primary>
            Register
          </Button>
          <Message error header="Error" content={submissionError} />
        </Form>
      </Segment>
    </Fragment>
  );
};

export default RegisterUser;
