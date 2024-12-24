import { PlayIcon } from "lucide-react"

import { Video } from "./featured-videos.types"

interface VideoListProps {
  videos: Video[]
  setSelectedVideo: (video: Video) => void
}

export function VideoList(props: VideoListProps) {
  const { videos, setSelectedVideo } = props
  return (
    <div className="flex w-full flex-col gap-y-4 lg:w-[55%]">
      {videos.map((video) => (
        <VideoItem
          key={video.href}
          video={video}
          setSelectedVideo={setSelectedVideo}
        />
      ))}
    </div>
  )
}

interface VideoItemProps {
  video: Video
  setSelectedVideo: (video: Video) => void
}

function VideoItem(props: VideoItemProps) {
  const { video, setSelectedVideo } = props
  const { imageHref, href, length, date, title, creator } = video

  return (
    <div
      onClick={() => setSelectedVideo(video)}
      className="group flex w-full cursor-pointer flex-row gap-x-2 rounded-3xl"
    >
      <div
        className="relative h-[112px] w-full max-w-[200px] rounded-xl bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${imageHref}')` }}
      >
        <p className="absolute bottom-1 right-1 rounded-md bg-black/50 px-2 py-[0.15rem] text-xs text-white">
          {length}
        </p>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-black/50 px-3 py-1 opacity-0 transition-opacity group-hover:opacity-100">
          <PlayIcon className="fill-white text-black" />
        </div>

        <div className="h-full w-full rounded-l-3xl bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="w-full space-y-2 p-2 text-sm group-hover:text-foreground/90">
        <p className="line-clamp-2 font-bold">{title}</p>
        <div className="space-y-1">
          <p className="text-xs">{creator}</p>
          <p className="text-xs">{date}</p>
        </div>
      </div>
    </div>
  )
}
