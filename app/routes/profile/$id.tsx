import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getProfile } from "~/server/api.server";
import { ssbServer } from "~/server/ssb.server";

interface Profile {
  id: string;
  name: string;
  description: string;
  image?: string;
  imageBlob?: string;
  following?: boolean;
}

type LoaderData = {
  profile: Profile;
};

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const ssb = ssbServer();
  const profile = await getProfile(ssb, id);

  return json({ profile });
};

export default function Index() {
  const {
    profile: { id, name, description, image, imageBlob, following },
  } = useLoaderData<LoaderData>();

  return (
    <div>
      <img src={`data:image/jpg;base64,${imageBlob}`} alt="Profile avatar" />
    </div>
  );
}
