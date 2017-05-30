import {Validator, ValidatorResult} from 'jsonschema';
import {ecSignatureSchema, ecSignatureParameter} from '../schemas/ec_signature_schema';
import {addressSchema, numberSchema, orderSchema, signedOrderSchema} from '../schemas/signed_order_schema';
import {tokenSchema} from '../schemas/token_schema';

export class SchemaValidator {
    private validator: Validator;
    constructor() {
        this.validator = new Validator();
        this.validator.addSchema(tokenSchema, tokenSchema.id);
        this.validator.addSchema(orderSchema, orderSchema.id);
        this.validator.addSchema(numberSchema, numberSchema.id);
        this.validator.addSchema(addressSchema, addressSchema.id);
        this.validator.addSchema(ecSignatureSchema, ecSignatureSchema.id);
        this.validator.addSchema(signedOrderSchema, signedOrderSchema.id);
        this.validator.addSchema(ecSignatureParameter, ecSignatureParameter.id);
    }
    public validate(instance: object, schema: Schema): ValidatorResult {
        return this.validator.validate(instance, schema);
    }
}
