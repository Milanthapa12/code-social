"use server"
import PostEditor from "@/app/components/post/editor/PostEditor";
import TrendingBlock from "@/app/components/ui/TrendingBlock";
import Feed from "./Feed";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import FollowingFeed from "./FollowingFeed";

export default async function Home() {
  return (<main className="w-full min-w-0 flex gap-5">
    <div className="w-full min-w-0 space-y-5">
      <PostEditor />
      <Tabs defaultValue="for-you">
        <TabsList>
          <TabsTrigger value="for-you">For You</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="for-you">
          <Feed />
        </TabsContent>
        <TabsContent value="following">
          <FollowingFeed />
        </TabsContent>
      </Tabs>
    </div>
    <TrendingBlock />
  </main>
  );
}
