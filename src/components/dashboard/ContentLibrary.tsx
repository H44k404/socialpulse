"use client";

import * as React from "react";
import { Image, UploadCloud, Search } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type Asset = {
  id: string;
  name: string;
  type: "image" | "video";
  tags: string[];
};

const demoAssets: Asset[] = [
  { id: "a1", name: "Launch-teaser.png", type: "image", tags: ["launch", "product"] },
  { id: "a2", name: "Behind-the-scenes.mp4", type: "video", tags: ["bts", "team"] }
];

export function ContentLibrary() {
  const [query, setQuery] = React.useState("");
  const assets = demoAssets.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Card gradientBorder padding="lg">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Content Library</h2>
          <p className="text-sm text-gray-400 mt-1">Centralized media storage with tagging, search, and versioning (demo).</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" dot>
            Smart tags
          </Badge>
          <Button variant="secondary" size="sm" iconLeft={<UploadCloud className="h-4 w-4" />}>
            Upload
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="max-w-md">
          <Input
            label="Search assets"
            iconLeft={<Search className="h-4 w-4" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by filename, tag, or campaign..."
            onClear={() => setQuery("")}
            className="bg-white/5 border-white/20 rounded-2xl focus:border-purple-400/60 focus:bg-white/10 transition-all duration-300 hover:border-white/30"
          />
        </div>

        {assets.length === 0 ? (
          <div className="mt-8 grid place-items-center rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-12 text-center backdrop-blur-sm">
            <div className="glass flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-lg">
              <Image className="h-8 w-8 text-pulse-muted" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-white">No assets found</h3>
            <p className="mt-1 max-w-md text-sm text-pulse-muted">
              Upload images and videos, then tag them for instant search. Your library becomes your team’s single
              source of truth.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {assets.map((a) => (
              <div key={a.id} className="glass group rounded-2xl border border-white/10 p-3 transition hover:bg-white/10">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-pulse-text">{a.name}</p>
                  <Badge variant="neutral" size="sm">
                    {a.type}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {a.tags.map((t) => (
                    <Badge key={t} variant="info" size="sm">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

