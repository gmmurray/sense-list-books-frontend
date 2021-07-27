import { FC } from 'react';
import { Grid, Placeholder } from 'semantic-ui-react';
import { SemanticWIDTHS } from 'semantic-ui-react/dist/commonjs/generic';

const PLACEHOLDER_COUNT = 4;

type StatisticsPlaceholderProps = {
  count?: SemanticWIDTHS;
};

const StatisticsPlaceholder: FC<StatisticsPlaceholderProps> = ({
  count = PLACEHOLDER_COUNT,
}) => {
  return (
    <Grid>
      {[...Array(count)].map(() => (
        <Grid.Column width={count}>
          <Placeholder>
            <Placeholder.Image />
          </Placeholder>
        </Grid.Column>
      ))}
    </Grid>
  );
};

export default StatisticsPlaceholder;
