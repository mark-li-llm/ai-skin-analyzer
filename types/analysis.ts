// Shared API contract for MVP (import as `@/types/analysis`)

export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';

export interface SpecificProduct {
  brandName: string;
  productName: string;
  spf: string; // keep as string per docs
  keyBenefit: string;
}

export interface SkinAnalysisResult {
  skinType: SkinType;
  confidence: number; // 0..1
  analysis: {
    observedCharacteristics: string[];
    skinTypeExplanation: string;
  };
  productRecommendation: {
    formulationType: string;
    formulationReasoning: string;
    specificProducts: SpecificProduct[]; // 1-2 items
  };
  additionalNotes?: string;
}

export type ApiErrorCode =
  | 'InvalidImage'
  | 'FileTooLarge'
  | 'UnsupportedType'
  | 'OpenAIError'
  | 'Timeout'
  | 'RateLimited';

export interface ApiError {
  error: ApiErrorCode;
  message?: string;
}

