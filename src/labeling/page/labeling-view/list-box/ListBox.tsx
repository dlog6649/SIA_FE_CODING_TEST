import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { LabelMode, selectLabels } from "../../../../common/modules/annotator"
import { RootState } from "../../../../index"

import cn from "classnames"
import styles from "./ListBox.module.scss"
import { Left, Right } from "../../../../common/asset/icons"
import Button from "../../../../common/components/button/Button"

const compareIds = (_ids: Array<number>) => {
  const ids = [] as Array<number>
  document.querySelectorAll(".label-info.active").forEach((labelInfo: Element) => {
    const info: HTMLLIElement = labelInfo as HTMLLIElement
    ids.push(Number(info.dataset.id))
  })
  if (ids.length !== _ids.length) {
    return false
  }
  for (let i = 0; i < _ids.length; i++) {
    if (Number(_ids[i]) !== Number(ids[i])) {
      return false
    }
  }
  return true
}

interface Label {
  id: number
  name: string
  coord: Array<{ x: number; y: number }>
  data: { x: number; y: number; w: number; h: number; deg: number }
}

export type ListItem = {
  id: string
  name: string
  coord: string
  selected: boolean
}

type Props = {
  className?: string
  itemList?: ListItem[]
  onItemClick?: (id: string) => (evt: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}

export default function ListBox(p: Props) {
  const [isOpen, setOpen] = useState<boolean>(false)
  const dispatch = useDispatch()
  const mode = useSelector((state: RootState) => state.annotatorReducer.mode)
  const selectedLabelsIds = useSelector((state: RootState) => state.annotatorReducer.selectedLabelsIds)
  const labels = useSelector((state: RootState) =>
    state.annotatorReducer.labels[state.annotatorReducer.currentImgURL] === undefined
      ? []
      : state.annotatorReducer.labels[state.annotatorReducer.currentImgURL],
  )

  // useEffect(() => {
  //   console.log("LabelList useEffect [p.labels]")
  //   if (!listBoxRef.current) {
  //     return
  //   }
  //   const curRefLabelList = listBoxRef.current
  //   const labelListRoot = curRefLabelList.lastChild as HTMLUListElement
  //   while (labelListRoot.firstChild) {
  //     labelListRoot.removeChild(labelListRoot.firstChild)
  //   }
  //   let labelList = ""
  //   labels.forEach((label: Label) => {
  //     labelList += `
  //               <li class="label-info btn" data-id="${label.id}" data-testid="testLabelInfo">
  //                   <p class="label-class">${label.name}</p>
  //                   <p class="label-coordinate">
  //                       (${Number(label.coord[0].x)}, ${Number(label.coord[0].y)})
  //                       (${Number(label.coord[1].x)}, ${Number(label.coord[1].y)})
  //                       (${Number(label.coord[2].x)}, ${Number(label.coord[2].y)})
  //                       (${Number(label.coord[3].x)}, ${Number(label.coord[3].y)})
  //                   </p>
  //               </li>
  //           `
  //   })
  //
  //   labelListRoot.insertAdjacentHTML("afterbegin", labelList)
  // }, [labels])

  useEffect(() => {
    console.log("LabelList useEffect [p.selectedLabelsIds]")
    if (compareIds(selectedLabelsIds)) {
      console.log("LabelList useEffect [p.selectedLabelsIds] returned")
      return
    }
    document.querySelectorAll(".label-info").forEach((labelInfo) => {
      const info: HTMLElement = labelInfo as HTMLElement
      info.classList.remove("active")
      selectedLabelsIds.forEach((id) => {
        if (Number(info.dataset.id) === Number(id)) {
          info.classList.add("active")
        }
      })
    })
  }, [selectedLabelsIds])

  const selectLabel = (evt: any): void => {
    if (mode === LabelMode.Create) {
      return
    }
    const labelInfo: HTMLLIElement = evt.target.classList.contains("label-info") ? evt.target : evt.target.parentNode
    labelInfo.classList.add("active")
    if (!evt.ctrlKey) {
      document.querySelectorAll(".label-info.active").forEach((info: Element) => {
        if (labelInfo !== info) {
          info.classList.remove("active")
        }
      })
    }
    const ids = [] as Array<number>
    document.querySelectorAll(".label-info.active").forEach((info: Element) => {
      ids.push(Number((info as HTMLLIElement).dataset.id as string))
    })
    dispatch(selectLabels({ selectedLabelsIds: ids }))
  }

  return (
    <aside className={cn(styles.listBox, p.className)}>
      <Button
        className={cn(styles.toggle, isOpen && styles.open)}
        icon={isOpen ? <Left /> : <Right />}
        onClick={() => setOpen(!isOpen)}
        type={"ghost"}
      />
      {isOpen && (
        <>
          <section>
            <h4>{"Labels"}</h4>
          </section>
          <ul>
            {p.itemList?.map((item) => (
              <li
                className={cn(item.selected && styles.active)}
                onClick={p.onItemClick && p.onItemClick(item.id)}
                key={item.id}
              >
                <div className={styles.name}>{item.name}</div>
                <div className={styles.coord}>{item.coord}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  )
}
