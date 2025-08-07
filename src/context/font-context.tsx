'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { fonts } from '~/config/fonts'


type Font = (typeof fonts)[number]

interface FontContextType {
  font: Font
  setFont: (font: Font) => void
}

const FontContext = createContext<FontContextType | undefined>(undefined)

const getFontFromStorage = (): Font => {
  if (typeof window === 'undefined') return fonts[0]
  try {
    const savedFont = localStorage.getItem('font')
    return fonts.includes(savedFont as Font) ? (savedFont as Font) : fonts[0]
  } catch (e) {
    return fonts[0]
  }
}

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [font, _setFont] = useState<Font>(getFontFromStorage)

  useEffect(() => {
    const applyFont = (font: string) => {
      const root = document.documentElement
      root.classList.forEach((cls) => {
        if (cls.startsWith('font-')) root.classList.remove(cls)
      })
      root.classList.add(`font-${font}`)
    }

    applyFont(font)
  }, [font])

  const setFont = (font: Font) => {
    try {
      localStorage?.setItem('font', font)
    } catch (e) {
      console.warn('Failed to save font to localStorage:', e)
    }
    _setFont(font)
  }

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  )
}

export const useFont = () => {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error('useFont must be used within a FontProvider')
  }
  return context
}
