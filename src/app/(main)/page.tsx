"use server"
import PostEditor from "@/app/components/post/editor/PostEditor";
import TrendingBlock from "@/app/components/ui/TrendingBlock";
import Feed from "./Feed";

export default async function Home() {
  return (<main className="w-full min-w-0 flex gap-5">
    <div className="w-full min-w-0 space-y-5">
      <PostEditor />
      <Feed />
    </div>
    <TrendingBlock />
  </main>
  );
}
