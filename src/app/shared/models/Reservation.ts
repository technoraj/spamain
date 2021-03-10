export interface Center {
    address: string;
    center_Id: string;
    city: string;
    name: string;
    image_Id: number;
    pincode: string;
    RowStatus: string;
    imageNm?: string;
    image?: string;
}

export interface Session {
    center_Id: string;
    endTime: string;
    isBlocked: string;
    name: string;
    session_Id: string;
    startTime: string;
    roomType: string;
    RowStatus: string;
    isAvailable?: boolean;
}

export interface Formula {
    name: string;
    formula_Id: string;
    price: number;
    activeDays: string;
    endTime: string;
    image_Id: number;
    RowStatus: string;
    startTime: string;
    status: boolean;
    imageNm?: string;
    image?: string;
}

export interface Service {
    service_Id: string;
    category: string;
    image_id: number;
    name: string;
    price: number;
    status: boolean;
    count?: number;
    RowStatus: string;
    imageNm?: string;
    image?: string;
}

export interface Reservation {
    reservation_Id?: string;
    center_Id: string;
    date: string,
    formula_Id?: string;
    gift_Cd?: string;
    isGiftApplied: number;
    isPromoApplied: number;
    payment_Id?: string,
    payment_Status?: string;
    promoCode?: string;
    session_Id?: string;
    totalPayment: number;
    user_Id: string;
    services: ReserveServices[];
    paymentType?:string;
    RowStatus?: string;
}

export interface ReservationResponse {
    result: any;
}

export interface ReserveServices {
    index?: string;
    reservation_Id?: string;
    service_Id: string;
    quantity: number
}

export interface Summary {
    selectedDate?: string;
    selectedCenter: Center;
    selectedSession?: Session;
    selectedFormula?: Formula;
    selectedServices: Service[];
    totalAmount: number;
    reservationType: ReservationType;
}

export enum ReservationType {
    Appointment = '1',
    Care = '2'
}

export interface GiftCard {
    giftCard_Id: number;
    image_Id: number;
    name: string;
    price: number;
    status: string;
    startTime: string;
    endTime: string;
    label?: string;
    detail: string;
    RowStatus?: string;
}

export interface GiftCardModal {
    giftCardId: string;
    recipientName: string;
    comment: string;
    price: number;
    user_Id: string;
    paymentId: string;
    paymentType:string;
}

export interface FormulaModal {
    day: number;
    sessionData: Session
}

export interface Promocode {
    promocode_Id: string;
    code: string;
    percentage_off: number;
    valid_Till: Date;
    no_of_times_use: number;
    is_Active: number;
    RowStatus?: string;
}

export interface GiftCardBought {
    isUsed: boolean;
    paymentStatus: string;
    giftCardCode: string;
    recipientName: string;
    comment: string;
    price: number;
}

export interface AppointmentModal {
    center: Center;
    date: Date;
    session: Session;
    formula: Formula;
    amount: number;
    paymentStatus: string;
    quantity?: number;
    service?: Service[];
    services?: string;
}