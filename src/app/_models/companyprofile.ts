// CMS has a table called CompanyProfile (depicted here) - don't confuse with Dealer entered values like sales tax (dlrSalesTax)
// those fields are in tblCompany
export class CompanyProfile {
    CompanyID: number;
    DMSId: number;
    ReferredBy: number;
}