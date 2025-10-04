/**
 * Textos del formulario de login
 */
export const LOGIN_FORM_TEXTS = {
  // Labels de campos
  USERNAME_LABEL: 'Usuario',
  PASSWORD_LABEL: 'Contraseña',

  // Placeholders
  USERNAME_PLACEHOLDER: 'Ingresa tu usuario',
  PASSWORD_PLACEHOLDER: 'Ingresa tu contraseña',

  // Botones
  SUBMIT_BUTTON: 'Entrar',
  SUBMIT_BUTTON_LOADING: 'Verificando...',

  // Estados
  REDIRECTING: 'Redirigiendo...',

  // Textos ARIA
  ARIA_FORM_LABEL: 'Formulario de inicio de sesión',
  ARIA_USERNAME_ICON: 'Ícono de usuario',
  ARIA_PASSWORD_ICON: 'Ícono de contraseña',
  ARIA_USERNAME_HELP: 'Ingresa tu nombre de usuario',
  ARIA_PASSWORD_HELP: 'Ingresa tu contraseña de acceso al sistema',
  ARIA_LOGIN_STATUS_LOADING: 'Verificando credenciales, por favor espera',
} as const;

/**
 * Estilos del formulario de login
 */
export const LOGIN_FORM_STYLES = {
  // Contenedor
  CARD_CONTENT: 'space-y-6 px-8 pb-8',
  CARD_CONTENT_LOADING: 'text-center py-8',
  FORM: 'space-y-6',

  // Campos
  FIELD_CONTAINER: 'space-y-2',
  LABEL: 'text-lg font-semibold text-gray-800',
  INPUT_WRAPPER: 'relative',
  INPUT_ICON:
    'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5',
  INPUT: 'pl-12 h-12 border-gray-300 rounded-lg text-base',

  // Botón
  BUTTON_CONTAINER: 'pt-4',
  BUTTON:
    'w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-base rounded-lg disabled:opacity-50',

  // Estados
  REDIRECTING_TEXT: 'text-primary',
  SR_ONLY: 'sr-only',
} as const;
