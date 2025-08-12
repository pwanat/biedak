import { pgEnum } from "drizzle-orm/pg-core"

export const currencyEnum = pgEnum('currency', ['PLN'])
export type Currency = typeof currencyEnum.enumValues[number]