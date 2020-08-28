import color from '@heroku-cli/color';
import { Command } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
import ux from 'cli-ux';

import { getOrCreateCache, writeCache } from '../../utils/cache';
import { login } from '../../utils/login';
import { flags } from '@oclif/command';

/**
 * Identical to default heroku login, but saves token after each login
 * @see https://github.com/heroku/cli/blob/master/packages/auth/src/commands/auth/login.ts
 */
export default class AddAcount extends Command {
  static description = 'add heroku account to your belt';

  static flags = {
    email: flags.string({
      char: 'e',
      description: 'account email',
      dependsOn: ['password'],
    }),
    password: flags.string({
      char: 'p',
      description: 'account password',
      dependsOn: ['email'],
    }),
  };

  async run() {
    const cache = await getOrCreateCache(this.config.dataDir);
    const { flags } = this.parse(AddAcount);

    const email =
      flags.email ||
      ((await ux.prompt('Account email', {
        required: true,
      })) as string);

    const password =
      flags.password ||
      ((await ux.prompt('Account password', {
        required: true,
        type: 'mask',
      })) as string);

    await login(this.heroku, email, password);

    const { body: account } = await this.heroku.get<Heroku.Account>(
      '/account',
      { retryAuth: false }
    );

    if (cache.find((acc) => acc.id === account.id))
      return this.error('This account already exists in your belt.');

    this.log(`Added belt account: ${color.green(email)}`);

    cache.push({
      email,
      id: account.id!,
      name: account.name!,
      password,
    });

    writeCache(this.config.dataDir, cache);
  }
}
