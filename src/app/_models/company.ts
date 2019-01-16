import { Contact } from '../_models/contact';
import { CompanyProfile } from '../_models/companyprofile';

// models tblCompany
export class CMSCompany {
    CompanyName: string;
    CompanyID: number;          // CMS ID
    CreatedDate: Date;
    AddrLn1: string;
    AddrLn2: string;
    City: string;
    State: string;
    Zip: string;
    Phone: string;
    County: string;
    SubmitFromDT: boolean;
    Contacts: Contact[];
    DMSOther: string;
    DMSName: string;
    CompanyProfile: CompanyProfile;
    DlrSaleTaxPer: number;
    DlrCntyTaxPer: number;
}
