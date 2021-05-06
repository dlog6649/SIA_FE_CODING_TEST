import React, { useEffect, useRef, useState } from "react"
import styles from "./LabelingBoard.module.scss"
import ZoomSlider from "./zoom-slider/ZoomSlider"
import ContextMenu, { MenuItem } from "./context-menu/ContextMenu"
import { LabelingCore, SvgRole } from "./LabelingCore"
import { Mode } from "../LabelingView"
import { Label } from "./Label"
import { SvgImage } from "./SvgImage"
import { pauseEvent } from "../../../../common/utils/common"

export type Coordinate = {
  x: number
  y: number
}

export type MenuItemState = {
  visible: boolean
  disabled: boolean
}

export type ContextMenuState = {
  edit: MenuItemState
  cut: MenuItemState
  copy: MenuItemState
  paste: MenuItemState
  delete: MenuItemState
}

const initMenuItemState = () => ({
  visible: false,
  disabled: false,
})

const initContextMenuState = () => ({
  edit: initMenuItemState(),
  cut: initMenuItemState(),
  copy: initMenuItemState(),
  paste: initMenuItemState(),
  delete: initMenuItemState(),
})

enum Menu {
  Edit = "Edit class",
  Cut = "Cut",
  Copy = "Copy",
  Paste = "Paste",
  Delete = "Delete",
}

type Props = {
  className?: string
  imgUrl?: string
  mode: Mode
  labels: Label[]
  setLabels: (labels: Label[]) => void
}

export default function LabelBoard(p: Props) {
  const [zoom, setZoom] = useState<number>(1)
  const [isContextMenuVisible, setIsContextMenuVisible] = useState<boolean>(false)
  const [contextMenuCoordinate, setContextMenuCoordinate] = useState<Coordinate>({ x: 0, y: 0 })
  const [contextMenuState, setContextMenuState] = useState<ContextMenuState>(initContextMenuState())
  const labelingCoreRef = useRef<LabelingCore>()
  const svgRef = useRef<SVGSVGElement>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    labelingCoreRef.current = new LabelingCore(svgRef.current, [], p.setLabels, setZoom, setContextMenuState)
    const onDocumentClick = (evt: MouseEvent) => {
      if (evt.target === null) return
      if (!contextMenuRef.current?.contains(evt.target as HTMLElement)) {
        hideContextMenu()
      }
    }
    document.addEventListener("click", onDocumentClick)
    document.addEventListener("keydown", labelingCoreRef.current.onDocumentKeyDown)
    document.addEventListener("keyup", labelingCoreRef.current.onDocumentKeyUp)
    document.addEventListener("mousemove", pauseEvent)
    return () => {
      document.removeEventListener("click", onDocumentClick)
      document.removeEventListener("mousemove", pauseEvent)
      if (labelingCoreRef.current !== undefined) {
        document.removeEventListener("keydown", labelingCoreRef.current.onDocumentKeyDown)
        document.removeEventListener("keyup", labelingCoreRef.current.onDocumentKeyUp)
      }
    }
  }, [p.setLabels])

  useEffect(() => {
    if (p.imgUrl === undefined || svgRef.current === null) return
    const svgImage = new SvgImage(p.imgUrl)
    svgRef.current.appendChild(svgImage.image)
  }, [p.imgUrl])

  useEffect(() => {
    if (!labelingCoreRef.current) return
    labelingCoreRef.current.zoom = zoom
  }, [zoom])

  useEffect(() => {
    if (!labelingCoreRef.current) return
    labelingCoreRef.current.mode = p.mode
  }, [p.mode])

  useEffect(() => {
    if (!labelingCoreRef.current) return
    labelingCoreRef.current.labels = p.labels
  }, [p.labels])

  const onSvgContextMenu = (evt: React.MouseEvent) => {
    evt.preventDefault()
    if (p.mode === Mode.Creation) return
    showContextMenu()
    setContextMenuCoordinate({ x: evt.clientX, y: evt.clientY })
  }

  const showContextMenu = () => setIsContextMenuVisible(true)
  const hideContextMenu = () => setIsContextMenuVisible(false)

  const menuItems: MenuItem[] = [
    {
      name: Menu.Edit,
      shortCut: "F2",
      onClick: labelingCoreRef.current?.onEditMenuClick,
      visible: contextMenuState.edit.visible,
      disabled: contextMenuState.edit.disabled,
    },
    {
      name: Menu.Cut,
      shortCut: "Ctrl + X",
      onClick: labelingCoreRef.current?.onCutMenuClick,
      visible: contextMenuState.cut.visible,
      disabled: contextMenuState.cut.disabled,
    },
    {
      name: Menu.Copy,
      shortCut: "Ctrl + C",
      onClick: labelingCoreRef.current?.onCopyMenuClick,
      visible: contextMenuState.copy.visible,
      disabled: contextMenuState.copy.disabled,
    },
    {
      name: Menu.Paste,
      shortCut: "Ctrl + V",
      onClick: labelingCoreRef.current?.onPasteMenuClick,
      visible: contextMenuState.paste.visible,
      disabled: contextMenuState.paste.disabled,
    },
    {
      name: Menu.Delete,
      shortCut: "Del",
      onClick: labelingCoreRef.current?.onDeleteMenuClick,
      visible: contextMenuState.delete.visible,
      disabled: contextMenuState.delete.disabled,
    },
  ]

  return (
    <div className={styles.labelBoard}>
      <svg
        onContextMenu={onSvgContextMenu}
        width={"100%"}
        height={"100%"}
        data-role={SvgRole.Svg}
        data-testid={"testSvg"}
        ref={svgRef}
      >
        <defs>
          <filter id={"f1"}>
            <feDropShadow dx={"-1"} dy={"1"} stdDeviation={"2.5"} floodColor={"gray"} />
          </filter>
        </defs>
      </svg>
      <ZoomSlider
        className={styles.zoomSliderPositioner}
        value={zoom}
        onChange={(evt) => setZoom(parseFloat(evt.target.value))}
      />
      {isContextMenuVisible && (
        <ContextMenu
          hideContextMenu={hideContextMenu}
          coordinate={contextMenuCoordinate}
          contextMenuRef={contextMenuRef}
          menuItems={menuItems}
        />
      )}
    </div>
  )
}
