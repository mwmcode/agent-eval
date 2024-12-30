import { Index as UpstashIndex } from '@upstash/vector';

const index = new UpstashIndex();

export const queryMovies = async ({
  query,
  filters,
  topK = 5,
}: {
  query: string;
  filters?: any;
  topK?: number;
}) => {
  // the field below will return to the LLM so it can 👀 them
  return index.query({
    data: query,
    topK,
    includeMetadata: true, // the `metadata` field in `upsert.upsert`
    includeData: true, // the `data` field in `upsert.upsert`
  });
};
