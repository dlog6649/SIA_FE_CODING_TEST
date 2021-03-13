import React, { useEffect, useRef, useState } from "react"
import styles from "./LabelingBoard.module.scss"
import ZoomSlider from "./zoom-slider/ZoomSlider"
import ContextMenu from "./context-menu/ContextMenu"
import { LabelingCore } from "./LabelingCore"
import { Mode } from "../LabelingView"
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

//   9
// 0 1 2
// 7 8 3
// 6 5 4
export const HANDLER_CURSOR_LIST = [
  "nw-resize",
  "n-resize",
  "ne-resize",
  "e-resize",
  "se-resize",
  "s-resize",
  "sw-resize",
  "w-resize",
]

const genHandlers = (label: Label) => {
  const halfOfWidth = label.width * 0.5
  const halfOfHeight = label.height * 0.5
  const anchorPosXList = [
    -7,
    halfOfWidth - 5,
    label.width - 3,
    label.width - 3,
    label.width - 3,
    halfOfWidth - 5,
    -7,
    -7,
  ]
  const anchorPosYList = [
    -7,
    -7,
    -7,
    halfOfHeight - 5,
    label.height - 3,
    label.height - 3,
    label.height - 3,
    halfOfHeight - 5,
  ]
  return (
    <>
      <line x1={halfOfWidth} y1={0} x2={halfOfWidth} y2={-25} stroke={label.color} strokeWidth={3} />
      <circle
        cx={halfOfWidth}
        cy={-25}
        r={5}
        cursor={"crosshair"}
        fill={"white"}
        stroke={label.color}
        strokeWidth={3}
        data-role={"rotator"}
      />
      {[...Array(8)].map((x, i) => (
        <rect
          x={anchorPosXList[i]}
          y={anchorPosYList[i]}
          cursor={HANDLER_CURSOR_LIST[i]}
          width={10}
          height={10}
          fill={"white"}
          stroke={label.color}
          strokeWidth={3}
          data-role={HANDLER_CURSOR_LIST[i]}
        />
      ))}
    </>
  )
}

type Props = {
  className?: string
  imgUrl?: string
  mode: Mode
  labelList: Label[]
  setLabelList: (labelList: Label[]) => void
  addLabel: (label: Label) => void
}

export default function LabelBoard(p: Props) {
  const [zoom, setZoom] = useState<number>(1)
  const [isContextMenuVisible, setIsContextMenuVisible] = useState<boolean>(false)
  // const currentImgURL = useSelector((state: RootState) => state.annotatorReducer.currentImgURL)
  // const image = useSelector((state: RootState) => state.annotatorReducer.images[state.annotatorReducer.currentImgURL])
  // const labels = useSelector((state: RootState) => state.annotatorReducer.labels[state.annotatorReducer.currentImgURL])
  const labelingCoreRef = useRef<LabelingCore>()
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    labelingCoreRef.current = new LabelingCore(svgRef.current, p.labelList, p.setLabelList)
    labelingCoreRef.current.initLabelList(p.labelList)
  }, [])

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
    labelingCoreRef.current.labelList = p.labelList
  }, [p.labelList])

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

  // const onRectMouseDown = (label: Label) => (evt: React.MouseEvent) => {
  //   console.log(label)
  //   p.setLabelList(
  //     p.labelList.map((_label) => {
  //       if (_label.id === label.id) {
  //         _label.selected = true
  //       }
  //       return _label
  //     }),
  //   )
  // }

  // for (let i = 0; i < 8; i++) {
  //   const anchor = document.createElementNS(labelNS.svgNS, "rect")
  //   anchor.setAttribute("x", anchorPosXList[i].toString())
  //   anchor.setAttribute("y", anchorPosYList[i].toString())
  //   anchor.setAttribute("cursor", this._HANDLER_CURSOR_LIST[i])
  //   anchor.setAttribute("width", "10")
  //   anchor.setAttribute("height", "10")
  //   anchor.setAttribute("fill", "white")
  //   anchor.setAttribute("stroke", this._color)
  //   anchor.setAttribute("stroke-width", "3")

  return (
    <main className={styles.labelBoard}>
      <svg id={"svg"} width={"100%"} height={"100%"} data-role={"svg"} data-testid={"testSvg"} ref={svgRef}>
        {/*{p.labelList?.map((label) => (*/}
        {/*  <g*/}
        {/*    transform={`translate(${label.x} ${label.y}) scale(${zoom}) rotate(${label.degree} ${label.width * 0.5} ${*/}
        {/*      label.height * 0.5*/}
        {/*    })`}*/}
        {/*    id={label.id}*/}
        {/*    key={label.id}*/}
        {/*  >*/}
        {/*    <rect*/}
        {/*      width={label.width}*/}
        {/*      height={label.height}*/}
        {/*      fill={label.color}*/}
        {/*      fillOpacity={"0.2"}*/}
        {/*      stroke={label.color}*/}
        {/*      strokeWidth={"3"}*/}
        {/*      data-role={"label"}*/}
        {/*      cursor={p.mode === Mode.Selection ? "pointer" : "default"}*/}
        {/*      // onMouseDown={onRectMouseDown(label)}*/}
        {/*    />*/}
        {/*    {label.selected && genHandlers(label)}*/}
        {/*  </g>*/}
        {/*))}*/}
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
