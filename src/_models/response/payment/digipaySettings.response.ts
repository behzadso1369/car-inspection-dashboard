export interface DigipaySurchargeSample {
  baseAmount: number;
  surchargeAmount: number;
  payableAmount: number;
  title: string;
  displayText: string;
}

export interface DigipaySettingsResult {
  id: number;
  installmentSurchargePercent: number;
  sample?: DigipaySurchargeSample | null;
}
