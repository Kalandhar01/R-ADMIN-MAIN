export const COMPANY_CONTACT = {
  email: "noorulsmart1998@gmail.com",
  mobile: "+91 9080844114",
  office: "+91 9443855819",
  locations: ["Coimbatore", "Palani", "Dindigul"],
  locationDisplay: "Coimbatore • Palani • Dindigul",
  emailHref: "mailto:noorulsmart1998@gmail.com",
  mobileHref: "tel:+919080844114",
  officeHref: "tel:+919443855819"
} as const;

export const CONSULTATION_CONTACT_ITEMS = [
  { label: "Email", value: COMPANY_CONTACT.email, href: COMPANY_CONTACT.emailHref },
  { label: "Phone", value: COMPANY_CONTACT.mobile, href: COMPANY_CONTACT.mobileHref },
  { label: "Office", value: COMPANY_CONTACT.office, href: COMPANY_CONTACT.officeHref }
] as const;

export const COMPANY_CONTACT_ITEMS = [
  { label: "Email", value: COMPANY_CONTACT.email, href: COMPANY_CONTACT.emailHref },
  { label: "Mobile", value: COMPANY_CONTACT.mobile, href: COMPANY_CONTACT.mobileHref },
  { label: "Office", value: COMPANY_CONTACT.office, href: COMPANY_CONTACT.officeHref },
  { label: "Locations", value: COMPANY_CONTACT.locationDisplay, href: undefined }
] as const;
