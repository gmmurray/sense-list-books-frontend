import React, { FC } from 'react';
import { Image, Popup, Grid } from 'semantic-ui-react';
import { UserProfile } from 'src/library/entities/user/UserProfile';

import defaultAvatar from '../../assets/images/default_profile_avatar.png';

type UserProfilePopupProps = {
  root: string | JSX.Element;
  profile: UserProfile | null;
};

const UserProfilePopup: FC<UserProfilePopupProps> = ({ root, profile }) => {
  if (!profile) return null;
  const { username, avatarUrl, listCount } = profile;
  const imageSrc = avatarUrl ?? defaultAvatar;
  return (
    <Popup key={profile.authId} trigger={root} size="large">
      <Popup.Header>{username}</Popup.Header>
      <Popup.Content>
        <Grid columns={2}>
          <Grid.Column>
            <Image size="mini" circular src={imageSrc} />
          </Grid.Column>
          <Grid.Column>{listCount} list(s)</Grid.Column>
        </Grid>
      </Popup.Content>
    </Popup>
  );
};

export default UserProfilePopup;
