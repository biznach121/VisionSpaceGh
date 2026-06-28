import { createContractSuite } from "@cimplify/sdk/testing/suite";
import { brand } from "../lib/brand";

createContractSuite({ seed: brand.mock.seed });
