import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../index"
import Header from "./header/Header"
import ToolBar, { ToolBtn } from "./tool-bar/ToolBar"
import ListBox from "./list-box/ListBox"
import LabelingBoard from "./labeling-board/LabelingBoard"
import styles from "./LabelingView.module.scss"
import { RouteComponentProps } from "react-router"
import { getImage } from "../../modules/labeling"
import { CursorDefault, Square } from "../../../common/asset/icons"
import { Label } from "./labeling-board/Label"

/**
 * TODO: SVG 보드 TS로 변경
 * TODO: canvas로 변경
 */

export enum Mode {
  Selection = "Selection",
  Creation = "Creation",
}

const toolBtnList: ToolBtn[] = [
  {
    value: Mode.Selection,
    icon: <CursorDefault />,
  },
  { value: Mode.Creation, icon: <Square /> },
]

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //최댓값은 제외, 최솟값은 포함
}

const initLabelList: Label[] = [...Array(1)].map((t, i) => {
  const label = new Label()
  label.name = "Class"
  label.x = 200
  label.y = 100
  label.width = 100
  label.height = 300
  label.selected = i % 2 === 0
  return label
})

type Props = {
  id: string
}

export default function LabelingView(p: RouteComponentProps<Props>) {
  const [mode, setMode] = useState<Mode>(Mode.Creation)
  const [labelList, setLabelList] = useState<Label[]>(initLabelList)
  const getImageAsync = useSelector((state: RootState) => state.labelingReducer.api.getImage)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getImage(p.match.params.id))
  }, [])

  useEffect(() => {
    if (mode === Mode.Creation) {
      setLabelList(
        labelList.map((item) => {
          item.selected = false
          return item
        }),
      )
    }
  }, [mode])

  const selectItem = (id: string) => (evt: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (mode === Mode.Creation) return
    if (evt.ctrlKey) {
      setLabelList(
        labelList.map((item) => {
          if (item.id === id) item.selected = !item.selected
          return item
        }),
      )
    } else {
      setLabelList(
        labelList.map((item) => {
          item.selected = item.id === id
          return item
        }),
      )
    }
  }

  const addLabel = (label: Label) => {
    setLabelList(labelList.concat(label))
  }

  const removeLabel = (label: Label) => {
    setLabelList(labelList.filter((item) => item.id !== label.id))
  }

  return (
    <div className={styles.labelingView}>
      <Header title={getImageAsync.data?.title || ""} />
      <div className={styles.row}>
        <ToolBar btnList={toolBtnList} value={mode} onChange={(value) => setMode(value as Mode)} />
        <ListBox labelList={labelList} onItemClick={selectItem} />
        <LabelingBoard
          imgUrl={getImageAsync.data?.url || ""}
          mode={mode}
          labelList={labelList}
          setLabelList={setLabelList}
          addLabel={addLabel}
          // removeLabel={}
        />
      </div>
    </div>
  )
}
