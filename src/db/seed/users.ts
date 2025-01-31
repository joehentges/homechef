import { faker } from "@faker-js/faker"
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator"

import { User } from "../schemas"

interface UserSeed {
  id: User["id"]
  email: User["email"]
  emailVerified: User["emailVerified"]
  password: User["password"]
  displayName: User["displayName"]
  image: User["image"]
  summary: User["summary"]
}

export const usersSeed: UserSeed[] = Array.from({ length: 50 }, () =>
  Math.random()
).map((_, index) => ({
  id: index + 1,
  email: `testing${index}@example.com`,
  emailVerified: null,
  // password = 'password'
  password:
    "$argon2id$v=19$m=65536,t=3,p=4$CgfrrvtaM6VBOnlxe4BgJg$cB8p2ejsQi9Rg30hCA57lWG05hK+jw3zPboNdEB8jh8",
  displayName: uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: " ",
    style: "capital",
  }),
  image: null,
  summary: faker.person.bio(),
}))
