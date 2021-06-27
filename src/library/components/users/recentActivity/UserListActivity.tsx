import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Feed } from 'semantic-ui-react';
import TimeAgo from 'javascript-time-ago';
import { RecentUserListActivity } from 'src/library/entities/user/RecentActivity';
import { appRoutes } from 'src/main/routes';

type UserListActivityProps = {
  data: RecentUserListActivity;
  timeAgo: TimeAgo;
};

const UserListActivity: FC<UserListActivityProps> = ({
  data: { identifier, timeStamp, title, bookCount },
  timeAgo,
}) => {
  return (
    <Feed.Event>
      <Feed.Label icon="plus" />
      <Feed.Content>
        <Feed.Summary>
          Started a new list
          <Feed.Date>{timeAgo.format(new Date(timeStamp))}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra text>
          <Link to={appRoutes.progress.view.getDynamicPath!(identifier)}>
            {title}
          </Link>
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>
  );
};

export default UserListActivity;
