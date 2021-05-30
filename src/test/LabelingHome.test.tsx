import LabelingHome from "../labeling/page/labeling-home/LabelingHome"
import { Provider, useDispatch, useSelector } from "react-redux"
import * as reactRedux from "react-redux"
import React from "react"
import { render, fireEvent, waitFor, RenderResult } from "@testing-library/react"
import configureMockStore from "redux-mock-store"
import * as labelingModule from "../labeling/modules/labeling"

const mockStore = configureMockStore()
const store = mockStore({ labelingReducer: labelingModule.initState })

describe("Test LabelingHome", () => {
  const useSelectorMock = jest.spyOn(reactRedux, "useSelector")
  const useDispatchMock = jest.spyOn(reactRedux, "useDispatch")

  // const mockViewImage = jest.fn()
  // jest.setTimeout(30000)

  beforeEach(() => {
    // useSelectorMock.mockClear()
    // useDispatchMock.mockClear()
  })
  jest.mock("react-redux")

  // it("123", () => {
  //   useSelectorMock.mockReturnValue({ aa: "aa" })
  //   const dummySelector = jest.fn()
  //   const dummyDispatch = jest.fn()
  //   useDispatchMock.mockReturnValue(dummyDispatch)
  //
  //   expect(dummyDispatch).not.toHaveBeenCalled()
  // })

  it("ㅇㅇ", () => {
    // useSelectorMock.mockReturnValue({ aa: "aa" })
    // const dummySelector = jest.fn()
    // const dummyDispatch = jest.fn()
    // useDispatchMock.mockReturnValue(dummyDispatch)
    // expect(dummyDispatch).not.toHaveBeenCalled()
    const wrapper = render(
      <Provider store={store}>
        <LabelingHome />,
      </Provider>,
    )
    // expect(useDispatchMock).toHaveBeenCalledTimes(10)
    expect(useDispatch).toHaveBeenCalledWith()
  })

  // jsonplaceholder 비동기 대기시간으로 30초 부여
  // await waitFor(() => wrapper.getAllByTestId("testThumbnail"), { timeout: 30000 })
  //   .then(() => {
  //     expect(wrapper.baseElement).toMatchSnapshot()
  //
  //     const testThumbnails = wrapper.getAllByTestId("testThumbnail")
  //     expect(testThumbnails.length).toBe(8)
  //
  //     // 0번 썸네일 클릭
  //     fireEvent.click(testThumbnails[0])
  //
  //     const viewImageEventByClick = mockViewImage.mock.calls[0]
  //     const [url, title] = viewImageEventByClick
  //     expect(url).toEqual("https://via.placeholder.com/600/92c952")
  //     expect(title).toEqual("accusamus beatae ad facilis cum similique qui sunt")
  //   })
  //   .catch((err) => console.log(err))
})
