import 'dotenv/config';
import { Index as UpstashIndex } from '@upstash/vector';
import { parse } from 'csv-parse/sync';
import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';

const index = new UpstashIndex();

const indexMovieData = async () => {
  const spinner = ora('Reading movie data...').start();
  const moviesPath = path.join(process.cwd(), 'src/rag/imdb_movie_dataset.csv');

  const csvData = fs.readFileSync(moviesPath, 'utf-8');
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });

  spinner.text = 'Starting movie indexing...';
  // FYI can be batched to speed it up
  // doint it row by row so you can see what's going on ;)
  for (const record of records) {
    spinner.text = `Indexing movie ${record.Title}...`;

    const text = `${record.Title}. ${record.Genre}. ${record.Description}.`;

    try {
      await index.upsert({
        id: record.Title, // using Rank as unique id
        // so in future, if it's re-ran again (some other time or from a different device), it will use the same id and not considered a new transfer
        data: text, // will be automatically embedded
        // metadata is what will be used to filter/search the data by
        metadata: {
          title: record.Title,
          year: Number(record.Year),
          genre: record.Genre,
          director: record.Director,
          actors: record.Actors,
          rating: Number(record.Rating),
          votes: Number(record.Votes),
          revenue: Number(record.Revenue),
          metascore: Number(record.Metascore),
        },
      });
    } catch (e) {
      spinner.fail(`Error indexing movie ${record.Title}`);
      console.error(e);
    }
  }

  spinner.succeed('All movies indexed!');
};

indexMovieData();
