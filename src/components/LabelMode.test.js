import React from "react";
import { render, fireEvent } from "@testing-library/react";
import LabelMode from "./LabelMode";

describe("LabelMode 테스트 시작", () => {
  let wrapper = null;
  const mockChangeMode = jest.fn();
  const _mode = "LABEL_SELECT_MODE";

  it("렌더링된 스냅샷이 기존과 일치해야 한다.", () => {
    wrapper = render(<LabelMode mode={_mode} changeMode={mockChangeMode} />);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  it("라벨모드 버튼을 클릭 시 활성화되며, 해당 모드는 디스패치돼야 한다.", () => {
    wrapper = render(<LabelMode mode={_mode} changeMode={mockChangeMode} />);
    const buttons = wrapper.getAllByRole("button");

    // 생성모드 버튼 클릭
    fireEvent.click(buttons[1]);

    expect(buttons[0].classList.contains("active")).toBe(false);
    expect(buttons[1].classList.contains("active")).toBe(true);

    const changeModeEventByClick = mockChangeMode.mock.calls;
    const [mode] = changeModeEventByClick[0];
    expect(mode).toEqual("LABEL_CREATE_MODE");
  });
});
