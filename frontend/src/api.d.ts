// Declaración de módulo para api.js

declare module '../../../api.js' {
  export function getAnimales(token: string): Promise<any>;
  export function createAnimal(data: any, token: string): Promise<any>;
  // Agrega otras funciones si es necesario
}
