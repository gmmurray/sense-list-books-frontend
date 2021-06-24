export class UserProfile {
  constructor(
    public authId: string,
    public username: string,
    public privateFields: PrivateUserFields,
    public listCount?: number,
    public avatarUrl?: string,
  ) {}
}

export class PrivateUserFields {
  constructor(
    public recentActivityCount: number,
    public activeListsCount: number,
    public showActivityOnPublicProfile: boolean,
  ) {}
}

export class CreateUserProfileDto {
  constructor(
    public authId?: string,
    public username?: string,
    public privateFields?: PrivateUserFields,
  ) {}
}

export class PatchUserProfileDto {
  constructor(
    public username?: string,
    public recentActivityCount?: number,
    public activeListsCount?: number,
    public showActivityOnPublicProfile?: boolean,
  ) {}
}
