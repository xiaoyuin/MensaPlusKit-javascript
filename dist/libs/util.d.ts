export declare function requestWebsite(url: string, onSuccess: (website: string) => void, onError?: (err) => void): void;
export declare function createDOM(website: string): any;
export declare function parseTimeMoment(dateString: any): {
    dateString: string;
    dateObject: Date;
};
export declare function formatTime(date: any): string;
export declare function formatNumber(n: any): any;
export declare function getWeekIndexRelativeToToday(date: any): number;
