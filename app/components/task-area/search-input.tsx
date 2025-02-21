import { useQueryStore } from "@/app/hooks/useQueryStore";
import { Input } from "@/components/ui/input";

export default function SearchInput() {
  const { query, setQuery } = useQueryStore();

  return (
    <Input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      type="text"
      className="h-10"
      placeholder="Filter By Tasks..."
    />
  );
}
