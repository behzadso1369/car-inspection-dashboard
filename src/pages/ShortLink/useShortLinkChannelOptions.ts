import { useCallback, useEffect, useMemo, useState } from 'react';
import { ShortLinkChannelRecord } from '../../_models/response/shortLink/shortLink.response';
import { errorText, listShortLinkChannels } from './shortLinkApi';
import { buildChannelTitleLookup, channelsToSelectOptions } from './shortLinkHelpers';

export function useShortLinkChannelOptions(activeOnly: boolean) {
  const [channels, setChannels] = useState<ShortLinkChannelRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return listShortLinkChannels(activeOnly)
      .then(setChannels)
      .catch((err) => {
        setChannels([]);
        setError(errorText(err));
      })
      .finally(() => setLoading(false));
  }, [activeOnly]);

  useEffect(() => {
    reload();
  }, [reload]);

  const selectOptions = useMemo(() => channelsToSelectOptions(channels), [channels]);
  const channelTitle = useMemo(() => buildChannelTitleLookup(channels), [channels]);

  return { channels, selectOptions, channelTitle, loading, error, reload };
}
