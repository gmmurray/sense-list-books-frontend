import { FC, Fragment } from 'react';
import { Grid, Header, Statistic } from 'semantic-ui-react';
import {
  flattenStatistics,
  getUserStatisticLabelLookup,
  UserStatistics,
} from 'src/library/entities/user/UserStatistics';
import StatisticsPlaceholder from '../StatisticsPlaceholder';

type UserStatisticDetailsProps = {
  data: UserStatistics | null;
  loading: boolean;
};

const userStatisticsLabelLookup = getUserStatisticLabelLookup();

const UserStatisticDetails: FC<UserStatisticDetailsProps> = ({
  data,
  loading,
}) => {
  if (loading) {
    return <StatisticsPlaceholder />;
  } else if (data === null) return null;
  const flattenedData = flattenStatistics(data);

  return (
    <Fragment>
      <Header size="medium" content="Stats" />
      <Grid>
        {Object.keys(flattenedData).map(key => (
          <Grid.Column
            key={`${userStatisticsLabelLookup[key]}-key`}
            width={4}
            style={{ textAlign: 'center' }}
          >
            <Statistic
              size="mini"
              label={userStatisticsLabelLookup[key]}
              value={flattenedData[key]}
            />
          </Grid.Column>
        ))}
      </Grid>
    </Fragment>
  );
};

export default UserStatisticDetails;
