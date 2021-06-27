import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Fragment } from 'react';
import { FC } from 'react';
import { Feed } from 'semantic-ui-react';
import SegmentPlaceholder from 'src/library/components/shared/SegmentPlaceholder';
import RecentActivityPlaceholder from 'src/library/components/users/RecentActivityPlaceholder';
import {
  RecentActivity,
  RecentBULIActivity,
  RecentListActivity,
  RecentUserListActivity,
} from 'src/library/entities/user/RecentActivity';
import { ActivityType } from 'src/library/types/ActivityType';
import { appRoutes } from 'src/main/routes';
import BULIActivity from './BULIActivity';
import ListActivity from './ListActivity';
import UserListActivity from './UserListActivity';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-us');

type RecentUserActivityProps = {
  loading: boolean;
  data: RecentActivity[];
  isActivityOwner: boolean;
};

const RecentUserActivity: FC<RecentUserActivityProps> = ({
  loading,
  data,
  isActivityOwner,
}) => {
  if (loading) {
    return <RecentActivityPlaceholder elements={5} />;
  } else if (data.length === 0) {
    return (
      <SegmentPlaceholder
        text="No recent activity available"
        iconName="times circle"
        linkTto={isActivityOwner ? appRoutes.progress.start.path : undefined}
        linkText={isActivityOwner ? 'Start now' : undefined}
      />
    );
  }
  const sortedData = [...data].sort(
    (a, b) => new Date(a.timeStamp).getDate() - new Date(b.timeStamp).getDate(),
  );
  return (
    <Fragment>
      <Feed size="large">
        {sortedData.map(item => {
          if (item.type === ActivityType.start) {
            return (
              <UserListActivity
                data={item as RecentUserListActivity}
                timeAgo={timeAgo}
              />
            );
          } else if (item.type === ActivityType.progress) {
            return (
              <BULIActivity
                data={item as RecentBULIActivity}
                timeAgo={timeAgo}
              />
            );
          } else if (
            item.type === ActivityType.createdList ||
            item.type === ActivityType.updatedList
          ) {
            return (
              <ListActivity
                data={item as RecentListActivity}
                timeAgo={timeAgo}
                type={item.type}
              />
            );
          } else return null;
        })}
      </Feed>
    </Fragment>
  );
};

export default RecentUserActivity;
