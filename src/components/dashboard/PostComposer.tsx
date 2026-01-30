"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addMinutes } from "date-fns";
import { z } from "zod";
import {
  Image as ImageIcon,
  Sparkles,
  Video,
  Music,
  Sticker,
  Hash,
  Camera,
  Play,
  Square,
  Type,
  Smile,
  MapPin,
  Tag
} from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dropdown } from "@/components/ui/Dropdown";
import { usePostStore } from "@/store/post-store";
import { useNotificationStore } from "@/store/notification-store";
import { PLATFORMS, type PlatformKey } from "@/lib/constants";

const schema = z.object({
  caption: z.string().min(1, "Caption is required").max(280),
  firstComment: z.string().optional(),
  scheduledAt: z.string().optional(),
  platform: z.string().min(1, "Select a platform") as z.ZodType<PlatformKey, z.ZodTypeDef, string>
});

type ComposerForm = z.infer<typeof schema>;

type InstagramFormat = "feed" | "story" | "reel";
type AspectRatio = "1:1" | "4:5" | "9:16";

export function PostComposer() {
  const { createPost, loading } = usePostStore();
  const pushToast = useNotificationStore((s) => s.push);
  const [mode, setMode] = React.useState<"now" | "schedule">("schedule");
  const [instagramFormat, setInstagramFormat] = React.useState<InstagramFormat>("feed");
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>("1:1");
  const [selectedMusic, setSelectedMusic] = React.useState<string>("");
  const [storyStickers, setStoryStickers] = React.useState<string[]>([]);
  const [hashtagFirstComment, setHashtagFirstComment] = React.useState(false);

  const defaultScheduled = format(addMinutes(new Date(), 30), "yyyy-MM-dd'T'HH:mm");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
    reset
  } = useForm<ComposerForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      caption: "",
      firstComment: "",
      platform: "instagram",
      scheduledAt: defaultScheduled
    }
  });

  const platform = watch("platform") as PlatformKey;
  const caption = watch("caption") ?? "";

  const onSubmit = async (data: ComposerForm) => {
    if (mode === "schedule" && !data.scheduledAt?.trim()) {
      setError("scheduledAt", { type: "manual", message: "Schedule time is required when scheduling." });
      return;
    }
    const scheduledAt =
      mode === "now"
        ? new Date()
        : data.scheduledAt
          ? new Date(data.scheduledAt)
          : addMinutes(new Date(), 30);

    await createPost({
      platform: data.platform as PlatformKey,
      title: data.caption.slice(0, 40),
      scheduledAt: scheduledAt.toISOString(),
      status: mode === "now" ? "published" : "scheduled"
    });

    pushToast({
      title: mode === "now" ? "Post published" : "Post scheduled",
      description:
        mode === "now" ? "Your post was sent to the selected platform." : "We’ll publish it at the scheduled time.",
      variant: "success"
    });
    reset({
      caption: "",
      firstComment: "",
      platform: "instagram",
      scheduledAt: defaultScheduled
    });
  };

  const instagramFormats = [
    { id: "feed", label: "Feed Post", icon: Square, description: "Regular post" },
    { id: "story", label: "Story", icon: Camera, description: "24-hour content" },
    { id: "reel", label: "Reel", icon: Play, description: "Short-form video" }
  ];

  const aspectRatios = [
    { id: "1:1", label: "Square (1:1)", preview: "w-20 h-20" },
    { id: "4:5", label: "Portrait (4:5)", preview: "w-16 h-20" },
    { id: "9:16", label: "Vertical (9:16)", preview: "w-14 h-20" }
  ];

  const musicTracks = [
    { id: "trending1", name: "Viral Hit #1", artist: "Trending Artist", duration: "30s" },
    { id: "trending2", name: "Dance Beat", artist: "Music Producer", duration: "45s" },
    { id: "original", name: "Original Audio", artist: "Your Audio", duration: "60s" }
  ];

  const stickerOptions = [
    { id: "location", icon: MapPin, label: "Location" },
    { id: "mention", icon: Tag, label: "Mention" },
    { id: "text", icon: Type, label: "Text" },
    { id: "emoji", icon: Smile, label: "Emoji" }
  ];

  return (
    <Card gradientBorder padding="lg">
      <CardHeader>
        <div>
          <CardTitle>Post Composer</CardTitle>
          <CardDescription>Plan content, attach media, and schedule across platforms.</CardDescription>
        </div>
        <Badge variant="info" dot>
          Cmd/Ctrl + N to compose
        </Badge>
      </CardHeader>
      <CardBody className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[2fr_1.4fr]">
            <div className="space-y-4">
              <Input
                label="Caption"
                placeholder="Write something memorable..."
                error={errors.caption?.message}
                counter={{ current: caption.length, max: 280 }}
                {...register("caption")}
              />

              <Input
                label="First comment (optional)"
                placeholder="Hashtags, mentions, or notes"
                error={errors.firstComment?.message}
                {...register("firstComment")}
              />

              {/* Instagram-specific features */}
              {platform === "instagram" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Format Selector */}
                  <div className="glass rounded-2xl border border-white/10 p-4">
                    <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Instagram Format
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {instagramFormats.map((format) => (
                        <motion.button
                          key={format.id}
                          type="button"
                          onClick={() => setInstagramFormat(format.id as InstagramFormat)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-3 rounded-xl border transition-all duration-200 ${
                            instagramFormat === format.id
                              ? "bg-purple-500/20 border-purple-400/50 text-purple-300"
                              : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                          }`}
                        >
                          <format.icon className="w-5 h-5 mx-auto mb-1" />
                          <div className="text-xs font-medium">{format.label}</div>
                          <div className="text-[10px] opacity-70">{format.description}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Ratio & Music for Reels */}
                  {instagramFormat === "reel" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid gap-3 sm:grid-cols-2"
                    >
                      {/* Aspect Ratio */}
                      <div className="glass rounded-2xl border border-white/10 p-4">
                        <h4 className="text-sm font-medium text-white mb-3">Aspect Ratio</h4>
                        <div className="space-y-2">
                          {aspectRatios.map((ratio) => (
                            <button
                              key={ratio.id}
                              type="button"
                              onClick={() => setAspectRatio(ratio.id as AspectRatio)}
                              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                                aspectRatio === ratio.id
                                  ? "bg-purple-500/20 text-purple-300"
                                  : "hover:bg-white/5 text-gray-400"
                              }`}
                            >
                              <div className={`bg-white/10 rounded ${ratio.preview} flex-shrink-0`} />
                              <span className="text-sm">{ratio.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Music Selector */}
                      <div className="glass rounded-2xl border border-white/10 p-4">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                          <Music className="w-4 h-4" />
                          Music
                        </h4>
                        <div className="space-y-2">
                          {musicTracks.map((track) => (
                            <button
                              key={track.id}
                              type="button"
                              onClick={() => setSelectedMusic(track.id)}
                              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                                selectedMusic === track.id
                                  ? "bg-purple-500/20 text-purple-300"
                                  : "hover:bg-white/5 text-gray-400"
                              }`}
                            >
                              <div className="text-left">
                                <div className="text-sm font-medium">{track.name}</div>
                                <div className="text-xs opacity-70">{track.artist}</div>
                              </div>
                              <div className="text-xs opacity-70">{track.duration}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Story Stickers */}
                  {instagramFormat === "story" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-2xl border border-white/10 p-4"
                    >
                      <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                        <Sticker className="w-4 h-4" />
                        Story Stickers
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {stickerOptions.map((sticker) => (
                          <motion.button
                            key={sticker.id}
                            type="button"
                            onClick={() => {
                              setStoryStickers(prev =>
                                prev.includes(sticker.id)
                                  ? prev.filter(s => s !== sticker.id)
                                  : [...prev, sticker.id]
                              );
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-3 rounded-xl border transition-all duration-200 ${
                              storyStickers.includes(sticker.id)
                                ? "bg-purple-500/20 border-purple-400/50 text-purple-300"
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            <sticker.icon className="w-5 h-5 mx-auto mb-1" />
                            <div className="text-xs">{sticker.label}</div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Hashtag First Comment */}
                  <div className="flex items-center gap-3 p-3 glass rounded-xl border border-white/10">
                    <input
                      type="checkbox"
                      id="hashtag-first"
                      checked={hashtagFirstComment}
                      onChange={(e) => setHashtagFirstComment(e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-purple-400 focus:ring-purple-400/20"
                    />
                    <label htmlFor="hashtag-first" className="text-sm text-gray-300 flex items-center gap-2 cursor-pointer">
                      <Hash className="w-4 h-4" />
                      Post hashtags as first comment (Instagram best practice)
                    </label>
                  </div>
                </motion.div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <Dropdown
                  label="Platform"
                  value={platform}
                  onChange={(value) => setValue("platform", value as PlatformKey)}
                  options={PLATFORMS.map((p) => ({
                    value: p.key,
                    label: p.name,
                    description: p.features.join(", ")
                  }))}
                />

                <div className="glass rounded-2xl border border-white/10 p-3 text-xs">
                  <p className="font-medium text-pulse-text">Media</p>
                  <p className="mt-1 text-pulse-muted">
                    Drag and drop images or video, then crop, filter, and trim.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      iconLeft={<ImageIcon className="h-3.5 w-3.5" />}
                    >
                      Add image
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      iconLeft={<Video className="h-3.5 w-3.5" />}
                    >
                      Add video
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass rounded-2xl border border-white/10 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-pulse-text">Scheduling</p>
                  <div className="inline-flex gap-1 rounded-full bg-white/5 p-1">
                    <button
                      type="button"
                      onClick={() => setMode("now")}
                      className={`rounded-full px-2 py-1 text-[11px] ${
                        mode === "now" ? "bg-white/15 text-pulse-text" : "text-pulse-muted"
                      }`}
                    >
                      Post now
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("schedule")}
                      className={`rounded-full px-2 py-1 text-[11px] ${
                        mode === "schedule" ? "bg-white/15 text-pulse-text" : "text-pulse-muted"
                      }`}
                    >
                      Schedule
                    </button>
                  </div>
                </div>

                {mode === "schedule" && (
                  <div className="mt-3">
                    <Input
                      label="Publish at"
                      type="datetime-local"
                      error={errors.scheduledAt?.message}
                      {...register("scheduledAt")}
                    />
                  </div>
                )}
              </div>

              <div className="glass rounded-2xl border border-white/10 p-3 text-xs">
                <p className="font-medium text-pulse-text">Preview</p>
                <p className="mt-1 text-pulse-muted">Approximate render of the post on the selected platform.</p>
                <div className={`mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] text-pulse-text ${
                  platform === "instagram" && instagramFormat === "reel" && aspectRatio === "9:16"
                    ? "aspect-[9/16] max-w-[120px] mx-auto"
                    : platform === "instagram" && instagramFormat === "story"
                    ? "aspect-[9/16] max-w-[100px] mx-auto"
                    : "max-w-full"
                }`}>
                  <p className="font-semibold">@demo_account</p>
                  <p className="mt-2 whitespace-pre-wrap">{caption || "Your caption will appear here."}</p>
                  {platform === "instagram" && instagramFormat === "story" && storyStickers.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {storyStickers.map(sticker => (
                        <Badge key={sticker} variant="info" size="sm">
                          {stickerOptions.find(s => s.id === sticker)?.label}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {platform === "instagram" && instagramFormat === "reel" && selectedMusic && (
                    <div className="mt-2 text-xs opacity-70">
                      🎵 {musicTracks.find(m => m.id === selectedMusic)?.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button type="submit" loading={loading} iconLeft={<Sparkles className="h-4 w-4" />}>
              {mode === "now" ? "Publish now" : "Schedule post"}
            </Button>
            <p className="text-xs text-pulse-muted">
              Powered by AI suggestions, best-time data, and queue management (demo).
            </p>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

