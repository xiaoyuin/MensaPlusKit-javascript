import { Canteen } from './libs/models';
export declare const URL_MENU_TODAY: string;
export declare const URL_MENU_TOMORROW: string;
export declare const URL_MENSA: string;
export declare let canteens: Canteen[];
export declare function getCanteenByName(name: any): Canteen | undefined;
export declare function findCanteen(query: any): Canteen | undefined;
export declare function getTodayMenu(callback: (error, result) => void): void;
