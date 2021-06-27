import { useAuth0 } from '@auth0/auth0-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { Redirect, useHistory, useLocation, useParams } from 'react-router-dom';
import { UserProfile } from 'src/library/entities/user/UserProfile';
import * as usersApi from 'src/library/api/backend/users';
import { appRoutes } from 'src/main/routes';
import { Header, Loader, Menu, Segment, Tab } from 'semantic-ui-react';

import './styles.scss';
import { defaultErrorTimeout } from 'src/library/constants/alertOptions';
import ActivityTab from './tabs/ActivityTab';
import SegmentPlaceholder from 'src/library/components/shared/SegmentPlaceholder';

type ViewUserProfileProps = {
  userId: string;
};

const ViewUserProfile: FC<ViewUserProfileProps> = () => {
  const auth = useAuth0();
  const alert = useAlert();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const activeTab = query.get('tab') ?? 0;

  const { userId } = useParams<ViewUserProfileProps>();
  const {
    user: { sub: authId },
  } = auth;
  const isProfileOwner = userId === authId;

  const [userProfile, setUserProfile] = useState<{
    profile: UserProfile | null;
    loading: boolean;
  }>({ profile: null, loading: true });

  const getUserProfile = useCallback(async () => {
    setUserProfile(state => ({ ...state, loading: true }));
    try {
      const data = await usersApi.getUserProfile(auth, userId);
      setUserProfile(state => ({ ...state, profile: data }));
    } catch (error) {
      alert.error(error.message, defaultErrorTimeout);
    } finally {
      setUserProfile(state => ({ ...state, loading: false }));
    }
  }, [alert, auth, userId]);

  useEffect(() => {
    if (userId) getUserProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!userId) {
    return <Redirect to={appRoutes.home.index.path} />;
  } else if (userProfile.loading) {
    return (
      <Segment className="loader-container">
        <Loader active />
      </Segment>
    );
  } else if (!userProfile.profile) {
    return (
      <SegmentPlaceholder
        text="That profile could not be found"
        iconName="times circle"
        linkTo={appRoutes.home.index.path}
        linkText="Return home"
      />
    );
  } else {
    return (
      <>
        <Header size="huge">{userProfile.profile?.username}</Header>
        <Tab
          activeIndex={activeTab}
          menu={{ secondary: true, pointing: true }}
          panes={[
            {
              menuItem: (
                <Menu.Item
                  onClick={() => history.push(`${userId}?tab=0`)}
                  key="activity"
                  icon="chart bar"
                  content="Activity"
                />
              ),
              render: () => (
                <Tab.Pane attached={false}>
                  <ActivityTab
                    recentActivityData={userProfile.profile!.recentActivity}
                    recentActivityLoading={userProfile.loading}
                    isActivityOwner={isProfileOwner}
                  />
                </Tab.Pane>
              ),
            },
            {
              menuItem: (
                <Menu.Item
                  onClick={() => history.push(`${userId}?tab=1`)}
                  key="lists"
                  icon="list"
                  content="Lists"
                />
              ),
              render: () => <Tab.Pane attached={false}>Lists</Tab.Pane>,
            },
            {
              menuItem: isProfileOwner ? (
                <Menu.Item
                  onClick={() => history.push(`${userId}?tab=2`)}
                  key="settings"
                  icon="settings"
                  content="Settings"
                />
              ) : undefined,
              render: isProfileOwner
                ? () => <Tab.Pane attached={false}>Settings</Tab.Pane>
                : undefined,
            },
          ]}
        />
      </>
    );
  }
};

export default ViewUserProfile;
