
export interface ProductLimit {
  id: string;
  productCode: string;
  productName: string;
  limitGroup: string;
  roundGroup: string;
  updateDate: string;
  updateBy: string;
  hasError?: boolean;
  errorMessage?: string;
}
