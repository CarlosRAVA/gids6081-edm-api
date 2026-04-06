import { HttpException, HttpStatus } from "@nestjs/common";

export class AppException extends HttpException{

    constructor( public readonly messsage: string, public readonly statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
        public readonly errorCode: string 
    ) {
        super(messsage, statusCode);
    }

}