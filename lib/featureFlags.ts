export interface FeatureFlags {
  enableNewCalculator: boolean;
  enableAppleEffects: boolean;
  enableZodValidation: boolean;
  enablePortfolioVirtualization: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  enableNewCalculator: true,
  enableAppleEffects: true,
  enableZodValidation: true,
  enablePortfolioVirtualization: true,
};

export function getFeatureFlags(): FeatureFlags {
  // Client-side local overrides for debugging
  if (typeof window !== "undefined") {
    const overrides = localStorage.getItem("adlight_feature_flags");
    if (overrides) {
      try {
        return { ...DEFAULT_FLAGS, ...JSON.parse(overrides) };
      } catch (e) {
        console.error("Failed to parse feature flag overrides from localStorage", e);
      }
    }
  }

  return {
    enableNewCalculator: process.env.NEXT_PUBLIC_ENABLE_NEW_CALCULATOR === "true" || DEFAULT_FLAGS.enableNewCalculator,
    enableAppleEffects: process.env.NEXT_PUBLIC_ENABLE_APPLE_EFFECTS === "true" || DEFAULT_FLAGS.enableAppleEffects,
    enableZodValidation: process.env.NEXT_PUBLIC_ENABLE_ZOD_VALIDATION === "true" || DEFAULT_FLAGS.enableZodValidation,
    enablePortfolioVirtualization: process.env.NEXT_PUBLIC_ENABLE_PORTFOLIO_VIRTUALIZATION === "true" || DEFAULT_FLAGS.enablePortfolioVirtualization,
  };
}

export function setFeatureFlagOverride(flag: keyof FeatureFlags, value: boolean) {
  if (typeof window !== "undefined") {
    const current = getFeatureFlags();
    current[flag] = value;
    localStorage.setItem("adlight_feature_flags", JSON.stringify(current));
  }
}

export function clearFeatureFlagOverrides() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adlight_feature_flags");
  }
}
