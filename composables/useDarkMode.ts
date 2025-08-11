export const useDarkMode = () => {
  const isDarkMode = useState<boolean>('darkMode', () => false)
  
  // Dark mode cookie
  const darkModeCookie = useCookie<boolean>('greek-alphabet-dark-mode', {
    default: () => false,
    maxAge: 60 * 60 * 24 * 365 // 1 year
  })

  const initDarkMode = (): void => {
    if (import.meta.client) {
      isDarkMode.value = darkModeCookie.value || false
      updateTheme()
    }
  }

  const toggleDarkMode = (): void => {
    isDarkMode.value = !isDarkMode.value
    darkModeCookie.value = isDarkMode.value
    updateTheme()
  }

  const updateTheme = (): void => {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
    }
  }

  return {
    isDarkMode: readonly(isDarkMode),
    toggleDarkMode,
    initDarkMode
  }
}
