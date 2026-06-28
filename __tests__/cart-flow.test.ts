import { createCartFlowSuite } from "@cimplify/sdk/testing/suite";
import { brand } from "../lib/brand";

createCartFlowSuite({ seed: brand.mock.seed, businessId: brand.mock.businessId });
