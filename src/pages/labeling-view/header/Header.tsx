import Button from "@src/components/button"
import Paths from "@src/shared/Paths"
import React from "react"
import { useNavigate } from "react-router"

type Props = {
  title?: string
}

export default function Header({ title = "" }: Props) {
  const navigate = useNavigate()

  return (
    <header className={"flex items-center h-6rem border-none border-b-1px border-b-solid border-b-[lightgray]"}>
      <Button.Icon className={"w-5.6rem h-full"} onClick={() => navigate(Paths.root)}>
        <span className={"i-outline:arrow-left text-28px"} />
      </Button.Icon>
      <h1 className={"ml-1rem ellipsis"} title={title}>
        {title}
      </h1>
    </header>
  )
}
