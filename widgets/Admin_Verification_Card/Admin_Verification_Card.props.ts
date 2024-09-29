export default interface IAdmin_Verification_Card {
  data: {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate: Date;
    birthPlace: string;
    tel: string;
    passSeries: string;
    passNumber: string;
    getDate: Date;
    givenBy: string;
    subunitCode: string;
    registrationAddress: string;
    bankName: string;
    accountNumber: string;
    status: string | null;
  };
}
