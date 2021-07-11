import { FC } from 'react';
import { Grid, Loader } from 'semantic-ui-react';

type FullScreenLoaderProps = {
  text?: string;
  indeterminate?: boolean;
};

const FullScreenLoader: FC<FullScreenLoaderProps> = ({
  text,
  indeterminate = false,
}) => (
  <Grid style={{ height: '100vh' }} verticalAlign="middle">
    <Grid.Column>
      <Loader active inline="centered" size="big" indeterminate={indeterminate}>
        {text}
      </Loader>
    </Grid.Column>
  </Grid>
);

export default FullScreenLoader;
