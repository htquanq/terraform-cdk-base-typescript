import { VpcConfig } from "./network";

export interface AppConfig {
  accountId: string;
  awsProfile: string;
  region: string;
  vpc: VpcConfig;
  eksClusters?: any[]; // Define proper type if needed
  iamRoles?: any[]; // Define proper type if needed
}