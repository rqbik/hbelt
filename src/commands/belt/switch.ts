import color from '@heroku-cli/color';
import { Command, flags } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';

import { getOrCreateCache } from '../../utils/cache';
import { login } from '../../utils/login';

export default class SwitchAcount extends Command {
  static description =
    'allows you to switch between multiple heroku account in your belt';

  static flags = {
    id: flags.string({
      char: 'i',
      description: 'account id',
      exclusive: ['name', 'email', 'idx'],
    }),
    name: flags.string({
      char: 'n',
      description: 'account name',
      exclusive: ['email', 'id', 'idx'],
    }),
    email: flags.string({
      char: 'e',
      description: 'account email',
      exclusive: ['name', 'id', 'idx'],
    }),
    index: flags.integer({
      char: 'x',
      description: 'account idx in list',
      exclusive: ['name', 'id', 'email'],
    }),
  };

  async run() {
    const cache = await getOrCreateCache(this.config.dataDir);
    const { flags } = this.parse(SwitchAcount);

    if (
      !flags.email &&
      !flags.id &&
      !flags.name &&
      typeof flags.index !== 'number'
    )
      return this.error('Please input either account email, name, id or index');

    if (flags.index && (flags.index < 0 || flags.index > cache.length - 1))
      return this.error('Index out of list bounds');

    const property = flags.id ? 'id' : flags.email ? 'email' : 'name';

    const account =
      typeof flags.index === 'number'
        ? cache[flags.index]
        : cache.find((acc) => acc[property] === flags[property]);

    if (!account)
      return this.error(
        `Couldn't find any accounts in your belt with ${property} ${color.green(
          `"${flags[property]}"`
        )}.`
      );

    const current = (
      await this.heroku.get<Heroku.Account>('/account', { retryAuth: false })
    ).body;

    if (account.email === current.email)
      return this.error(`You are already logged into this account.`);

    await login(this.heroku, account.email, account.password);
    await this.heroku.get<Heroku.Account>('/account', { retryAuth: false });

    this.log(
      `Successfully switched to account with ${property} ${color.green(
        account[property] || ''
      )}!`
    );
  }
}
