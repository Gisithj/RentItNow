'use client'

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { ReduxProvider } from './redux-provider';
import {useRouter} from 'next/navigation'
import { Router } from 'next/router';
export function Providers({children}: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <ReduxProvider>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          {children}
        </NextThemesProvider>
      </NextUIProvider>
    </ReduxProvider>
  )
}