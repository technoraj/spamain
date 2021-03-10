import { Byte } from '@angular/compiler/src/util';

export interface ImageDetail {
    image_Id:number;
    name: string;
    docFile:string;
    image:Byte[];
}