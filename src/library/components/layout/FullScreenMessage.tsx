import { FC } from 'react';
import { Grid, Header } from 'semantic-ui-react';

type FullScreenMessageProps = {
  text?: string;
  indeterminate?: boolean;
};

const FullScreenMessage: FC<FullScreenMessageProps> = ({ text }) => (
  <Grid style={{ height: '100vh' }} verticalAlign="middle" centered>
    <Grid.Column />
    <Grid.Column stretched width={10} textAlign="center">
      <Header>{text}</Header>
    </Grid.Column>
    <Grid.Column />
  </Grid>
);

export default FullScreenMessage;
