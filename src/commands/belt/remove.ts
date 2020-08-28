import color from '@heroku-cli/color';
import { Command, flags } from '@heroku-cli/command';

import { getOrCreateCache, writeCache } from '../../utils/cache';

export default class RemoveAcount extends Command {
  static description = 'removes heroku account from your belt';

  static flags = {
    id: flags.string({
      char: 'i',
      description: 'account id',
      exclusive: ['name', 'email'],
    }),
    name: flags.string({
      char: 'n',
      description: 'account name',
      exclusive: ['email', 'id'],
    }),
    email: flags.string({
      char: 'e',
      description: 'account email',
      exclusive: ['name', 'id'],
    }),
    index: flags.integer({
      char: 'x',
      description: 'account idx in list',
      exclusive: ['name', 'id', 'email'],
    }),
  };

  async run() {
    const cache = await getOrCreateCache(this.config.dataDir);
    const { flags } = this.parse(RemoveAcount);

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

    cache.splice(cache.indexOf(account), 1);
    writeCache(this.config.dataDir, cache);
    this.log(
      `Successfully removed account with ${property} ${color.green(
        account[property] || ''
      )}!`
    );
  }
}
