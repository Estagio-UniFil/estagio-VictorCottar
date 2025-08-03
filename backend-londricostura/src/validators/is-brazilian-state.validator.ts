import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { BRAZILIAN_STATES } from '../utils/brazilian-states.constant';

export function IsBrazilianState(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBrazilianState',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && BRAZILIAN_STATES.includes(value.toUpperCase() as any);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um estado brasileiro válido (${BRAZILIAN_STATES.join(', ')})`;
        },
      },
    });
  };
}