import { getSongsByTitle } from "../_action/get-songs-by-title-action";
import HeaderSearch from "../components/headerClient/HeaderSearch";
import SearchInput from "../components/SearchInput";
import SearchContent from "./component/SearchContent";

interface SearchProps {
  searchParams: {
    title: string;
  };
}

const Search = async ({ searchParams }: SearchProps) => {
  const songs = (await getSongsByTitle(searchParams.title)) || [];
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <HeaderSearch />
      <div className="mb-2 flex flex-col gap-y-6">
        <h1 className=" text-white text-3xl font-semibold p-6">Search</h1>
        <SearchInput />
      </div>
      <SearchContent songs={songs} />
    </div>
  );
};

export default Search;
