// Declaración de módulo para api.js

declare module '../../../api.js' {
  export function getAnimales(token: string): Promise<any>;
  export function createAnimal(data: any, token: string): Promise<any>;
  export function getRefugioDashboardStats(token: string): Promise<{
    animales: number;
    adopciones_pendientes: number;
    hogares_temporales_pendientes: number;
  }>;
  // Agrega otras funciones si es necesario
}
