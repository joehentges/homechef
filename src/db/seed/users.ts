import { animals, colors, uniqueNamesGenerator } from "unique-names-generator"

interface UserSeed {
  id: number
  email: string
  emailVerified?: number
  password: string
  displayName: string
  image?: string
}

export const usersSeed: UserSeed[] = [
  {
    id: 1,
    email: "testing@example.com",
    emailVerified: undefined,
    // password = 'password'
    password:
      "$argon2id$v=19$m=65536,t=3,p=4$CgfrrvtaM6VBOnlxe4BgJg$cB8p2ejsQi9Rg30hCA57lWG05hK+jw3zPboNdEB8jh8",
    displayName: uniqueNamesGenerator({
      dictionaries: [colors, animals],
      separator: " ",
      style: "capital",
    }),
  },
  {
    id: 2,
    email: "testing2@example.com",
    emailVerified: undefined,
    // password = 'password'
    password:
      "$argon2id$v=19$m=65536,t=3,p=4$CgfrrvtaM6VBOnlxe4BgJg$cB8p2ejsQi9Rg30hCA57lWG05hK+jw3zPboNdEB8jh8",
    displayName: uniqueNamesGenerator({
      dictionaries: [colors, animals],
      separator: " ",
      style: "capital",
    }),
  },
]
