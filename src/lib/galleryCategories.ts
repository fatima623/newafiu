export type GalleryCategoryValue =
  | 'OPD'
  | 'DAY_CARE'
  | 'SURGERIES'
  | 'DIALYSIS'
  | 'ESWL'
  | 'WARDS'
  | 'URODYNAMIC_STUDIES'
  | 'RADIOLOGY_DEPARTMENT'
  | 'RENAL_TRANSPLANT_SERVICE'
  | 'OTHERS';

export type GalleryCategoryOption = {
  value: GalleryCategoryValue;
  label: string;
  slug: string;
};

export const GALLERY_CATEGORIES: GalleryCategoryOption[] = [
  { value: 'OPD', label: 'OPD (Outpatient Department)', slug: 'opd-outpatient-department' },
  { value: 'DAY_CARE', label: 'Day Care', slug: 'day-care' },
  { value: 'SURGERIES', label: 'Surgeries', slug: 'surgeries' },
  { value: 'DIALYSIS', label: 'Dialysis', slug: 'dialysis' },
  { value: 'ESWL', label: 'ESWL (Lithotripsy)', slug: 'eswl-lithotripsy' },
  { value: 'WARDS', label: 'Wards', slug: 'wards' },
  { value: 'URODYNAMIC_STUDIES', label: 'Urodynamic Studies (UDS)', slug: 'urodynamic-studies-uds' },
  { value: 'RADIOLOGY_DEPARTMENT', label: 'Radiology Department', slug: 'radiology-department' },
  { value: 'RENAL_TRANSPLANT_SERVICE', label: 'Renal Transplant Service', slug: 'renal-transplant-service' },
  { value: 'OTHERS', label: 'Others', slug: 'others' },
];

export function getGalleryCategoryBySlug(slug: string): GalleryCategoryOption | undefined {
  return GALLERY_CATEGORIES.find((c) => c.slug === slug);
}

export function getGalleryCategoryByValue(value: string): GalleryCategoryOption | undefined {
  return GALLERY_CATEGORIES.find((c) => c.value === value);
}
