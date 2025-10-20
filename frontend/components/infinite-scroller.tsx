"use client"

import { motion, useScroll, useMotionValueEvent, useAnimationFrame, wrap, useMotionValue } from "framer-motion"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

interface InfiniteScrollerProps {
  images: string[]
  direction?: "left" | "right"
  speed?: "slow" | "normal" | "fast"
}

export function InfiniteScroller({ images, direction = "left", speed = "normal" }: InfiniteScrollerProps) {
  const [isScrolling, setIsScrolling] = useState(false)
  const { scrollY } = useScroll()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  const prevScrollY = useRef(scrollY.get())

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest !== prevScrollY.current) {
      setIsScrolling(true)
    }
    prevScrollY.current = latest
  })

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (isScrolling) {
      timeout = setTimeout(() => {
        setIsScrolling(false)
      }, 200)
    }
    return () => clearTimeout(timeout)
  }, [isScrolling])

  useEffect(() => {
    if (scrollerRef.current) {
      const scrollerWidth = Array.from(scrollerRef.current.children).reduce(
        (acc, child) => acc + child.clientWidth + 16, // 16 is the gap
        0
      )
      setWidth(scrollerWidth / 2)
    }
  }, [images])

  const x = useMotionValue(0)
  const speedFactor = useRef(0)

  useEffect(() => {
    speedFactor.current = isScrolling
      ? speed === "fast" ? 200 : speed === "normal" ? 100 : 50
      : speed === "fast" ? 80 : speed === "normal" ? 40 : 20
  }, [isScrolling, speed])

  useAnimationFrame((_t, delta) => {
    if (width === 0) return
    let moveBy = (direction === "left" ? -1 : 1) * speedFactor.current * (delta / 1000)
    const newX = x.get() + moveBy;
    x.set(wrap(-width, 0, newX))
  })

  const duplicatedImages = [...images, ...images]

  return (
    <div className="w-full overflow-hidden">
      <motion.div
        className="flex gap-4"
        ref={scrollerRef}
        style={{ x }}
      >
        {duplicatedImages.map((src, index) => (
          <div key={index} className="relative flex-shrink-0 w-64 h-40">
                          <Image
                            src={src}
                            alt={`scrolling image ${index}`}
                            fill
                            className="object-cover rounded-lg"
                            sizes="256px"
                          />          </div>
        ))}
      </motion.div>
    </div>
  )
}
