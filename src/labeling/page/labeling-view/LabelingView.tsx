import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../index"
import Header from "./header/Header"
import ToolBar, { ToolBtn } from "./tool-bar/ToolBar"
import ListBox, { ListItem } from "./list-box/ListBox"
import LabelingBoard from "./labeling-board/LabelingBoard"
import styles from "./LabelingView.module.scss"
import { RouteComponentProps } from "react-router"
import { getImage } from "../../modules/labeling"
import { CursorDefault, Square } from "../../../common/asset/icons"

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
    key: Mode.Selection,
    icon: <CursorDefault />,
  },
  { key: Mode.Creation, icon: <Square /> },
]

const initItemList: ListItem[] = [...Array(200)].map((a, i) => ({
  id: i.toString(),
  name: "Class",
  coord: "(135.1351353115315, 13.51351353115315)",
  selected: i % 2 === 0,
}))

type Props = {
  id: string
}

export default function LabelingView(p: RouteComponentProps<Props>) {
  const [mode, setMode] = useState<Mode>(Mode.Selection)
  const [itemList, setItemList] = useState<ListItem[]>(initItemList)
  const getImageAsync = useSelector((state: RootState) => state.labelingReducer.api.getImage)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getImage(p.match.params.id))
  }, [])

  useEffect(() => {
    if (mode === Mode.Creation) {
      setItemList(
        itemList.map((item) => {
          item.selected = false
          return item
        }),
      )
    }
  }, [mode])

  const selectItem = (id: string) => (evt: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (mode === Mode.Creation) return
    if (evt.ctrlKey) {
      setItemList(
        itemList.map((item) => {
          if (item.id === id) item.selected = !item.selected
          return item
        }),
      )
    } else {
      setItemList(
        itemList.map((item) => {
          item.selected = item.id === id
          return item
        }),
      )
    }
  }

  return (
    <div className={styles.labelingView}>
      <Header title={getImageAsync.data?.title || ""} />
      <div className={styles.row}>
        <ToolBar btnList={toolBtnList} onChange={(key) => setMode(key as Mode)} />
        <ListBox itemList={itemList} onItemClick={selectItem} />
        <LabelingBoard imgUrl={getImageAsync.data?.url || ""} mode={mode} />
      </div>
    </div>
  )
}
