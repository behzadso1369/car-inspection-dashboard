import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UtmFilterOptions, UtmQueryFilters } from '../../_models/response/utm/utmAnalytics.response';
import { errorText, fetchUtmFilters } from './utmAnalyticsApi';
import {
  defaultUtmFilterForm,
  UtmFilterFormValues,
} from './UtmAnalyticsFilters';
import { filtersFromForm, toIsoDate } from './utmAnalyticsHelpers';

export function useUtmReportFilters() {
  const form = useForm<UtmFilterFormValues>({ defaultValues: defaultUtmFilterForm });
  const { getValues, reset } = form;
  const [appliedFilters, setAppliedFilters] = useState<UtmQueryFilters>({ includeBots: false });
  const [filterOptions, setFilterOptions] = useState<UtmFilterOptions | null>(null);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const refreshFilterOptions = useCallback(() => {
    const { fromDate, toDate } = getValues();
    fetchUtmFilters({
      from: toIsoDate(fromDate),
      to: toIsoDate(toDate),
    })
      .then(setFilterOptions)
      .catch((err) => {
        setFilterOptions(null);
        setOptionsError(errorText(err));
      });
  }, [getValues]);

  useEffect(() => {
    refreshFilterOptions();
  }, [refreshFilterOptions]);

  const applyFilters = useCallback(() => {
    const next = filtersFromForm(getValues());
    setAppliedFilters(next);
    refreshFilterOptions();
  }, [getValues, refreshFilterOptions]);

  const clearFilters = useCallback(() => {
    reset(defaultUtmFilterForm);
    setAppliedFilters({ includeBots: false });
    refreshFilterOptions();
  }, [reset, refreshFilterOptions]);

  return {
    form,
    appliedFilters,
    filterOptions,
    optionsError,
    applyFilters,
    clearFilters,
  };
}
