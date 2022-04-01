// 1. import `extendTheme` function
import { extendTheme, theme } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools'

// 2. Add your color mode config
const config = {
    initialColorMode: "light", // options are light or dark
    useSystemColorMode: false, // options are true or false
}

const customTheme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        fontFamily: 'body',
        color: mode('blue.800', 'grey.300')(props),
        bg: mode('orange.100', 'blue.800')(props),
        lineHeight: 'base',
      },
    }),
  },
  fonts: {
    heading: 'league mono narrow, sans serif',
  }
})

 export default customTheme;

