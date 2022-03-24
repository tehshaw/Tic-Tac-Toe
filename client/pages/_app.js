import '../styles/globals.css'
import Header from '../comp/Header'


import { ChakraProvider, CSSReset } from '@chakra-ui/react'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
        <CSSReset />
        <Header>
          <Component {...pageProps} />

        </Header>
    </ChakraProvider>
  )
}

export default MyApp
