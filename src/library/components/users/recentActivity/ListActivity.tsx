import TimeAgo from 'javascript-time-ago';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Feed } from 'semantic-ui-react';
import { RecentListActivity } from 'src/library/entities/user/RecentActivity';
import { ActivityType } from 'src/library/types/ActivityType';
import { appRoutes } from 'src/main/routes';

type ListActivityProps = {
  data: RecentListActivity;
  timeAgo: TimeAgo;
  type: ActivityType.createdList | ActivityType.updatedList;
};

const ListActivity: FC<ListActivityProps> = ({
  data: { identifier, timeStamp, title },
  timeAgo,
  type,
}) => {
  let verb, listDescriptor, icon;
  if (type === ActivityType.createdList) {
    verb = 'Created';
    listDescriptor = 'new ';
    icon = 'add';
  } else {
    verb = 'Updated';
    listDescriptor = '';
    icon = 'edit';
  }
  return (
    <Feed.Event>
      <Feed.Label icon={icon} />
      <Feed.Content>
        <Feed.Summary>
          {`${verb} a ${listDescriptor} book list`}
          <Feed.Date>{timeAgo.format(new Date(timeStamp))}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra>
          <Link
            to={appRoutes.lists.view.getDynamicPath!(identifier)}
            target="_blank"
          >
            {title}
          </Link>
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>
  );
};

export default ListActivity;
