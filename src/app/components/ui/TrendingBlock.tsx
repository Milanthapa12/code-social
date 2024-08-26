import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { Loader2 } from 'lucide-react'
import React, { Suspense } from 'react'
import UserAvatar from './UserAvatar'
import { unstable_cache } from 'next/cache'
import { bigint } from 'zod'
import Link from 'next/link'
import { getUserDataSelect } from '@/lib/type'
import FollowButton from '../FollowButton'
import UserToolTip from '../user/UserToolTip'

export default function TrendingBlock() {
    return (
        <div className='sticky top-[5.25rem] hidden md:block w-72 flex-none space-y-5 lg:w-80'>
            <Suspense fallback={<Loader2 className='mx-auto animate-spin' />}>
                <WhoToFollow />
                <TrendingTopic />
            </Suspense>
        </div>
    )
}

async function WhoToFollow() {

    const { user } = await validateRequest()
    if (!user) return null;
    // await new Promise(r => setTimeout(r, 10000))
    const notFollowedUsers = await prisma.user.findMany({
        where: {
            NOT: {
                id: user.id
            },
            followers: {
                none: {
                    followerId: user.id
                }
            }
        },
        select: getUserDataSelect(user.id),
        take: 5
    })

    return (<div className='space-y-5 rounded-2xl bg-card p-5 shadow-sm'>
        <div className="text-xl font-bold">Who to follow</div>
        {
            notFollowedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-3">
                    <UserToolTip user={user}>
                        <Link href={`/users/${user.username}`} className='flex items-center gap-3'>
                            <UserAvatar avatarURL={user.avatar} className='flex-none' />
                            <div>
                                <p className="line-clamp-1 break-all font-semibold hover:underline">
                                    {user.name}
                                </p>
                                <p className="line-clamp-1 break-all text-muted-foreground">
                                    @{user.username}</p>
                            </div>
                        </Link>
                    </UserToolTip>
                    <FollowButton
                        userId={user.id}
                        initialState={{
                            followers: user._count.followers,
                            isFollowedByUser: user.followers.some(
                                ({ followerId }) => followerId === user.id
                            )
                        }}
                    />
                </div>
            ))
        }
    </div>)
}

// const getTrendingTopics = unstable_cache(
//     async () => {
//         const result = await prisma.$queryRaw<{ hashtag: string, count: bigint }[]>`
//         SELECT hashtag, COUNT(*) AS count
//         FROM (
//           SELECT LOWER(SUBSTRING_INDEX(SUBSTRING_INDEX(content, ' ', n), ' ', -1)) AS hashtag
//           FROM posts 
//           JOIN (
//             SELECT @row := @row + 1 AS n
//             FROM (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t1,
//                  (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t2,
//                  (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t3,
//                  (SELECT @row := 0) t4
//           ) numbers ON CHAR_LENGTH(content) - CHAR_LENGTH(REPLACE(content, ' ', '')) >= n - 1
//         ) hashtags
//         WHERE hashtag REGEXP '^#[[:alnum:]_]+$'
//         GROUP BY hashtag
//         ORDER BY count DESC, hashtag ASC
//         LIMIT 5;
//       `;

//         return result.map((row) => ({
//             hashtag: row.hashtag,
//             count: Number(row.count),
//         }));
//     },
//     ["trending_topics"],
//     {
//         revalidate: 3 * 60 * 60, // cached 3hrs
//     }
// );


const getTrendingTopics = unstable_cache(
    async () => {
        const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
              SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
              FROM posts
              GROUP BY (hashtag)
              ORDER BY count DESC, hashtag ASC
              LIMIT 5
          `;

        return result.map((row) => ({
            hashtag: row.hashtag,
            count: Number(row.count),
        }));
    },
    ["trending_topics"],
    {
        revalidate: 3 * 60 * 60,
    },
);


async function TrendingTopic() {
    const trendingTopics = await getTrendingTopics()
    return (<div className='space-y-5 rounded-2xl bg-card p-5 shadow-sm'>
        <div className="text-xl font-bold">
            {trendingTopics.map(({ hashtag, count }) => {
                const title = hashtag.split('#')[1];
                return (<Link key={title} href={`/hashtag/${title}`} className='block'>
                    <p className="line-clamp-1 break-all font-semibold hover:underline" title={title}>{hashtag}</p>
                    <div className="text-sm text-muted-forground">{count}</div>
                </Link>
                )
            })
            }
        </div>
    </div>)
}
