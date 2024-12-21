import argon2 from "argon2"

async function main() {
  const password = "password"

  const hash = await argon2.hash(password)

  console.log(hash)

  const verified = await argon2.verify(
    "$argon2id$v=19$m=65536,t=3,p=4$CgfrrvtaM6VBOnlxe4BgJg$cB8p2ejsQi9Rg30hCA57lWG05hK+jw3zPboNdEB8jh8",
    password
  )

  console.log(verified)
}

main()
