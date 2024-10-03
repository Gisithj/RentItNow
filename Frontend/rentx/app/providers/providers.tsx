'use client'

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { ReduxProvider } from './redux-provider';
import {useRouter} from 'next/navigation'
import { Router } from 'next/router';
import ToastProvider from './toast-provider';
export function Providers({children}: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <ReduxProvider>
      <ToastProvider>
        <NextUIProvider navigate={router.push} >
          <NextThemesProvider attribute="class" defaultTheme="dark">
            {children}
          </NextThemesProvider>
        </NextUIProvider>
      </ToastProvider>
    </ReduxProvider>
  )
}