import * as profile from '~/server/entities/profile';

export async function getProfile(ssb, id = 'self') {
  try {
    return profile.getProfile(ssb, id === 'self' ? ssb.id : id);
  } catch ({ message, name }) {
    throw new Error(`${name} on getProfile: ${message}`);
  }
}
