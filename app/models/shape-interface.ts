export interface ShapeInterface {
    type: string;
    data: {[key:string]:number|string};
    fill: string;
}

export interface BoundingBox {
    cornerX: Array<number>;
    cornerY: Array<number>;
}