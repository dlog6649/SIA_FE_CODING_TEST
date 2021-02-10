import styles from "./ToolBar.module.scss"

import React, { useEffect, useRef, useState } from "react"

import { changeMode, LabelMode } from "../../../../common/modules/annotator"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../../index"

import cn from "classnames"

import Button from "../../../../common/components/button/Button"
import { CursorDefault, Square } from "../../../../common/asset/icons"

type Props = {
  className?: string
}

export default function ToolBar(props: Props) {
  const [mode, setMode] = useState<LabelMode>(LabelMode.Select)
  const refModeBtnList = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const labelMode = useSelector((state: RootState) => state.annotatorReducer.mode)

  useEffect(() => {
    console.log("LabelMode useEffect: [props.mode]")
    const refModeBtnDiv = refModeBtnList.current
    if (refModeBtnDiv === null) {
      return
    }
    refModeBtnDiv.childNodes.forEach((modeBtnEle) => {
      const modeBtn = modeBtnEle as HTMLButtonElement
      labelMode === LabelMode[modeBtn.id] ? modeBtn.classList.add("active") : modeBtn.classList.remove("active")
    })
  }, [labelMode])

  const clickBtn = (evt: React.FormEvent<HTMLButtonElement>) => {
    const clickedMode: string = evt.currentTarget.id
    if (mode === clickedMode) {
      return
    }
    const refModeBtnDiv = refModeBtnList.current
    if (refModeBtnDiv === null) {
      return
    }
    refModeBtnDiv.childNodes.forEach((modeBtnEle) => {
      const modeBtn = modeBtnEle as HTMLButtonElement
      if (clickedMode === modeBtn.id) {
        modeBtn.classList.add("active")
      } else {
        modeBtn.classList.remove("active")
      }
    })
    setMode(LabelMode[clickedMode])
    dispatch(changeMode({ mode: LabelMode[clickedMode] }))
  }

  return (
    <aside className={cn(styles.toolBar, props.className)} ref={refModeBtnList}>
      <Button className={"btn label-mode-btn active"} onClick={clickBtn} id={LabelMode.Select}>
        <CursorDefault />
      </Button>
      <Button className={"btn label-mode-btn"} onClick={clickBtn} id={LabelMode.Create}>
        <Square />
      </Button>
    </aside>
  )
}
