import color from '@heroku-cli/color';
import { Command } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';

import { getOrCreateCache, CachedAccount } from '../../utils/cache';
import ux, { Table } from 'cli-ux';

export default class ListAccounts extends Command {
  static description = 'lists every account in your belt';

  static flags = {
    ...ux.table.flags(),
  };

  async run() {
    const { flags } = this.parse(ListAccounts);
    const cache = await getOrCreateCache(this.config.dataDir);

    const { body: current } = await this.heroku.get<Heroku.Account>(
      '/account',
      {
        retryAuth: false,
      }
    );

    const columns: Table.table.Columns<CachedAccount> = {
      name: {},
      email: {},
      id: {
        header: 'ID',
        extended: true,
      },
      current: {
        get: (account) =>
          current.email === account.email ? color.green('✔️') : color.red('❌'),
      },
    };

    this.log(color.cyan.bold('Accounts in your belt'));

    if (cache.length === 0) this.log(color.gray('Empty :('));
    else ux.table(cache, columns, { printLine: this.log, ...flags });
  }
}
