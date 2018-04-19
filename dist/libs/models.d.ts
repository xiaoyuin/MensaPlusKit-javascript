export declare class Canteen {
    name: string;
    fullName: string;
    address: string;
    coordinates: string;
    notes: any;
    mId: number;
    urlLogo: string;
    urlDetail: string;
    urlOpenTimes: string;
    urlAnsprechpartner: string;
    urlLageplan: string;
    urlMeals: string;
    urlMealsW1: string;
    urlMealsW2: string;
    constructor(json: any);
    getMenu(date: any, callback: (err, meals) => void): void;
    getDetail(callback: (err, newCanteen) => void): void;
}
export declare class Menu {
    canteenName: string;
    date: Date;
    items: MenuItem[];
    constructor(canteenName: string, date: Date);
}
export declare class MenuItem {
    id: string;
    text: string;
    createdAt: Date;
    canteenName: string;
    date: string;
    dateObject: Date;
    category: string;
    constructor();
}
export declare class Meal extends MenuItem {
    name: string;
    price: string;
    slot: string;
    notes: any;
    urlDetail: string;
    urlImages: string[];
    urlPicture: string;
    urlThumbnail: string;
    constructor();
    getMealDetail(callback: (err, meal) => void): void;
}
export declare class Info extends MenuItem {
    constructor();
}
