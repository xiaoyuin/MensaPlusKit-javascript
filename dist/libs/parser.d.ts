import { Meal, MenuItem } from "./models";
export declare class Parser {
    doc: any;
    baseUrl: string;
    canteenName: string;
    date: Date;
    mId: number;
    constructor(doc: any, baseUrl: string);
    setCanteenName(canteenName: string): Parser;
    setDate(date: Date): Parser;
    setMId(mId: number): Parser;
    parseMenu(): MenuItem[];
    parseMeal(baseMeal: Meal): Meal;
    parseToday(): object;
}
