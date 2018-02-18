export interface ChartData {
    name: Date | string;
    value: number;
    extra?: {
        format: string
    };
}
