import { createMuiTheme } from '@material-ui/core/styles'
import { Check } from 'mdi-material-ui'
import Color from 'color'

const defaultGuiThemeOptions = {
  mode: 'light',
  regularFontFamily: `'Barlow',sans-serif`,
  headingFontFamily: `'Barlow',sans-serif`,
  themeColor: '#3554A1',
  baseFontSize: 16,
}

export const REGULAR_FONT_FAMILY =
  '"Barlow", "Roboto", "Helvetica", "Arial", sans-serif'
export const HEADING_FONT_FAMILY =
  '"Barlow", "Roboto", "Helvetica", "Arial", sans-serif'

export const createGuruUiTheme = ($guiThemeOptions) => {
  const guiThemeOptions = {
    ...defaultGuiThemeOptions,
    ...$guiThemeOptions,
  }
  const {
    themeColor: mainColor = '#3554A1',
    baseFontSize = 16,
  } = guiThemeOptions

  const headingFontFamily = `"${
    guiThemeOptions.headingFontFamily || HEADING_FONT_FAMILY
  }", "Roboto", "Helvetica", "Arial", sans-serif`
  const regularFontFamily = `"${
    guiThemeOptions.regularFontFamily || REGULAR_FONT_FAMILY
  }", "Roboto", "Helvetica", "Arial", sans-serif`

  const headingFontOptions = {
    fontFamily: headingFontFamily,
  }

  const BUTTON_UPPER_CASED = false

  const PRIMARY_MAIN = mainColor
  const PRIMARY_LIGHT = Color(PRIMARY_MAIN).lighten(0.2).string()
  const PRIMARY_DARK = Color(PRIMARY_MAIN).darken(0.2).string()

  const SECONDARY_MAIN = '#C13C4F'
  const SECONDARY_LIGHT = Color(SECONDARY_MAIN).lighten(0.2).string()
  const SECONDARY_DARK = Color(SECONDARY_MAIN).darken(0.2).string()

  const shadows = [
    'none',
    '0px 0px 20px rgba(0, 0, 0, 0.1)',
    '0px 5px 20px rgba(0, 0, 0, 0.2)',
    '0px 10px 25px rgba(0, 0, 0, 0.3)',
    '0px 15px 30px rgba(0, 0, 0, 0.4)',
    '0px 20px 30px rgba(0, 0, 0, 0.4)',
    '0px 21px 31px rgba(0, 0, 0, 0.4)',
    '0px 22px 32px rgba(0, 0, 0, 0.4)',
    '0px 23px 33px rgba(0, 0, 0, 0.4)',
    '0px 24px 34px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
    '0px 25px 35px rgba(0, 0, 0, 0.4)',
  ]

  const spacing = 8

  const palette = {
    primary: {
      light: PRIMARY_LIGHT,
      main: PRIMARY_MAIN,
      dark: PRIMARY_DARK,
    },
    secondary: {
      light: SECONDARY_LIGHT,
      main: SECONDARY_MAIN,
      dark: SECONDARY_DARK,
    },
    background: {
      paper: '#FFFFFF',
      default: '#F0F2F8',
      dark: '#f4f4f4',
      grey: '#fafafa',
    },
    semantic: {
      yellow: '#FFAB00',
      green: '#36B37E',
      red: '#FF5630',
      purple: '#6554C0',
      tale: '#00B8D9',
      smoke: '#CECECE',
      blue: '#0065FF',
      pale: '#1582C0',
    },
    divider: '#B6B7BC',
  }

  const typography = {
    htmlFontSize: baseFontSize,
    body1: { fontFamily: regularFontFamily },
    body2: { fontFamily: regularFontFamily },
    caption: { fontFamily: regularFontFamily },
    h1: headingFontOptions,
    h2: headingFontOptions,
    h3: headingFontOptions,
    h4: headingFontOptions,
    h5: headingFontOptions,
    h6: headingFontOptions,
    subtitle1: headingFontOptions,
    subtitle2: headingFontOptions,
    button: {
      ...headingFontOptions,
      fontWeight: 'bold',
      textTransform: BUTTON_UPPER_CASED ? 'uppercase' : 'none',
      letterSpacing: 'normal',
    },
  }

  const shape = {
    borderRadius: 8,
  }
  return createMuiTheme({
    palette,
    shape,
    spacing,
    shadows,
    typography,
    overrides: {
      MuiPaper: {
        elevation1: {
          boxShadow: shadows[1],
        },
        elevation2: {
          boxShadow: shadows[2],
        },
      },
      MuiButton: {
        root: {
          height: 44,
          marginTop: 0,
          letterSpacing: '0.05rem',
          textTransform: BUTTON_UPPER_CASED ? 'uppercase' : 'none',
        },
        label: {
          userSelect: 'none !important',
        },
        sizeSmall: {
          height: 38,
        },
        sizeLarge: {
          height: 56,
        },
        text: {
          '&:active': {
            backgroundColor: Color('#FFF').darken(0.1).string(),
          },
        },
        textPrimary: {
          '&:active': {
            backgroundColor: Color(PRIMARY_MAIN).alpha(0.1).string(),
          },
        },
        textSecondary: {
          '&:active': {
            backgroundColor: Color(SECONDARY_MAIN).alpha(0.1).string(),
          },
        },
        contained: {
          boxShadow: shadows[1],
          backgroundColor: '#FFF',
          '&:hover': {
            boxShadow: shadows[2],
            backgroundColor: '#FFF',
          },
          '&:active': {
            boxShadow: shadows[3],
          },
        },
        containedPrimary: {
          '&:active': {
            backgroundColor: PRIMARY_DARK,
          },
        },
        containedSecondary: {
          '&:active': {
            backgroundColor: SECONDARY_DARK,
          },
        },
      },
      MuiAvatar: {
        root: {
          fontFamily: HEADING_FONT_FAMILY,
        },
      },
      MuiCardHeader: {
        root: {
          paddingBottom: 0,
        },
        title: {
          textTransform: 'uppercase',
          fontSize: '0.875rem',
          fontWeight: 'bold',
        },
      },
      MuiCardContent: {
        root: {
          '&:last-child': {
            paddingBottom: spacing * 2,
          },
        },
      },
      MuiFilledInput: {
        root: {
          borderRadius: shape.borderRadius,
        },
      },
      MuiFab: {
        extended: {
          boxShadow: shadows[1],
          padding: `0 ${spacing * 3}px`,
          '&:active, &:hover': {
            boxShadow: shadows[2],
          },
        },
        label: {
          marginTop: 2,
        },
      },
      MuiCheckbox: {
        root: {
          backgroundColor: 'transparent !important',
          '& .icon': {
            borderRadius: 6,
            backgroundColor: '#F0F2F8',
            height: 18,
            width: 18,
            margin: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& > svg': {
              padding: 4,
              stroke: 'currentColor',
              strokeWidth: 1.5,
            },

            '&.checked': {
              border: `solid 2px currentColor !important`,
            },
          },
        },
      },
      MuiTable: {
        root: {
          borderSpacing: `0 ${spacing * 1.5}px`,
          borderCollapse: 'separate',
        },
      },
      MuiTableCell: {
        root: {
          borderBottom: 'none',
          backgroundColor: palette.background.paper,
          '&:first-child': {
            borderTopLeftRadius: shape.borderRadius,
            borderBottomLeftRadius: shape.borderRadius,
          },
          '&:last-child': {
            borderTopRightRadius: shape.borderRadius,
            borderBottomRightRadius: shape.borderRadius,
          },
        },
        head: {
          fontFamily: regularFontFamily,
          textTransform: 'uppercase',
          fontWeight: 'bold',
          color: 'rgba(0, 0, 0, 0.54)',
          backgroundColor: 'unset',
          borderRadius: 'unset',
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
      MuiTableRow: {
        root: {
          borderSpacing: `0 ${spacing * 1.5}px`,
          borderCollapse: 'separate',
          boxShadow: shadows[1],
          borderRadius: shape.borderRadius,
        },
        head: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
      MuiDialogActions: {
        root: {
          padding: `${spacing}px ${spacing * 3}px ${spacing * 2}px`,
        },
      },
      MuiInput: {
        input: {
          lineHeight: 1,
        },
      },
      MuiTooltip: {
        tooltip: {
          ...typography.h6,
          fontSize: typography.body2?.fontSize,
        },
      },
    },

    props: {
      MuiTextField: {
        fullWidth: true,
        variant: 'filled',
      },
      MuiButton: {
        disableRipple: true,
      },
      MuiCheckbox: {
        disableRipple: true,
        disableFocusRipple: true,
        color: 'primary',
        icon: <span className="icon" />,
        checkedIcon: (
          <span className="icon checked">
            <Check />
          </span>
        ),
      },
      MuiCard: {
        elevation: 0,
        variant: 'outlined',
      },
      MuiCardHeader: {
        titleTypographyProps: {
          variant: 'h6',
          color: 'textSecondary',
        },
      },
      MuiFilledInput: {
        disableUnderline: true,
      },
      MuiContainer: {
        maxWidth: 'md',
      },
    },
  })
}

const theme = createGuruUiTheme({})

export default theme
