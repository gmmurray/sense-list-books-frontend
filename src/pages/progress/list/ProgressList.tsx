import { useAuth0 } from '@auth0/auth0-react';
import { Fragment, useCallback, useEffect, useState } from 'react';
import BreadcrumbWrapper from 'src/library/components/layout/BreadcrumbWrapper';
import { BookUserList } from 'src/library/entities/userList/BookUserList';
import { DataTotalResponse } from 'src/library/types/responseWrappers';
import { appRoutes } from 'src/main/routes';
import * as userListsApi from 'src/library/api/backend/userLists';
import { syncSearch } from 'src/library/utilities/search';
import { BookList } from 'src/library/entities/list/BookList';
import AllUserLists from './AllUserLists';
import {
  DEFAULT_FILTER_OPTIONS,
  filterBookUserLists,
  filterOptions,
} from './helpers';
import { showErrorToast } from 'src/library/components/layout/ToastifyWrapper';

const searchableFields = ['title', 'description', 'category'];

const ProgressList = () => {
  const auth = useAuth0();

  const [allUserLists, setAllUserLists] = useState<
    DataTotalResponse<BookUserList>
  >(new DataTotalResponse([], 0));
  const [allUserListsLoading, setAllUserListsLoading] = useState(true);

  const [visibleUserLists, setVisibleUserLists] = useState<BookUserList[]>([]);

  const [filterOptions, setFilterOptions] = useState(DEFAULT_FILTER_OPTIONS);

  const getUserLists = useCallback(async () => {
    setAllUserListsLoading(true);
    try {
      const data = await userListsApi.getAllUserLists(auth);
      setAllUserLists(data);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setAllUserListsLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    getUserLists();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setVisibleUserLists(allUserLists.data);
  }, [allUserLists]);

  const handleListSearch = useCallback(
    (searchTerm: string) => {
      const nestedLists = allUserLists.data.map(ul => ul.list as BookList);
      const result = syncSearch(searchTerm, [...searchableFields], nestedLists);
      const relatedUserLists = allUserLists.data.filter(ul =>
        result.some(list => list.id === (ul.list as BookList).id),
      );
      setVisibleUserLists(relatedUserLists);
    },
    [allUserLists.data],
  );

  const handleFilterChange = useCallback(
    (filterChange: Partial<filterOptions>) => {
      setFilterOptions({ ...filterOptions, ...filterChange });
    },
    [filterOptions],
  );

  useEffect(() => {
    setVisibleUserLists(
      filterBookUserLists(filterOptions, allUserLists.data, auth.user.sub),
    );
  }, [filterOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fragment>
      <BreadcrumbWrapper
        breadcrumbs={appRoutes.progress.list.breadcrumbs!}
        onPage={true}
      />
      <AllUserLists
        data={visibleUserLists}
        loading={allUserListsLoading}
        onSearch={handleListSearch}
        filter={filterOptions}
        onFilterChange={handleFilterChange}
        emptyResults={allUserLists.total === 0}
      />
    </Fragment>
  );
};

export default ProgressList;
