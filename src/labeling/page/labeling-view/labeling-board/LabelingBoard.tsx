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
  setLabelList?: (labelList: Label[]) => void
  addLabel: (label: Label) => void
}

export default function LabelBoard(p: Props) {
  const [zoom, setZoom] = useState<number>(1)
  const [isContextMenuVisible, setIsContextMenuVisible] = useState<boolean>(false)
  // const dispatcher = useDispatch()
  // const mode = useSelector((state: RootState) => state.annotatorReducer.mode)
  // const currentImgURL = useSelector((state: RootState) => state.annotatorReducer.currentImgURL)
  // const selectedLabelsIds = useSelector((state: RootState) => state.annotatorReducer.selectedLabelsIds)
  // const image = useSelector((state: RootState) => state.annotatorReducer.images[state.annotatorReducer.currentImgURL])
  // const labels = useSelector((state: RootState) => state.annotatorReducer.labels[state.annotatorReducer.currentImgURL])
  const labelingCoreRef = useRef<LabelingCore>()
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (p.labelList === undefined) return
    if (p.setLabelList === undefined) return
    if (!svgRef.current) return
    labelingCoreRef.current = new LabelingCore(svgRef.current, p.labelList, p.setLabelList)
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
    if (p.labelList === undefined) return
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

  return (
    <main className={styles.labelBoard}>
      <svg id={"svg"} width={"100%"} height={"100%"} data-testid={"testSvg"} ref={svgRef}>
        {p.labelList?.map((label) => (
          <g
            transform={`translate(${label.x} ${label.y}) scale(${zoom}) rotate(${label.degree} ${label.width * 0.5} ${
              label.height * 0.5
            })`}
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
