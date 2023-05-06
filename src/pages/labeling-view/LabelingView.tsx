import { useImageQuery } from "@src/domains/image/queries"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router"

import styles from "./LabelingView.module.scss"
import Header from "./header/Header"
import { Label } from "./labeling-board/Label"
import LabelingBoard from "./labeling-board/LabelingBoard"
import ListBox from "./list-box/ListBox"
import ToolBar, { ToolBtn } from "./tool-bar/ToolBar"

/**
 * TODO: canvas로 변경
 */

export enum Mode {
  Selection = "Selection",
  Creation = "Creation",
}

const toolBtns: ToolBtn[] = [
  {
    value: Mode.Selection,
    icon: <span className={"i-outline:cursor text-2.25rem"} />,
  },
  { value: Mode.Creation, icon: <span className={"i-outline:square text-2rem"} /> },
]

type Params = {
  id: string
}

export default function LabelingView() {
  const { id } = useParams<Params>()
  const [mode, setMode] = useState(Mode.Creation)
  const [labels, setLabels] = useState<Label[]>([])
  const { data } = useImageQuery(Number(id))

  useEffect(() => {
    if (mode === Mode.Creation) {
      setLabels((labels) =>
        labels.map((item) => {
          item.selected = false
          return item
        }),
      )
    }
  }, [mode])

  const selectItem = (id: string) => (evt: React.MouseEvent) => {
    if (mode === Mode.Creation) return
    if (evt.ctrlKey) {
      setLabels(
        labels.map((item) => {
          if (item.id === id) item.selected = !item.selected
          return item
        }),
      )
    } else {
      setLabels(
        labels.map((item) => {
          item.selected = item.id === id
          return item
        }),
      )
    }
  }

  return (
    <div className={styles.labelingView}>
      <Header title={data?.title} />
      <main className={styles.row}>
        <ToolBar btns={toolBtns} value={mode} onChange={(value) => setMode(value as Mode)} />
        <ListBox labels={labels} onItemClick={selectItem} />
        <LabelingBoard imgUrl={data?.url} mode={mode} labels={labels} setLabels={setLabels} />
      </main>
    </div>
  )
}
