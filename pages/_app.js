import '../styles/globals.css'
import Header from '../comp/Header'
import Footer from '../comp/Footer'
import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import customTheme from '../styles/theme'
import '@fontsource/league-mono-narrow/400.css'

function MyApp({ Component, pageProps }) {

  return (
    <ChakraProvider theme={customTheme}>
        <CSSReset />
        <Header />
            <Component {...pageProps} />
        <Footer />
    </ChakraProvider>
  )
}

export default MyApp
