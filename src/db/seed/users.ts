import { faker } from "@faker-js/faker"
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator"

interface UserSeed {
  id: number
  email: string
  emailVerified?: number
  password: string
  displayName: string
  image?: string
  summary?: string
}

export const usersSeed: UserSeed[] = Array.from({ length: 50 }, () =>
  Math.random()
).map((_, index) => ({
  id: index + 1,
  email: `testing${index}@example.com`,
  emailVerified: undefined,
  // password = 'password'
  password:
    "$argon2id$v=19$m=65536,t=3,p=4$CgfrrvtaM6VBOnlxe4BgJg$cB8p2ejsQi9Rg30hCA57lWG05hK+jw3zPboNdEB8jh8",
  displayName: uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: " ",
    style: "capital",
  }),
  summary: faker.person.bio(),
}))
