import { FC } from 'react';
import RecentUserActivity from 'src/library/components/users/recentActivity/RecentUserActivity';
import { RecentActivity } from 'src/library/entities/user/RecentActivity';

type ActivityTabProps = {
  recentActivityData: RecentActivity[];
  recentActivityLoading: boolean;
  isActivityOwner: boolean;
};

const ActivityTab: FC<ActivityTabProps> = ({
  recentActivityData,
  recentActivityLoading,
  isActivityOwner,
}) => {
  return (
    <div>
      Stats <br />
      Recent Activity
      <RecentUserActivity
        data={recentActivityData}
        loading={recentActivityLoading}
        isActivityOwner={isActivityOwner}
      />
    </div>
  );
};

export default ActivityTab;
