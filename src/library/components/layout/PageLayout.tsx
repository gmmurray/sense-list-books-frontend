import { FC, useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Container,
  Dropdown,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Sidebar,
} from 'semantic-ui-react';
import { appRoutes } from 'src/main/routes';
import Logo from '../../assets/images/logo_checkmark.png';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppContext } from 'src/main/context/appContext';

type PageLayoutType = { children: JSX.Element };

const PageLayout: FC<PageLayoutType> = ({ children }) => {
  let history = useHistory();
  const { user, logout } = useAuth0();
  const { isUserRegistered } = useAppContext() || {};
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = useCallback(
    () => logout({ returnTo: window.location.origin }),
    [logout],
  );

  const handleProfileClick = useCallback(() => {
    if (isUserRegistered) {
      const route = appRoutes.auth.viewProfile.getDynamicPath!(user.sub, '0');
      history.push(route);
    }
  }, [history, isUserRegistered, user.sub]);
  return (
    <div>
      <Sidebar.Pushable
        as={Segment}
        style={{
          overflow: 'hidden',
          border: 'none',
          borderRadius: '0',
          minHeight: '100vh',
        }}
      >
        <Sidebar
          as={Menu}
          animation="overlay"
          direction="left"
          inverted
          vertical
          visible={navOpen}
          width="wide"
          fixed="left"
          size="massive"
        >
          <Menu.Item as="a" onClick={() => setNavOpen(false)}>
            <Icon name="close" />
            Close Menu
          </Menu.Item>
          <Menu.Item
            as={Link}
            active={history.location.pathname === appRoutes.home.index.path}
            to={appRoutes.home.index.path}
          >
            <Icon name="home" />
            Home
          </Menu.Item>
          <Menu.Item
            as={Link}
            active={history.location.pathname === appRoutes.progress.start.path}
            to={appRoutes.progress.start.path}
          >
            <Icon name="list" />
            Lists
          </Menu.Item>
          <Menu.Item
            as={Link}
            active={history.location.pathname === appRoutes.lists.new.path}
            to={appRoutes.lists.new.path}
          >
            <Icon name="plus" />
            New List
          </Menu.Item>
          <Menu.Item
            as={Link}
            active={history.location.pathname === appRoutes.progress.list.path}
            to={appRoutes.progress.list.path}
          >
            <Icon name="book" />
            Progress
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher
          dimmed={navOpen}
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Menu fixed="top" inverted borderless>
            <Menu.Item
              onClick={() => setNavOpen(!navOpen)}
              style={{ marginLeft: 0 }}
            >
              <Icon name="sidebar" />
            </Menu.Item>
            <Container>
              <Menu.Item as={Link} to={appRoutes.home.index.path} header>
                <Image
                  size="mini"
                  src={Logo}
                  style={{ marginRight: '1.5em' }}
                />
                SenseList Books
              </Menu.Item>
              <Menu.Menu position="right">
                <Dropdown item icon="setting" simple>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      text="Profile"
                      icon="user"
                      onClick={handleProfileClick}
                      disabled={!isUserRegistered}
                    />
                    <Dropdown.Item
                      text="Logout"
                      icon="sign-out"
                      onClick={handleLogout}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Menu>
            </Container>
          </Menu>
          <Container text style={{ marginTop: '7rem', flex: 1 }}>
            {children}
          </Container>
          <Segment
            inverted
            style={{ padding: '5rem 0', border: 'none', borderRadius: 0 }}
          >
            <Container>
              <Grid divided inverted stackable>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <Header inverted as="h4" content="Other sites" />
                    <List link inverted>
                      <List.Item as="a">Coffee</List.Item>
                      <List.Item as="a">Exploration</List.Item>
                    </List>
                  </Grid.Column>
                  <Grid.Column width={3}>
                    <Header inverted as="h4" content="About the creator" />
                    <List link inverted>
                      <List.Item
                        as="a"
                        href="https://github.com/gmmurray"
                        target="_blank"
                      >
                        GitHub
                      </List.Item>
                      <List.Item
                        as="a"
                        href="https://gregmurray.org"
                        target="_blank"
                      >
                        Personal website
                      </List.Item>
                    </List>
                  </Grid.Column>
                  <Grid.Column width={7}>
                    <Header as="h4" inverted>
                      SenseList Books
                    </Header>
                    <p>
                      The easiest way to create and keep track of your reading
                      lists
                    </p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
};

export default PageLayout;
