export type SettingType = 'static' | 'login' | 'version';

export type SettingValue = VersionSetting;

export interface VersionSetting {
  version: string;
}
export interface LoginSetting {
  enableMaxLoginRetry: boolean;
  maxRetryTimes: number;
  durationSeconds: number;
  expiresIn: number;
}
export interface VersionSetting {
  version: string;
}
