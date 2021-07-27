import { Auth0ContextInterface } from '@auth0/auth0-react';
import { RecentActivity } from 'src/library/entities/user/RecentActivity';
import {
  CreateUserProfileDto,
  PatchUserProfileDto,
  UserProfile,
} from 'src/library/entities/user/UserProfile';
import { UserStatistics } from 'src/library/entities/user/UserStatistics';
import { PopulatedBookUserList } from 'src/library/entities/userList/BookUserList';
import { DataTotalResponse } from 'src/library/types/responseWrappers';
import { authenticatedRequest } from '.';

export const bookUsersRoute = `${process.env.REACT_APP_BACKEND_URL}/books/users`;
export const userProfilesRoute = `${bookUsersRoute}/profiles`;

export const getUserProfile = async (
  authContext: Auth0ContextInterface,
  authId: string,
): Promise<UserProfile> => {
  return await authenticatedRequest({
    authContext,
    method: 'GET',
    url: `${userProfilesRoute}/${authId}`,
  });
};

export const createUserProfile = async (
  authContext: Auth0ContextInterface,
  data: CreateUserProfileDto,
): Promise<UserProfile> => {
  return await authenticatedRequest({
    authContext,
    method: 'POST',
    url: `${userProfilesRoute}`,
    data,
  });
};

export const updateUserProfile = async (
  authContext: Auth0ContextInterface,
  data: PatchUserProfileDto,
): Promise<void> => {
  return await authenticatedRequest({
    authContext,
    method: 'PATCH',
    url: `${userProfilesRoute}`,
    data,
  });
};

export const getRecentActivity = async (
  authContext: Auth0ContextInterface,
  count: number,
): Promise<DataTotalResponse<RecentActivity>> => {
  return await authenticatedRequest({
    authContext,
    method: 'GET',
    url: `${bookUsersRoute}/activity/${count}`,
  });
};

export const getActiveLists = async (
  authContext: Auth0ContextInterface,
  count: number,
): Promise<DataTotalResponse<PopulatedBookUserList>> => {
  return await authenticatedRequest({
    authContext,
    method: 'GET',
    url: `${bookUsersRoute}/active-lists/${count}`,
  });
};

export const registerUser = async (
  authContext: Auth0ContextInterface,
  data: CreateUserProfileDto,
): Promise<void> =>
  await authenticatedRequest({
    authContext,
    method: 'POST',
    url: `${bookUsersRoute}/register`,
    data,
  });

export const getUserStats = async (
  authContext: Auth0ContextInterface,
  authId: string,
): Promise<UserStatistics> =>
  await authenticatedRequest({
    authContext,
    method: 'GET',
    url: `${bookUsersRoute}/statistics/${authId}`,
  });
