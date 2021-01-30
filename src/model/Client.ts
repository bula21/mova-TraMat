class Client {

    id?: number;
    type?: number;
    name?: string;
    street?: string;
    place?: string;
    zipcode?: number;
    phone?: string;
    email?: string;
    modified_on?: Date;
    created_on?: Date;
    modified_by?: number;


    constructor(id?: number, type?: number, name?: string, street?: string, place?: string, zipcode?: number, phone?: string, email?: string, modified_on?: Date, created_on?: Date, modified_by?: number) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.street = street;
        this.place = place;
        this.zipcode = zipcode;
        this.phone = phone;
        this.email = email;
        this.modified_on = modified_on;
        this.created_on = created_on;
        this.modified_by = modified_by;
    }
}

export default Client;