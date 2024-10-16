import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema()
export class File extends Document {
    @Prop({ required: true })
    filename: string;

    @Prop({ required: true })
    path: string;

    @Prop({ required: true })
    uploadDate: Date;

    @Prop({ required: true })
    size: number;

    @Prop({ required: true })
    mimetype: string;

    @Prop({ required: true })
    originalname: string;
}

export type FileDocument = HydratedDocument<File>;
export const FileSchema = SchemaFactory.createForClass(File);
