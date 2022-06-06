import * as profile from '~/server/entities/profile';

export const getProfile = async (ssb, feedId = 'self') => {
  try {
    return profile.getProfile(ssb, feedId === 'self' ? ssb.id : feedId);
  } catch ({ message, name }) {
    throw new Error(`${name} on getProfile: ${message}`);
  }
};
