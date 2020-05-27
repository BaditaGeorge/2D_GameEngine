export interface RectInterface{
    type?:string;
    w?:number;
    h?:number;
    x?:number;
    y?:number;
    fill?:string;
}

export interface CircleInterface{
    type?:string;
    cx?:number;
    cy?:number;
    r?:number;
    fill?:string;
}

export interface PolygonInterface{
    type?:string;
    points?:Array<number>;
    fill?:string;
}

export interface ShapeInterface{
    type?:string;
    data?:Array<number>;
    fill?:string;
}