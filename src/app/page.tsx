import { getSongsByUser } from "@/app/action/get-songs-by-user-action";
import PageContent from "./components/getFiles/PageContent";
import HeaderClient from "./components/headerClient/HeaderClient";

// make sure page is not cached and always up-to-date
// export const revalidate = 0;

export default async function Home() {
  const songsByUser = await getSongsByUser();
  // console.log("songs by user", songsByUser);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <HeaderClient />
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white font-semibold text-2xl">Newest songs</h1>
        </div>
        <div>
          <PageContent songs={songsByUser || []} />
        </div>
      </div>
    </div>
  );
}
