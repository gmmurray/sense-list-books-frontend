import { FC, Fragment } from 'react';
import RecentUserActivity from 'src/library/components/users/recentActivity/RecentUserActivity';
import UserStatisticDetails from 'src/library/components/users/statistics/UserStatisticDetails';
import { RecentActivity } from 'src/library/entities/user/RecentActivity';
import { UserStatistics } from 'src/library/entities/user/UserStatistics';

type ActivityTabProps = {
  recentActivityData: RecentActivity[];
  recentActivityLoading: boolean;
  isActivityOwner: boolean;
  statisticsData: UserStatistics | null;
  statisticsLoading: boolean;
};

const ActivityTab: FC<ActivityTabProps> = ({
  recentActivityData,
  recentActivityLoading,
  isActivityOwner,
  statisticsData,
  statisticsLoading,
}) => {
  return (
    <Fragment>
      <UserStatisticDetails data={statisticsData} loading={statisticsLoading} />
      <RecentUserActivity
        data={recentActivityData}
        loading={recentActivityLoading}
        isActivityOwner={isActivityOwner}
      />
    </Fragment>
  );
};

export default ActivityTab;
