import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../../index"
import styles from "./LabelingBoard.module.scss"
import ZoomSlider from "./zoom-slider/ZoomSlider"
import ContextMenu from "./context-menu/ContextMenu"
import { LabelingCore } from "./LabelingCore"
import { Mode } from "../LabelingView"
import labelNS from "./labeling-tool/labelNS"
import { LabelMode, selectLabels } from "../../../../common/modules/annotator"
import { createInputBox, initializeLabel, labelBodyMouseDownEvent } from "./labeling-tool/LabelCreator"
import { deleteAnchors, getSelectedLabelsIds } from "./labeling-tool/LabelMain"
import { generateUUID, parseTransform, parseTransformG } from "../../../../common/utils/common"
import { Label } from "./Label"

export let dispatch: any
export let _setScale: React.Dispatch<React.SetStateAction<number>>

const INIT_ZOOM_LEVEL = 1

const MAX_ZOOM = 2
const MIN_ZOOM = 0.1

// type Label = {
//   ele: SVGGElement
//   x: number
//   y: number
//   width: number
//   height: number
// }

type Props = {
  className?: string
  imgUrl?: string
  mode: Mode
  labelList?: Label[]
  addLabel: (label: Label) => void
}

export default function LabelBoard(p: Props) {
  const [zoom, setZoom] = useState<number>(1)
  const [isCtxMenuVisible, setCtxMenuVisible] = useState<boolean>(false)
  // const dispatcher = useDispatch()
  // const mode = useSelector((state: RootState) => state.annotatorReducer.mode)
  // const currentImgURL = useSelector((state: RootState) => state.annotatorReducer.currentImgURL)
  // const selectedLabelsIds = useSelector((state: RootState) => state.annotatorReducer.selectedLabelsIds)
  // const image = useSelector((state: RootState) => state.annotatorReducer.images[state.annotatorReducer.currentImgURL])
  // const labels = useSelector((state: RootState) => state.annotatorReducer.labels[state.annotatorReducer.currentImgURL])
  // const labelingCoreRef = useRef<LabelingCore | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const isDrawingRef = useRef<boolean>(false)
  const curLabelRef = useRef<Label>()

  // useEffect(() => {
  //   if (!svgRef.current) return
  //   labelingCoreRef.current = new LabelingCore(svgRef.current)
  // }, [])
  //
  // useEffect(() => {
  //   if (!labelingCoreRef.current) return
  //   labelingCoreRef.current.zoom = zoom
  // }, [zoom])
  //
  // useEffect(() => {
  //   if (!labelingCoreRef.current || !p.mode) return
  //   labelingCoreRef.current.mode = p.mode
  // }, [p.mode])

  // useEffect(() => {
  //   console.log("LabelBoard useEffect: []")
  //   dispatch = dispatcher
  //   _setScale = setScale
  //   LabelMain.initialize()
  //   return () => LabelMain.finalize()
  // }, [])
  // //
  // useEffect(() => {
  //   console.log("LabelBoard useEffect: [mode]: ", mode)
  //   if (LabelMain.getMode() === mode) {
  //     console.log("useEffect: [mode]: returned ")
  //     return
  //   }
  //   LabelMain.setMode(mode)
  // }, [mode])
  //
  // useEffect(() => {
  //   console.log("LabelBoard useEffect: [image]: ")
  //   if (compareImage(image)) {
  //     console.log("LabelBoard useEffect: [image]: returned")
  //     return
  //   }
  //   redrawImage(currentImgURL, image)
  // }, [image])
  //
  // useEffect(() => {
  //   console.log("LabelBoard useEffect: [labels]: ")
  //   if (compareLabels(labels)) {
  //     console.log("LabelBoard useEffect: [labels]: returned")
  //     return
  //   }
  //   redrawLabels(labels)
  // }, [labels])
  //
  // useEffect(() => {
  //   console.log("LabelBoard useEffect: [selectedLabelsIds]: ")
  //   if (compareIds(selectedLabelsIds)) {
  //     console.log("LabelBoard useEffect: [selectedLabelsIds]: returned")
  //     return
  //   }
  //   LabelMain.createAnchorsInSelectedLabelsIds(selectedLabelsIds)
  // }, [selectedLabelsIds])

  const onSvgMouseDown = (evt: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (labelNS.isPushingSpacebar) {
      // labelNS.isDragging = true
      // initImgForDrag(evt)
    } else if (p.mode === Mode.Creation) {
      // 마우스 왼쪽 클릭이 아니면
      if (evt.button !== 0) return
      isDrawingRef.current = true

      const startX = evt.nativeEvent.offsetX
      const startY = evt.nativeEvent.offsetY
      const label = new Label(startX, startY)

      svgRef.current?.appendChild(label.g)
      curLabelRef.current = label
    } else if (p.mode === Mode.Selection) {
      // const selectedLabels = [...labelNS.svg.childNodes].filter((node) => node.classList.contains("selected"))
      // if (!selectedLabels.length) {
      //   return
      // }
      // deleteAnchors(evt)
      // dispatch(selectLabels({ selectedLabelsIds: getSelectedLabelsIds() }))
    }
  }

  // startX, startY 를 저장할 메모리가 필요함.
  const onSvgMouseMove = (evt: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (p.mode === Mode.Creation && isDrawingRef.current) {
      const label = curLabelRef.current
      if (!label) return

      const endX = evt.nativeEvent.offsetX
      const endY = evt.nativeEvent.offsetY
      const x = label.x < endX ? label.x : endX
      const y = label.y < endY ? label.y : endY
      let width = label.x > endX ? label.x - endX : endX - label.x
      let height = label.y > endY ? label.y - endY : endY - label.y
      width = width / zoom
      height = height / zoom

      label.g.setAttribute("transform", `translate(${x} ${y}) scale(${zoom}) rotate(0 0 0)`)
      // label.rect.setAttribute("width", width.toString())
      // label.rect.setAttribute("height", height.toString())
      label.width = width
      label.height = height
      // label.x = x
      // label.y = y
    }
  }

  const onSvgMouseUp = (evt: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (p.mode === Mode.Creation && isDrawingRef.current) {
      const label = curLabelRef.current
      if (!label) return
      if (label.width > 10 && label.height > 10) {
        p.addLabel(label)
      }
      svgRef.current?.removeChild(label.g)
      curLabelRef.current = undefined
    }
    isDrawingRef.current = false
  }

  return (
    <main className={styles.labelBoard}>
      <svg
        id={"svg"}
        width={"100%"}
        height={"100%"}
        onMouseDown={onSvgMouseDown}
        onMouseMove={onSvgMouseMove}
        onMouseUp={onSvgMouseUp}
        data-testid={"testSvg"}
        ref={svgRef}
      >
        {p.labelList?.map((label) => (
          <g
            transform={`
            translate(${label.x} ${label.y})
            rotate(${label.degree} ${label.width * 0.5} ${label.height * 0.5})
            `}
            key={label.id}
          >
            <rect
              width={label.width}
              height={label.height}
              fill={label.color}
              fillOpacity={"0.2"}
              stroke={label.color}
              strokeWidth={"3"}
            />
            <polygon />
          </g>
        ))}
        {/*<defs>*/}
        {/*  <filter id={"f1"}>*/}
        {/*    <feDropShadow dx={"-1"} dy={"1"} stdDeviation={"2.5"} floodColor={"gray"} />*/}
        {/*  </filter>*/}
        {/*</defs>*/}
      </svg>
      <ZoomSlider
        className={styles.zoomSliderPositioner}
        value={zoom}
        onChange={(evt) => setZoom(parseFloat(evt.target.value))}
      />
      <ContextMenu />
    </main>
  )
}
