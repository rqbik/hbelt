import { APIClient } from '@heroku-cli/command';
import ux from 'cli-ux';
import netrc from 'netrc-parser';
import { HerokuAPIError } from '@heroku-cli/command/lib/api-client';

export const login = async (
  client: APIClient,
  email: string,
  password: string
) => {
  await netrc.load();
  let auth: { password: string; login: string };
  try {
    // @ts-expect-error
    auth = await client._login.createOAuthToken(email, password, {
      expiresIn: 60 * 60 * 24 * 365,
    });
  } catch (error) {
    if (!error.body || error.body.id !== 'two_factor') {
      if (error.body.id === 'device_trust_required') {
        error.body.message =
          'The interactive flag requires Two-Factor Authentication to be enabled on your account. Please use heroku login.';
      }
      throw new HerokuAPIError(error);
    }
    const secondFactor = await ux.prompt('Two-factor code', { type: 'mask' });
    // @ts-expect-error
    auth = await client._login.createOAuthToken(email, password, {
      expiresIn: 60 * 60 * 24 * 365,
      secondFactor,
    });
  }

  client.auth = auth.password;
  // @ts-expect-error
  await client._login.saveToken(auth);
  return auth;
};
