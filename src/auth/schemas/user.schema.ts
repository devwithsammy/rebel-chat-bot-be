import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({
    timestamps: true 
})
export class User extends Document { 
    @Prop({
        required : true 
    })
    firstName : string;


    @Prop()
    lastname : string ; 

    @Prop({
        required: true, unique : true 
    })
    email : string ; 

    @Prop()
    picture :string ; 
    @Prop()
    googleId: string ; 
}

export const UserSchema = SchemaFactory.createForClass(User)