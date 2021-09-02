import { IdName, IdNameAlias } from "@/components/Commons/common";

export type PrepareData = {
  project: any
  insLib: IdName
  anaLib: IdName
  method: IdName
  // insProteins: string[]
  anaProteins: string[]
  expList: array<IdNameAlias>
  overviewMap: Map<string, any>
}
