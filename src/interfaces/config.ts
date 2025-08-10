import { VpcConfig } from "./network";
import { RdsConfig } from "./rds";

export interface AppConfig {
  accountId: string;
  awsProfile: string;
  region: string;
  vpc: VpcConfig;
  rds: RdsConfig;
}