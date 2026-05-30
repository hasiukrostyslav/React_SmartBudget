import { useLocation, useNavigate, useSearchParams } from 'react-router';

import { createQueryString } from '@/lib/utils/utils';

export function useSort() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const sort = searchParams.get('sort');
  const order = searchParams.get('order');

  const handleSort = (label: string) => {
    const orderValue = sort === label && order === 'desc' ? 'asc' : 'desc';

    const newSearchString = createQueryString(searchParams, [
      { name: 'sort', value: label },
      {
        name: 'order',
        value: orderValue,
      },
    ]);
    navigate(`${location.pathname}?${newSearchString}`, { replace: true });
  };

  return { handleSort, sort, order };
}
