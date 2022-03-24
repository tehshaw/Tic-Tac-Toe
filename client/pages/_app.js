import '../styles/globals.css'
import Header from '../comp/Header'
import Footer from '../comp/Footer'
import Wrapper from '../comp/Wrapper'


import { ChakraProvider, CSSReset } from '@chakra-ui/react'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
        <CSSReset />
        <Header />
        <Wrapper>
            <Component {...pageProps} />
        </Wrapper>
        <Footer />
    </ChakraProvider>
  )
}

export default MyApp
