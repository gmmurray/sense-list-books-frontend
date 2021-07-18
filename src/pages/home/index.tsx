import { useAuth0 } from '@auth0/auth0-react';
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { Button, Container, Header, Menu, Transition } from 'semantic-ui-react';
import * as usersApi from 'src/library/api/backend/users';
import BreadcrumbWrapper from 'src/library/components/layout/BreadcrumbWrapper';
import { ACTIVE_LISTS_COUNT } from 'src/library/constants/activity';
import { defaultErrorTimeout } from 'src/library/constants/alertOptions';
import { BookUserList } from 'src/library/entities/userList/BookUserList';
import { DataTotalResponse } from 'src/library/types/responseWrappers';
import { appRoutes } from 'src/main/routes';
import ActiveLists from './ActiveLists';
import RecentUserActivity from 'src/library/components/users/recentActivity/RecentUserActivity';
import { useAppContext } from 'src/main/context/appContext';

const Home = () => {
  const auth = useAuth0();
  const alert = useAlert();
  const { currentProfile: userProfile } = useAppContext() || {};

  const [showActiveLists, setShowActiveLists] = useState(true);
  const [activeLists, setActiveLists] = useState(
    new DataTotalResponse<BookUserList>([], 0),
  );
  const [activeListsLoading, setActiveListsLoading] = useState(true);

  const [showRecentActivity, setShowRecentActivity] = useState(true);

  const getUserLists = useCallback(async () => {
    setActiveListsLoading(true);
    try {
      const data = await usersApi.getActiveLists(auth, ACTIVE_LISTS_COUNT);
      setActiveLists(data);
    } catch (error) {
      alert.error(error.message, defaultErrorTimeout);
    } finally {
      setActiveListsLoading(false);
    }
  }, [auth, alert]);

  useEffect(() => {
    getUserLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container style={{ minHeight: '85vh' }}>
      <BreadcrumbWrapper breadcrumbs={appRoutes.home.index.breadcrumbs!} />
      <Menu borderless secondary>
        <Menu.Item fitted>
          <Header as="h1">Active Lists</Header>
        </Menu.Item>
        <Menu.Item position="right" fitted>
          <Button
            onClick={() => setShowActiveLists(!showActiveLists)}
            icon={showActiveLists ? 'chevron up' : 'chevron down'}
            basic
          />
        </Menu.Item>
      </Menu>
      <Transition.Group animation="slide down" duration={300}>
        {showActiveLists && (
          <Container>
            <ActiveLists data={activeLists.data} loading={activeListsLoading} />
          </Container>
        )}
      </Transition.Group>
      <Menu borderless secondary>
        <Menu.Item fitted>
          <Header as="h1">Recent Activity</Header>
        </Menu.Item>
        <Menu.Item position="right" fitted>
          <Button
            onClick={() => setShowRecentActivity(!showRecentActivity)}
            icon={showRecentActivity ? 'chevron up' : 'chevron down'}
            basic
          />
        </Menu.Item>
      </Menu>
      <Transition.Group animation="slide down" duration={300}>
        {userProfile && showRecentActivity && (
          <Container>
            <RecentUserActivity
              data={userProfile.recentActivity}
              loading={false}
              isActivityOwner={true}
            />
          </Container>
        )}
      </Transition.Group>
    </Container>
  );
};

export default Home;
