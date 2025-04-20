import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
// import { Toaster } from "@/components/ui/sonner"
import { Provider } from "react-redux";
import store from "@/redux/store";
import NextTopLoader from "nextjs-toploader";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GIG Worker Registration Portal",
  description: "A portal to register workers with udin certificates",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,bn,hi',
                layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL
              }, 'google_translate_element');
            }
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader showSpinner={false}/>
        {/* <Provider store={store}> */}
        <Toaster />
        {children}
        {/* </Provider> */}
      </body>
    </html>
  );
}
