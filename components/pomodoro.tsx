'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const MODES = {
  work: { time: 1500, label: 'Work' },
  shortBreak: { time: 300, label: 'Short Break' },
  longBreak: { time: 900, label: 'Long Break' },
}

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(MODES.work.time)
  const [isRunning, setIsRunning] = useState(false)
  const [currentMode, setCurrentMode] = useState('work')
  const [showYouTube, setShowYouTube] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const playClickSound = () => {
    const audio = new Audio('/click.wav')
    audio.play()
  }

  const toggleTimer = useCallback(() => {
    playClickSound()
    setIsRunning(prev => !prev)
  }, [])

  const resetTimer = useCallback(() => {
    playClickSound()
    setIsRunning(false)
    setTimeLeft(MODES[currentMode as keyof typeof MODES].time)
  }, [currentMode])

  const setMode = useCallback((mode: keyof typeof MODES) => {
    playClickSound()
    setCurrentMode(mode)
    setTimeLeft(MODES[mode].time)
    setIsRunning(false)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      const audio = new Audio('/alarm.mp3')
      audio.play()
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white flex items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <Tabs value={currentMode} onValueChange={(value) => setMode(value as keyof typeof MODES)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
              <TabsTrigger value="longBreak">Long Break</TabsTrigger>
            </TabsList>
            <TabsContent value={currentMode} className="mt-0">
              <div className="text-center">
                <h2 className="text-7xl font-bold mb-8 text-white">{formatTime(timeLeft)}</h2>
                <div className="flex justify-center space-x-4 mb-6">
                  <Button onClick={toggleTimer} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isRunning ? 'Pause' : 'Start'}
                  </Button>
                  <Button onClick={resetTimer} variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-600/20">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
                <Button onClick={() => setShowYouTube(!showYouTube)} variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700/50">
                  <Music className="mr-2 h-4 w-4" />
                  {showYouTube ? 'Hide' : 'Show'} Music Player
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          {showYouTube && (
            <div className="mt-6">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/jfKfPfyJRdk"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
