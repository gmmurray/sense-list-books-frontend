import { FC, Fragment, useCallback, useState } from 'react';
import { Button, Form, Header, Message, Segment } from 'semantic-ui-react';
import SegmentPlaceholder from 'src/library/components/shared/SegmentPlaceholder';
import {
  PatchUserProfileDto,
  UserProfile,
} from 'src/library/entities/user/UserProfile';
import * as usersApi from 'src/library/api/backend/users';
import { useAuth0 } from '@auth0/auth0-react';
import { DataLoadingState } from 'src/library/types/dataLoadingState';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import WrappedTextInput from 'src/library/components/form/WrappedTextInput';
import WrappedSelect from 'src/library/components/form/WrappedSelect';
import { getNumbersOptionsArray } from 'src/library/utilities/numberOptions';
import WrappedCheckbox from 'src/library/components/form/WrappedCheckbox';

const settingsSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
});

type SettingsTabProps = {
  profile: UserProfile | null;
  loading: boolean;
  isProfileOwner: boolean;
  getProfile: () => Promise<void>;
};

const SettingsTab: FC<SettingsTabProps> = ({
  profile,
  loading,
  isProfileOwner,
  getProfile,
}) => {
  const auth = useAuth0();
  const {
    handleSubmit,
    errors: formErrors,
    control: formControl,
    reset,
  } = useForm<PatchUserProfileDto>({
    resolver: yupResolver(settingsSchema),
  });

  const [submissionError, setSubmissionError] = useState<
    DataLoadingState<string>
  >({ data: null, loading: false });

  const saveChanges = useCallback(
    async (updates: any) => {
      if (!updates) return;
      setSubmissionError(state => ({ ...state, loading: true, data: null }));
      try {
        await usersApi.updateUserProfile(auth, updates);
        getProfile();
      } catch (error) {
        setSubmissionError(state => ({ ...state, data: error.message }));
      } finally {
        setSubmissionError(state => ({ ...state, loading: false }));
      }
    },
    [auth, getProfile],
  );

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  if (loading) {
    return <Segment basic loading />;
  } else if (!profile || !isProfileOwner) {
    return (
      <SegmentPlaceholder
        text="You do not have access to this profile's settings"
        iconName="times circle"
        hideButton
      />
    );
  }

  return (
    <Fragment>
      <Header size="medium" content="Settings" />
      <Segment basic>
        <Form
          size="big"
          onSubmit={handleSubmit(saveChanges)}
          error={!!submissionError.data}
          loading={submissionError.loading}
        >
          <WrappedTextInput
            name="username"
            control={formControl}
            defaultValue={profile.username}
            label="Username"
            placeholder="Username"
            error={formErrors.username?.message}
          />
          <WrappedSelect
            name="activeListsCount"
            control={formControl}
            defaultValue={profile.privateFields.activeListsCount}
            label="The number of active lists to show on your homepage"
            options={getNumbersOptionsArray(false, 10)}
          />
          <WrappedSelect
            name="recentActivityCount"
            control={formControl}
            defaultValue={profile.privateFields.recentActivityCount}
            label="The number of recent activity entries to show on your homepage"
            options={getNumbersOptionsArray(false, 10)}
          />
          <Form.Field>
            <WrappedCheckbox
              name="showActivityOnPublicProfile"
              control={formControl}
              defaultValue={profile.privateFields.showActivityOnPublicProfile}
              label="Allow others to see your public list activity"
              toggle
            />
          </Form.Field>
          <Form.Group>
            <Button
              type="submit"
              icon="check"
              content="Save"
              color="green"
              disabled={!!submissionError.data}
            />
            <Button
              type="reset"
              onClick={handleReset}
              content="Reset"
              icon="redo"
            />
          </Form.Group>
          <Message error header="Error" content={submissionError.data} />
        </Form>
      </Segment>
    </Fragment>
  );
};

export default SettingsTab;
