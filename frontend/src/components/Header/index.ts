// Componente principal wrapper
export { default as HeaderWrapper } from './HeaderWrapper';
export type { UserType } from './HeaderWrapper';

// Componentes específicos (por si necesitas usarlos directamente)
export { default as HeaderPublic } from './variants/HeaderPublic';
export { default as HeaderRefugio } from './variants/HeaderRefugio';
export { default as HeaderUsuario } from './variants/HeaderUsuario';
export { default as HeaderAdmin } from './variants/HeaderAdmin';

// Componente compartido
export { default as Logo } from './shared/Logo';

// Header original (por compatibilidad)
export { default as Header } from './Header';