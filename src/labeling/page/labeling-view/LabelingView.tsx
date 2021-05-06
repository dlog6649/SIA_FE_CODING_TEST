import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import Header from "./header/Header"
import ToolBar, { ToolBtn } from "./tool-bar/ToolBar"
import ListBox from "./list-box/ListBox"
import LabelingBoard from "./labeling-board/LabelingBoard"
import styles from "./LabelingView.module.scss"
import { RouteComponentProps } from "react-router"
import { getImage } from "../../modules/labeling"
import { CursorDefault, Square } from "../../../common/asset/icons"
import { Label } from "./labeling-board/Label"
import { useRootState } from "../../../common/hooks/useRootState"

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
    icon: <CursorDefault />,
  },
  { value: Mode.Creation, icon: <Square /> },
]

const initLabels: Label[] = [...Array(1)].map((t, i) => {
  const label = new Label()
  label.name = "Class"
  label.x = 200
  label.y = 100
  label.width = 100
  label.height = 300
  label.selected = i % 2 === 0
  return label
})

type Params = {
  id: string
}

export default function LabelingView({ match: { params } }: RouteComponentProps<Params>) {
  const [mode, setMode] = useState<Mode>(Mode.Creation)
  const [labels, setLabels] = useState<Label[]>([])
  const getImageState = useRootState((state) => state.labelingReducer.api.getImage)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getImage(params.id))
  }, [params.id])

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

  const addLabel = (label: Label) => {
    setLabels(labels.concat(label))
  }

  const removeLabel = (label: Label) => {
    setLabels(labels.filter((item) => item.id !== label.id))
  }

  return (
    <div className={styles.labelingView}>
      <Header title={getImageState.data?.title} />
      <main className={styles.row}>
        <ToolBar btns={toolBtns} value={mode} onChange={(value) => setMode(value as Mode)} />
        <ListBox labels={labels} onItemClick={selectItem} />
        <LabelingBoard imgUrl={getImageState.data?.url} mode={mode} labels={labels} setLabels={setLabels} />
      </main>
    </div>
  )
}
