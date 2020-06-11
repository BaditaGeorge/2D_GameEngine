export interface ShapeInterface {
    type: string;
    data: Array<number>;
    fill: string;
}

export interface BoundingBox {
    cornerX: Array<number>;
    cornerY: Array<number>;
}