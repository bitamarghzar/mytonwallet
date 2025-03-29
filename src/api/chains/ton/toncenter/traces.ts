import type { ApiNetwork } from '../../../types';
import type { AddressBook, MetadataMap, Trace } from './types';

import { callToncenterV3 } from './other';

type TracesResponse = {
  traces: Trace[];
  address_book: AddressBook;
  metadata: MetadataMap;
};

export async function fetchTrace(options: {
  network: ApiNetwork;
  traceId: string;
}): Promise<{ trace: Trace; addressBook: AddressBook }> {
  const { network, traceId } = options;

  const response = await callToncenterV3<TracesResponse>(network, '/traces', {
    trace_id: traceId,
    include_actions: true,
  });

  return {
    trace: response.traces[0],
    addressBook: response.address_book,
  };
}
