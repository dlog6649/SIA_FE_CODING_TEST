import React from "react";
import { render, fireEvent } from "@testing-library/react";
import LabelList from "./LabelList";

describe("LabelList 테스트 시작", () => {
  let wrapper = null;
  const _labels = [
    {
      id: 0,
      name: "sea",
      coordinates: [
        { x: 10, y: 20 },
        { x: 110, y: 20 },
        { x: 110, y: 70 },
        { x: 10, y: 70 },
      ],
      data: { x: 10, y: 20, w: 90, h: 50, deg: 0 },
    },
    {
      id: 1,
      name: "woods",
      coordinates: [
        { x: 10, y: 20 },
        { x: 110, y: 20 },
        { x: 110, y: 70 },
        { x: 10, y: 70 },
      ],
      data: { x: 10, y: 20, w: 90, h: 50, deg: 0 },
    },
    {
      id: 2,
      name: "building",
      coordinates: [
        { x: 10, y: 20 },
        { x: 110, y: 20 },
        { x: 110, y: 70 },
        { x: 10, y: 70 },
      ],
      data: { x: 10, y: 20, w: 90, h: 50, deg: 0 },
    },
  ];
  const _selectedLabelsIds = [1];
  const mockSelectLabels = jest.fn();

  it("렌더링된 스냅샷이 기존과 일치해야 한다.", () => {
    wrapper = render(<LabelList labels={_labels} selectedLabelsIds={_selectedLabelsIds} selectLabels={mockSelectLabels} />);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  it("선택된 라벨ID가 전달되었을 때 목록에 활성화가 되어야 한다.", () => {
    // 선택된 라벨ID로 1번 전달
    wrapper = render(<LabelList labels={_labels} selectedLabelsIds={[1]} selectLabels={mockSelectLabels} />);

    const labelInfo = wrapper.getAllByTestId("testLabelInfo");
    expect(labelInfo[1].dataset.id).toEqual("1");
    expect(labelInfo[1].classList.contains("active")).toBe(true);
  });

  it("목록에 있는 라벨정보를 선택시 해당 라벨들에 대한 ID리스트가 디스패치돼야 한다.", () => {
    wrapper = render(<LabelList labels={_labels} selectedLabelsIds={[]} selectLabels={mockSelectLabels} />);
    const labelInfo = wrapper.getAllByTestId("testLabelInfo");

    // 라벨목록중 2번 클릭
    fireEvent.mouseDown(labelInfo[2]);

    const selectLabelsEventByClick = mockSelectLabels.mock.calls;
    const [selectedLabelsIds] = selectLabelsEventByClick[0];
    expect(selectedLabelsIds).toEqual([2]);
  });
});
