"use client";

import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type Activity = {
  id: string;
  type: "post" | "comment" | "follower" | "team" | "system";
  title: string;
  description: string;
  time: string;
};

const activities: Activity[] = [
  {
    id: "1",
    type: "post",
    title: "Post published on Instagram",
    description: "“Launch teaser — Season 2” went live.",
    time: "2m ago"
  },
  {
    id: "2",
    type: "comment",
    title: "New comments spike",
    description: "37 comments on TikTok in the last hour.",
    time: "18m ago"
  },
  {
    id: "3",
    type: "follower",
    title: "Follower milestone",
    description: "You crossed 25k followers on Instagram.",
    time: "1h ago"
  },
  {
    id: "4",
    type: "team",
    title: "Approval completed",
    description: "Jordan approved 3 posts in the July campaign.",
    time: "3h ago"
  },
  {
    id: "5",
    type: "system",
    title: "Platform update",
    description: "Threads added to the Meta API. You’re ready.",
    time: "Yesterday"
  }
];

function typeBadge(type: Activity["type"]) {
  switch (type) {
    case "post":
      return <Badge variant="info" size="sm" dot>Post</Badge>;
    case "comment":
      return <Badge variant="warning" size="sm" dot>Engagement</Badge>;
    case "follower":
      return <Badge variant="success" size="sm" dot>Growth</Badge>;
    case "team":
      return <Badge variant="neutral" size="sm" dot>Team</Badge>;
    case "system":
    default:
      return <Badge variant="info" size="sm" dot>System</Badge>;
  }
}

export function ActivityFeed() {
  return (
    <Card gradientBorder padding="lg">
      <CardHeader>
        <div>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>Real-time activity across posts, team members, and platforms.</CardDescription>
        </div>
      </CardHeader>
      <CardBody>
        <div className="max-h-72 space-y-4 overflow-auto pr-1">
          {activities.map((a) => (
            <div key={a.id} className="relative flex gap-3">
              <div className="flex flex-col items-center">
                <span className="h-2 w-2 rounded-full bg-pulse-secondary" />
                <span className="mt-1 h-full w-px bg-white/15" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-pulse-text">{a.title}</p>
                  {typeBadge(a.type)}
                </div>
                <p className="text-xs text-pulse-muted">{a.description}</p>
                <p className="text-[11px] text-pulse-muted/80">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

