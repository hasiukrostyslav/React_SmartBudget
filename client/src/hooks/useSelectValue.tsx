import { useState } from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router';

import { createQueryString } from '@/lib/utils/utils';

interface useSelectValueProps {
  defaultValue?: string | number;
  param?: string;
}

export function useSelectValue({
  defaultValue,
  param,
}: useSelectValueProps = {}) {
  const [selectedValue, setSelectedValue] = useState<
    string | number | undefined
  >(defaultValue);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSelect = (option: string | number) => {
    setSelectedValue(option);

    // Write to the URL search params when a param key is provided
    if (param) {
      const newSearchString = createQueryString(searchParams, [
        { name: param, value: option },
      ]);

      navigate(`${location.pathname}?${newSearchString}`, { replace: true });
    }
  };

  return { selectedValue, handleSelect };
}
