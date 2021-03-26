import { UserList } from '../userList/UserList';

export class ULI {
  constructor(
    public id: string,
    public userList: string | UserList,
    public userId: string,
    public notes: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
