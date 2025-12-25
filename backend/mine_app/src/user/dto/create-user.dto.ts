export class AddressDto {
    street: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
}

export class CreateUserDto {
    fullName: string;
    email: string;
    password: string;
    address: AddressDto;
}
