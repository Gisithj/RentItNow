'use client'

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { ReduxProvider } from './redux-provider';
export function Providers({children}: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          {children}
        </NextThemesProvider>
      </NextUIProvider>
    </ReduxProvider>
  )
}