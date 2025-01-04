"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { MoveRightIcon } from "lucide-react"

import { Video } from "./featured-videos.types"
import { VideoList } from "./video-list"

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false, // Disable server-side rendering
})

interface FeaturedVideosProps {
  videos: Video[]
}

export function FeaturedVideos(props: FeaturedVideosProps) {
  const { videos } = props

  const [selectedVideo, setSelectedVideo] = useState<Video>(videos[0])

  if (videos.length < 1) {
    return null
  }

  return (
    <div className="container rounded-3xl bg-primary/20 p-4 md:p-8">
      <p className="font-header text-4xl font-bold md:text-5xl">Videos</p>

      <div className="flex flex-col gap-12 pt-6 lg:flex-row">
        <div className="flex w-full flex-col space-y-2 lg:items-start">
          <div className="h-[300px] w-full md:h-[450px]">
            <ReactPlayer
              width="100%"
              height="100%"
              url={selectedVideo.href}
              controls={true}
              // light is usefull incase of dark mode
              light={false}
              // picture in picture
              pip={true}
            />
          </div>

          <p className="pt-2 text-lg font-bold">{selectedVideo.title}</p>
          <Link href={selectedVideo.creatorHref}>
            <p className="group flex items-center gap-x-3 text-sm font-bold transition-colors hover:text-foreground/80">
              {selectedVideo.creator}
              <MoveRightIcon className="h-3 w-3 transition-all group-hover:translate-x-1" />
            </p>
          </Link>
          <p className="pt-2 text-sm text-muted-foreground">
            {selectedVideo.description}
          </p>
        </div>

        <VideoList
          videos={videos.filter((video) => video.href !== selectedVideo.href)}
          setSelectedVideo={setSelectedVideo}
        />
      </div>
    </div>
  )
}
