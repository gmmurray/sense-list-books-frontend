import { RecentActivity } from './RecentActivity';

export class UserProfile {
  constructor(
    public authId: string,
    public username: string,
    public privateFields: PrivateUserFields,
    public pinnedListId: string,
    public recentActivity: RecentActivity[],
    public listCount: number | null,
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
    public username: string,
    public authId: string,
    public privateFields?: PrivateUserFields,
  ) {}
}

export class PatchUserProfileDto {
  constructor(
    public username?: string,
    public pinnedListId?: string,
    public recentActivityCount?: number,
    public activeListsCount?: number,
    public showActivityOnPublicProfile?: boolean,
  ) {}
}
