import { ssbServer } from "~/server/ssb.server";
import * as profile from "~/server/entities/profile";

export async function getProfile(id = "self") {
  try {
    const ssb = ssbServer();

    return profile.getProfile(ssb, id === "self" ? ssb.id : id);
  } catch (err) {
    console.error("getProfile: ", err);

    throw err;
  }
}
